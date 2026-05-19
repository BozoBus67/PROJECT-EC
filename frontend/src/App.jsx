import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import Main_Shell from './app_structure/main_shell';
import { api_me } from './auth';
import { init_yt_player, load_playlist } from './music/audio_state';
import { save_game_data } from './game/game_utils';
import { get, post_auth } from './shared/api_client';
import { Env_Config_Error, Error_Boundary, Loading_Screen } from './shared/components';
import {
  cache_account_tiers, cache_buildings, cache_game_data, cache_premium_game_data, cache_session_data,
  read_account_tiers, read_buildings, read_game_data, read_premium_game_data, read_session_data,
} from './shared/local_cache';
import { store } from './shared/store';
import { login, set_account_tiers, set_buildings, set_online } from './shared/store/sessionSlice';
import { supabase } from './shared/supabase_client';
import { useTheme } from './shared/theme';
import { notify_migration } from './shared/utils';
import {
  DEFAULT_ACCOUNT_TIERS, DEFAULT_BUILDINGS, DEFAULT_GAME_DATA, DEFAULT_PREMIUM_GAME_DATA,
} from './shared/zero_state';
import toast from 'react-hot-toast';

const ACTIVE_PING_INTERVAL_MS = 60_000;
// Bootstrap waits this long for api_me before falling back to offline mode.
// Browser fetch has no default timeout — without this, the loading screen
// would sit there for the full Render cold-start (up to ~60s).
const BOOTSTRAP_API_TIMEOUT_MS = 3_000;
// While in offline mode, retry api_me on this cadence until it succeeds.
// Each attempt is itself bounded by BOOTSTRAP_API_TIMEOUT_MS so a hung backend
// doesn't pile up in-flight requests.
const RECONNECT_POLL_INTERVAL_MS = 5_000;

// Required env vars whose absence renders the app unusable. App-breaking, so
// we fail loud with a full-screen overlay rather than getting stuck on the
// loading screen with a cryptic console error. Optional vars (like
// VITE_STRIPE_PAYMENT_LINK) get a console.warn but don't block startup.
const REQUIRED_ENV_VARS = ['VITE_BACKEND_URL', 'VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
const missing_env_vars = REQUIRED_ENV_VARS.filter(v => !import.meta.env[v]);

if (!import.meta.env.VITE_STRIPE_PAYMENT_LINK) {
  console.warn('[env] VITE_STRIPE_PAYMENT_LINK is missing — Buy Tokens button will be non-functional.');
}

export default function App() {
  if (missing_env_vars.length > 0) return <Env_Config_Error missing={missing_env_vars} />;
  return <App_Inner />;
}

function App_Inner() {
  const dispatch = useDispatch();
  const is_logged_in = useSelector(state => state.session.is_logged_in);
  use_active_ping(is_logged_in);
  const [checking_session, set_checking_session] = useState(true);

  useEffect(() => {
    // Bootstrap fires both metadata + session in parallel. Metadata is
    // fire-and-forget (no gate), session flips the loading screen off when
    // it resolves. With anon-by-default, every visitor ends up with a
    // session — only the "no anon, no real session" failure mode lands on
    // the auth screens.
    bootstrap_metadata(dispatch);
    bootstrap_session(dispatch)
      .catch(err => console.error('[bootstrap] session restore failed:', err))
      .finally(() => set_checking_session(false));
    // Fire-and-forget: builds the persistent YT.Player iframe under <body>.
    // Lives independently of any screen so audio survives navigation.
    init_yt_player();
  }, []);

  // Toaster mounts above the loading gate so the slow-backend toast (and any
  // other bootstrap-time feedback) actually has somewhere to render.
  return (
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Themed_Toaster />
      <Error_Boundary>
        {checking_session ? <Loading_Screen /> : <Main_Shell />}
      </Error_Boundary>
    </HashRouter>
  );
}

// Pings /active_ping once a minute while the user is logged in AND the window
// is BOTH visible and focused. Counting these in PostHog × the interval gives
// us total active time per user.
//
// Two gates, not one: visibilityState catches background tabs / minimized
// windows; document.hasFocus() catches the "user alt-tabbed to another app"
// case where the tab is still technically visible but the window isn't the
// foreground one. Skipping either keeps the metric honest.
//
// Errors are swallowed deliberately: the ping fires every 60s, so a transient
// network blip would otherwise spam the user with toasts. This is a deliberate
// exception to fail-loud — analogous to backend/services/analytics.py, where
// PostHog capture() is also silent on failure. Same trade-off, same reason.
// If we adopt Sentry (or similar) later, route ping failures there so we
// catch systemic outages without bothering the user.
function use_active_ping(is_logged_in) {
  useEffect(() => {
    if (!is_logged_in) return;
    let cancelled = false;
    const is_active = () => document.visibilityState === 'visible' && document.hasFocus();
    const ping = () => {
      if (cancelled) return;
      if (!is_active()) return;
      // Send URL + screen so PostHog's URL/SCREEN column populates and we
      // can break active-time down by which subscreen the user was on.
      // Hash router puts the route in `location.hash` (e.g. "#/game/auction-house").
      post_auth('/active_ping', { url: window.location.href, screen: window.location.hash }).catch(() => {});
    };
    ping();
    const id = setInterval(ping, ACTIVE_PING_INTERVAL_MS);
    // Fire immediately when the window becomes active again (e.g. user alt-tabs
    // back), so we don't lose up to 60s of activity to interval drift.
    const on_regain = () => { if (is_active()) ping(); };
    document.addEventListener('visibilitychange', on_regain);
    window.addEventListener('focus', on_regain);
    return () => {
      cancelled = true;
      clearInterval(id);
      document.removeEventListener('visibilitychange', on_regain);
      window.removeEventListener('focus', on_regain);
    };
  }, [is_logged_in]);
}

// The global toast rendering host. One mount, persists across navigation.
// Themed so toasts match the active light/dark palette. See react-hot-toast
// docs for what `toastOptions` accepts.
function Themed_Toaster() {
  const theme = useTheme();
  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        style: {
          background: theme.panel,
          color: theme.text,
          border: `1px solid ${theme.panel_border}`,
        },
      }}
    />
  );
}

// Fetches the static metadata Main_Shell needs (account tiers, building defs,
// music playlist). Fire-and-forget — the auth screens don't read any of
// these, and Main_Shell renders with empty fallbacks if metadata fails (user
// can hit the refresh button). Errors are logged for debugging only.
//
// Scroll metadata is NOT fetched here — it lives entirely in the frontend
// registry at shared/scroll_registry.js. The backend's MASTERY_SCROLLS dict
// is the source of truth for *which slugs are valid* (enforced at write
// time), but the user-facing strings live frontend-side.
async function bootstrap_metadata(dispatch) {
  try {
    const [account_tiers, buildings] = await with_timeout(
      Promise.all([
        get('/account_tiers'),
        get('/get_building_metadata'),
        load_playlist(),
      ]),
      BOOTSTRAP_API_TIMEOUT_MS,
    );
    dispatch(set_account_tiers(account_tiers));
    dispatch(set_buildings(buildings));
    cache_account_tiers(account_tiers);
    cache_buildings(buildings);
  } catch (err) {
    console.error('[bootstrap] metadata fetch failed:', err);
    // Catalog is static-ish reference data, fine to hydrate from a stale cache
    // (or the baked-in defaults for a brand-new visitor on first cold-start).
    // Without this fallback, the game would render with no buildings and the
    // Buy buttons would silently do nothing. The reconnect-polling loop in
    // bootstrap_session will eventually pull the live catalog when Render
    // wakes up; until then, the cached/default values keep the game playable.
    const cached_tiers = read_account_tiers() ?? DEFAULT_ACCOUNT_TIERS;
    const cached_buildings = read_buildings() ?? DEFAULT_BUILDINGS;
    dispatch(set_account_tiers(cached_tiers));
    dispatch(set_buildings(cached_buildings));
  }
}

// Bootstraps a session for the user. Three paths:
//
//   - Cached session, /me succeeds → real or anon user comes back where they
//     left off. Most common path on repeat visits.
//   - Cached session, /me fails (typically stale JWT) → local-only sign-out
//     so we don't make a doomed /logout call (see auth/README.md), then fall
//     through to the no-session branch below.
//   - No session → signInAnonymously so the user can play immediately
//     without an account. Backend's /me auto-creates the User_Login_Data row.
//
// If signInAnonymously itself fails (e.g. anon auth not enabled in the
// Supabase project), the bootstrap finishes with no session and Main_Shell
// renders the auth screens instead — same fallback as before this change.
// Wrap any promise in a timeout that throws a shaped network-style error.
// We treat timeout-to-respond identically to "Cannot reach server" because for
// the bootstrap UX the user can't tell the difference — both mean "Render is
// still cold". Without an explicit timeout, browser fetch has no default cap
// and the loading screen would sit there for the full cold-start (~60s).
function with_timeout(promise, timeout_ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => {
      const err = new Error('Bootstrap timeout — backend is taking too long.');
      err.is_network_error = true;
      reject(err);
    }, timeout_ms)),
  ]);
}

const api_me_with_timeout = (timeout_ms) => with_timeout(api_me(), timeout_ms);

// Once we've fallen back to offline mode, keep trying api_me on a slow
// cadence. When it eventually succeeds (Render finished waking up), pull
// server-authoritative state (session_data + premium_game_data) but PRESERVE
// the local game_data — the user may have made progress while offline and the
// in-memory snapshot is what they actually see on screen. Force-save right
// after so we push that local progress to the backend without waiting up to
// a minute for the auto-save tick.
function start_reconnect_polling(dispatch) {
  let cancelled = false;
  async function attempt() {
    if (cancelled) return;
    try {
      const data = await api_me_with_timeout(BOOTSTRAP_API_TIMEOUT_MS);
      const local_game_data = store.getState().session.game_data;
      dispatch(login({ user: { ...data.user, game_data: local_game_data } }));
      cache_session_data(data.user);
      cache_premium_game_data(data.user.premium_game_data ?? null);
      toast.success('Backend is back — syncing progress.', { id: 'offline-mode' });
      save_game_data().catch(err => console.warn('[reconnect] sync push failed:', err));
      // Refresh metadata too — if the user bootstrapped from DEFAULT_BUILDINGS
      // (brand-new visitor with no cache), this populates the cache with the
      // live catalog so subsequent loads have the freshest data.
      bootstrap_metadata(dispatch).catch(() => {});
    } catch {
      setTimeout(attempt, RECONNECT_POLL_INTERVAL_MS);
    }
  }
  attempt();
}

// Resolve api_me + cache the result, or — if api_me failed because the
// backend was unreachable — hydrate the session from localStorage (falling
// back to zero-state defaults on a first-ever cold start). Returns true if
// the session was successfully resolved one way or the other.
function login_from_api(dispatch, data) {
  dispatch(login({ user: data.user }));
  cache_session_data(data.user);
  cache_game_data(data.user.game_data);
  cache_premium_game_data(data.user.premium_game_data ?? null);
  notify_migration(data.migration_info);
  redirect_away_from_stale_auth_hash();
}

function login_from_cache_or_zero(dispatch, { is_anonymous }) {
  const cached_session = read_session_data();
  const cached_game_data = read_game_data();
  const cached_pgd = read_premium_game_data();
  const user = {
    ...(cached_session ?? { id: 'offline_guest', is_anonymous: !!is_anonymous }),
    game_data: cached_game_data ?? DEFAULT_GAME_DATA,
    premium_game_data: cached_pgd ?? DEFAULT_PREMIUM_GAME_DATA,
  };
  dispatch(login({ user }));
  dispatch(set_online(false));
  toast(
    cached_session
      ? 'Playing offline — backend is waking up. Your progress will sync when it\'s back.'
      : 'Backend is waking up — starting a local game. Progress will sync once it\'s up.',
    { id: 'offline-mode', icon: '📦', duration: 6000 }
  );
}

async function bootstrap_session(dispatch) {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    try {
      const data = await api_me_with_timeout(BOOTSTRAP_API_TIMEOUT_MS);
      login_from_api(dispatch, data);
      return;
    } catch (err) {
      if (err?.is_network_error) {
        // Backend unreachable on cold start: keep the existing Supabase
        // session and play from cache. Skip the JWT sign-out path below — the
        // JWT is fine, the backend just isn't answering yet.
        login_from_cache_or_zero(dispatch, { is_anonymous: false });
        start_reconnect_polling(dispatch);
        return;
      }
      // Non-network failure typically means stale JWT — sign out locally and
      // fall through to the anon flow so we don't make a doomed /logout call.
      // See auth/README.md for why scope: 'local'.
      await supabase.auth.signOut({ scope: 'local' });
    }
  }

  const { error: anon_error } = await supabase.auth.signInAnonymously();
  if (anon_error) {
    // Supabase auth itself is down — no JWT, but we can still let the user
    // play locally if anything is cached. Brand-new visitor in this state
    // gets the zero-state defaults.
    console.error('[bootstrap] anonymous sign-in failed:', anon_error);
    login_from_cache_or_zero(dispatch, { is_anonymous: true });
    return;
  }
  try {
    const data = await api_me_with_timeout(BOOTSTRAP_API_TIMEOUT_MS);
    login_from_api(dispatch, data);
  } catch (err) {
    if (err?.is_network_error) {
      login_from_cache_or_zero(dispatch, { is_anonymous: true });
      start_reconnect_polling(dispatch);
      return;
    }
    throw err;
  }
}

// HashRouter persists the URL across refreshes — so a hash of `#/signup` or
// `#/login` left over from a previous No_Session_Shell bounce will keep
// rendering the auth screens even after we successfully establish a session.
// Snap those specific hashes back to /game once bootstrap succeeds. The
// in-app "Log In / Sign Up" button in the top bar still works because that
// navigation happens AFTER bootstrap completes.
function redirect_away_from_stale_auth_hash() {
  const hash = window.location.hash;
  if (hash === '#/signup' || hash === '#/login') {
    window.location.hash = '#/game';
  }
}

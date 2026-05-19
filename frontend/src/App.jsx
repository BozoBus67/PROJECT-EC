import { useEffect, useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import Main_Shell from './app_structure/main_shell';
import { api_me } from './auth';
import { save_game_data } from './game/game_utils';
import { init_yt_player, load_playlist } from './music/audio_state';
import { get, post_auth } from './shared/api_client';
import { Env_Config_Error, Error_Boundary } from './shared/components';
import {
  cache_account_tiers, cache_buildings, cache_premium_game_data, cache_session_data,
} from './shared/local_cache';
import { store } from './shared/store';
import { login, set_account_tiers, set_buildings } from './shared/store/sessionSlice';
import { supabase } from './shared/supabase_client';
import { useTheme } from './shared/theme';
import { notify_migration } from './shared/utils';

const ACTIVE_PING_INTERVAL_MS = 60_000;

// Required env vars whose absence renders the app unusable. App-breaking, so
// we fail loud with a full-screen overlay rather than getting stuck on a
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
  const is_online = useSelector(state => state.session.is_online);
  use_active_ping(is_logged_in);

  // Background refresh runs on every false→true transition of is_online,
  // including the initial mount (prev_online starts false so the first
  // render counts as a transition). Redux was already hydrated synchronously
  // from localStorage at module load (see shared/store/index.js), so the
  // game shell is rendering regardless — this just pulls the freshest
  // authoritative state when the backend is reachable.
  const prev_online = useRef(false);
  useEffect(() => {
    if (is_online && !prev_online.current) {
      refresh_session(dispatch);
      refresh_metadata(dispatch);
    }
    prev_online.current = is_online;
  }, [is_online, dispatch]);

  // Fire-and-forget: builds the persistent YT.Player iframe under <body>.
  // Lives independently of any screen so audio survives navigation.
  useEffect(() => { init_yt_player(); }, []);

  return (
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Themed_Toaster />
      <Error_Boundary>
        <Main_Shell />
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
// Themed so toasts match the active light/dark palette.
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

// Refresh the static catalog (account tiers, building defs, playlist) from
// the backend in the background. Failures are non-fatal — the store was
// already hydrated from cache or zero-state defaults at module load, so the
// game shell keeps rendering regardless.
async function refresh_metadata(dispatch) {
  try {
    const [account_tiers, buildings] = await Promise.all([
      get('/account_tiers'),
      get('/get_building_metadata'),
      load_playlist(),
    ]);
    dispatch(set_account_tiers(account_tiers));
    dispatch(set_buildings(buildings));
    cache_account_tiers(account_tiers);
    cache_buildings(buildings);
  } catch (err) {
    console.warn('[refresh] metadata fetch failed:', err);
  }
}

// Refresh the user's authoritative state. If supabase has no cached session
// (brand-new visitor), sign in anonymously first. Then call api_me and merge
// the result: take server-authoritative session_data and premium_game_data,
// but for game_data prefer whichever side shows more progress. That handles
// both directions of drift — the "user played offline" case (local wins) and
// the "this device's cache got wiped but the server has the real state" case
// (backend wins). Force-save after if local won so the offline progress is
// pushed up without waiting for the next auto-save tick.
async function refresh_session(dispatch) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      const { error: anon_error } = await supabase.auth.signInAnonymously();
      if (anon_error) {
        console.warn('[refresh] anonymous sign-in failed:', anon_error);
        return;
      }
    }
    const data = await api_me();
    const local_gd = store.getState().session.game_data;
    const local_quantity = local_gd?.quantity ?? 0;
    const backend_quantity = data.user.game_data?.quantity ?? 0;
    const local_wins = local_quantity > backend_quantity;
    const preferred_gd = local_wins ? local_gd : data.user.game_data;
    dispatch(login({ user: { ...data.user, game_data: preferred_gd } }));
    cache_session_data(data.user);
    cache_premium_game_data(data.user.premium_game_data ?? null);
    notify_migration(data.migration_info);
    redirect_away_from_stale_auth_hash();
    if (local_wins) save_game_data().catch(() => {});
  } catch (err) {
    // Network errors are expected when the backend is cold-starting — the
    // is_online watcher in App_Inner will fire this again on the next
    // false→true transition. Anything else gets logged but doesn't surface
    // to the user; the game keeps running from cached state.
    if (!err?.is_network_error) {
      console.warn('[refresh] session fetch failed:', err);
    }
  }
}

// HashRouter persists the URL across refreshes — so a hash of `#/signup` or
// `#/login` left over from a previous No_Session_Shell bounce will keep
// rendering the auth screens even after we successfully establish a session.
// Snap those specific hashes back to /game once refresh succeeds. The in-app
// "Log In / Sign Up" button in the top bar still works because that
// navigation happens AFTER mount.
function redirect_away_from_stale_auth_hash() {
  const hash = window.location.hash;
  if (hash === '#/signup' || hash === '#/login') {
    window.location.hash = '#/game';
  }
}

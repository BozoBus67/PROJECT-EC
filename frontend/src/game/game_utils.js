import { apply_building_buffs, apply_global_modifiers } from '../mastery_scrolls/scroll_effects';
import { cache_game_data } from '../shared/local_cache';
import { store } from '../shared/store';
import {
  increment_game_data_field,
  update_game_data_field,
} from '../shared/store/sessionSlice';
import { api_save_game } from './api';

// CPS calculation runs as a 3-stage compiler-like pipeline:
//
//   Stage 1 — collect raw per-building cps entries (count × base cps).
//   Stage 2 — apply per-building scroll buffs.        (scroll_effects.js)
//   Stage 3 — sum, then apply global cps modifiers.   (scroll_effects.js)
//
// Splitting it like this keeps each kind of buff in its own stage: a Diddy
// multiplier (per-building, stage 2) doesn't get tangled up with a Shadow
// Clone Jutsu multiplier (global, stage 3). New buffs slot into the right
// stage as a single if-block — no orchestration code changes here.
export function recalculate_cps() {
  const { game_data, buildings, premium_game_data } = store.getState().session;
  const pgd = premium_game_data ?? {};

  const raw_entries = Object.entries(game_data.buildings).map(([key, count]) => ({
    key,
    count,
    cps: (buildings[key]?.cps ?? 0) * count,
  }));
  const buffed_entries = apply_building_buffs(raw_entries, pgd);
  const subtotal = buffed_entries.reduce((sum, entry) => sum + entry.cps, 0);
  const cps = apply_global_modifiers(subtotal, pgd);

  store.dispatch(update_game_data_field({ key: 'cps', value: cps }));
}

export function increase_cookies() {
  const { game_data } = store.getState().session;
  store.dispatch(increment_game_data_field({
    key: 'quantity',
    amount: game_data.cookies_per_click,
  }));
}

export function buy_building(key) {
  const { game_data, buildings } = store.getState().session;
  const cost = buildings[key]?.cost;
  if (game_data.quantity < cost) return;

  store.dispatch(increment_game_data_field({ key: 'quantity', amount: -cost }));
  store.dispatch(update_game_data_field({
    key: 'buildings',
    value: { ...game_data.buildings, [key]: game_data.buildings[key] + 1 },
  }));

  recalculate_cps();
}

// Returns { local: true, remote: boolean, error?: Error }. Always writes to
// localStorage first (so play continues seamlessly when Render is cold) and
// then attempts the backend POST. A network failure on the POST is swallowed
// here — local save succeeded, so the user hasn't lost anything; the next
// auto-save tick that happens after the backend wakes up will push the same
// state up. Non-network errors (4xx/5xx with a real response) still bubble
// in `error` so the caller can decide whether to surface them.
export async function save_game_data() {
  const { game_data } = store.getState().session;
  const snapshot = JSON.parse(JSON.stringify(game_data));
  cache_game_data(snapshot);
  try {
    await api_save_game(snapshot);
    return { local: true, remote: true };
  } catch (err) {
    if (err?.is_network_error) return { local: true, remote: false };
    return { local: true, remote: false, error: err };
  }
}

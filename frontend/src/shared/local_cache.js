// localStorage cache for the bootstrap data — building catalog, account tier
// list, and the user's game_data / premium_game_data / session_data snapshots.
// Lets the game boot from cache when Render is cold-starting (or unreachable)
// so players can still click the cookie and buy buildings while the backend
// wakes up. See zero_state.js for the brand-new-player default that's used
// when no cache exists yet.
//
// Why localStorage and not cookies: cookies auto-attach to every request,
// inflating the upload of every API call with game state we don't need to
// send (the backend is authoritative on its own row). localStorage stays
// client-only, which is what we want here.

const PREFIX = 'ec_';
const K = {
  buildings:         `${PREFIX}buildings`,
  account_tiers:     `${PREFIX}account_tiers`,
  game_data:         `${PREFIX}game_data`,
  premium_game_data: `${PREFIX}premium_game_data`,
  session_data:      `${PREFIX}session_data`,
};

function safe_set(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); }
  catch (err) { console.warn('[local_cache] set failed:', key, err); }
}

function safe_get(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.warn('[local_cache] get failed:', key, err);
    return null;
  }
}

export const cache_buildings         = (v) => safe_set(K.buildings, v);
export const cache_account_tiers     = (v) => safe_set(K.account_tiers, v);
export const cache_game_data         = (v) => safe_set(K.game_data, v);
export const cache_premium_game_data = (v) => safe_set(K.premium_game_data, v);
export const cache_session_data      = (v) => safe_set(K.session_data, v);

export const read_buildings         = () => safe_get(K.buildings);
export const read_account_tiers     = () => safe_get(K.account_tiers);
export const read_game_data         = () => safe_get(K.game_data);
export const read_premium_game_data = () => safe_get(K.premium_game_data);
export const read_session_data      = () => safe_get(K.session_data);

export function clear_local_cache() {
  for (const key of Object.values(K)) {
    try { localStorage.removeItem(key); } catch {}
  }
}

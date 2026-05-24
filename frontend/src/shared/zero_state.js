// Default game_data + premium_game_data for brand-new players whose first
// visit hits a backend that's cold-starting or fully unreachable. Once
// api_me succeeds, this is replaced by the backend's authoritative state;
// progress made offline persists via the auto-save's localStorage write and
// gets pushed when the backend comes back.
//
// Loaded from the monorepo-root shared/ JSON files — same source the backend
// reads. Single source of truth; no manual mirroring.

export { default as DEFAULT_GAME_DATA }         from '../../../shared/game_data.json';
export { default as DEFAULT_PREMIUM_GAME_DATA } from '../../../shared/premium_game_data.json';
export { default as DEFAULT_BUILDINGS }         from '../../../shared/buildings.json';
export { default as DEFAULT_ACCOUNT_TIERS }     from '../../../shared/account_tiers.json';

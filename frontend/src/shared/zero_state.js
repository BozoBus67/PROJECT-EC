// Default game_data + premium_game_data for brand-new players whose first
// visit hits a backend that's cold-starting or fully unreachable. Once
// api_me succeeds, this is replaced by the backend's authoritative state;
// progress made offline persists via the auto-save's localStorage write and
// gets pushed when the backend comes back.
//
// MUST stay in sync with backend/data/game_data.py:INITIAL_GAME_DATA and
// backend/data/premium_game_data.py:INITIAL_PREMIUM_GAME_DATA. The backend
// is canonical; if those shapes change, mirror the change here.

export const DEFAULT_GAME_DATA = {
  version: 1,
  quantity: 0,
  cps: 0,
  cookies_per_click: 1,
  buildings: {
    building_1:  0,
    building_2:  0,
    building_3:  0,
    building_4:  0,
    building_5:  0,
    building_6:  0,
    building_7:  0,
    building_8:  0,
    building_9:  0,
    building_10: 0,
    building_11: 0,
    building_12: 0,
    building_13: 0,
  },
};

// Fallback building catalog and account tier list, mirrors backend/data/.
// Used when bootstrap_metadata couldn't reach the backend AND no localStorage
// cache exists — i.e. a brand-new visitor's first session while Render is
// cold. Once a real fetch succeeds, the cache overrides this on subsequent
// loads. MUST stay in sync with backend/data/buildings.py and
// backend/data/account_tiers.py + backend/constants/constants.py.

export const DEFAULT_BUILDINGS = [
  { key: 'building_1',  cost: 1,      cps: 1 },
  { key: 'building_2',  cost: 3,      cps: 2 },
  { key: 'building_3',  cost: 9,      cps: 4 },
  { key: 'building_4',  cost: 27,     cps: 8 },
  { key: 'building_5',  cost: 81,     cps: 16 },
  { key: 'building_6',  cost: 243,    cps: 32 },
  { key: 'building_7',  cost: 729,    cps: 64 },
  { key: 'building_8',  cost: 2187,   cps: 128 },
  { key: 'building_9',  cost: 6561,   cps: 256 },
  { key: 'building_10', cost: 19683,  cps: 512 },
  { key: 'building_11', cost: 59049,  cps: 1024 },
  { key: 'building_12', cost: 177147, cps: 2048 },
  { key: 'building_13', cost: 531441, cps: 4096 },
];

export const DEFAULT_ACCOUNT_TIERS = [
  { id: 'account_tier_0', token_price: 0 },
  { id: 'account_tier_1', token_price: 10 },
  { id: 'account_tier_2', token_price: 25 },
  { id: 'account_tier_3', token_price: 100 },
  { id: 'account_tier_4', token_price: 1000 },
  { id: 'account_tier_5', token_price: 10000 },
  { id: 'account_tier_6', token_price: 67000 },
  { id: 'account_tier_7', token_price: 200000 },
  { id: 'account_tier_8', token_price: 750000 },
  { id: 'account_tier_9', token_price: 3000000 },
];

export const DEFAULT_PREMIUM_GAME_DATA = {
  tokens: 0,
  account_tier: 'account_tier_0',
  login_streak: 0,
  last_login_date: null,
  hourly_streak: 0,
  last_hourly_claim: null,
  fivemin_streak: 0,
  last_5min_claim: null,
  '6_7_kid':             0,
  adolf_hitler:          0,
  blurry_epstein:        0,
  caseoh:                0,
  charlie_kirk:          0,
  dexter:                0,
  diddy:                 0,
  doakes:                0,
  donald_trump:          0,
  drake:                 0,
  elon_musk:             0,
  freddy_fazbear:        0,
  george_floyd:          0,
  hillary_clinton:       0,
  ishowspeed:            0,
  kai_cenat:             0,
  khaby_lame:            0,
  mark_zuckerberg:       0,
  mr_beast:              0,
  ninja_from_fortnite:   0,
  roy_lee:               0,
  state_trooper_cop:     0,
  stephen_hawking:       0,
  tung_tung_tung_sahur:  0,
  walter_white:          0,
  redeemed: {},
  theme: 'default',
  chess_beaten_bots: [],
  kirk_mode: false,
};

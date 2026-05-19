import { configureStore } from '@reduxjs/toolkit';
import {
  read_account_tiers, read_buildings, read_game_data,
  read_premium_game_data, read_session_data,
} from '../local_cache';
import {
  DEFAULT_ACCOUNT_TIERS, DEFAULT_BUILDINGS, DEFAULT_GAME_DATA, DEFAULT_PREMIUM_GAME_DATA,
} from '../zero_state';
import sessionReducer from './sessionSlice';

// Synchronously hydrate Redux from localStorage at module load. By the time
// React mounts, the store already has a complete is_logged_in: true session
// with valid game_data + catalog, so the game shell renders immediately
// without ever waiting on a network promise. The backend fetches in App.jsx
// run as a refresh in the background — they merge their result in if/when
// they arrive, but they never gate the UI.
//
// For a brand-new visitor with no cache, the zero-state defaults from
// zero_state.js produce a functional "guest" session that can click the
// cookie and buy buildings. Once the real api_me / signInAnonymously
// resolves, it overwrites session_data with the authoritative identity.
const cached_session = read_session_data();
const cached_game_data = read_game_data();
const cached_pgd = read_premium_game_data();
const cached_tiers = read_account_tiers() ?? DEFAULT_ACCOUNT_TIERS;
const cached_buildings_arr = read_buildings() ?? DEFAULT_BUILDINGS;

const preloaded_session = {
  is_logged_in: true,
  is_anonymous: cached_session?.is_anonymous ?? true,
  session_data: cached_session ?? { id: 'offline_guest', is_anonymous: true },
  game_data: cached_game_data ?? DEFAULT_GAME_DATA,
  premium_game_data: cached_pgd ?? DEFAULT_PREMIUM_GAME_DATA,
  account_tiers: cached_tiers,
  buildings: Object.fromEntries(cached_buildings_arr.map(b => [b.key, b])),
  is_online: true,
};

export const store = configureStore({
  reducer: { session: sessionReducer },
  preloadedState: { session: preloaded_session },
});

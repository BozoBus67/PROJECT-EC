import { createSlice } from '@reduxjs/toolkit';

const sessionSlice = createSlice({
  name: 'session',
  initialState: {
    is_logged_in: false,
    is_anonymous: false,
    session_data: null,
    game_data: null,
    premium_game_data: null,
    account_tiers: [],
    buildings: {},
    // Reflects backend reachability. Flipped by shared/api_client.js on every
    // request based on whether the fetch resolved or threw a network error.
    // Consumed by feature buttons that need the backend (gambling, auction,
    // checkins) so they can decline to fire and tell the user to wait.
    is_online: true,
  },
  reducers: {
    login(state, action) {
      const { user } = action.payload;
      state.is_logged_in = true;
      state.is_anonymous = !!user.is_anonymous;
      state.session_data = user;
      state.game_data = user.game_data;
      state.premium_game_data = user.premium_game_data ?? null;
    },
    logout(state) {
      state.is_logged_in = false;
      state.is_anonymous = false;
      state.session_data = null;
      state.game_data = null;
      state.premium_game_data = null;
    },
    update_game_data(state, action) {
      state.game_data = action.payload;
    },
    update_premium_game_data(state, action) {
      state.premium_game_data = action.payload;
    },

    // Field-granular updates. Prefer these over whole-object replacement when
    // updating one top-level field — see ./README.md for the lost-update
    // race they prevent.
    update_game_data_field(state, action) {
      const { key, value } = action.payload;
      if (state.game_data) state.game_data[key] = value;
    },
    increment_game_data_field(state, action) {
      const { key, amount } = action.payload;
      if (state.game_data) {
        state.game_data[key] = (state.game_data[key] ?? 0) + amount;
      }
    },
    update_premium_game_data_field(state, action) {
      const { key, value } = action.payload;
      if (state.premium_game_data) state.premium_game_data[key] = value;
    },
    increment_premium_game_data_field(state, action) {
      const { key, amount } = action.payload;
      if (state.premium_game_data) {
        state.premium_game_data[key] = (state.premium_game_data[key] ?? 0) + amount;
      }
    },
    set_account_tiers(state, action) {
      state.account_tiers = action.payload;
    },
    set_buildings(state, action) {
      state.buildings = Object.fromEntries(action.payload.map(b => [b.key, b]));
    },
    patch_session_data(state, action) {
      if (state.session_data) Object.assign(state.session_data, action.payload);
    },
    set_online(state, action) {
      // No-op when unchanged so we don't re-render every consumer on each
      // successful API call (most of them, since we dispatch this from the
      // request layer on every fetch).
      if (state.is_online === action.payload) return;
      state.is_online = action.payload;
    },
  },
});

export const {
  login,
  logout,
  update_game_data,
  update_premium_game_data,
  update_game_data_field,
  increment_game_data_field,
  update_premium_game_data_field,
  increment_premium_game_data_field,
  set_account_tiers,
  set_buildings,
  patch_session_data,
  set_online,
} = sessionSlice.actions;

export default sessionSlice.reducer;

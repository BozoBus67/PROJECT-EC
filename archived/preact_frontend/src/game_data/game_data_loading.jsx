import { signal } from '@preact/signals';
import * as BuildingConstants from '../constants/building_constants';
import { supabase } from '../miscellaneous_info/supabase_api_info';
import { logged_in_user, account_tier } from '../miscellaneous_info/user_info';
import { account_tiers } from '../miscellaneous_info/misc_info';

const initial_buildings = Object.fromEntries(
  Object.keys(BuildingConstants.BUILDINGS).map(name => [name, 0])
);

export const initial_save = {
  quantity: 0,
  cps: 0,
  cookies_per_click: 1,
  buildings: initial_buildings,
};

export const game_data = signal(initial_save);

export async function loadGameFromDB() {
  const { data, error } = await supabase
    .from('User_Login_Data')
    .select('game_data, premium_game_data')
    .eq('username', logged_in_user.value)
    .single();

  if (error) { console.error('Load error:', error); return; }

  game_data.value = {
    ...initial_save,
    ...data?.game_data,
    buildings: {
      ...initial_buildings,
      ...data?.game_data?.buildings,
    },
  };
  account_tier.value = data?.premium_game_data?.account_tier ?? 'free';

  fetch('https://epstein-clicker-backend.onrender.com/account_tiers')
    .then(res => res.ok ? res.json() : Promise.reject())
    .then(tiers => { account_tiers.value = tiers; })
    .catch(() => console.error('Failed to load account tiers'));
}

export async function saveGameData() {
  const { error } = await supabase
    .from('User_Login_Data')
    .update({ game_data: game_data.value })
    .eq('username', logged_in_user.value);

  if (error) console.error('Save error:', error);
}
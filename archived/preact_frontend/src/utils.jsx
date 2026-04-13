import { game_data } from './game_data/game_state';
import { logged_in_user_id } from './signup_and_login_stuff/session';
import { BUILDINGS } from './constants/building_constants';

// game data calculations
function recalculate_cps() {
  const cps = Object.entries(game_data.value.buildings).reduce((total, [key, count]) => {
    return total + BUILDINGS[key].cps * count;
  }, 0);

  game_data.value = {
    ...game_data.value,
    cps,
  };
}

export function increase_cookies() {
  game_data.value = {
    ...game_data.value,
    quantity: game_data.value.quantity + game_data.value.cookies_per_click,
  };
}

export function buy_building(key) {
  const cost = BUILDINGS[key].cost;
  if (game_data.value.quantity < cost) return;

  game_data.value = {
    ...game_data.value,
    quantity: game_data.value.quantity - cost,
    buildings: {
      ...game_data.value.buildings,
      [key]: game_data.value.buildings[key] + 1,
    },
  };

  recalculate_cps();
}

// save
export async function save_game_data() {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/save_game_data`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: logged_in_user_id.value,
      game_data: JSON.parse(JSON.stringify(game_data.value)),
    }),
  });

  if (!res.ok) console.error('Save error:', await res.json());
}
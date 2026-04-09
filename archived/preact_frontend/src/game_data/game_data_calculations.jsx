import { game_data } from './game_data_loading';
import { BUILDINGS } from '../constants/building_constants';

function recalculate_cps() {
  const cps = Object.entries(game_data.value.buildings).reduce((total, [name, count]) => {
    return total + BUILDINGS[name].cps * count;
  }, 0);

  game_data.value = {
    ...game_data.value,
    cps,
  };
}

export function increaseCookies() {
  game_data.value = {
    ...game_data.value,
    quantity: game_data.value.quantity + game_data.value.cookies_per_click,
  };
}

export function buyBuilding(name) {
  const cost = BUILDINGS[name].cost;
  if (game_data.value.quantity < cost) return;

  game_data.value = {
    ...game_data.value,
    quantity: game_data.value.quantity - cost,
    buildings: {
      ...game_data.value.buildings,
      [name]: game_data.value.buildings[name] + 1,
    },
  };

  recalculate_cps();
}
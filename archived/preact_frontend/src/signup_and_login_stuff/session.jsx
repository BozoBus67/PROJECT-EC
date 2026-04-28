import { signal } from '@preact/signals';
import { current_screen } from '../miscellaneous_info/screen_info';

export const game_data = signal(null);
export const is_logged_in = signal(false);
export let session_data = null;
export let jwt = null;

export function on_login(user, token) {
  session_data = user;
  jwt = token;
  game_data.value = user.game_data;
  current_screen.value = 'main';
  is_logged_in.value = true;
}
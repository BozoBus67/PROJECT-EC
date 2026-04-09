import { logged_in_user } from '../miscellaneous_info/user_info';
import { current_screen } from '../miscellaneous_info/screen_info';

export function on_login(user) {
  logged_in_user.value = user.username;
  localStorage.setItem('logged_in_user', user.username);
  current_screen.value = 'main';
}
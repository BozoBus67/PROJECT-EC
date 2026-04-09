import { signal } from '@preact/signals';

type current_screen_type =
  'sign_up' |
  'login' |
  'main' |
  'settings' |
  'buy_premium'
;

const saved_user = localStorage.getItem('logged_in_user');

export const current_screen = signal<current_screen_type>(saved_user ? 'main' : 'sign_up');
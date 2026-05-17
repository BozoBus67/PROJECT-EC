import { signal } from '@preact/signals';

type current_screen_type =
  'sign_up' |
  'login' |
  'main' |
  'settings' |
  'buy_premium'
;

export const current_screen = signal<current_screen_type>('login');
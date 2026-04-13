import { signal } from '@preact/signals';

export const is_logged_in = signal(false);
export const logged_in_user_id = signal(null);
export let session_data = null;

export function on_login(user) {
  session_data = user;
  logged_in_user_id.value = user.id;
  is_logged_in.value = true;
}
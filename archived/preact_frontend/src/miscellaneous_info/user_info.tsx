import { signal } from '@preact/signals';

const saved_user = localStorage.getItem('logged_in_user');

export const logged_in_user = signal<string | null>(saved_user);
export const account_tier = signal<string>('free');

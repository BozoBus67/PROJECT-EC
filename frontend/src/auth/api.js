import { get_auth, post, post_auth } from '../shared/api_client';

export const api_me = () =>
  get_auth('/me');

export const api_login = (username_or_email, password) =>
  post('/login', { username_or_email, password });

export const api_signup = (email, username, password) =>
  post('/signup', { email, username, password });

// Promotes the current anonymous Supabase user into a permanent account
// in place — same user.id, so the existing guest progress carries over.
export const api_upgrade_anon = (email, username, password) =>
  post_auth('/upgrade_anon', { email, username, password });

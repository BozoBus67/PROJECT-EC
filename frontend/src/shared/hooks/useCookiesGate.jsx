import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Cookies_Locked_Modal from '../components/cookies_locked_modal';
import { update_game_data_field } from '../store/sessionSlice';

// Soft gate that requires the user to have reached at least `min` cookies
// (game_data.quantity) at least once. Once crossed, the unlock persists via
// game_data.has_passed_cookies_gate so spending back below the threshold
// doesn't re-lock. Mirrors `useTierGate` in shape: returns `{ gate, lock_modal }`.
// Render the modal alongside the gated buttons.
//
// Used to push fresh accounts to actually click the cookie a few times before
// they can hit the top-bar nav buttons. A determined user can hack their state
// to bypass it, but 1000 is low enough that the legit path is faster than
// reverse-engineering the Redux store.
export function useCookiesGate(min) {
  const dispatch = useDispatch();
  const quantity = useSelector(state => state.session.game_data?.quantity ?? 0);
  const has_passed = useSelector(state => state.session.game_data?.has_passed_cookies_gate ?? false);
  const [show_lock, set_show_lock] = useState(false);

  const gate = (callback) => {
    if (has_passed) { callback(); return; }
    if (quantity >= min) {
      dispatch(update_game_data_field({ key: 'has_passed_cookies_gate', value: true }));
      callback();
      return;
    }
    set_show_lock(true);
  };

  const lock_modal = show_lock
    ? <Cookies_Locked_Modal min={min} on_close={() => set_show_lock(false)} />
    : null;

  return { gate, lock_modal };
}

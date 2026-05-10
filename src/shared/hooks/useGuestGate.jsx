import { useState } from 'react';
import { useSelector } from 'react-redux';
import Guest_Locked_Modal from '../components/guest_locked_modal';

// Gate that blocks anonymous (guest) users from running a callback. Same shape
// as useCookiesGate / useTierGate: returns { gate, lock_modal }. Render the
// modal alongside the gated button. Pass `feature` so the modal can name what
// the user is being blocked from.
//
// Use for actions that require a real account — real-money flows (Buy Tokens),
// social features that surface a username, etc. NOT for in-game-token spends
// like Buy Premium, which work fine on the anon account.
export function useGuestGate(feature) {
  const is_anonymous = useSelector(state => state.session.is_anonymous);
  const [show_lock, set_show_lock] = useState(false);

  const gate = (callback) => {
    if (!is_anonymous) callback();
    else set_show_lock(true);
  };

  const lock_modal = show_lock
    ? <Guest_Locked_Modal feature={feature} on_close={() => set_show_lock(false)} />
    : null;

  return { gate, lock_modal };
}

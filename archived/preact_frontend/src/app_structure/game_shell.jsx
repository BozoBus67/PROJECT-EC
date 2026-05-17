import { createContext } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { current_screen } from '../miscellaneous_info/screen_info';
import { session_data, game_data, jwt } from '../signup_and_login_stuff/session';
import Main_Screen from '../main_game_screen_stuff/main_screen';
import Settings_Screen from '../settings_screen_stuff/settings_screen';
import Buy_Premium_Screen from '../settings_screen_stuff/buy_premium_screen';
import Loading_Screen from './loading_screen';

export const Game_Shell_Context = createContext(null);

const screens = {
  main: Main_Screen,
  settings: Settings_Screen,
  buy_premium: Buy_Premium_Screen,
};

function Daily_Checkin_Popup({ tokens_granted, streak }) {
  return (
    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', border: '1px solid gray', borderRadius: '12px', padding: '24px', textAlign: 'center', zIndex: 100 }}>
      <p style={{ fontWeight: 'bold', fontSize: '18px' }}>Daily check-in!</p>
      <p>+{tokens_granted} token{tokens_granted !== 1 ? 's' : ''}</p>
      <p style={{ color: 'gray', fontSize: '14px' }}>Day {streak} streak</p>
    </div>
  );
}

export default function Game_Shell() {
  const [done_loading, set_done_loading] = useState(false);
  const [premium_game_data, set_premium_game_data] = useState(null);
  const [user_auth_data, set_user_auth_data] = useState(null);
  const [checkin_popup, set_checkin_popup] = useState(null);
  const last_checkin_date = useRef(null);

  const show_checkin_popup = (tokens_granted, streak) => {
    set_checkin_popup({ tokens_granted, streak });
    setTimeout(() => set_checkin_popup(null), 3000);
  };

  const do_checkin = async () => {
    const today = new Date().toISOString().slice(0, 10);
    last_checkin_date.current = today;
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/daily_checkin`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (!data.already_checked_in) {
          set_premium_game_data(prev => ({ ...prev, tokens: data.tokens, login_streak: data.streak }));
          show_checkin_popup(data.tokens_granted, data.streak);
        }
      }
    } catch (e) {
      console.error('[daily_checkin]', e);
    }
  };

  const handle_visibility = () => {
    if (document.visibilityState === 'visible') {
      const today = new Date().toISOString().slice(0, 10);
      if (today !== last_checkin_date.current) do_checkin();
    }
  };

  useEffect(() => {
    const user = session_data;
    game_data.value = user.game_data;
    set_premium_game_data(user.premium_game_data);
    set_user_auth_data(user);
    set_done_loading(true);

    do_checkin();

    document.addEventListener('visibilitychange', handle_visibility);
    return () => document.removeEventListener('visibilitychange', handle_visibility);
  }, []);

  if (!done_loading) return <Loading_Screen />;

  if (screens[current_screen.value]) {
    const Screen = screens[current_screen.value];
    return (
      <Game_Shell_Context.Provider value={{ premium_game_data, set_premium_game_data, user_auth_data }}>
        {checkin_popup && <Daily_Checkin_Popup tokens_granted={checkin_popup.tokens_granted} streak={checkin_popup.streak} />}
        <Screen />
      </Game_Shell_Context.Provider>
    );
  } else {
    console.error('Invalid screen value:', current_screen.value);
  }
}

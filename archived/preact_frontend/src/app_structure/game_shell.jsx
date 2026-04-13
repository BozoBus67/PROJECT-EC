import { createContext } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { current_screen } from '../miscellaneous_info/screen_info';
import { session_data } from '../signup_and_login_stuff/session';
import { game_data } from '../game_data/game_state';
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

export default function Game_Shell() {
  const [done_loading, set_done_loading] = useState(false);
  const [premium_game_data, set_premium_game_data] = useState(null);
  const [user_auth_data, set_user_auth_data] = useState(null);

  useEffect(() => {
    const user = session_data;
    game_data.value = user.game_data;
    set_premium_game_data(user.premium_game_data);
    set_user_auth_data(user);
    set_done_loading(true);
  }, []);

  if (!done_loading) return <Loading_Screen />;

  if (screens[current_screen.value]) {
    const Screen = screens[current_screen.value];
    return (
      <Game_Shell_Context.Provider value={{ premium_game_data, set_premium_game_data, user_auth_data }}>
        <Screen />
      </Game_Shell_Context.Provider>
    );
  } else {
    console.error('Invalid screen value:', current_screen.value);
  }
}
import { current_screen } from './miscellaneous_info/screen_info';
import Sign_Up_Screen from './signup_and_login_stuff/sign_up_screen';
import Login_Screen from './signup_and_login_stuff/login_screen';
import Main_Screen from './main_game_screen_stuff/main_screen';
import Settings_Screen from './settings_screen_stuff/settings_screen';
import Buy_Premium_Screen from './settings_screen_stuff/buy_premium_screen';

const screens = {
  sign_up: Sign_Up_Screen,
  login: Login_Screen,
  settings: Settings_Screen,
  buy_premium: Buy_Premium_Screen,
  main: Main_Screen,
};

export default function App() {
  const Screen = screens[current_screen.value] ?? Main_Screen;
  return <Screen />;
}
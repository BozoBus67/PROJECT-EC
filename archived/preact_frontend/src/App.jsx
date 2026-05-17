import { is_logged_in } from './signup_and_login_stuff/session';
import Auth_Shell from './app_structure/auth_shell';
import Game_Shell from './app_structure/game_shell';

export default function App() {
  return is_logged_in.value ? <Game_Shell /> : <Auth_Shell />;
}
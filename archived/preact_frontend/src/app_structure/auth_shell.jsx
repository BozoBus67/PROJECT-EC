import { current_screen } from '../miscellaneous_info/screen_info';
import Login_Screen from '../signup_and_login_stuff/login_screen';
import Sign_Up_Screen from '../signup_and_login_stuff/sign_up_screen';

export default function Auth_Shell() {
  if (current_screen.value === 'sign_up') return <Sign_Up_Screen />;
  else if (current_screen.value === 'login') return <Login_Screen />;
  else console.error('Invalid screen value:', current_screen.value);
}
import { supabase } from '../miscellaneous_info/supabase_api_info';
import { useState, useEffect } from 'preact/hooks';
import { current_screen } from '../miscellaneous_info/screen_info';
import { on_login } from './session';

function Login_Panel({ Try_Login, fields }) {
  return (
    <div className="w-96 p-4 border-2 border-gray-300 rounded-lg" style={{ background: 'white' }}>
      <h2 className="text-xl font-bold mb-4">Login</h2>

      <input
        type="text"
        placeholder="Username or Email"
        className="w-full mb-2 p-2 border-2 border-gray-300 rounded-lg"
        value={fields.usernameOrEmail}
        onChange={(e) => fields.setUsernameOrEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full mb-4 p-2 border-2 border-gray-300 rounded-lg"
        value={fields.password}
        onChange={(e) => fields.setPassword(e.target.value)}
      />

      <button
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 active:bg-blue-700 transition"
        onClick={Try_Login}
      >
        Login
      </button>

      <button
        className="w-full text-blue-500 py-2 rounded-lg hover:underline transition"
        onClick={() => current_screen.value = 'sign_up'}
      >
        I want to sign up instead
      </button>
    </div>
  );
}

export default function Login_Screen() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');

  const Try_Login = async () => {
    const { data, error } = await supabase
      .from('User_Login_Data')
      .select()
      .or(`username.eq.${usernameOrEmail},email.eq.${usernameOrEmail}`)
      .eq('password', password)
      .single();

    if (error || !data) {
      alert('Invalid username/email or password');
      return;
    }

    on_login(data);
  };

  useEffect(() => {
    const handle_enter = (e) => {
      if (e.key === 'Enter') Try_Login();
    };
    document.addEventListener('keydown', handle_enter);
    return () => document.removeEventListener('keydown', handle_enter);
  }, [usernameOrEmail, password]);

  return (
    <div style={{
      display: 'flex',
      width: '100vw',
      height: '100vh',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundImage: 'url(/images/jeffery_epstein_blurry.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <Login_Panel
        Try_Login={Try_Login}
        fields={{
          usernameOrEmail, setUsernameOrEmail,
          password, setPassword,
        }}
      />
    </div>
  );
}
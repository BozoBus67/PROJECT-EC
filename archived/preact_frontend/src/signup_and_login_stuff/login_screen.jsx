import { useState, useEffect, useRef } from 'preact/hooks';
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
        onInput={(e) => fields.setUsernameOrEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full mb-4 p-2 border-2 border-gray-300 rounded-lg"
        value={fields.password}
        onInput={(e) => fields.setPassword(e.target.value)}
      />

      {fields.error && (
        <p style={{ color: 'red', marginBottom: '8px', fontSize: '14px' }}>{fields.error}</p>
      )}

      <button
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 active:bg-blue-700 transition"
        onClick={Try_Login}
        disabled={fields.loading}
      >
        {fields.loading ? 'Logging in...' : 'Login'}
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
  console.log('Rendering Login_Screen');
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  console.log('State initialized:', { usernameOrEmail, password });
  const [error, set_error] = useState('');
  const [loading, set_loading] = useState(false);
  const try_login_ref = useRef(null);

  const Try_Login = async () => {
    set_error('');

    if (!usernameOrEmail || !password) {
      set_error('Please enter your username/email and password.');
      return;
    }

    set_loading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username_or_email: usernameOrEmail, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        set_error(data.detail || 'Something went wrong. Please try again.');
      } else {
        on_login(data.user, data.jwt);
      }
    } catch {
      set_error('Could not reach the server. Check your connection.');
    } finally {
      set_loading(false);
    }
  };

  try_login_ref.current = Try_Login;

  useEffect(() => {
    const handle_enter = (e) => {
      if (e.key === 'Enter') try_login_ref.current();
    };
    document.addEventListener('keydown', handle_enter);
    return () => document.removeEventListener('keydown', handle_enter);
  }, []);

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
        fields={{ usernameOrEmail, setUsernameOrEmail, password, setPassword, error, loading }}
      />
    </div>
  );
}
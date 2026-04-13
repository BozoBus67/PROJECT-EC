import { useState, useEffect } from 'preact/hooks';
import { current_screen } from '../miscellaneous_info/screen_info';
import { on_login } from './session';

function Sign_Up_Panel({ Try_Sign_Up, fields }) {
  return (
    <div className="w-96 p-4 border-2 border-gray-300 rounded-lg" style={{ background: 'white' }}>
      <h2 className="text-xl font-bold mb-4">Sign Up</h2>

      <input
        type="text"
        placeholder="Username"
        className="w-full mb-2 p-2 border-2 border-gray-300 rounded-lg"
        value={fields.username}
        onChange={(e) => fields.setUsername(e.target.value)}
      />

      <input
        type="text"
        placeholder="Email"
        className="w-full mb-2 p-2 border-2 border-gray-300 rounded-lg"
        value={fields.email}
        onChange={(e) => fields.setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full mb-2 p-2 border-2 border-gray-300 rounded-lg"
        value={fields.password}
        onChange={(e) => fields.setPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Confirm Password"
        className="w-full mb-4 p-2 border-2 border-gray-300 rounded-lg"
        value={fields.confirmPassword}
        onChange={(e) => fields.setConfirmPassword(e.target.value)}
      />

      <button
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 active:bg-blue-700 transition"
        onClick={Try_Sign_Up}
      >
        Sign Up
      </button>

      <button
        className="w-full text-blue-500 py-2 rounded-lg hover:underline transition"
        onClick={() => current_screen.value = 'login'}
      >
        I already have an account
      </button>
    </div>
  );
}

export default function Sign_Up_Screen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const Try_Sign_Up = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.detail || 'Sign up failed');
      return;
    }

    on_login(data.user);
  };

  useEffect(() => {
    const handle_enter = (e) => {
      if (e.key === 'Enter') Try_Sign_Up();
    };
    document.addEventListener('keydown', handle_enter);
    return () => document.removeEventListener('keydown', handle_enter);
  }, [username, email, password, confirmPassword]);

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
      <Sign_Up_Panel
        Try_Sign_Up={Try_Sign_Up}
        fields={{ username, setUsername, email, setEmail, password, setPassword, confirmPassword, setConfirmPassword }}
      />
    </div>
  );
}
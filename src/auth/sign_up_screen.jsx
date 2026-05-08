import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Back_Arrow_Button } from '../shared/components';
import { useEscapeKey } from '../shared/hooks';
import { login } from '../shared/store/sessionSlice';
import { supabase } from '../shared/supabase_client';
import { variant_asset } from '../shared/variant_assets';
import { api_me, api_signup, api_upgrade_anon } from './api';

// SFW reuses the loading-screen image as the auth background — there's no
// separate SFW auth-bg asset. NSFW uses the original jeff blurry photo.
const SFW = import.meta.env.VITE_SFW === 'true';
const auth_background = variant_asset('backgrounds', SFW ? 'loading_screen' : 'jeffrey_epstein_blurry');

export default function Sign_Up_Screen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const is_anonymous = useSelector(state => state.session.is_anonymous);
  const is_logged_in = useSelector(state => state.session.is_logged_in);

  const [error, set_error] = useState('');
  const [loading, set_loading] = useState(false);

  // Back nav (arrow + esc) only for users with a session to return to.
  // The No_Session_Shell fallback (anon sign-in disabled, etc.) doesn't
  // have /game available, so showing a back button there would dead-end.
  useEscapeKey(() => navigate('/game'), is_logged_in && !loading);

  const try_sign_up = async ({ username, email, password, confirm_password }) => {
    set_error('');

    if (!username || !email || !password || !confirm_password) {
      set_error('Please fill in all fields.');
      return;
    }
    if (password !== confirm_password) {
      set_error('Passwords do not match.');
      return;
    }

    set_loading(true);

    try {
      // Anonymous → permanent: upgrade in place so the guest's progress is
      // preserved (same user.id, same User_Login_Data row). Cold signup
      // (no anon session, e.g. anon auth disabled) goes through /signup
      // which creates a fresh auth user.
      if (is_anonymous) {
        await api_upgrade_anon(email, username, password);
        // Refresh the JWT so the local session reflects is_anonymous=false,
        // then re-fetch /me to pick up the new username/email.
        await supabase.auth.refreshSession();
        const me = await api_me();
        dispatch(login({ user: me.user }));
      } else {
        const data = await api_signup(email, username, password);
        await supabase.auth.setSession({ access_token: data.jwt, refresh_token: data.refresh_token });
        dispatch(login({ user: data.user }));
      }
      navigate('/game');
    } catch (err) {
      set_error(err?.detail || 'Error: An unknown error occurred — please try again.');
    } finally {
      set_loading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      width: '100vw',
      height: '100vh',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundImage: `url(${auth_background})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      {is_logged_in && <Back_Arrow_Button to="/game" />}
      <Sign_Up_Panel
        on_submit={try_sign_up}
        error={error}
        loading={loading}
        go_to_login={() => navigate('/login')}
        upgrading_guest={is_anonymous}
      />
    </div>
  );
}

function Sign_Up_Panel({ on_submit, error, loading, go_to_login, upgrading_guest }) {
  const [username, set_username] = useState('');
  const [email, set_email] = useState('');
  const [password, set_password] = useState('');
  const [confirm_password, set_confirm_password] = useState('');

  const submit = () => on_submit({ username, email, password, confirm_password });

  const input_style = { display: 'block', padding: '8px 10px', background: 'rgba(255,255,255,0.1)', color: '#e0e0f0', border: '1px solid rgba(255,255,255,0.25)' };
  const on_enter = (e) => { if (e.key === 'Enter') submit(); };

  return (
    <div style={{
      width: '384px', padding: '32px', borderRadius: '12px',
      background: 'rgba(9, 14, 28, 0.88)',
      border: '1px solid rgba(250, 204, 21, 0.5)',
      backdropFilter: 'blur(12px)',
      color: '#e0e0f0',
    }}>
      <h2 style={{ margin: '0 0 20px', color: '#facc15', fontSize: '32px', fontWeight: 'bold', textAlign: 'center' }}>Sign Up</h2>
      {upgrading_guest && (
        <p style={{ margin: '0 0 16px', color: '#a3e635', fontSize: '13px', textAlign: 'center', lineHeight: 1.4 }}>
          Your guest progress will be saved to this new account.
        </p>
      )}

      <input
        type="text"
        placeholder="Username"
        className="w-full mb-2 rounded-lg"
        style={input_style}
        value={username}
        onChange={(e) => set_username(e.target.value)}
        onKeyDown={on_enter}
      />

      <input
        type="text"
        placeholder="Email"
        className="w-full mb-2 rounded-lg"
        style={input_style}
        value={email}
        onChange={(e) => set_email(e.target.value)}
        onKeyDown={on_enter}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full mb-2 rounded-lg"
        style={input_style}
        value={password}
        onChange={(e) => set_password(e.target.value)}
        onKeyDown={on_enter}
      />

      <input
        type="password"
        placeholder="Confirm Password"
        className="w-full mb-4 rounded-lg"
        style={input_style}
        value={confirm_password}
        onChange={(e) => set_confirm_password(e.target.value)}
        onKeyDown={on_enter}
      />

      {error && (
        <p style={{ color: '#f87171', marginBottom: '8px', fontSize: '14px' }}>{error}</p>
      )}

      <button
        type="button"
        className="w-full rounded-lg transition"
        style={{ padding: '8px', background: '#facc15', color: '#000', fontWeight: 'bold', cursor: 'pointer', border: 'none' }}
        onClick={submit}
        disabled={loading}
      >
        {loading ? 'Creating account...' : 'Sign Up'}
      </button>

      <button
        type="button"
        className="w-full rounded-lg transition hover:underline"
        style={{ padding: '8px', background: 'transparent', color: '#facc15', border: 'none', cursor: 'pointer', marginTop: '4px' }}
        onClick={go_to_login}
      >
        I already have an account
      </button>
    </div>
  );
}

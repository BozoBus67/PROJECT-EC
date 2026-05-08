import { useNavigate } from 'react-router-dom';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { useTheme } from '../theme';
import Modal_Overlay from './modal_overlay';

export default function Guest_Locked_Modal({ feature, on_close }) {
  const theme = useTheme();
  const navigate = useNavigate();
  useEscapeKey(on_close);

  const handle_sign_up = () => {
    on_close();
    navigate('/signup');
  };

  return (
    <Modal_Overlay panel_style={{ alignItems: 'center', textAlign: 'center', minWidth: '360px' }}>
      <h2 style={{ color: theme.accent, margin: 0 }}>🔒 Sign up required</h2>
      <p style={{ margin: 0 }}>
        You're playing as a guest. Sign up to use {feature}.
      </p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button
          type="button"
          onClick={handle_sign_up}
          style={{
            padding: '8px 24px', background: theme.accent, color: theme.accent_text,
            border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer',
          }}
        >
          Sign up
        </button>
        <button
          type="button"
          onClick={on_close}
          style={{
            padding: '8px 24px', background: theme.button_neutral_bg, color: theme.button_neutral_text,
            border: 'none', borderRadius: '6px', cursor: 'pointer',
          }}
        >
          Not now
        </button>
      </div>
    </Modal_Overlay>
  );
}

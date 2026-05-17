import { useEffect, useState } from 'preact/hooks';
import { current_screen } from '../miscellaneous_info/screen_info';
import { current_audio } from '../miscellaneous_info/misc_info';
import { game_data, is_logged_in, jwt } from '../signup_and_login_stuff/session';

function Reset_Save_Confirmation_Panel({ on_confirm, on_cancel }) {
  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'white',
      border: '1px solid gray',
      borderRadius: '12px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
      zIndex: 100,
    }}>
      <p style={{ fontSize: '18px', fontWeight: 'bold' }}>Are you sure?</p>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={on_confirm}
          className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 active:bg-red-700 transition"
        >
          Yes
        </button>
        <button
          onClick={on_cancel}
          className="bg-gray-300 text-black py-2 px-6 rounded-lg hover:bg-gray-400 active:bg-gray-500 transition"
        >
          No
        </button>
      </div>
    </div>
  );
}

export default function Settings_Screen() {
  const [show_reset_confirmation, set_show_reset_confirmation] = useState(false);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') current_screen.value = 'main';
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '12px' }}>
      <Back_Arrow_Button on_click={() => current_screen.value = 'main'} />
      <X_Button on_click={() => current_screen.value = 'main'} />
      <button
        onClick={() => current_screen.value = 'buy_premium'}
        className="bg-purple-500 text-white py-2 px-6 rounded-lg hover:bg-purple-600 active:bg-purple-700 transition"
      >
        Buy Premium
      </button>
      <Reset_Save_Button on_click={() => set_show_reset_confirmation(true)} />
      <Log_Out_Button />
      {show_reset_confirmation && (
        <Reset_Save_Confirmation_Panel
          on_confirm={async () => {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/reset_game_data`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`,
              },
            });
            if (res.ok) {
              const data = await res.json();
              game_data.value = data.game_data;
            } else {
              console.error('Reset failed');
            }
            set_show_reset_confirmation(false);
          }}
          on_cancel={() => set_show_reset_confirmation(false)}
        />
      )}
    </div>
  );
}

function Back_Arrow_Button({ on_click }) {
  return (
    <button
      onClick={on_click}
      style={{
        position: 'fixed',
        top: '16px',
        left: '16px',
        border: '1px solid gray',
        borderRadius: '50%',
        width: '32px',
        height: '32px',
      }}
      className="text-gray-700 hover:text-gray-900 transition font-bold"
    >
      ←
    </button>
  );
}

function X_Button({ on_click }) {
  return (
    <button
      onClick={on_click}
      style={{
        position: 'fixed',
        top: '16px',
        right: '16px',
        border: '1px solid gray',
        borderRadius: '50%',
        width: '32px',
        height: '32px',
      }}
      className="text-gray-700 hover:text-gray-900 transition font-bold"
    >
      ✕
    </button>
  );
}

function Reset_Save_Button({ on_click }) {
  return (
    <button
      onClick={on_click}
      className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 active:bg-gray-700 transition"
    >
      Reset Save
    </button>
  );
}

function Log_Out_Button() {
  const handle_logout = () => {
    is_logged_in.value = false;
    current_screen.value = 'login';

    if (current_audio.value) {
      current_audio.value.pause();
      current_audio.value = null;
    }
  };

  return (
    <button
      onClick={handle_logout}
      className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 active:bg-red-700 transition"
    >
      Log Out
    </button>
  );
}
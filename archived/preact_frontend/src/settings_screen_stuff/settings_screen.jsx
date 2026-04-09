import { useEffect } from 'preact/hooks';
import { current_screen } from '../miscellaneous_info/screen_info';
import { logged_in_user } from '../miscellaneous_info/user_info';
import { current_audio } from '../miscellaneous_info/misc_info';
import { game_data, initial_save, saveGameData } from '../game_data/game_data_loading';

export default function Settings_Screen() {
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
      <Reset_Save_Button />
      <Log_Out_Button />
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

function Reset_Save_Button() {
  const handle_reset = async () => {
    game_data.value = initial_save;
    await saveGameData();
  };

  return (
    <button
      onClick={handle_reset}
      className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 active:bg-gray-700 transition"
    >
      Reset Save
    </button>
  );
}

function Log_Out_Button() {
  const handle_logout = () => {
    logged_in_user.value = null;
    localStorage.removeItem('logged_in_user');
    current_screen.value = 'sign_up';

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
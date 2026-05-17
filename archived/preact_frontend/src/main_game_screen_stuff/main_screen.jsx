import { useEffect, useState } from 'preact/hooks';
import { game_data } from '../signup_and_login_stuff/session';
import { save_game_data } from '../utils';
import { current_screen } from '../miscellaneous_info/screen_info';
import settingsIcon from '../assets/settings_gear_icon.jpg';
import Top_Bar from './parts_of_main_screen/top_bar';
import Main_Body from './parts_of_main_screen/main_body';

function use_main_screen_effects(trigger_save) {
  useEffect(() => {
    const interval = setInterval(trigger_save, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        trigger_save();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      game_data.value = {
        ...game_data.value,
        quantity: game_data.value.quantity + game_data.value.cps,
      };
    }, 1000);
    return () => clearInterval(interval);
  }, []);
}

function Game_Saved_Popup() {
  return (
    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
      Game saved!
    </div>
  );
}

function Settings_Button() {
  const [hovered, set_hovered] = useState(false);

  return (
    <button
      onClick={() => current_screen.value = 'settings'}
      onMouseEnter={() => set_hovered(true)}
      onMouseLeave={() => set_hovered(false)}
      style={{
        position: 'fixed',
        bottom: '16px',
        left: '16px',
        border: '1px solid gray',
        borderRadius: '8px',
        padding: '2px',
        outline: hovered ? '2px solid #facc15' : '2px solid transparent',
        cursor: hovered ? 'pointer' : 'default',
      }}
    >
      <img src={settingsIcon} draggable={false} style={{ width: '40px', height: '40px', display: 'block' }} />
    </button>
  );
}

export default function Main_Screen() {
  const [showSaved, setShowSaved] = useState(false);

  const trigger_save = () => {
    save_game_data();
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  use_main_screen_effects(trigger_save);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh' }}>
      {showSaved && <Game_Saved_Popup />}
      <Top_Bar />
      <Main_Body />
      <Settings_Button />
    </div>
  );
}
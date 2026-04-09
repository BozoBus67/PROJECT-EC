import { useEffect, useState } from 'preact/hooks';
import { game_data, saveGameData, loadGameFromDB } from '../game_data/game_data_loading';import { current_screen } from '../miscellaneous_info/screen_info';
import settingsIcon from '../assets/settings_gear_icon.jpg';
import Top_Bar from './parts_of_main_screen/top_bar';
import Main_Body from './parts_of_main_screen/main_body';

export default function Main_Screen() {
  const [showSaved, setShowSaved] = useState(false);

  const triggerSave = () => {
    saveGameData();
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  useEffect(() => { loadGameFromDB(); }, []);

  useEffect(() => {
    const interval = setInterval(triggerSave, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        triggerSave();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      game_data.value = {
        ...game_data.value,
        quantity: game_data.value.quantity + game_data.value.cps
      };
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh' }}>
      {showSaved && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          Game saved!
        </div>
      )}
      <Top_Bar />
      <Main_Body />
      <button
        onClick={() => current_screen.value = 'settings'}
        style={{ position: 'fixed', bottom: '16px', left: '16px', border: '1px solid gray', borderRadius: '8px', padding: '2px' }}
        className="hover:opacity-70 active:opacity-50 transition"
      >
        <img src={settingsIcon} style={{ width: '40px', height: '40px', display: 'block' }} />
      </button>
    </div>
  );
}
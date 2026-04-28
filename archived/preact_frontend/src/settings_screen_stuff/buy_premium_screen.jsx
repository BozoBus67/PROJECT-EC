import { useEffect } from 'preact/hooks';
import { current_screen } from '../miscellaneous_info/screen_info';
import { account_tiers } from '../miscellaneous_info/misc_info';

export default function Buy_Premium_Screen() {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') current_screen.value = 'settings';
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const paid_tiers = account_tiers.value.filter(t => t.id !== 'free');

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
    }}>
      <Back_Arrow_Button on_click={() => current_screen.value = 'settings'} />
      <X_Button on_click={() => current_screen.value = 'main'} />

      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '24px',
        padding: '80px 48px',
        overflowX: 'auto',
        height: '100%',
      }}>
        {paid_tiers.map((tier) => (
          <Tier_Card key={tier.id} tier={tier} />
        ))}
      </div>
    </div>
  );
}

function Tier_Card({ tier }) {
  return (
    <button
      onClick={() => {}}
      style={{
        minWidth: '220px',
        height: '340px',
        border: '1px solid #ccc',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        gap: '16px',
        flexShrink: 0,
        background: 'white',
        cursor: 'pointer',
        transition: 'transform 0.15s, box-shadow 0.15s',
      }}
      className="hover:scale-105 hover:shadow-xl"
    >
      <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{tier.label}</div>
      <div style={{ flex: 1, width: '100%', background: '#f0f0f0', borderRadius: '8px' }} />
    </button>
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
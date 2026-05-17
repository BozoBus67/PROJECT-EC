import Music_Player from './music_player';

export default function Top_Bar() {
  return (
    <div style={{
      width: '100%',
      height: '40px',
      background: 'white',
      borderBottom: '1px solid #ddd',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 12px',
      boxSizing: 'border-box',
      flexShrink: 0,
    }}>
      <Music_Player />
    </div>
  );
}
import { useState, useRef } from 'preact/hooks';
import { game_data } from '../../signup_and_login_stuff/session';
import { buy_building } from '../../utils';
import { BUILDINGS } from '../../constants/building_constants';

function Building_Tooltip({ building, owned, row_top, row_height }) {
  return (
    <div style={{
      position: 'fixed',
      top: row_top + row_height / 2,
      transform: 'translateX(-110%) translateY(-50%)',
      background: 'rgba(0,0,0,0.75)',
      color: 'white',
      borderRadius: '6px',
      padding: '6px 10px',
      fontSize: '12px',
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      zIndex: 10,
    }}>
      <div>Each: {building.cps} cps</div>
      <div>Total: {building.cps * owned} cps</div>
    </div>
  );
}

export function Building_Row({ name }) {
  const [hovered, set_hovered] = useState(false);
  const [rect, set_rect] = useState(null);
  const row_ref = useRef(null);
  const building = BUILDINGS[name];
  const owned = game_data.value.buildings[name];

  return (
    <div
      ref={row_ref}
      onClick={() => buy_building(name)}
      onMouseEnter={() => { set_hovered(true); set_rect(row_ref.current.getBoundingClientRect()); }}
      onMouseLeave={() => set_hovered(false)}
      style={{ position: 'relative', display: 'flex', alignItems: 'center', border: '1px solid black', padding: '8px', cursor: 'pointer' }}
      className="hover:bg-gray-100 active:bg-gray-200 transition"
    >
      {hovered && rect && <Building_Tooltip building={building} owned={owned} row_top={rect.top} row_height={rect.height} />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{building.display_name}</span>
        <span style={{ fontSize: '12px', color: '#666' }}>Cost: {building.cost}</span>
      </div>
      <span style={{ marginLeft: 'auto', fontSize: '14px' }}>
        Owned: {owned}
      </span>
    </div>
  );
}
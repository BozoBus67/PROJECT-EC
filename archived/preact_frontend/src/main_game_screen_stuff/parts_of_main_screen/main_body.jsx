import { game_data } from '../../game_data/game_data_loading';
import { increaseCookies } from '../../game_data/game_data_calculations';
import { Building_Row } from '../buildings/buildings_components';
import * as Constants from '../../constants/constants';
import * as BuildingConstants from '../../constants/building_constants';
import epstein from '../../assets/epstein.png';

function Epstein_Head() {
  return (
    <button
      onClick={increaseCookies}
      className="cursor-pointer transition-transform duration-100 hover:scale-[1.02] active:scale-[0.98]"
    >
      <img src={epstein} />
    </button>
  );
}

function Left_Part_Of_Screen() {
  return (
    <div style={{ flex: '1 1 0', height: '100%', padding: '20px' }}>
      <p>{Constants.QUANTITY_NAME}: {game_data.value.quantity}</p>
      <p>{Constants.QUANTITY_NAME} per second: {game_data.value.cps}</p>
      <Epstein_Head />
    </div>
  );
}

function Middle_Part_Of_Screen() {
  return (
    <div style={{ flex: '1 1 0', height: '100%', padding: '20px' }}>
      Middle
    </div>
  );
}

function Right_Part_Of_Screen() {
  return (
    <div style={{ flex: '1 1 0', height: '100%', padding: '20px', paddingBottom: '40px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      {Object.keys(BuildingConstants.BUILDINGS).map(name => (
        <Building_Row key={name} name={name} />
      ))}
    </div>
  );
}

export default function Main_Body() {
  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      <Left_Part_Of_Screen />
      <Middle_Part_Of_Screen />
      <Right_Part_Of_Screen />
    </div>
  );
}
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './shared/store';
import { variant_asset } from './shared/variant_assets';
import App from './App';
import './index.css';

// Favicon swap by edition. The `<link rel="icon">` tag in index.html has no
// href; we set it here so the same bundle picks the correct asset based on
// VITE_VARIANT at build time (cookie/gem image in non-NSFW, Epstein in NSFW).
const favicon = document.getElementById('app-favicon');
if (favicon) favicon.href = variant_asset('backgrounds', 'epstein');

createRoot(document.getElementById('app')).render(
  <Provider store={store}>
    <App />
  </Provider>
);

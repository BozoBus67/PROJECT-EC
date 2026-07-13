import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './shared/store';
import { variant_asset } from './shared/variant_assets';
import App from './App';
import './index.css';

// Favicon swap by edition. The `<link rel="icon">` tag in index.html has no
// href; we set it here so the same bundle picks the correct asset based on
// VITE_VARIANT at build time (cookie/gem image in non-NSFW, Epstein in NSFW).
// The raw asset is a wide photo, which the tab icon would squeeze whole;
// redraw it as the same circular center-top cover crop the in-game clicker
// uses (Epstein_Head in cookie_click_panel.jsx) before handing it to the tab.
const favicon = document.getElementById('app-favicon');
if (favicon) {
  const asset = variant_asset('backgrounds', 'epstein');
  favicon.href = asset; // shown until the crop is ready, kept if it fails
  const img = new Image();
  img.onload = () => {
    const side = Math.min(img.naturalWidth, img.naturalHeight);
    if (!side) return; // e.g. an SVG with no resolvable intrinsic size
    const SIZE = 64;
    const canvas = document.createElement('canvas');
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, 2 * Math.PI);
    ctx.clip();
    ctx.drawImage(img, (img.naturalWidth - side) / 2, 0, side, side, 0, 0, SIZE, SIZE);
    try {
      favicon.href = canvas.toDataURL('image/png');
    } catch {
      // toDataURL throws on a tainted canvas (file:// in the desktop build,
      // where there is no tab anyway); the raw href above stays in place
    }
  };
  img.src = asset;
}

createRoot(document.getElementById('app')).render(
  <Provider store={store}>
    <App />
  </Provider>
);

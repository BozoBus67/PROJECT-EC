import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Relative base so built index.html resolves assets under file:// when
  // loaded by Electron via mainWindow.loadFile. Vercel deployments serve from
  // an HTTP origin where absolute '/' would also work, so this is safe for both.
  base: './',
  plugins: [
    react(),
    tailwindcss(),
  ],
});

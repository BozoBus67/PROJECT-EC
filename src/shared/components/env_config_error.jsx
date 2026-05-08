import { useEffect } from 'react';

// Renders instead of the normal app when required env vars are missing. Mounts
// before any router or session bootstrap, so a misconfigured deploy fails
// loud and visible instead of getting stuck on the loading screen forever.
// See App.jsx for the missing-var detection.
export default function Env_Config_Error({ missing }) {
  useEffect(() => {
    console.error('[env] Missing required environment variables:', missing);
  }, [missing]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100vw',
      height: '100vh',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#1a0d0d',
      color: '#ffaeae',
      fontFamily: 'sans-serif',
      gap: '16px',
      padding: '24px',
      textAlign: 'center',
    }}>
      <h1 style={{ color: '#ff6b6b', fontSize: '28px', margin: 0 }}>Configuration Error</h1>
      <p style={{ margin: 0, fontSize: '16px', maxWidth: '560px', lineHeight: 1.5 }}>
        The app is missing one or more required environment variables. Set these in your Vercel project (Settings → Environment Variables) and redeploy.
      </p>
      <ul style={{
        listStyle: 'none', margin: 0,
        background: 'rgba(255,107,107,0.1)',
        border: '1px solid rgba(255,107,107,0.3)',
        borderRadius: '8px',
        padding: '16px 32px',
      }}>
        {missing.map(name => (
          <li key={name} style={{ fontFamily: 'monospace', fontSize: '15px', color: '#fff' }}>
            {name}
          </li>
        ))}
      </ul>
      <p style={{ margin: 0, fontSize: '13px', color: '#888', maxWidth: '560px', lineHeight: 1.4 }}>
        Local dev: add them to <code>frontend/.env</code> and restart the dev server.
      </p>
    </div>
  );
}

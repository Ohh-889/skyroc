// oxlint-disable import/no-unassigned-import
import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import './demos/ipc';
// If you want use Node.js, the`nodeIntegration` needs to be enabled in the Main process.
// import './demos/node'

async function bootstrap() {
  if (import.meta.env.DEV) {
    await import('./features/devtools/jotai');
  }

  const { default: App } = await import('./App');

  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  postMessage({ payload: 'removeLoading' }, '*');
}

bootstrap();

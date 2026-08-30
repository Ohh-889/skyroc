// oxlint-disable import/no-unassigned-import
import React from 'react';
import ReactDOM from 'react-dom/client';

import { initializeTheme } from './features/theme/theme';
import './index.css';
import './demos/ipc';
import { loadSettings } from './pages/(app)/settings/modules/settings-config';
// If you want use Node.js, the`nodeIntegration` needs to be enabled in the Main process.
// import './demos/node'

async function bootstrap() {
  const settings = loadSettings();
  const disposeTheme = initializeTheme({
    accentColor: settings.accentColor,
    themeMode: settings.themeMode
  });

  if (import.meta.hot) import.meta.hot.dispose(disposeTheme);

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

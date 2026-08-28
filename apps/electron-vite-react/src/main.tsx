// oxlint-disable import/no-unassigned-import
import React from 'react';
import ReactDOM from 'react-dom/client';
import RouterProvider from './features/router/RouterProvider';

import './index.css';
import './demos/ipc';
// If you want use Node.js, the`nodeIntegration` needs to be enabled in the Main process.
// import './demos/node'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider />
  </React.StrictMode>
);

postMessage({ payload: 'removeLoading' }, '*');

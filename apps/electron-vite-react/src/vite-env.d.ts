/// <reference types="vite/client" />

interface Window {
  /** Safe desktop file selection methods exposed by the preload bridge. */
  desktopFiles?: {
    importFiles: () => Promise<string[]>;
    openDirectory: () => Promise<string[]>;
  };
  /** Safe window controls exposed by the preload bridge. */
  desktopWindow?: {
    close: () => void;
    minimize: () => void;
    platform: NodeJS.Platform;
    setMode: (mode: 'auth' | 'workspace') => Promise<void>;
    toggleMaximize: () => void;
  };
  // expose in the `electron/preload/index.ts`
  ipcRenderer: import('electron').IpcRenderer;
}

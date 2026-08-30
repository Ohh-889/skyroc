/// <reference types="vite/client" />

interface Window {
  /** Safe native appearance methods exposed by the preload bridge. */
  desktopAppearance?: {
    getNativeAppearance: () => Promise<{ accentColor: string | null }>;
    offAccentColorChanged: (listener: (accentColor: string) => void) => void;
    onAccentColorChanged: (listener: (accentColor: string) => void) => void;
    setThemeSource: (themeSource: 'dark' | 'light' | 'system') => Promise<void>;
    setWindowMaterial: (material: 'acrylic' | 'auto' | 'mica' | 'solid' | 'vibrancy') => Promise<boolean>;
    setZoomFactor: (factor: number) => Promise<void>;
  };
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

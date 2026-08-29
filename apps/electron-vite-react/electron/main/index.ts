import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BrowserWindow, Menu, app, dialog, ipcMain, screen, shell } from 'electron';
import type { OpenDialogOptions } from 'electron';
import { update } from './update';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs   > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.APP_ROOT = path.join(__dirname, '../..');

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST;

// Disable GPU Acceleration for Windows 7
if (process.platform === 'win32' && os.release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let win: BrowserWindow | null = null;
const preload = path.join(__dirname, '../preload/index.mjs');
const indexHtml = path.join(RENDERER_DIST, 'index.html');

type DesktopWindowMode = 'auth' | 'workspace';

function setDesktopWindowMode(window: BrowserWindow, mode: DesktopWindowMode) {
  if (window.isMaximized()) window.unmaximize();

  if (mode === 'auth') {
    window.setResizable(true);
    window.setMinimumSize(400, 520);
    window.setSize(440, 620, true);
    window.center();
    window.setMaximizable(false);
    window.setResizable(false);
    return;
  }

  const { height: availableHeight, width: availableWidth } = screen.getDisplayMatching(window.getBounds()).workAreaSize;

  window.setResizable(true);
  window.setMaximizable(true);
  window.setMinimumSize(760, 560);
  window.setSize(Math.min(1240, availableWidth), Math.min(800, availableHeight), true);
  window.center();
}

async function createWindow() {
  win = new BrowserWindow({
    height: 620,
    icon: path.join(process.env.VITE_PUBLIC ?? '', 'favicon.ico'),
    maximizable: false,
    minHeight: 520,
    minWidth: 400,
    resizable: false,
    title: 'Main window',
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 18, y: 16 },
    webPreferences: {
      preload
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // nodeIntegration: true,

      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      // contextIsolation: false,
    },
    width: 440
  });

  if (VITE_DEV_SERVER_URL) {
    // #298
    win.loadURL(VITE_DEV_SERVER_URL);

    win.webContents.on('before-input-event', (event, input) => {
      if (input.type === 'keyDown' && input.key === 'F12') {
        event.preventDefault();
        win?.webContents.toggleDevTools();
      }
    });

    win.webContents.on('context-menu', (_, params) => {
      Menu.buildFromTemplate([
        {
          label: '打开开发者工具',
          click() {
            win?.webContents.openDevTools();
          }
        }
      ]).popup({ window: win ?? undefined, x: params.x, y: params.y });
    });
  } else {
    win.loadFile(indexHtml);
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url);
    return { action: 'deny' };
  });

  // Auto update
  update(win);
}

ipcMain.on('desktop-window:minimize', event => {
  BrowserWindow.fromWebContents(event.sender)?.minimize();
});

ipcMain.on('desktop-window:toggle-maximize', event => {
  const window = BrowserWindow.fromWebContents(event.sender);

  if (window?.isMaximized()) {
    window.unmaximize();
  } else {
    window?.maximize();
  }
});

ipcMain.on('desktop-window:close', event => {
  BrowserWindow.fromWebContents(event.sender)?.close();
});

ipcMain.handle('desktop-window:set-mode', (event, mode: DesktopWindowMode) => {
  if (mode !== 'auth' && mode !== 'workspace') return;

  const window = BrowserWindow.fromWebContents(event.sender);

  if (window) setDesktopWindowMode(window, mode);
});

ipcMain.handle('desktop-files:open-directory', async event => {
  const window = BrowserWindow.fromWebContents(event.sender);
  const options: OpenDialogOptions = { properties: ['openDirectory', 'createDirectory'] };
  const result = window ? await dialog.showOpenDialog(window, options) : await dialog.showOpenDialog(options);

  return result.canceled ? [] : result.filePaths;
});

ipcMain.handle('desktop-files:import-files', async event => {
  const window = BrowserWindow.fromWebContents(event.sender);
  const options: OpenDialogOptions = { properties: ['openFile', 'multiSelections'] };
  const result = window ? await dialog.showOpenDialog(window, options) : await dialog.showOpenDialog(options);

  return result.canceled ? [] : result.filePaths;
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  win = null;
  if (process.platform !== 'darwin') app.quit();
});

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  if (VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});

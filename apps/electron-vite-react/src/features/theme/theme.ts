export type ThemeMode = 'dark' | 'light' | 'system';

const SYSTEM_DARK_MODE_QUERY = '(prefers-color-scheme: dark)';

let activeThemeMode: ThemeMode = 'system';
let systemThemeQuery: MediaQueryList | null = null;

function syncTheme() {
  const isDark = activeThemeMode === 'dark' || (activeThemeMode === 'system' && Boolean(systemThemeQuery?.matches));

  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
}

function handleSystemThemeChange() {
  if (activeThemeMode === 'system') syncTheme();
}

export function setThemeMode(themeMode: ThemeMode) {
  activeThemeMode = themeMode;
  syncTheme();
}

export function initializeTheme(themeMode: ThemeMode) {
  systemThemeQuery = window.matchMedia(SYSTEM_DARK_MODE_QUERY);
  systemThemeQuery.addEventListener('change', handleSystemThemeChange);
  setThemeMode(themeMode);

  return function disposeTheme() {
    systemThemeQuery?.removeEventListener('change', handleSystemThemeChange);
    systemThemeQuery = null;
  };
}

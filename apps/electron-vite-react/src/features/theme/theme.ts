import { generateDarkModePalette, generateOklchPaletteAnchored, getContrastRatio, getHsl } from '@skyroc/color';

export const ACCENT_COLOR_VALUES = {
  amber: '#b17a2e',
  blue: '#527b96',
  moss: '#66784a',
  rose: '#a85565'
} as const;

export type AccentColor = keyof typeof ACCENT_COLOR_VALUES;
export type ThemeMode = 'dark' | 'light' | 'system';

interface ThemePreferences {
  /** 用户选择的界面强调色。 */
  accentColor: AccentColor;
  /** 用户选择的界面明暗模式。 */
  themeMode: ThemeMode;
}

const SYSTEM_DARK_MODE_QUERY = '(prefers-color-scheme: dark)';

let activeAccentColor: AccentColor = 'moss';
let activeThemeMode: ThemeMode = 'system';
let systemThemeQuery: MediaQueryList | null = null;

function toHslValue(color: string) {
  const { h, l, s } = getHsl(color);

  return `${h} ${s}% ${l}%`;
}

function syncAccentColor(isDark: boolean) {
  const root = document.documentElement;
  const seedColor = ACCENT_COLOR_VALUES[activeAccentColor];
  const { palettes } = isDark ? generateDarkModePalette(seedColor, 500) : generateOklchPaletteAnchored(seedColor, 500);
  const primaryColor = palettes.find(color => color.number === (isDark ? 400 : 500))?.hex ?? seedColor;
  const foregroundColor = getContrastRatio(primaryColor, '#ffffff') >= 4.5 ? '#ffffff' : '#000000';
  const accentColor = palettes.find(color => color.number === (isDark ? 900 : 100))?.hex ?? seedColor;
  const accentForegroundColor = palettes.find(color => color.number === (isDark ? 100 : 800))?.hex ?? foregroundColor;

  for (const { hex, number } of palettes) {
    root.style.setProperty(`--primary-${number}`, toHslValue(hex));
  }

  root.style.setProperty('--primary', toHslValue(primaryColor));
  root.style.setProperty('--primary-foreground', toHslValue(foregroundColor));
  root.style.setProperty('--ring', toHslValue(primaryColor));
  root.style.setProperty('--accent', toHslValue(accentColor));
  root.style.setProperty('--accent-foreground', toHslValue(accentForegroundColor));
  root.dataset.accent = activeAccentColor;
}

function syncTheme() {
  const isDark = activeThemeMode === 'dark' || (activeThemeMode === 'system' && Boolean(systemThemeQuery?.matches));

  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
  syncAccentColor(isDark);
}

function handleSystemThemeChange() {
  if (activeThemeMode === 'system') syncTheme();
}

export function setThemeMode(themeMode: ThemeMode) {
  activeThemeMode = themeMode;
  syncTheme();
}

export function setAccentColor(accentColor: AccentColor) {
  activeAccentColor = accentColor;
  syncTheme();
}

export function setThemePreferences(preferences: ThemePreferences) {
  const { accentColor, themeMode } = preferences;

  activeAccentColor = accentColor;
  activeThemeMode = themeMode;
  syncTheme();
}

export function initializeTheme(preferences: ThemePreferences) {
  systemThemeQuery = window.matchMedia(SYSTEM_DARK_MODE_QUERY);
  systemThemeQuery.addEventListener('change', handleSystemThemeChange);
  setThemePreferences(preferences);

  return function disposeTheme() {
    systemThemeQuery?.removeEventListener('change', handleSystemThemeChange);
    systemThemeQuery = null;
  };
}

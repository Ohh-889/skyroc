import { setSystemAccentColor, setThemePreferences } from './theme';
import type { ThemeMode, ThemePreferences, TitlebarTheme, WindowMaterial } from './theme';

export interface DesktopAppearancePreferences extends ThemePreferences {
  /** 标题栏明暗策略。 */
  titlebarTheme: TitlebarTheme;
  /** 桌面窗口材质。 */
  windowMaterial: WindowMaterial;
  /** 界面整体缩放百分比。 */
  zoom: number;
}

function resolveNativeThemeSource(preferences: DesktopAppearancePreferences): ThemeMode {
  if (preferences.titlebarTheme === 'app') return preferences.themeMode;
  return preferences.titlebarTheme;
}

export function applyDesktopAppearance(preferences: DesktopAppearancePreferences) {
  setThemePreferences(preferences);
  document.documentElement.dataset.windowMaterial = preferences.reduceTransparency
    ? 'solid'
    : preferences.windowMaterial;

  const bridge = window.desktopAppearance;

  if (!bridge) {
    document.documentElement.style.zoom = String(preferences.zoom / 100);
    return;
  }

  document.documentElement.style.removeProperty('zoom');
  bridge.setThemeSource(resolveNativeThemeSource(preferences)).catch(() => undefined);
  bridge
    .setWindowMaterial(preferences.reduceTransparency ? 'solid' : preferences.windowMaterial)
    .catch(() => undefined);
  bridge.setZoomFactor(preferences.zoom / 100).catch(() => undefined);
}

export function initializeDesktopAppearance(preferences: DesktopAppearancePreferences) {
  const bridge = window.desktopAppearance;

  applyDesktopAppearance(preferences);

  if (!bridge) return () => undefined;

  bridge
    .getNativeAppearance()
    .then(appearance => setSystemAccentColor(appearance.accentColor))
    .catch(() => setSystemAccentColor(null));

  function handleAccentColorChange(accentColor: string) {
    setSystemAccentColor(accentColor);
  }

  bridge.onAccentColorChanged(handleAccentColorChange);

  return function disposeDesktopAppearance() {
    bridge.offAccentColorChanged(handleAccentColorChange);
  };
}

import { defu } from 'defu';
import { defaultThemeSettings } from '../config/default';
import type { ThemeColor } from '../types';

/**
 * Get default theme settings
 *
 * @returns Default theme settings
 */
export function getDefaultThemeSettings(): Theme.ThemeSetting {
  return defaultThemeSettings;
}

/**
 * Merge theme settings with defaults
 *
 * @param settings Partial theme settings to merge
 * @param defaults Base theme settings (defaults to defaultThemeSettings)
 * @returns Merged theme settings
 */
export function mergeThemeSettings(
  settings?: Partial<Theme.ThemeSetting>,
  defaults: Theme.ThemeSetting = defaultThemeSettings
): Theme.ThemeSetting {
  if (!settings) return defaults;
  return defu(settings, defaults) as Theme.ThemeSetting;
}

/**
 * Get theme colors from settings
 *
 * @param settings Theme settings
 * @returns Complete theme colors including primary
 */
export function getThemeColors(settings: Theme.ThemeSetting): ThemeColor {
  const { isInfoFollowPrimary, otherColor, themeColor } = settings;

  return {
    primary: themeColor,
    ...otherColor,
    info: isInfoFollowPrimary ? themeColor : otherColor.info
  };
}

/**
 * Re-export types from the global Theme namespace
 *
 * This allows internal code (e.g. hooks, utils) to import types via standard ES module imports while the actual
 * definitions live in the global Theme namespace (theme.d.ts).
 */

export type BaseToken = Theme.BaseToken;
export type BaseWatermarkSettings = Theme.BaseWatermarkSettings;
export type ColorPaletteNumber = Theme.ColorPaletteNumber;
export type OtherColor = Theme.OtherColor;
export type ThemeColor = Theme.ThemeColor;
export type ThemeColorKey = Theme.ThemeColorKey;
export type ThemeIcons = Theme.ThemeIcons;
export type ThemeLayoutMode = Theme.ThemeLayoutMode;
export type ThemeMode = Theme.ThemeMode;
export type ThemePageAnimateMode = Theme.ThemePageAnimateMode;
export type ThemePaletteColor = Theme.ThemePaletteColor;
export type ThemePreset = Theme.ThemePreset;
export type ThemePresetMeta = Theme.ThemePresetMeta;
export type ThemeScrollMode = Theme.ThemeScrollMode;
export type ThemeSettingToken = Theme.ThemeSettingToken;
export type ThemeSettingTokenBoxShadow = Theme.ThemeSettingTokenBoxShadow;
export type ThemeSettingTokenColor = Theme.ThemeSettingTokenColor;
export type ThemeTabMode = Theme.ThemeTabMode;
export type ThemeTokenColor = Theme.ThemeTokenColor;
export type ThemeTokenCSSVars = Theme.ThemeTokenCSSVars;

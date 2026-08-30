import { generateDarkModePalette, generateOklchPaletteAnchored, getContrastRatio, getHsl } from '@skyroc/color';

export const ACCENT_COLOR_VALUES = {
  amber: '#b17a2e',
  blue: '#527b96',
  moss: '#66784a',
  rose: '#a85565'
} as const;

export type AccentColor = keyof typeof ACCENT_COLOR_VALUES;
export type AccentSource = 'custom' | 'preset' | 'system';
export type ColorVisionMode = 'deutan' | 'none' | 'protan' | 'tritan';
export type ContrastMode = 'high' | 'standard' | 'system';
export type DensityMode = 'comfortable' | 'compact' | 'standard';
export type FontFamilyPreset = 'modern' | 'reading' | 'system';
export type LineHeightPreset = 'comfortable' | 'compact' | 'standard';
export type MotionMode = 'full' | 'none' | 'reduced' | 'system';
export type ScrollbarSize = 'auto' | 'thin' | 'wide';
export type SurfacePreset = 'neutral' | 'pure' | 'slate' | 'warm';
export type ThemeMode = 'dark' | 'light' | 'system';
export type TitlebarTheme = 'app' | 'dark' | 'light' | 'system';
export type WindowMaterial = 'acrylic' | 'auto' | 'mica' | 'solid' | 'vibrancy';

export interface ThemePreferences {
  /** 用户选择的界面强调色。 */
  accentColor: AccentColor;
  /** 强调色来源。 */
  accentSource: AccentSource;
  /** 色觉辅助滤镜。 */
  colorVisionMode: ColorVisionMode;
  /** 界面对比度策略。 */
  contrastMode: ContrastMode;
  /** 自定义强调色。 */
  customAccentColor: string;
  /** 界面信息密度。 */
  density: DensityMode;
  /** 是否强化键盘焦点轮廓。 */
  enhancedFocus: boolean;
  /** 字体预设。 */
  fontFamily: FontFamilyPreset;
  /** 是否使用灰度显示。 */
  grayscale: boolean;
  /** 正文行高预设。 */
  lineHeight: LineHeightPreset;
  /** 动效策略。 */
  motionMode: MotionMode;
  /** 全局圆角大小。 */
  radius: number;
  /** 是否减少闪烁和循环动画。 */
  reduceFlashing: boolean;
  /** 是否减少透明与模糊效果。 */
  reduceTransparency: boolean;
  /** 滚动条尺寸。 */
  scrollbarSize: ScrollbarSize;
  /** 界面底色预设。 */
  surfacePreset: SurfacePreset;
  /** 界面文字缩放百分比。 */
  textScale: number;
  /** 用户选择的界面明暗模式。 */
  themeMode: ThemeMode;
  /** 是否始终为正文链接显示下划线。 */
  underlineLinks: boolean;
}

const SYSTEM_DARK_MODE_QUERY = '(prefers-color-scheme: dark)';
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const COLOR_VISION_MATRICES = {
  deutan: '0.625 0.375 0 0 0 0.7 0.3 0 0 0 0 0.3 0.7 0 0 0 0 0 1 0',
  protan: '0.567 0.433 0 0 0 0.558 0.442 0 0 0 0 0.242 0.758 0 0 0 0 0 1 0',
  tritan: '0.95 0.05 0 0 0 0 0.433 0.567 0 0 0 0.475 0.525 0 0 0 0 0 1 0'
} as const;

let activeAccentColor: AccentColor = 'moss';
let activeAccentSource: AccentSource = 'preset';
let activeCustomAccentColor: string = ACCENT_COLOR_VALUES.moss;
let activeSystemAccentColor: string | null = null;
let activeThemeMode: ThemeMode = 'system';
let activePreferences: ThemePreferences | null = null;
let systemThemeQuery: MediaQueryList | null = null;
let systemContrastQuery: MediaQueryList | null = null;

function toHslValue(color: string) {
  const { h, l, s } = getHsl(color);

  return `${h} ${s}% ${l}%`;
}

function ensureColorVisionFilters() {
  if (document.getElementById('skyroc-color-vision-filters')) return;

  const svg = document.createElementNS(SVG_NAMESPACE, 'svg');
  const definitions = document.createElementNS(SVG_NAMESPACE, 'defs');

  svg.id = 'skyroc-color-vision-filters';
  svg.setAttribute('aria-hidden', 'true');
  svg.style.cssText = 'position:fixed;width:0;height:0;pointer-events:none';

  for (const [mode, values] of Object.entries(COLOR_VISION_MATRICES)) {
    const filter = document.createElementNS(SVG_NAMESPACE, 'filter');
    const matrix = document.createElementNS(SVG_NAMESPACE, 'feColorMatrix');

    filter.id = `skyroc-color-${mode}`;
    matrix.setAttribute('type', 'matrix');
    matrix.setAttribute('values', values);
    filter.append(matrix);
    definitions.append(filter);
  }

  svg.append(definitions);
  document.body.append(svg);
}

function syncAccentColor(isDark: boolean) {
  const root = document.documentElement;
  let seedColor = ACCENT_COLOR_VALUES[activeAccentColor] as string;

  if (activeAccentSource === 'custom') seedColor = activeCustomAccentColor;
  if (activeAccentSource === 'system' && activeSystemAccentColor) seedColor = activeSystemAccentColor;
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
  root.dataset.accent = activeAccentSource === 'preset' ? activeAccentColor : activeAccentSource;
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

function syncDisplayPreferences(preferences: ThemePreferences) {
  const root = document.documentElement;
  const highContrast =
    preferences.contrastMode === 'high' ||
    (preferences.contrastMode === 'system' && Boolean(systemContrastQuery?.matches));

  root.dataset.colorVision = preferences.colorVisionMode;
  root.dataset.contrast = highContrast ? 'high' : 'standard';
  root.dataset.density = preferences.density;
  root.dataset.enhancedFocus = String(preferences.enhancedFocus);
  root.dataset.font = preferences.fontFamily;
  root.dataset.grayscale = String(preferences.grayscale);
  root.dataset.lineHeight = preferences.lineHeight;
  root.dataset.motion = preferences.motionMode;
  root.dataset.reduceFlashing = String(preferences.reduceFlashing);
  root.dataset.reduceTransparency = String(preferences.reduceTransparency);
  root.dataset.scrollbar = preferences.scrollbarSize;
  root.dataset.surface = preferences.surfacePreset;
  root.dataset.underlineLinks = String(preferences.underlineLinks);
  root.style.setProperty('--app-radius', `${preferences.radius / 16}rem`);
  root.style.setProperty('--app-text-scale', String(preferences.textScale / 100));
  root.style.setProperty('--radius', `${preferences.radius / 16}rem`);
}

function handleSystemContrastChange() {
  if (activePreferences?.contrastMode === 'system') syncDisplayPreferences(activePreferences);
}

export function setThemeMode(themeMode: ThemeMode) {
  activeThemeMode = themeMode;
  syncTheme();
}

export function setAccentColor(accentColor: AccentColor) {
  activeAccentColor = accentColor;
  activeAccentSource = 'preset';
  syncTheme();
}

export function setThemePreferences(preferences: ThemePreferences) {
  const { accentColor, accentSource, customAccentColor, themeMode } = preferences;

  activePreferences = preferences;
  activeAccentColor = accentColor;
  activeAccentSource = accentSource;
  activeCustomAccentColor = /^#[\da-f]{6}$/i.test(customAccentColor) ? customAccentColor : ACCENT_COLOR_VALUES.moss;
  activeThemeMode = themeMode;
  syncDisplayPreferences(preferences);
  syncTheme();
}

export function setSystemAccentColor(accentColor: string | null) {
  const normalizedColor = accentColor?.match(/^#?([\da-f]{6})/i)?.[1];

  activeSystemAccentColor = normalizedColor ? `#${normalizedColor}` : null;
  if (activeAccentSource === 'system') syncTheme();
}

export function initializeTheme(preferences: ThemePreferences) {
  ensureColorVisionFilters();
  systemThemeQuery = window.matchMedia(SYSTEM_DARK_MODE_QUERY);
  systemContrastQuery = window.matchMedia('(prefers-contrast: more)');
  systemThemeQuery.addEventListener('change', handleSystemThemeChange);
  systemContrastQuery.addEventListener('change', handleSystemContrastChange);
  setThemePreferences(preferences);

  return function disposeTheme() {
    systemThemeQuery?.removeEventListener('change', handleSystemThemeChange);
    systemContrastQuery?.removeEventListener('change', handleSystemContrastChange);
    systemThemeQuery = null;
    systemContrastQuery = null;
  };
}

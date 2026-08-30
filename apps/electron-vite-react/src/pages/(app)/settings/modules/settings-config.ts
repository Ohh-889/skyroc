import { ACCENT_COLOR_VALUES } from '../../../../features/theme/theme';
import type { ThemePreferences, TitlebarTheme, WindowMaterial } from '../../../../features/theme/theme';
import type { DesktopSettings, SettingsSection, ShortcutId } from './types';

type AppearanceSettings = ThemePreferences & {
  /** 标题栏明暗策略。 */
  titlebarTheme: TitlebarTheme;
  /** 桌面窗口材质。 */
  windowMaterial: WindowMaterial;
  /** 界面整体缩放百分比。 */
  zoom: number;
};

type LegacyDesktopSettings = Partial<DesktopSettings> & {
  /** 旧版本的减少动画开关。 */
  reduceMotion?: boolean;
};

interface ShortcutDefinition {
  /** 快捷键功能说明。 */
  description: string;
  /** 快捷键稳定标识。 */
  id: ShortcutId;
  /** 快捷键名称。 */
  label: string;
}

export const SETTINGS_STORAGE_KEY = 'skyroc.desktop.settings';
export const DATA_STORAGE_LOCATION = '~/Library/Application Support/Skyroc Desktop';

export const DEFAULT_SHORTCUTS: DesktopSettings['shortcuts'] = {
  commandPalette: '⌘ K',
  globalSearch: '⌘ ⇧ F',
  newWorkspace: '⌘ N',
  openDirectory: '⌘ O'
};

export const DEFAULT_APPEARANCE_SETTINGS: AppearanceSettings = {
  accentColor: 'moss',
  accentSource: 'preset',
  colorVisionMode: 'none',
  contrastMode: 'standard',
  customAccentColor: ACCENT_COLOR_VALUES.moss,
  density: 'standard',
  enhancedFocus: true,
  fontFamily: 'system',
  grayscale: false,
  lineHeight: 'standard',
  motionMode: 'system',
  radius: 8,
  reduceFlashing: false,
  reduceTransparency: false,
  scrollbarSize: 'auto',
  surfacePreset: 'warm',
  textScale: 100,
  themeMode: 'system',
  titlebarTheme: 'app',
  underlineLinks: false,
  windowMaterial: 'auto',
  zoom: 100
};

export const DEFAULT_SETTINGS: DesktopSettings = {
  ...DEFAULT_APPEARANCE_SETTINGS,
  backgroundPolicy: 'continue',
  closeBehavior: 'tray',
  defaultWorkspace: '~/Projects/desktop-kit',
  downloadDirectory: '~/Downloads',
  followLocale: true,
  language: 'zh-CN',
  launchAtLogin: false,
  restoreLastPage: true,
  schemaVersion: 1,
  shortcuts: DEFAULT_SHORTCUTS,
  taskNotifications: true,
  trayBehavior: 'show',
  updateNotifications: true
};

export const SETTINGS_SECTIONS: SettingsSection[] = [
  { description: '启动、窗口与默认目录', icon: 'lucide:sliders-horizontal', id: 'general', label: '通用' },
  { description: '主题、颜色与显示比例', icon: 'lucide:palette', id: 'appearance', label: '外观' },
  { description: '界面和区域格式', icon: 'lucide:languages', id: 'language', label: '语言' },
  { description: '键盘操作与冲突检测', icon: 'lucide:keyboard', id: 'shortcuts', label: '快捷键' },
  { description: '提醒、托盘与后台策略', icon: 'lucide:bell-ring', id: 'notifications', label: '通知与后台' },
  { description: '存储、配置与本地数据', icon: 'lucide:shield-check', id: 'data', label: '数据与隐私' }
];

export const SHORTCUT_DEFINITIONS: ShortcutDefinition[] = [
  { description: '从应用任意位置搜索页面和操作', id: 'commandPalette', label: '打开命令面板' },
  { description: '跨工作区搜索文件内容', id: 'globalSearch', label: '全局搜索' },
  { description: '创建一个新的本地工作区', id: 'newWorkspace', label: '新建工作区' },
  { description: '通过系统选择器打开目录', id: 'openDirectory', label: '打开目录' }
];

export const ACCENT_COLORS = [
  { color: ACCENT_COLOR_VALUES.moss, id: 'moss', label: '苔原绿' },
  { color: ACCENT_COLOR_VALUES.blue, id: 'blue', label: '雾霭蓝' },
  { color: ACCENT_COLOR_VALUES.amber, id: 'amber', label: '暖琥珀' },
  { color: ACCENT_COLOR_VALUES.rose, id: 'rose', label: '岩蔷薇' }
] as const;

export function loadSettings(): DesktopSettings {
  const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);

  if (!savedSettings) return DEFAULT_SETTINGS;

  try {
    const parsedSettings = JSON.parse(savedSettings) as LegacyDesktopSettings;
    const motionMode = parsedSettings.motionMode ?? (parsedSettings.reduceMotion ? 'reduced' : 'system');

    return {
      ...DEFAULT_SETTINGS,
      ...parsedSettings,
      motionMode,
      schemaVersion: 1,
      shortcuts: { ...DEFAULT_SHORTCUTS, ...parsedSettings.shortcuts }
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function formatShortcut(event: KeyboardEvent) {
  const modifiers: string[] = [];

  if (event.metaKey || event.ctrlKey) modifiers.push(event.metaKey ? '⌘' : 'Ctrl');
  if (event.altKey) modifiers.push('⌥');
  if (event.shiftKey) modifiers.push('⇧');

  const normalizedKey = event.key.length === 1 ? event.key.toUpperCase() : event.key;
  return [...modifiers, normalizedKey].join(' ');
}

export function downloadSettings(settings: DesktopSettings) {
  const payload = JSON.stringify(settings, null, 2);
  const blob = new Blob([payload], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = 'skyroc-desktop-settings.json';
  anchor.click();
  URL.revokeObjectURL(url);
}

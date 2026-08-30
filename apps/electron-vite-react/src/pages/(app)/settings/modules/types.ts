import type {
  AccentColor,
  AccentSource,
  ColorVisionMode,
  ContrastMode,
  DensityMode,
  FontFamilyPreset,
  LineHeightPreset,
  MotionMode,
  ScrollbarSize,
  SurfacePreset,
  ThemeMode,
  ThemePreferences,
  TitlebarTheme,
  WindowMaterial
} from '../../../../features/theme/theme';

export type SettingsSectionId = 'appearance' | 'data' | 'general' | 'language' | 'notifications' | 'shortcuts';

export type ShortcutId = 'commandPalette' | 'globalSearch' | 'newWorkspace' | 'openDirectory';

export interface ShortcutMap {
  /** 打开全局命令面板。 */
  commandPalette: string;
  /** 聚焦跨工作区搜索。 */
  globalSearch: string;
  /** 创建新的本地工作区。 */
  newWorkspace: string;
  /** 打开本地目录选择器。 */
  openDirectory: string;
}

export interface DesktopSettings extends ThemePreferences {
  /** 用户选择的界面强调色。 */
  accentColor: AccentColor;
  /** 强调色来源。 */
  accentSource: AccentSource;
  /** 主窗口关闭后的后台任务策略。 */
  backgroundPolicy: 'ask' | 'continue' | 'stop';
  /** 主窗口关闭后的处理方式。 */
  closeBehavior: 'quit' | 'tray';
  /** 色觉辅助滤镜。 */
  colorVisionMode: ColorVisionMode;
  /** 界面对比度策略。 */
  contrastMode: ContrastMode;
  /** 自定义强调色。 */
  customAccentColor: string;
  /** 默认打开的工作区。 */
  defaultWorkspace: string;
  /** 界面信息密度。 */
  density: DensityMode;
  /** 默认下载目录。 */
  downloadDirectory: string;
  /** 是否强化键盘焦点轮廓。 */
  enhancedFocus: boolean;
  /** 日期、时间和数字是否跟随界面语言。 */
  followLocale: boolean;
  /** 字体预设。 */
  fontFamily: FontFamilyPreset;
  /** 是否使用灰度显示。 */
  grayscale: boolean;
  /** 界面显示语言。 */
  language: 'en-US' | 'ja-JP' | 'zh-CN';
  /** 应用是否随系统登录启动。 */
  launchAtLogin: boolean;
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
  /** 启动时是否恢复最后访问页面。 */
  restoreLastPage: boolean;
  /** 配置结构版本。 */
  schemaVersion: 1;
  /** 滚动条尺寸。 */
  scrollbarSize: ScrollbarSize;
  /** 用户可修改的快捷键映射。 */
  shortcuts: ShortcutMap;
  /** 界面底色预设。 */
  surfacePreset: SurfacePreset;
  /** 后台任务完成时是否通知。 */
  taskNotifications: boolean;
  /** 界面文字缩放百分比。 */
  textScale: number;
  /** 应用界面的明暗模式。 */
  themeMode: ThemeMode;
  /** 标题栏明暗策略。 */
  titlebarTheme: TitlebarTheme;
  /** 单击托盘图标时执行的动作。 */
  trayBehavior: 'menu' | 'show';
  /** 是否始终为正文链接显示下划线。 */
  underlineLinks: boolean;
  /** 发现应用更新时是否通知。 */
  updateNotifications: boolean;
  /** 桌面窗口材质。 */
  windowMaterial: WindowMaterial;
  /** 应用界面缩放百分比。 */
  zoom: number;
}

export interface SettingsSection {
  /** 分区辅助说明。 */
  description: string;
  /** 分区图标名称。 */
  icon: string;
  /** 分区稳定标识。 */
  id: SettingsSectionId;
  /** 分区标题。 */
  label: string;
}

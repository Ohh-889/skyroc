import type { ThemeMode } from '../../../../features/theme/theme';

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

export interface DesktopSettings {
  /** 用户选择的界面强调色。 */
  accentColor: 'amber' | 'blue' | 'moss' | 'rose';
  /** 主窗口关闭后的后台任务策略。 */
  backgroundPolicy: 'ask' | 'continue' | 'stop';
  /** 主窗口关闭后的处理方式。 */
  closeBehavior: 'quit' | 'tray';
  /** 默认打开的工作区。 */
  defaultWorkspace: string;
  /** 默认下载目录。 */
  downloadDirectory: string;
  /** 日期、时间和数字是否跟随界面语言。 */
  followLocale: boolean;
  /** 界面显示语言。 */
  language: 'en-US' | 'ja-JP' | 'zh-CN';
  /** 应用是否随系统登录启动。 */
  launchAtLogin: boolean;
  /** 是否减少非必要界面动画。 */
  reduceMotion: boolean;
  /** 启动时是否恢复最后访问页面。 */
  restoreLastPage: boolean;
  /** 用户可修改的快捷键映射。 */
  shortcuts: ShortcutMap;
  /** 后台任务完成时是否通知。 */
  taskNotifications: boolean;
  /** 应用界面的明暗模式。 */
  themeMode: ThemeMode;
  /** 单击托盘图标时执行的动作。 */
  trayBehavior: 'menu' | 'show';
  /** 发现应用更新时是否通知。 */
  updateNotifications: boolean;
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

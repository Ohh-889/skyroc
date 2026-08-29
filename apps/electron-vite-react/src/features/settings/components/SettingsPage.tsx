import { AlertDialog, Button, Icon, Input, Segment, Select, Slider, Switch } from '@skyroc/web-ui';
import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, ReactNode } from 'react';
import type { DesktopSettings, SettingsSection, SettingsSectionId, ShortcutId } from '../types';

interface SettingsPageProps {
  /** 设置页面不接收路由外部内容。 */
  children?: never;
}

interface SettingRowProps {
  /** 设置项右侧的操作控件。 */
  children: ReactNode;
  /** 设置项的辅助说明。 */
  description: string;
  /** 是否使用危险操作样式。 */
  destructive?: boolean;
  /** 设置项标题。 */
  title: string;
}

interface SectionHeaderProps {
  /** 分区的辅助说明。 */
  description: string;
  /** 分区标题前的图标。 */
  icon: string;
  /** 分区名称。 */
  title: string;
}

interface ShortcutDefinition {
  /** 快捷键功能说明。 */
  description: string;
  /** 快捷键稳定标识。 */
  id: ShortcutId;
  /** 快捷键名称。 */
  label: string;
}

const SETTINGS_STORAGE_KEY = 'skyroc.desktop.settings';
const DATA_STORAGE_LOCATION = '~/Library/Application Support/Skyroc Desktop';

const DEFAULT_SHORTCUTS: DesktopSettings['shortcuts'] = {
  commandPalette: '⌘ K',
  globalSearch: '⌘ ⇧ F',
  newWorkspace: '⌘ N',
  openDirectory: '⌘ O'
};

const DEFAULT_SETTINGS: DesktopSettings = {
  accentColor: 'moss',
  backgroundPolicy: 'continue',
  closeBehavior: 'tray',
  defaultWorkspace: '~/Projects/desktop-kit',
  downloadDirectory: '~/Downloads',
  followLocale: true,
  language: 'zh-CN',
  launchAtLogin: false,
  reduceMotion: false,
  restoreLastPage: true,
  shortcuts: DEFAULT_SHORTCUTS,
  taskNotifications: true,
  themeMode: 'system',
  trayBehavior: 'show',
  updateNotifications: true,
  zoom: 100
};

const SETTINGS_SECTIONS: SettingsSection[] = [
  { description: '启动、窗口与默认目录', icon: 'lucide:sliders-horizontal', id: 'general', label: '通用' },
  { description: '主题、颜色与显示比例', icon: 'lucide:palette', id: 'appearance', label: '外观' },
  { description: '界面和区域格式', icon: 'lucide:languages', id: 'language', label: '语言' },
  { description: '键盘操作与冲突检测', icon: 'lucide:keyboard', id: 'shortcuts', label: '快捷键' },
  { description: '提醒、托盘与后台策略', icon: 'lucide:bell-ring', id: 'notifications', label: '通知与后台' },
  { description: '存储、配置与本地数据', icon: 'lucide:shield-check', id: 'data', label: '数据与隐私' }
];

const SHORTCUT_DEFINITIONS: ShortcutDefinition[] = [
  { description: '从应用任意位置搜索页面和操作', id: 'commandPalette', label: '打开命令面板' },
  { description: '跨工作区搜索文件内容', id: 'globalSearch', label: '全局搜索' },
  { description: '创建一个新的本地工作区', id: 'newWorkspace', label: '新建工作区' },
  { description: '通过系统选择器打开目录', id: 'openDirectory', label: '打开目录' }
];

const ACCENT_COLORS = [
  { color: '#7b9257', id: 'moss', label: '苔原绿' },
  { color: '#527da5', id: 'blue', label: '雾霭蓝' },
  { color: '#bf7d42', id: 'amber', label: '暖琥珀' },
  { color: '#a66d75', id: 'rose', label: '岩蔷薇' }
] as const;

function loadSettings(): DesktopSettings {
  const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);

  if (!savedSettings) return DEFAULT_SETTINGS;

  try {
    const parsedSettings = JSON.parse(savedSettings) as Partial<DesktopSettings>;

    return {
      ...DEFAULT_SETTINGS,
      ...parsedSettings,
      shortcuts: { ...DEFAULT_SHORTCUTS, ...parsedSettings.shortcuts }
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function formatShortcut(event: KeyboardEvent) {
  const modifiers: string[] = [];

  if (event.metaKey || event.ctrlKey) modifiers.push(event.metaKey ? '⌘' : 'Ctrl');
  if (event.altKey) modifiers.push('⌥');
  if (event.shiftKey) modifiers.push('⇧');

  const normalizedKey = event.key.length === 1 ? event.key.toUpperCase() : event.key;
  return [...modifiers, normalizedKey].join(' ');
}

function downloadSettings(settings: DesktopSettings) {
  const payload = JSON.stringify(settings, null, 2);
  const blob = new Blob([payload], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = 'skyroc-desktop-settings.json';
  anchor.click();
  URL.revokeObjectURL(url);
}

const SettingRow = (props: SettingRowProps) => {
  const { children, description, destructive = false, title } = props;

  return (
    <div className="flex min-h-19 items-center justify-between gap-8 px-5 py-4">
      <div className="min-w-0">
        <h3 className={`text-[13px] font-semibold ${destructive ? 'text-[#9b493e]' : 'text-[#3b3f38]'}`}>{title}</h3>
        <p className="mt-1 max-w-xl text-[11px] leading-5 text-[#888c83]">{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
};

const SectionHeader = (props: SectionHeaderProps) => {
  const { description, icon, title } = props;

  return (
    <div className="flex items-start gap-3 border-b border-black/[0.07] px-5 py-5">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#e7ecdd] text-[#617749]">
        <Icon
          height="17"
          icon={icon}
          width="17"
        />
      </span>
      <div>
        <h2 className="text-sm font-semibold text-[#30342d]">{title}</h2>
        <p className="mt-1 text-[11px] text-[#8a8e85]">{description}</p>
      </div>
    </div>
  );
};

const SettingsPage = (_props: SettingsPageProps) => {
  const [activeSection, setActiveSection] = useState<SettingsSectionId>('general');
  const [settings, setSettings] = useState<DesktopSettings>(loadSettings);
  const [editingShortcut, setEditingShortcut] = useState<ShortcutId | null>(null);
  const [shortcutConflict, setShortcutConflict] = useState('');
  const [statusMessage, setStatusMessage] = useState('设置已在此设备上保存');
  const [cacheSize, setCacheSize] = useState('86.4 MB');

  const configInputRef = useRef<HTMLInputElement>(null);

  const currentSection = SETTINGS_SECTIONS.find(section => section.id === activeSection) ?? SETTINGS_SECTIONS[0];
  const datePreview = new Intl.DateTimeFormat(settings.followLocale ? settings.language : 'zh-CN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date('2026-08-29T09:42:00'));
  const numberPreview = new Intl.NumberFormat(settings.followLocale ? settings.language : 'zh-CN').format(1284567.89);

  function updateSetting<Key extends keyof DesktopSettings>(key: Key, value: DesktopSettings[Key]) {
    setSettings(current => ({ ...current, [key]: value }));
    setStatusMessage('更改已保存到当前设备');
  }

  async function chooseDirectory(key: 'defaultWorkspace' | 'downloadDirectory') {
    if (!window.desktopFiles) {
      setStatusMessage('目录选择仅在 Electron 桌面环境中可用');
      return;
    }

    const [selectedPath] = await window.desktopFiles.openDirectory();

    if (!selectedPath) return;

    updateSetting(key, selectedPath);
  }

  function handleShortcutEdit(shortcutId: ShortcutId) {
    setEditingShortcut(shortcutId);
    setShortcutConflict('');
  }

  function handleShortcutKeyDown(event: KeyboardEvent) {
    if (!editingShortcut) return;
    if (['Alt', 'Control', 'Meta', 'Shift'].includes(event.key)) return;

    event.preventDefault();

    const shortcut = formatShortcut(event);
    const conflict = SHORTCUT_DEFINITIONS.find(definition => {
      return definition.id !== editingShortcut && settings.shortcuts[definition.id] === shortcut;
    });

    if (conflict) {
      setShortcutConflict(`与“${conflict.label}”冲突，请输入其他组合`);
      return;
    }

    setSettings(current => ({
      ...current,
      shortcuts: { ...current.shortcuts, [editingShortcut]: shortcut }
    }));
    setEditingShortcut(null);
    setShortcutConflict('');
    setStatusMessage('快捷键已更新');
  }

  function handleShortcutReset() {
    updateSetting('shortcuts', DEFAULT_SHORTCUTS);
    setEditingShortcut(null);
    setShortcutConflict('');
  }

  function handleExportSettings() {
    downloadSettings(settings);
    setStatusMessage('配置文件已导出');
  }

  async function handleImportSettings(event: ChangeEvent<HTMLInputElement>) {
    const [file] = Array.from(event.target.files ?? []);

    if (!file) return;

    try {
      const importedSettings = JSON.parse(await file.text()) as Partial<DesktopSettings>;
      setSettings(current => ({
        ...current,
        ...importedSettings,
        shortcuts: { ...current.shortcuts, ...importedSettings.shortcuts }
      }));
      setStatusMessage(`已导入 ${file.name}`);
    } catch {
      setStatusMessage('配置导入失败：请选择有效的 JSON 文件');
    } finally {
      event.target.value = '';
    }
  }

  function handleClearCache() {
    setCacheSize('0 KB');
    setStatusMessage('缓存与诊断日志已清理');
  }

  async function handleCopyStorageLocation() {
    try {
      await navigator.clipboard.writeText(DATA_STORAGE_LOCATION);
      setStatusMessage('数据目录位置已复制到剪贴板');
    } catch {
      setStatusMessage('无法访问剪贴板，请手动复制数据目录');
    }
  }

  function handleLogout() {
    setStatusMessage('云端会话已清理，当前继续使用本地模式');
  }

  function handleDeleteLocalData() {
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
    setSettings(DEFAULT_SETTINGS);
    setCacheSize('0 KB');
    setStatusMessage('本模板的本地设置数据已删除');
  }

  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (!editingShortcut) return;

    window.addEventListener('keydown', handleShortcutKeyDown);
    return () => window.removeEventListener('keydown', handleShortcutKeyDown);
  }, [editingShortcut, settings.shortcuts]);

  return (
    <div className="mx-auto min-h-full w-full max-w-[1420px] px-6 py-6 xl:px-8 xl:py-7">
      <header className="settings-enter flex items-end justify-between gap-6">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7c8177]">
            <span className="h-px w-7 bg-[#98a485]" />
            Device preferences
          </div>
          <h1 className="font-['Iowan_Old_Style','Palatino_Linotype',Georgia,serif] text-[42px] leading-none tracking-[-0.045em] text-[#262a24]">
            设置中心
          </h1>
          <p className="mt-3 text-[13px] text-[#74786f]">让应用按照你的设备、工作习惯和隐私偏好运行。</p>
        </div>
        <div className="rounded-xl border border-black/[0.08] bg-white/65 px-3 py-2 text-right shadow-[0_4px_16px_rgba(38,43,35,0.035)]">
          <div className="flex items-center justify-end gap-1.5 text-[10px] font-semibold text-[#657b4d]">
            <span className="size-1.5 rounded-full bg-[#7b9b57]" />
            本地保存
          </div>
          <div
            aria-live="polite"
            className="mt-1 max-w-64 truncate text-[10px] text-[#8c9087]"
          >
            {statusMessage}
          </div>
        </div>
      </header>

      <div className="settings-enter-delay mt-6 grid gap-4 min-[960px]:grid-cols-[230px_minmax(0,1fr)]">
        <aside className="self-start rounded-[22px] border border-black/[0.08] bg-white/55 p-2.5 shadow-[0_12px_34px_rgba(39,44,35,0.045)] min-[960px]:sticky min-[960px]:top-6">
          <nav
            aria-label="设置分区"
            className="grid grid-cols-2 gap-1 min-[680px]:grid-cols-3 min-[960px]:grid-cols-1"
          >
            {SETTINGS_SECTIONS.map(section => {
              const isActive = section.id === activeSection;

              return (
                <button
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex min-w-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                    isActive
                      ? 'bg-[#dfe9cf] text-[#344127]'
                      : 'text-[#6f736a] hover:bg-black/[0.04] hover:text-[#343831]'
                  }`}
                  data-testid={`settings-section-${section.id}`}
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  type="button"
                >
                  <Icon
                    className={isActive ? 'text-[#667d4c]' : 'text-[#969a91]'}
                    height="17"
                    icon={section.icon}
                    width="17"
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-semibold">{section.label}</span>
                    <span className="mt-0.5 hidden truncate text-[9px] text-[#969a91] min-[960px]:block">
                      {section.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </nav>
          <div className="mt-2 hidden rounded-xl border border-black/[0.06] bg-[#f0efe9] p-3 min-[960px]:block">
            <div className="flex items-center gap-2 text-[10px] font-semibold text-[#656a60]">
              <Icon
                height="13"
                icon="lucide:hard-drive"
                width="13"
              />
              当前设备
            </div>
            <div className="mt-2 text-[9px] leading-4 text-[#92968d]">macOS · Skyroc 2.4.0</div>
          </div>
        </aside>

        <section
          aria-labelledby={`settings-${activeSection}`}
          className="min-w-0"
          data-testid="settings-panel"
        >
          <div className="mb-3 flex items-center gap-2 px-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#94988f]">
            <span>{currentSection.label}</span>
            <span className="size-1 rounded-full bg-[#b4b7af]" />
            <span>{currentSection.description}</span>
          </div>

          {activeSection === 'general' ? (
            <div className="space-y-4">
              <div className="overflow-hidden rounded-[22px] border border-black/[0.08] bg-white/75 shadow-[0_14px_40px_rgba(39,44,35,0.05)]">
                <SectionHeader
                  description="决定应用如何启动、关闭以及恢复工作现场。"
                  icon="lucide:power"
                  title="启动与窗口"
                />
                <div className="divide-y divide-black/[0.06]">
                  <SettingRow
                    description="登录当前系统账号后自动启动 Skyroc。"
                    title="开机启动"
                  >
                    <Switch
                      aria-label="开机启动"
                      checked={settings.launchAtLogin}
                      classNames={{ root: 'data-[state=checked]:bg-[#718b50]' }}
                      onCheckedChange={checked => updateSetting('launchAtLogin', checked)}
                    />
                  </SettingRow>
                  <SettingRow
                    description="关闭主窗口后退出应用，或保留在系统托盘继续后台任务。"
                    title="关闭主窗口时"
                  >
                    <Segment
                      classNames={{
                        indicator: 'bg-[#dfe9cf]',
                        list: 'rounded-xl border border-black/[0.08] bg-[#f1f0ea] p-1',
                        trigger: 'min-w-24 rounded-lg px-3 py-1.5 text-[11px] data-[state=active]:text-[#344127]'
                      }}
                      items={[
                        { label: '最小化到托盘', value: 'tray' },
                        { label: '直接退出', value: 'quit' }
                      ]}
                      onValueChange={value => updateSetting('closeBehavior', value as DesktopSettings['closeBehavior'])}
                      value={settings.closeBehavior}
                    />
                  </SettingRow>
                  <SettingRow
                    description="重新启动应用时回到上次访问的业务页面。"
                    title="恢复上次页面"
                  >
                    <Switch
                      aria-label="恢复上次页面"
                      checked={settings.restoreLastPage}
                      classNames={{ root: 'data-[state=checked]:bg-[#718b50]' }}
                      onCheckedChange={checked => updateSetting('restoreLastPage', checked)}
                    />
                  </SettingRow>
                </div>
              </div>

              <div className="overflow-hidden rounded-[22px] border border-black/[0.08] bg-white/75 shadow-[0_14px_40px_rgba(39,44,35,0.05)]">
                <SectionHeader
                  description="新建任务和文件操作会优先使用这些位置。"
                  icon="lucide:folder-cog"
                  title="默认目录"
                />
                <div className="divide-y divide-black/[0.06]">
                  <SettingRow
                    description="没有明确指定时默认打开的本地工作区。"
                    title="默认工作区"
                  >
                    <Button
                      className="max-w-72 justify-start gap-2 rounded-xl border-black/10 bg-[#f4f3ee] px-3 text-[11px] text-[#676b62] shadow-none hover:bg-white"
                      onClick={() => chooseDirectory('defaultWorkspace')}
                      type="button"
                      variant="outline"
                    >
                      <Icon icon="lucide:folder" />
                      <span className="truncate">{settings.defaultWorkspace}</span>
                    </Button>
                  </SettingRow>
                  <SettingRow
                    description="导出、下载和离线文件默认保存的位置。"
                    title="下载目录"
                  >
                    <Button
                      className="max-w-72 justify-start gap-2 rounded-xl border-black/10 bg-[#f4f3ee] px-3 text-[11px] text-[#676b62] shadow-none hover:bg-white"
                      onClick={() => chooseDirectory('downloadDirectory')}
                      type="button"
                      variant="outline"
                    >
                      <Icon icon="lucide:download" />
                      <span className="truncate">{settings.downloadDirectory}</span>
                    </Button>
                  </SettingRow>
                </div>
              </div>
            </div>
          ) : null}

          {activeSection === 'appearance' ? (
            <div className="space-y-4">
              <div className="overflow-hidden rounded-[22px] border border-black/[0.08] bg-white/75 shadow-[0_14px_40px_rgba(39,44,35,0.05)]">
                <SectionHeader
                  description="选择应用的基础明暗关系和强调色。"
                  icon="lucide:swatch-book"
                  title="主题外观"
                />
                <div className="p-5">
                  <div className="grid gap-3 sm:grid-cols-3">
                    {(['light', 'dark', 'system'] as const).map(mode => {
                      const labels = { dark: '深色', light: '浅色', system: '跟随系统' };
                      const icons = { dark: 'lucide:moon-star', light: 'lucide:sun', system: 'lucide:laptop' };
                      const isActive = settings.themeMode === mode;

                      return (
                        <button
                          aria-pressed={isActive}
                          className={`relative overflow-hidden rounded-2xl border p-4 text-left transition ${
                            isActive
                              ? 'border-[#7e9560] bg-[#eff3e8] shadow-[0_8px_24px_rgba(71,89,49,0.09)]'
                              : 'border-black/[0.08] bg-[#f7f6f1] hover:border-black/[0.14]'
                          }`}
                          key={mode}
                          onClick={() => updateSetting('themeMode', mode)}
                          type="button"
                        >
                          <div
                            className={`mb-5 h-18 rounded-xl border ${mode === 'dark' ? 'border-white/10 bg-[#282c26]' : 'border-black/[0.06] bg-white'}`}
                          >
                            <div
                              className={`mx-2 mt-2 h-2 w-12 rounded-full ${mode === 'dark' ? 'bg-white/15' : 'bg-black/10'}`}
                            />
                            <div className="mx-2 mt-2 grid grid-cols-[18px_1fr] gap-2">
                              <span className={`h-8 rounded ${mode === 'dark' ? 'bg-white/10' : 'bg-[#e6eadf]'}`} />
                              <span className={`h-8 rounded ${mode === 'dark' ? 'bg-white/[0.06]' : 'bg-[#f1f0eb]'}`} />
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-semibold text-[#3e433b]">
                            <Icon icon={icons[mode]} />
                            {labels[mode]}
                          </div>
                          {isActive ? (
                            <span className="absolute right-3 top-3 size-2 rounded-full bg-[#789654]" />
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="border-t border-black/[0.06] px-5 py-4">
                  <div className="mb-3 text-[12px] font-semibold text-[#3b3f38]">主题色</div>
                  <div className="flex flex-wrap gap-2">
                    {ACCENT_COLORS.map(accent => (
                      <button
                        aria-label={`使用${accent.label}`}
                        aria-pressed={settings.accentColor === accent.id}
                        className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-[11px] transition ${
                          settings.accentColor === accent.id
                            ? 'border-black/15 bg-white text-[#363b33] shadow-sm'
                            : 'border-black/[0.07] bg-[#f4f3ee] text-[#777b72] hover:bg-white'
                        }`}
                        key={accent.id}
                        onClick={() => updateSetting('accentColor', accent.id)}
                        type="button"
                      >
                        <span
                          className="size-3 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]"
                          style={{ backgroundColor: accent.color }}
                        />
                        {accent.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-[22px] border border-black/[0.08] bg-white/75 shadow-[0_14px_40px_rgba(39,44,35,0.05)]">
                <SectionHeader
                  description="控制内容密度，并为需要的人减少动态效果。"
                  icon="lucide:scan-text"
                  title="显示与动效"
                />
                <div className="divide-y divide-black/[0.06]">
                  <SettingRow
                    description="调整界面字号和控件比例，不影响导出内容。"
                    title="界面缩放"
                  >
                    <div className="flex w-64 items-center gap-3">
                      <Slider
                        aria-label="界面缩放"
                        className="flex-1"
                        classNames={{
                          range: 'bg-[#718b50]',
                          thumb: 'border-[#718b50] bg-white',
                          track: 'bg-[#e2e5dc]'
                        }}
                        max={125}
                        min={85}
                        onValueChange={value => updateSetting('zoom', value[0] ?? 100)}
                        step={5}
                        value={[settings.zoom]}
                      />
                      <span className="w-10 text-right font-mono text-[11px] text-[#676c61]">{settings.zoom}%</span>
                    </div>
                  </SettingRow>
                  <SettingRow
                    description="关闭装饰性转场和脉冲效果，保留必要的状态反馈。"
                    title="减少动画"
                  >
                    <Switch
                      aria-label="减少动画"
                      checked={settings.reduceMotion}
                      classNames={{ root: 'data-[state=checked]:bg-[#718b50]' }}
                      onCheckedChange={checked => updateSetting('reduceMotion', checked)}
                    />
                  </SettingRow>
                </div>
              </div>
            </div>
          ) : null}

          {activeSection === 'language' ? (
            <div className="space-y-4">
              <div className="overflow-hidden rounded-[22px] border border-black/[0.08] bg-white/75 shadow-[0_14px_40px_rgba(39,44,35,0.05)]">
                <SectionHeader
                  description="界面语言可以独立于操作系统语言设置。"
                  icon="lucide:globe-2"
                  title="语言与区域"
                />
                <div className="divide-y divide-black/[0.06]">
                  <SettingRow
                    description="更改后将在当前窗口立即应用。"
                    title="界面语言"
                  >
                    <Select
                      classNames={{ trigger: 'w-48 rounded-xl border-black/10 bg-[#f4f3ee] text-[11px] shadow-none' }}
                      items={[
                        { label: '简体中文', value: 'zh-CN' },
                        { label: 'English', value: 'en-US' },
                        { label: '日本語', value: 'ja-JP' }
                      ]}
                      onValueChange={value => updateSetting('language', value as DesktopSettings['language'])}
                      triggerProps={{ placeholder: '选择语言' }}
                      value={settings.language}
                    />
                  </SettingRow>
                  <SettingRow
                    description="日期、时间和数字自动使用所选语言的区域格式。"
                    title="区域格式跟随语言"
                  >
                    <Switch
                      aria-label="区域格式跟随语言"
                      checked={settings.followLocale}
                      classNames={{ root: 'data-[state=checked]:bg-[#718b50]' }}
                      onCheckedChange={checked => updateSetting('followLocale', checked)}
                    />
                  </SettingRow>
                </div>
              </div>
              <div className="rounded-[22px] border border-[#d7dccd] bg-[#eef2e8] p-5">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#4d5c3e]">
                  <Icon icon="lucide:calendar-clock" />
                  格式预览
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-black/[0.06] bg-white/55 p-4">
                    <div className="text-[9px] uppercase tracking-[0.14em] text-[#969b91]">Date & time</div>
                    <div className="mt-2 text-sm font-medium text-[#3f453b]">{datePreview}</div>
                  </div>
                  <div className="rounded-xl border border-black/[0.06] bg-white/55 p-4">
                    <div className="text-[9px] uppercase tracking-[0.14em] text-[#969b91]">Number</div>
                    <div className="mt-2 text-sm font-medium text-[#3f453b]">{numberPreview}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {activeSection === 'shortcuts' ? (
            <div className="overflow-hidden rounded-[22px] border border-black/[0.08] bg-white/75 shadow-[0_14px_40px_rgba(39,44,35,0.05)]">
              <SectionHeader
                description="点击快捷键后直接输入新组合，冲突会在保存前提示。"
                icon="lucide:command"
                title="键盘快捷键"
              />
              <div className="divide-y divide-black/[0.06]">
                {SHORTCUT_DEFINITIONS.map(shortcut => (
                  <SettingRow
                    description={shortcut.description}
                    key={shortcut.id}
                    title={shortcut.label}
                  >
                    <button
                      className={`min-w-28 rounded-xl border px-3 py-2 font-mono text-[11px] transition ${
                        editingShortcut === shortcut.id
                          ? 'border-[#8da36e] bg-[#eef3e6] text-[#4f6439] ring-3 ring-[#7f995b]/10'
                          : 'border-black/10 bg-[#f3f2ed] text-[#5f645a] hover:bg-white'
                      }`}
                      data-testid={`shortcut-${shortcut.id}`}
                      onClick={() => handleShortcutEdit(shortcut.id)}
                      type="button"
                    >
                      {editingShortcut === shortcut.id ? '请按下组合键…' : settings.shortcuts[shortcut.id]}
                    </button>
                  </SettingRow>
                ))}
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-black/[0.07] bg-[#f3f2ed]/65 px-5 py-3">
                <div className={`text-[10px] ${shortcutConflict ? 'text-[#a25043]' : 'text-[#92968d]'}`}>
                  {shortcutConflict || '修改后的快捷键仅在应用聚焦时生效。'}
                </div>
                <Button
                  className="rounded-lg border-black/10 bg-white/65 text-[10px] text-[#696d64] shadow-none hover:bg-white"
                  onClick={handleShortcutReset}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  恢复默认值
                </Button>
              </div>
            </div>
          ) : null}

          {activeSection === 'notifications' ? (
            <div className="space-y-4">
              <div className="overflow-hidden rounded-[22px] border border-black/[0.08] bg-white/75 shadow-[0_14px_40px_rgba(39,44,35,0.05)]">
                <SectionHeader
                  description="只发送需要你关注的系统级提醒。"
                  icon="lucide:message-square-dot"
                  title="通知"
                />
                <div className="divide-y divide-black/[0.06]">
                  <SettingRow
                    description="导入、导出、扫描或同步任务完成后发送桌面通知。"
                    title="任务完成通知"
                  >
                    <Switch
                      aria-label="任务完成通知"
                      checked={settings.taskNotifications}
                      classNames={{ root: 'data-[state=checked]:bg-[#718b50]' }}
                      onCheckedChange={checked => updateSetting('taskNotifications', checked)}
                    />
                  </SettingRow>
                  <SettingRow
                    description="发现新版本或更新下载完成后提醒。"
                    title="更新通知"
                  >
                    <Switch
                      aria-label="更新通知"
                      checked={settings.updateNotifications}
                      classNames={{ root: 'data-[state=checked]:bg-[#718b50]' }}
                      onCheckedChange={checked => updateSetting('updateNotifications', checked)}
                    />
                  </SettingRow>
                </div>
              </div>

              <div className="overflow-hidden rounded-[22px] border border-black/[0.08] bg-white/75 shadow-[0_14px_40px_rgba(39,44,35,0.05)]">
                <SectionHeader
                  description="协调窗口关闭、后台任务和系统托盘之间的行为。"
                  icon="lucide:workflow"
                  title="后台与托盘"
                />
                <div className="divide-y divide-black/[0.06]">
                  <SettingRow
                    description="关闭窗口时如何处理仍在执行的后台任务。"
                    title="后台运行策略"
                  >
                    <Select
                      classNames={{ trigger: 'w-48 rounded-xl border-black/10 bg-[#f4f3ee] text-[11px] shadow-none' }}
                      items={[
                        { label: '继续在后台运行', value: 'continue' },
                        { label: '每次询问', value: 'ask' },
                        { label: '停止任务并退出', value: 'stop' }
                      ]}
                      onValueChange={value =>
                        updateSetting('backgroundPolicy', value as DesktopSettings['backgroundPolicy'])
                      }
                      triggerProps={{ placeholder: '选择后台策略' }}
                      value={settings.backgroundPolicy}
                    />
                  </SettingRow>
                  <SettingRow
                    description="点击系统托盘图标时显示窗口或打开快捷菜单。"
                    title="托盘行为"
                  >
                    <Segment
                      classNames={{
                        indicator: 'bg-[#dfe9cf]',
                        list: 'rounded-xl border border-black/[0.08] bg-[#f1f0ea] p-1',
                        trigger: 'min-w-20 rounded-lg px-3 py-1.5 text-[11px] data-[state=active]:text-[#344127]'
                      }}
                      items={[
                        { label: '显示窗口', value: 'show' },
                        { label: '快捷菜单', value: 'menu' }
                      ]}
                      onValueChange={value => updateSetting('trayBehavior', value as DesktopSettings['trayBehavior'])}
                      value={settings.trayBehavior}
                    />
                  </SettingRow>
                </div>
              </div>
            </div>
          ) : null}

          {activeSection === 'data' ? (
            <div className="space-y-4">
              <div className="overflow-hidden rounded-[22px] border border-black/[0.08] bg-white/75 shadow-[0_14px_40px_rgba(39,44,35,0.05)]">
                <SectionHeader
                  description="了解数据所在位置，并管理可安全清理的缓存。"
                  icon="lucide:database"
                  title="本地存储"
                />
                <div className="divide-y divide-black/[0.06]">
                  <SettingRow
                    description={DATA_STORAGE_LOCATION}
                    title="数据存储位置"
                  >
                    <Button
                      className="rounded-xl border-black/10 bg-[#f4f3ee] text-[11px] text-[#656a60] shadow-none hover:bg-white"
                      onClick={handleCopyStorageLocation}
                      type="button"
                      variant="outline"
                    >
                      <Icon icon="lucide:copy" />
                      复制路径
                    </Button>
                  </SettingRow>
                  <SettingRow
                    description={`当前缓存与诊断日志占用 ${cacheSize}，清理不会删除工作区文件。`}
                    title="缓存与日志"
                  >
                    <AlertDialog
                      cancelText="取消"
                      description="这会清理可重新生成的缓存和诊断日志，不会影响工作区文件。"
                      okText="确认清理"
                      onOk={handleClearCache}
                      title="清理缓存与日志？"
                      trigger={
                        <Button
                          className="rounded-xl border-black/10 bg-[#f4f3ee] text-[11px] text-[#656a60] shadow-none hover:bg-white"
                          type="button"
                          variant="outline"
                        >
                          清理
                        </Button>
                      }
                      type="warning"
                    />
                  </SettingRow>
                </div>
              </div>

              <div className="overflow-hidden rounded-[22px] border border-black/[0.08] bg-white/75 shadow-[0_14px_40px_rgba(39,44,35,0.05)]">
                <SectionHeader
                  description="用 JSON 文件备份或迁移当前设备上的偏好。"
                  icon="lucide:file-cog"
                  title="配置迁移"
                />
                <div className="divide-y divide-black/[0.06]">
                  <SettingRow
                    description="导出当前配置，便于备份或迁移到其他设备。"
                    title="导出用户配置"
                  >
                    <Button
                      className="rounded-xl border-black/10 bg-[#f4f3ee] text-[11px] text-[#656a60] shadow-none hover:bg-white"
                      onClick={handleExportSettings}
                      type="button"
                      variant="outline"
                    >
                      <Icon icon="lucide:file-down" />
                      导出 JSON
                    </Button>
                  </SettingRow>
                  <SettingRow
                    description="从 Skyroc 配置文件恢复偏好，现有设置会被合并。"
                    title="导入用户配置"
                  >
                    <Button
                      className="rounded-xl border-black/10 bg-[#f4f3ee] text-[11px] text-[#656a60] shadow-none hover:bg-white"
                      onClick={() => configInputRef.current?.click()}
                      type="button"
                      variant="outline"
                    >
                      <Icon icon="lucide:file-up" />
                      选择文件
                    </Button>
                  </SettingRow>
                </div>
              </div>

              <div className="overflow-hidden rounded-[22px] border border-[#e4c9c3] bg-[#fbf4f1] shadow-[0_14px_40px_rgba(90,45,38,0.045)]">
                <SectionHeader
                  description="这些操作会改变账号状态或删除当前设备上的配置。"
                  icon="lucide:triangle-alert"
                  title="敏感操作"
                />
                <div className="divide-y divide-[#ead8d3]">
                  <SettingRow
                    description="移除云端凭据与同步会话，本地工作区不会被删除。"
                    title="退出登录并清理云端会话"
                  >
                    <AlertDialog
                      cancelText="取消"
                      description="退出后将停止云端同步，但仍可继续使用本地模式。"
                      okText="退出登录"
                      onOk={handleLogout}
                      title="退出当前账号？"
                      trigger={
                        <Button
                          className="rounded-xl border-[#d8b7af] bg-white/65 text-[11px] text-[#965145] shadow-none hover:bg-white"
                          type="button"
                          variant="outline"
                        >
                          退出登录
                        </Button>
                      }
                      type="warning"
                    />
                  </SettingRow>
                  <SettingRow
                    description="删除此模板保存的偏好与界面状态；工作区原始文件不会被修改。"
                    destructive
                    title="删除本地数据"
                  >
                    <AlertDialog
                      cancelText="保留数据"
                      description="此操作无法撤销。工作区文件不会被删除，但本地偏好需要重新设置。"
                      okButtonProps={{ color: 'destructive' }}
                      okText="确认删除"
                      onOk={handleDeleteLocalData}
                      title="永久删除本地设置数据？"
                      trigger={
                        <Button
                          className="rounded-xl border-[#d6a99f] bg-[#fff8f6] text-[11px] text-[#a14235] shadow-none hover:bg-white"
                          type="button"
                          variant="outline"
                        >
                          删除数据
                        </Button>
                      }
                      type="destructive"
                    />
                  </SettingRow>
                </div>
              </div>
            </div>
          ) : null}
        </section>
      </div>

      <Input
        accept="application/json,.json"
        className="hidden"
        onChange={handleImportSettings}
        ref={configInputRef}
        tabIndex={-1}
        type="file"
      />
    </div>
  );
};

export default SettingsPage;

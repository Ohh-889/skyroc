import { Form, Input, useForm } from '@skyroc/web-ui';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import AppearanceSettings from './modules/AppearanceSettings';
import DataSettings from './modules/DataSettings';
import GeneralSettings from './modules/GeneralSettings';
import LanguageSettings from './modules/LanguageSettings';
import NotificationSettings from './modules/NotificationSettings';
import {
  DATA_STORAGE_LOCATION,
  DEFAULT_SETTINGS,
  DEFAULT_SHORTCUTS,
  SETTINGS_SECTIONS,
  SETTINGS_STORAGE_KEY,
  SHORTCUT_DEFINITIONS,
  downloadSettings,
  formatShortcut,
  loadSettings
} from './modules/settings-config';
import SettingsNavigation from './modules/SettingsNavigation';
import ShortcutSettings from './modules/ShortcutSettings';
import type { DesktopSettings, SettingsSectionId, ShortcutId } from './modules/types';

interface SettingsPageProps {
  /** 设置页面不接收路由外部内容。 */
  children?: never;
}

const SettingsPage = (_props: SettingsPageProps) => {
  const [activeSection, setActiveSection] = useState<SettingsSectionId>('general');
  const [editingShortcut, setEditingShortcut] = useState<ShortcutId | null>(null);
  const [shortcutConflict, setShortcutConflict] = useState('');
  const [statusMessage, setStatusMessage] = useState('设置已在此设备上保存');
  const [cacheSize, setCacheSize] = useState('86.4 MB');

  const configInputRef = useRef<HTMLInputElement>(null);
  const initialSettingsRef = useRef<DesktopSettings | null>(null);

  const [form] = useForm<DesktopSettings>();

  if (!initialSettingsRef.current) initialSettingsRef.current = loadSettings();

  const currentSection = SETTINGS_SECTIONS.find(section => section.id === activeSection) ?? SETTINGS_SECTIONS[0];

  function handleSettingsChange(_changedValues: Partial<DesktopSettings>, values: DesktopSettings) {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(values));
    setStatusMessage('更改已保存到当前设备');
  }

  async function chooseDirectory(key: 'defaultWorkspace' | 'downloadDirectory') {
    if (!window.desktopFiles) {
      setStatusMessage('目录选择仅在 Electron 桌面环境中可用');
      return;
    }

    const [selectedPath] = await window.desktopFiles.openDirectory();

    if (!selectedPath) return;

    form.setFieldValue(key, selectedPath);
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
    const shortcuts = form.getFieldValue('shortcuts') ?? DEFAULT_SHORTCUTS;
    const conflict = SHORTCUT_DEFINITIONS.find(definition => {
      return definition.id !== editingShortcut && shortcuts[definition.id] === shortcut;
    });

    if (conflict) {
      setShortcutConflict(`与“${conflict.label}”冲突，请输入其他组合`);
      return;
    }

    form.setFieldValue('shortcuts', { ...shortcuts, [editingShortcut]: shortcut });
    setEditingShortcut(null);
    setShortcutConflict('');
    setStatusMessage('快捷键已更新');
  }

  function handleShortcutReset() {
    form.setFieldValue('shortcuts', DEFAULT_SHORTCUTS);
    setEditingShortcut(null);
    setShortcutConflict('');
  }

  function handleExportSettings() {
    downloadSettings(form.getFieldsValue());
    setStatusMessage('配置文件已导出');
  }

  async function handleImportSettings(event: ChangeEvent<HTMLInputElement>) {
    const [file] = Array.from(event.target.files ?? []);

    if (!file) return;

    try {
      const importedSettings = JSON.parse(await file.text()) as Partial<DesktopSettings>;
      const currentSettings = form.getFieldsValue();
      form.setFieldsValue({
        ...currentSettings,
        ...importedSettings,
        shortcuts: { ...currentSettings.shortcuts, ...importedSettings.shortcuts }
      });
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
    form.setFieldsValue(DEFAULT_SETTINGS);
    setCacheSize('0 KB');
    setStatusMessage('本模板的本地设置数据已删除');
  }

  useEffect(() => {
    if (!editingShortcut) return;

    window.addEventListener('keydown', handleShortcutKeyDown);
    return () => window.removeEventListener('keydown', handleShortcutKeyDown);
  }, [editingShortcut, form]);

  return (
    <div className="mx-auto min-h-full w-full max-w-[1420px] px-6 py-6 xl:px-8 xl:py-7">
      <header className="settings-enter flex items-end justify-between gap-6">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <span className="h-px w-7 bg-primary" />
            Device preferences
          </div>
          <h1 className="font-['Iowan_Old_Style','Palatino_Linotype',Georgia,serif] text-[42px] leading-none tracking-[-0.045em] text-foreground">
            设置中心
          </h1>
          <p className="mt-3 text-[13px] text-muted-foreground">让应用按照你的设备、工作习惯和隐私偏好运行。</p>
        </div>
        <div className="rounded-xl border border-border bg-card/70 px-3 py-2 text-right shadow-sm">
          <div className="flex items-center justify-end gap-1.5 text-[10px] font-semibold text-primary">
            <span className="size-1.5 rounded-full bg-success" />
            本地保存
          </div>
          <div
            aria-live="polite"
            className="mt-1 max-w-64 truncate text-[10px] text-muted-foreground"
          >
            {statusMessage}
          </div>
        </div>
      </header>

      <div className="settings-enter-delay mt-6 grid gap-4 min-[960px]:grid-cols-[230px_minmax(0,1fr)]">
        <SettingsNavigation
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        <section
          aria-label={currentSection.label}
          className="min-w-0"
          data-testid="settings-panel"
        >
          <div className="mb-3 flex items-center gap-2 px-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            <span>{currentSection.label}</span>
            <span className="size-1 rounded-full bg-primary" />
            <span>{currentSection.description}</span>
          </div>

          <Form<DesktopSettings>
            component={false}
            form={form}
            initialValues={initialSettingsRef.current}
            onValuesChange={handleSettingsChange}
          >
            {activeSection === 'general' ? (
              <GeneralSettings
                form={form}
                onChooseDirectory={chooseDirectory}
              />
            ) : null}
            {activeSection === 'appearance' ? <AppearanceSettings form={form} /> : null}
            {activeSection === 'language' ? <LanguageSettings form={form} /> : null}
            {activeSection === 'shortcuts' ? (
              <ShortcutSettings
                editingShortcut={editingShortcut}
                form={form}
                onEdit={handleShortcutEdit}
                onReset={handleShortcutReset}
                shortcutConflict={shortcutConflict}
              />
            ) : null}
            {activeSection === 'notifications' ? <NotificationSettings /> : null}
            {activeSection === 'data' ? (
              <DataSettings
                cacheSize={cacheSize}
                configInputRef={configInputRef}
                onClearCache={handleClearCache}
                onCopyStorageLocation={handleCopyStorageLocation}
                onDeleteLocalData={handleDeleteLocalData}
                onExportSettings={handleExportSettings}
                onLogout={handleLogout}
              />
            ) : null}
          </Form>
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

export const Route = createFileRoute('/(app)/settings/')({
  component: SettingsPage
});

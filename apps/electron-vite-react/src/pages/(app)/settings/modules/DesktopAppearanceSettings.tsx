import { FormControl, Select } from '@skyroc/web-ui';
import { SettingRow, SettingsGroup } from './SettingsCard';
import type { DesktopSettings } from './types';

function getWindowMaterialItems() {
  const platform = window.desktopWindow?.platform;

  if (platform === 'darwin') {
    return [
      { label: '自动', value: 'auto' },
      { label: '实色', value: 'solid' },
      { label: 'macOS 毛玻璃', value: 'vibrancy' }
    ];
  }

  if (platform === 'win32') {
    return [
      { label: '自动', value: 'auto' },
      { label: '实色', value: 'solid' },
      { label: 'Mica', value: 'mica' },
      { label: 'Acrylic', value: 'acrylic' }
    ];
  }

  return [
    { label: '自动（实色）', value: 'auto' },
    { label: '实色', value: 'solid' }
  ];
}

const DesktopAppearanceSettings = () => {
  return (
    <SettingsGroup
      description="这些选项由 Electron 主进程安全地同步到原生窗口。"
      icon="lucide:panels-top-left"
      title="桌面窗口"
    >
      <div className="divide-y divide-border">
        <SettingRow
          description="macOS 使用 Vibrancy，Windows 使用 Mica 或 Acrylic；其他平台回退到实色。"
          title="窗口材质"
        >
          <FormControl<DesktopSettings>
            name="windowMaterial"
            trigger="onValueChange"
          >
            <Select
              classNames={{ trigger: 'w-44 rounded-xl border-border bg-muted text-[11px] shadow-none' }}
              items={getWindowMaterialItems()}
            />
          </FormControl>
        </SettingRow>
        <SettingRow
          description="控制原生标题栏、系统菜单和窗口按钮使用的明暗模式。"
          title="标题栏主题"
        >
          <FormControl<DesktopSettings>
            name="titlebarTheme"
            trigger="onValueChange"
          >
            <Select
              classNames={{ trigger: 'w-44 rounded-xl border-border bg-muted text-[11px] shadow-none' }}
              items={[
                { label: '跟随应用', value: 'app' },
                { label: '跟随系统', value: 'system' },
                { label: '浅色', value: 'light' },
                { label: '深色', value: 'dark' }
              ]}
            />
          </FormControl>
        </SettingRow>
      </div>
    </SettingsGroup>
  );
};

export default DesktopAppearanceSettings;

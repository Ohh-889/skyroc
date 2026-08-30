import { FormControl, Icon, RadioCardGroup, Slider, Switch, useWatch } from '@skyroc/web-ui';
import type { FormInstance, RadioCardGroupItem, RadioCardGroupProps, RadioCardRenderState } from '@skyroc/web-ui';
import { ACCENT_COLORS } from './settings-config';
import { SettingRow, SettingsGroup } from './SettingsCard';
import type { DesktopSettings } from './types';

interface AppearanceSettingsProps {
  /** 设置表单实例。 */
  form: FormInstance<DesktopSettings>;
}

const THEME_MODE_OPTIONS: RadioCardGroupProps['items'] = [
  { icon: <Icon icon="lucide:sun" />, label: '浅色', value: 'light' },
  { icon: <Icon icon="lucide:moon-star" />, label: '深色', value: 'dark' },
  { icon: <Icon icon="lucide:laptop" />, label: '跟随系统', value: 'system' }
];

const ACCENT_COLOR_OPTIONS: RadioCardGroupProps['items'] = ACCENT_COLORS.map(accent => ({
  'aria-label': `使用${accent.label}`,
  icon: <span className={`size-3 rounded-full ${accent.className}`} />,
  label: accent.label,
  value: accent.id
}));

function renderThemeModeOption(item: RadioCardGroupItem) {
  return (
    <div className="w-full">
      <div
        className="theme-preview mb-5 h-18 rounded-xl border"
        data-theme-preview={item.value}
      >
        <div className="theme-preview-toolbar mx-2 mt-2 h-2 w-12 rounded-full" />
        <div className="mx-2 mt-2 grid grid-cols-[18px_1fr] gap-2">
          <span className="theme-preview-sidebar h-8 rounded" />
          <span className="theme-preview-content h-8 rounded" />
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
        {item.icon}
        {item.label}
      </div>
    </div>
  );
}

function renderAccentColorOption(item: RadioCardGroupItem, state: RadioCardRenderState) {
  return (
    <>
      {item.icon}
      <span>{item.label}</span>
      {state.checked ? (
        <Icon
          className="ml-0.5 size-3 text-primary"
          icon="lucide:check"
        />
      ) : null}
    </>
  );
}

const AppearanceSettings = (props: AppearanceSettingsProps) => {
  const { form } = props;

  const zoom = useWatch('zoom', { form });

  return (
    <div className="space-y-4">
      <SettingsGroup
        description="选择应用的基础明暗关系和强调色。"
        icon="lucide:swatch-book"
        title="主题外观"
      >
        <div className="p-5">
          <FormControl<DesktopSettings>
            name="themeMode"
            trigger="onValueChange"
          >
            <RadioCardGroup
              aria-label="主题模式"
              className="grid gap-3 sm:grid-cols-3"
              classNames={{
                card: 'w-full overflow-hidden rounded-2xl bg-muted p-4 text-left',
                cardContent: 'block w-full',
                control:
                  'absolute right-3 top-3 size-2 border-0 bg-transparent shadow-none data-[state=checked]:bg-primary',
                indicator: 'hidden'
              }}
              items={THEME_MODE_OPTIONS}
              renderItem={renderThemeModeOption}
            />
          </FormControl>
        </div>

        <div className="border-t border-border px-5 py-4">
          <div className="mb-3 text-[12px] font-semibold text-foreground">主题色</div>
          <FormControl<DesktopSettings>
            name="accentColor"
            trigger="onValueChange"
          >
            <RadioCardGroup
              aria-label="主题色"
              className="flex flex-wrap gap-2"
              classNames={{
                card: 'w-auto gap-2 rounded-xl border-border bg-muted px-3 py-2 text-[11px] text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-within:ring-2 focus-within:ring-primary/20 data-[state=checked]:border-primary data-[state=checked]:bg-background data-[state=checked]:text-foreground data-[state=checked]:shadow-sm',
                cardContent: 'gap-2',
                control: 'absolute size-px opacity-0',
                indicator: 'hidden'
              }}
              items={ACCENT_COLOR_OPTIONS}
              renderItem={renderAccentColorOption}
              size="sm"
            />
          </FormControl>
        </div>
      </SettingsGroup>

      <SettingsGroup
        description="控制内容密度，并为需要的人减少动态效果。"
        icon="lucide:scan-text"
        title="显示与动效"
      >
        <div className="divide-y divide-border">
          <SettingRow
            description="调整界面字号和控件比例，不影响导出内容。"
            title="界面缩放"
          >
            <div className="flex w-64 items-center gap-3">
              <FormControl<DesktopSettings>
                getValueFromEvent={value => value[0] ?? 100}
                getValueProps={value => [value]}
                name="zoom"
                trigger="onValueChange"
              >
                <Slider
                  aria-label="界面缩放"
                  className="flex-1"
                  classNames={{ track: 'bg-muted' }}
                  max={125}
                  min={85}
                  step={5}
                />
              </FormControl>
              <span className="w-10 text-right font-mono text-[11px] text-muted-foreground">{zoom}%</span>
            </div>
          </SettingRow>

          <SettingRow
            description="关闭装饰性转场和脉冲效果，保留必要的状态反馈。"
            title="减少动画"
          >
            <FormControl<DesktopSettings>
              name="reduceMotion"
              trigger="onCheckedChange"
              valuePropName="checked"
            >
              <Switch aria-label="减少动画" />
            </FormControl>
          </SettingRow>
        </div>
      </SettingsGroup>
    </div>
  );
};

export default AppearanceSettings;

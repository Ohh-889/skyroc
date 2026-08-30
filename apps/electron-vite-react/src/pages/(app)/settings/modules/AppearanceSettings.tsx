import { FormControl, Icon, Slider, Switch, useWatch } from '@skyroc/web-ui';
import type { FormInstance } from '@skyroc/web-ui';
import { ACCENT_COLORS } from './settings-config';
import { SettingRow, SettingsGroup } from './SettingsCard';
import type { DesktopSettings } from './types';

interface AppearanceSettingsProps {
  /** 设置表单实例。 */
  form: FormInstance<DesktopSettings>;
}

const AppearanceSettings = (props: AppearanceSettingsProps) => {
  const { form } = props;

  const accentColor = useWatch('accentColor', { form });
  const themeMode = useWatch('themeMode', { form });
  const zoom = useWatch('zoom', { form });

  return (
    <div className="space-y-4">
      <SettingsGroup
        description="选择应用的基础明暗关系和强调色。"
        icon="lucide:swatch-book"
        title="主题外观"
      >
        <div className="p-5">
          <div className="grid gap-3 sm:grid-cols-3">
            {(['light', 'dark', 'system'] as const).map(mode => {
              const labels = { dark: '深色', light: '浅色', system: '跟随系统' };
              const icons = { dark: 'lucide:moon-star', light: 'lucide:sun', system: 'lucide:laptop' };
              const isActive = themeMode === mode;

              return (
                <button
                  aria-pressed={isActive}
                  className={`relative overflow-hidden rounded-2xl border p-4 text-left transition ${
                    isActive
                      ? 'border-primary bg-primary/10 shadow-sm'
                      : 'border-border bg-muted hover:border-primary/40'
                  }`}
                  key={mode}
                  onClick={() => form.setFieldValue('themeMode', mode)}
                  type="button"
                >
                  <div
                    className={`mb-5 h-18 rounded-xl border ${
                      mode === 'dark' ? 'border-background/10 bg-foreground' : 'border-border bg-background'
                    }`}
                  >
                    <div
                      className={`mx-2 mt-2 h-2 w-12 rounded-full ${
                        mode === 'dark' ? 'bg-background/15' : 'bg-foreground/10'
                      }`}
                    />
                    <div className="mx-2 mt-2 grid grid-cols-[18px_1fr] gap-2">
                      <span className={`h-8 rounded ${mode === 'dark' ? 'bg-background/10' : 'bg-primary/10'}`} />
                      <span className={`h-8 rounded ${mode === 'dark' ? 'bg-background/5' : 'bg-muted'}`} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    <Icon icon={icons[mode]} />
                    {labels[mode]}
                  </div>
                  {isActive ? <span className="absolute right-3 top-3 size-2 rounded-full bg-primary" /> : null}
                </button>
              );
            })}
          </div>
        </div>
        <div className="border-t border-border px-5 py-4">
          <div className="mb-3 text-[12px] font-semibold text-foreground">主题色</div>
          <div className="flex flex-wrap gap-2">
            {ACCENT_COLORS.map(accent => (
              <button
                aria-label={`使用${accent.label}`}
                aria-pressed={accentColor === accent.id}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-[11px] transition ${
                  accentColor === accent.id
                    ? 'border-primary bg-background text-foreground shadow-sm'
                    : 'border-border bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
                key={accent.id}
                onClick={() => form.setFieldValue('accentColor', accent.id)}
                type="button"
              >
                <span className={`size-3 rounded-full ${accent.className}`} />
                {accent.label}
              </button>
            ))}
          </div>
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

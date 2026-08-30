import { Button, FormControl, Icon, RadioCardGroup, Segment, Select, Slider, useWatch } from '@skyroc/web-ui';
import type { FormInstance, RadioCardGroupItem, RadioCardGroupProps } from '@skyroc/web-ui';
import AccessibilityAppearanceSettings from './AccessibilityAppearanceSettings';
import { ACCENT_COLORS } from './settings-config';

import DesktopAppearanceSettings from './DesktopAppearanceSettings';
import { SettingRow, SettingsGroup } from './SettingsCard';
import type { DesktopSettings } from './types';

interface AppearanceSettingsProps {
  /** 设置表单实例。 */
  form: FormInstance<DesktopSettings>;
  /** 恢复所有外观设置。 */
  onReset: () => void;
}

const THEME_MODE_OPTIONS: RadioCardGroupProps['items'] = [
  { icon: <Icon icon="lucide:sun" />, label: '浅色', value: 'light' },
  { icon: <Icon icon="lucide:moon-star" />, label: '深色', value: 'dark' },
  { icon: <Icon icon="lucide:laptop" />, label: '跟随系统', value: 'system' }
];

const ACCENT_COLOR_OPTIONS: RadioCardGroupProps['items'] = ACCENT_COLORS.map(accent => ({
  'aria-label': `使用${accent.label}`,
  icon: (
    <span
      className="size-3 rounded-full"
      style={{ backgroundColor: accent.color }}
    />
  ),
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

const AppearanceSettings = (props: AppearanceSettingsProps) => {
  const { form, onReset } = props;

  const accentSource = useWatch('accentSource', { form });
  const customAccentColor = useWatch('customAccentColor', { form });

  const radius = useWatch('radius', { form });

  const textScale = useWatch('textScale', { form });
  const zoom = useWatch('zoom', { form });

  return (
    <div className="space-y-4">
      <SettingsGroup
        description="选择基础明暗、表面底色以及强调色来源。"
        icon="lucide:swatch-book"
        title="主题与颜色"
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

        <div className="divide-y divide-border border-t border-border">
          <SettingRow
            description="暖灰适合长时间使用，冷灰更清晰，纯净模式减少底色色相。"
            title="界面底色"
          >
            <FormControl<DesktopSettings>
              name="surfacePreset"
              trigger="onValueChange"
            >
              <Segment
                classNames={{
                  indicator: 'bg-primary/10',
                  list: 'rounded-xl border border-border bg-muted p-1',
                  trigger: 'min-w-16 rounded-lg px-2.5 py-1.5 text-[11px]'
                }}
                items={[
                  { label: '暖灰', value: 'warm' },
                  { label: '自然灰', value: 'neutral' },
                  { label: '冷灰', value: 'slate' },
                  { label: '纯净', value: 'pure' }
                ]}
              />
            </FormControl>
          </SettingRow>
          <SettingRow
            description="使用内置色、自定义颜色，或读取操作系统强调色。"
            title="主题色来源"
          >
            <FormControl<DesktopSettings>
              name="accentSource"
              trigger="onValueChange"
            >
              <Segment
                classNames={{
                  indicator: 'bg-primary/10',
                  list: 'rounded-xl border border-border bg-muted p-1',
                  trigger: 'min-w-20 rounded-lg px-3 py-1.5 text-[11px]'
                }}
                items={[
                  { label: '内置', value: 'preset' },
                  { label: '自定义', value: 'custom' },
                  { label: '系统强调色', value: 'system' }
                ]}
              />
            </FormControl>
          </SettingRow>
          {accentSource === 'preset' ? (
            <div className="px-5 py-[var(--app-row-padding-y)]">
              <FormControl<DesktopSettings>
                name="accentColor"
                trigger="onValueChange"
              >
                <RadioCardGroup
                  aria-label="主题色"
                  className="flex flex-wrap gap-2"
                  classNames={{
                    card: 'w-auto gap-2 rounded-xl border-border bg-muted px-3 py-2 text-[11px] text-muted-foreground hover:bg-accent hover:text-accent-foreground data-[state=checked]:border-primary data-[state=checked]:bg-background data-[state=checked]:text-foreground data-[state=checked]:shadow-sm',
                    cardContent: 'gap-2',
                    control: 'absolute size-px opacity-0',
                    indicator: 'hidden'
                  }}
                  items={ACCENT_COLOR_OPTIONS}
                  size="sm"
                />
              </FormControl>
            </div>
          ) : null}
          {accentSource === 'custom' ? (
            <SettingRow
              description="以当前颜色作为 500 色阶，自动生成浅色和深色完整色板。"
              title="自定义主题色"
            >
              <div className="flex items-center gap-3 rounded-xl border border-border bg-muted px-3 py-2">
                <FormControl<DesktopSettings>
                  name="customAccentColor"
                  trigger="onChange"
                >
                  <input
                    aria-label="自定义主题色"
                    className="size-7 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                    type="color"
                  />
                </FormControl>
                <span className="font-mono text-[11px] uppercase text-muted-foreground">{customAccentColor}</span>
              </div>
            </SettingRow>
          ) : null}
        </div>
      </SettingsGroup>

      <SettingsGroup
        description="使用有限的字体和排版预设，避免不同平台出现不可控回退。"
        icon="lucide:type"
        title="字体与排版"
      >
        <div className="divide-y divide-border">
          <SettingRow
            description="阅读字体更适合长文本，控件和代码仍保持清晰。"
            title="字体预设"
          >
            <FormControl<DesktopSettings>
              name="fontFamily"
              trigger="onValueChange"
            >
              <Select
                classNames={{ trigger: 'w-44 rounded-xl border-border bg-muted text-[11px] shadow-none' }}
                items={[
                  { label: '系统字体', value: 'system' },
                  { label: '现代无衬线', value: 'modern' },
                  { label: '阅读字体', value: 'reading' }
                ]}
              />
            </FormControl>
          </SettingRow>
          <SettingRow
            description="只调整文字基准，不改变窗口和图片比例。"
            title="文字大小"
          >
            <div className="flex w-64 items-center gap-3">
              <FormControl<DesktopSettings>
                getValueFromEvent={value => value[0] ?? 100}
                getValueProps={value => [value]}
                name="textScale"
                trigger="onValueChange"
              >
                <Slider
                  aria-label="文字大小"
                  className="flex-1"
                  max={120}
                  min={90}
                  step={10}
                />
              </FormControl>
              <span className="w-10 text-right font-mono text-[11px] text-muted-foreground">{textScale}%</span>
            </div>
          </SettingRow>
          <SettingRow
            description="调整正文与说明文字的垂直阅读节奏。"
            title="正文行高"
          >
            <FormControl<DesktopSettings>
              name="lineHeight"
              trigger="onValueChange"
            >
              <Segment
                classNames={{
                  indicator: 'bg-primary/10',
                  list: 'rounded-xl border border-border bg-muted p-1',
                  trigger: 'min-w-20 rounded-lg px-3 py-1.5 text-[11px]'
                }}
                items={[
                  { label: '紧凑', value: 'compact' },
                  { label: '标准', value: 'standard' },
                  { label: '舒适', value: 'comfortable' }
                ]}
              />
            </FormControl>
          </SettingRow>
        </div>
      </SettingsGroup>

      <SettingsGroup
        description="统一调整设置行、控件、圆角和滚动区域的空间尺度。"
        icon="lucide:scan-text"
        title="布局与密度"
      >
        <div className="divide-y divide-border">
          <SettingRow
            description="紧凑模式展示更多信息，宽松模式提供更大的点击区域。"
            title="界面密度"
          >
            <FormControl<DesktopSettings>
              name="density"
              trigger="onValueChange"
            >
              <Segment
                classNames={{
                  indicator: 'bg-primary/10',
                  list: 'rounded-xl border border-border bg-muted p-1',
                  trigger: 'min-w-20 rounded-lg px-3 py-1.5 text-[11px]'
                }}
                items={[
                  { label: '紧凑', value: 'compact' },
                  { label: '标准', value: 'standard' },
                  { label: '宽松', value: 'comfortable' }
                ]}
              />
            </FormControl>
          </SettingRow>
          <SettingRow
            description="调整整个 Electron 页面比例，不影响导出内容。"
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
                  max={125}
                  min={85}
                  step={5}
                />
              </FormControl>
              <span className="w-10 text-right font-mono text-[11px] text-muted-foreground">{zoom}%</span>
            </div>
          </SettingRow>
          <SettingRow
            description="作为组件默认圆角 token，内置组件会保持相对层级。"
            title="组件圆角"
          >
            <div className="flex w-64 items-center gap-3">
              <FormControl<DesktopSettings>
                getValueFromEvent={value => value[0] ?? 8}
                getValueProps={value => [value]}
                name="radius"
                trigger="onValueChange"
              >
                <Slider
                  aria-label="组件圆角"
                  className="flex-1"
                  max={16}
                  min={0}
                  step={2}
                />
              </FormControl>
              <span className="w-10 text-right font-mono text-[11px] text-muted-foreground">{radius}px</span>
            </div>
          </SettingRow>
          <SettingRow
            description="调整垂直和水平滚动条的可见宽度。"
            title="滚动条大小"
          >
            <FormControl<DesktopSettings>
              name="scrollbarSize"
              trigger="onValueChange"
            >
              <Segment
                classNames={{
                  indicator: 'bg-primary/10',
                  list: 'rounded-xl border border-border bg-muted p-1',
                  trigger: 'min-w-20 rounded-lg px-3 py-1.5 text-[11px]'
                }}
                items={[
                  { label: '自动', value: 'auto' },
                  { label: '细', value: 'thin' },
                  { label: '宽', value: 'wide' }
                ]}
              />
            </FormControl>
          </SettingRow>
        </div>
      </SettingsGroup>

      <AccessibilityAppearanceSettings />
      <DesktopAppearanceSettings />
      <div className="flex justify-end">
        <Button
          className="rounded-lg border-border bg-background/60 text-[10px] text-muted-foreground shadow-none hover:bg-accent hover:text-accent-foreground"
          onClick={onReset}
          size="sm"
          type="button"
          variant="outline"
        >
          恢复默认外观
        </Button>
      </div>
    </div>
  );
};

export default AppearanceSettings;

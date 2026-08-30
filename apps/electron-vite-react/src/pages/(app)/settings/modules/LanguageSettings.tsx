import { FormControl, Icon, Select, Switch, useWatch } from '@skyroc/web-ui';
import type { FormInstance } from '@skyroc/web-ui';
import { SettingRow, SettingsGroup } from './SettingsCard';
import type { DesktopSettings } from './types';

interface LanguageSettingsProps {
  /** 设置表单实例。 */
  form: FormInstance<DesktopSettings>;
}

const LanguageSettings = (props: LanguageSettingsProps) => {
  const { form } = props;

  const followLocale = useWatch('followLocale', { form });
  const language = useWatch('language', { form });

  const datePreview = new Intl.DateTimeFormat(followLocale ? language : 'zh-CN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date('2026-08-29T09:42:00'));
  const numberPreview = new Intl.NumberFormat(followLocale ? language : 'zh-CN').format(1284567.89);

  return (
    <div className="space-y-4">
      <SettingsGroup
        description="界面语言可以独立于操作系统语言设置。"
        icon="lucide:globe-2"
        title="语言与区域"
      >
        <div className="divide-y divide-border">
          <SettingRow
            description="更改后将在当前窗口立即应用。"
            title="界面语言"
          >
            <FormControl<DesktopSettings>
              name="language"
              trigger="onValueChange"
            >
              <Select
                classNames={{ trigger: 'w-48 rounded-xl border-border bg-muted text-[11px] shadow-none' }}
                items={[
                  { label: '简体中文', value: 'zh-CN' },
                  { label: 'English', value: 'en-US' },
                  { label: '日本語', value: 'ja-JP' }
                ]}
                triggerProps={{ placeholder: '选择语言' }}
              />
            </FormControl>
          </SettingRow>
          <SettingRow
            description="日期、时间和数字自动使用所选语言的区域格式。"
            title="区域格式跟随语言"
          >
            <FormControl<DesktopSettings>
              name="followLocale"
              trigger="onCheckedChange"
              valuePropName="checked"
            >
              <Switch aria-label="区域格式跟随语言" />
            </FormControl>
          </SettingRow>
        </div>
      </SettingsGroup>

      <div className="rounded-[22px] border border-primary/20 bg-primary/5 p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <Icon icon="lucide:calendar-clock" />
          格式预览
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-background/60 p-4">
            <div className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Date & time</div>
            <div className="mt-2 text-sm font-medium text-foreground">{datePreview}</div>
          </div>
          <div className="rounded-xl border border-border bg-background/60 p-4">
            <div className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Number</div>
            <div className="mt-2 text-sm font-medium text-foreground">{numberPreview}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSettings;

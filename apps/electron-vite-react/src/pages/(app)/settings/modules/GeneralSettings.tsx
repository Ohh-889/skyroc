import { Button, FormControl, Icon, Segment, Switch, useWatch } from '@skyroc/web-ui';
import type { FormInstance } from '@skyroc/web-ui';
import { SettingRow, SettingsGroup } from './SettingsCard';
import type { DesktopSettings } from './types';

interface GeneralSettingsProps {
  /** 设置表单实例。 */
  form: FormInstance<DesktopSettings>;
  /** 请求打开系统目录选择器。 */
  onChooseDirectory: (key: 'defaultWorkspace' | 'downloadDirectory') => void;
}

const GeneralSettings = (props: GeneralSettingsProps) => {
  const { form, onChooseDirectory } = props;

  const defaultWorkspace = useWatch('defaultWorkspace', { form });
  const downloadDirectory = useWatch('downloadDirectory', { form });

  return (
    <div className="space-y-4">
      <SettingsGroup
        description="决定应用如何启动、关闭以及恢复工作现场。"
        icon="lucide:power"
        title="启动与窗口"
      >
        <div className="divide-y divide-border">
          <SettingRow
            description="登录当前系统账号后自动启动 Skyroc。"
            title="开机启动"
          >
            <FormControl<DesktopSettings>
              name="launchAtLogin"
              trigger="onCheckedChange"
              valuePropName="checked"
            >
              <Switch aria-label="开机启动" />
            </FormControl>
          </SettingRow>
          <SettingRow
            description="关闭主窗口后退出应用，或保留在系统托盘继续后台任务。"
            title="关闭主窗口时"
          >
            <FormControl<DesktopSettings>
              name="closeBehavior"
              trigger="onValueChange"
            >
              <Segment
                classNames={{
                  indicator: 'bg-primary/10',
                  list: 'rounded-xl border border-border bg-muted p-1',
                  trigger: 'min-w-24 rounded-lg px-3 py-1.5 text-[11px] '
                }}
                items={[
                  { label: '最小化到托盘', value: 'tray' },
                  { label: '直接退出', value: 'quit' }
                ]}
              />
            </FormControl>
          </SettingRow>
          <SettingRow
            description="重新启动应用时回到上次访问的业务页面。"
            title="恢复上次页面"
          >
            <FormControl<DesktopSettings>
              name="restoreLastPage"
              trigger="onCheckedChange"
              valuePropName="checked"
            >
              <Switch aria-label="恢复上次页面" />
            </FormControl>
          </SettingRow>
        </div>
      </SettingsGroup>

      <SettingsGroup
        description="新建任务和文件操作会优先使用这些位置。"
        icon="lucide:folder-cog"
        title="默认目录"
      >
        <div className="divide-y divide-border">
          <SettingRow
            description="没有明确指定时默认打开的本地工作区。"
            title="默认工作区"
          >
            <Button
              className="max-w-72 justify-start gap-2 rounded-xl border-border bg-muted px-3 text-[11px] text-muted-foreground shadow-none hover:bg-accent hover:text-accent-foreground"
              onClick={() => onChooseDirectory('defaultWorkspace')}
              type="button"
              variant="outline"
            >
              <Icon icon="lucide:folder" />
              <span className="truncate">{defaultWorkspace}</span>
            </Button>
          </SettingRow>
          <SettingRow
            description="导出、下载和离线文件默认保存的位置。"
            title="下载目录"
          >
            <Button
              className="max-w-72 justify-start gap-2 rounded-xl border-border bg-muted px-3 text-[11px] text-muted-foreground shadow-none hover:bg-accent hover:text-accent-foreground"
              onClick={() => onChooseDirectory('downloadDirectory')}
              type="button"
              variant="outline"
            >
              <Icon icon="lucide:download" />
              <span className="truncate">{downloadDirectory}</span>
            </Button>
          </SettingRow>
        </div>
      </SettingsGroup>
    </div>
  );
};

export default GeneralSettings;

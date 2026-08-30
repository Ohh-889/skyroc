import { FormControl, Segment, Select, Switch } from '@skyroc/web-ui';
import { SettingRow, SettingsGroup } from './SettingsCard';
import type { DesktopSettings } from './types';

interface NotificationSettingsProps {
  /** 设置模块不接收额外内容。 */
  children?: never;
}

const NotificationSettings = (_props: NotificationSettingsProps) => {
  return (
    <div className="space-y-4">
      <SettingsGroup
        description="只发送需要你关注的系统级提醒。"
        icon="lucide:message-square-dot"
        title="通知"
      >
        <div className="divide-y divide-border">
          <SettingRow
            description="导入、导出、扫描或同步任务完成后发送桌面通知。"
            title="任务完成通知"
          >
            <FormControl<DesktopSettings>
              name="taskNotifications"
              trigger="onCheckedChange"
              valuePropName="checked"
            >
              <Switch aria-label="任务完成通知" />
            </FormControl>
          </SettingRow>
          <SettingRow
            description="发现新版本或更新下载完成后提醒。"
            title="更新通知"
          >
            <FormControl<DesktopSettings>
              name="updateNotifications"
              trigger="onCheckedChange"
              valuePropName="checked"
            >
              <Switch aria-label="更新通知" />
            </FormControl>
          </SettingRow>
        </div>
      </SettingsGroup>

      <SettingsGroup
        description="协调窗口关闭、后台任务和系统托盘之间的行为。"
        icon="lucide:workflow"
        title="后台与托盘"
      >
        <div className="divide-y divide-border">
          <SettingRow
            description="关闭窗口时如何处理仍在执行的后台任务。"
            title="后台运行策略"
          >
            <FormControl<DesktopSettings>
              name="backgroundPolicy"
              trigger="onValueChange"
            >
              <Select
                classNames={{ trigger: 'w-48 rounded-xl border-border bg-muted text-[11px] shadow-none' }}
                items={[
                  { label: '继续在后台运行', value: 'continue' },
                  { label: '每次询问', value: 'ask' },
                  { label: '停止任务并退出', value: 'stop' }
                ]}
                triggerProps={{ placeholder: '选择后台策略' }}
              />
            </FormControl>
          </SettingRow>
          <SettingRow
            description="点击系统托盘图标时显示窗口或打开快捷菜单。"
            title="托盘行为"
          >
            <FormControl<DesktopSettings>
              name="trayBehavior"
              trigger="onValueChange"
            >
              <Segment
                classNames={{
                  indicator: 'bg-primary/10',
                  list: 'rounded-xl border border-border bg-muted p-1',
                  trigger: 'min-w-20 rounded-lg px-3 py-1.5 text-[11px] data-[state=active]:text-primary'
                }}
                items={[
                  { label: '显示窗口', value: 'show' },
                  { label: '快捷菜单', value: 'menu' }
                ]}
              />
            </FormControl>
          </SettingRow>
        </div>
      </SettingsGroup>
    </div>
  );
};

export default NotificationSettings;

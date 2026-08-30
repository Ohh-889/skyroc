import { AlertDialog, Button, Icon } from '@skyroc/web-ui';
import type { RefObject } from 'react';
import { SettingRow, SettingsGroup } from './SettingsCard';
import { DATA_STORAGE_LOCATION } from './settings-config';

interface DataSettingsProps {
  /** 当前缓存大小文案。 */
  cacheSize: string;
  /** 隐藏的配置导入输入框。 */
  configInputRef: RefObject<HTMLInputElement | null>;
  /** 清理缓存和诊断日志。 */
  onClearCache: () => void;
  /** 复制本地数据目录。 */
  onCopyStorageLocation: () => void;
  /** 删除当前设备上的设置数据。 */
  onDeleteLocalData: () => void;
  /** 导出当前配置。 */
  onExportSettings: () => void;
  /** 清理云端会话。 */
  onLogout: () => void;
}

const DataSettings = (props: DataSettingsProps) => {
  const {
    cacheSize,
    configInputRef,
    onClearCache,
    onCopyStorageLocation,
    onDeleteLocalData,
    onExportSettings,
    onLogout
  } = props;

  const neutralButtonClassName =
    'rounded-xl border-border bg-muted text-[11px] text-muted-foreground shadow-none hover:bg-accent hover:text-accent-foreground';

  return (
    <div className="space-y-4">
      <SettingsGroup
        description="了解数据所在位置，并管理可安全清理的缓存。"
        icon="lucide:database"
        title="本地存储"
      >
        <div className="divide-y divide-border">
          <SettingRow
            description={DATA_STORAGE_LOCATION}
            title="数据存储位置"
          >
            <Button
              className={neutralButtonClassName}
              onClick={onCopyStorageLocation}
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
              onOk={onClearCache}
              title="清理缓存与日志？"
              trigger={
                <Button
                  className={neutralButtonClassName}
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
      </SettingsGroup>

      <SettingsGroup
        description="用 JSON 文件备份或迁移当前设备上的偏好。"
        icon="lucide:file-cog"
        title="配置迁移"
      >
        <div className="divide-y divide-border">
          <SettingRow
            description="导出当前配置，便于备份或迁移到其他设备。"
            title="导出用户配置"
          >
            <Button
              className={neutralButtonClassName}
              onClick={onExportSettings}
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
              className={neutralButtonClassName}
              onClick={() => configInputRef.current?.click()}
              type="button"
              variant="outline"
            >
              <Icon icon="lucide:file-up" />
              选择文件
            </Button>
          </SettingRow>
        </div>
      </SettingsGroup>

      <SettingsGroup
        description="这些操作会改变账号状态或删除当前设备上的配置。"
        destructive
        icon="lucide:triangle-alert"
        title="敏感操作"
      >
        <div className="divide-y divide-destructive/20">
          <SettingRow
            description="移除云端凭据与同步会话，本地工作区不会被删除。"
            title="退出登录并清理云端会话"
          >
            <AlertDialog
              cancelText="取消"
              description="退出后将停止云端同步，但仍可继续使用本地模式。"
              okText="退出登录"
              onOk={onLogout}
              title="退出当前账号？"
              trigger={
                <Button
                  className="rounded-xl border-warning/40 bg-background/60 text-[11px] text-warning shadow-none hover:bg-warning/10"
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
              onOk={onDeleteLocalData}
              title="永久删除本地设置数据？"
              trigger={
                <Button
                  className="rounded-xl border-destructive/40 bg-destructive/5 text-[11px] text-destructive shadow-none hover:bg-destructive/10"
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
      </SettingsGroup>
    </div>
  );
};

export default DataSettings;

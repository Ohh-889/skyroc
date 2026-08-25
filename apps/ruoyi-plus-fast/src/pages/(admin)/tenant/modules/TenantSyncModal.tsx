import { SvgIcon } from '@shell/ui/compose';
import { Alert, Button, Flex, Modal, Typography } from 'antd';

interface TenantSyncModalProps {
  /** 同步参数配置是否进行中。 */
  configLoading: boolean;
  /** 同步字典是否进行中。 */
  dictLoading: boolean;
  /** 关闭弹窗。 */
  onClose: () => void;
  /** 把默认租户的参数配置补进所有正常租户。 */
  onSyncConfig: () => void;
  /** 把默认租户的字典补进所有正常租户。 */
  onSyncDict: () => void;
  /** 弹窗是否打开。 */
  open: boolean;
}

interface SyncTaskProps {
  description: string;
  loading: boolean;
  onStart: () => void;
  title: string;
}

const SyncTask = (props: SyncTaskProps) => {
  const { description, loading, onStart, title } = props;

  return (
    <Flex
      align="center"
      className="border border-border-secondary rounded-8px p-12px"
      gap={12}
    >
      <div className="min-w-0 flex-1">
        <Typography.Text strong>{title}</Typography.Text>
        <Typography.Text
          className="block text-12px"
          type="secondary"
        >
          {description}
        </Typography.Text>
      </div>
      <Button
        loading={loading}
        onClick={onStart}
      >
        开始同步
      </Button>
    </Flex>
  );
};

/**
 * 平台基础数据同步。
 *
 * 这是两个全平台操作，不针对某一家租户，所以放在工具栏而不是行操作里。
 */
const TenantSyncModal = (props: TenantSyncModalProps) => {
  const { configLoading, dictLoading, onClose, onSyncConfig, onSyncDict, open } = props;

  return (
    <Modal
      destroyOnHidden
      footer={<Button onClick={onClose}>关闭</Button>}
      open={open}
      title="平台基础数据同步"
      onCancel={onClose}
    >
      <Flex
        className="pt-8px"
        gap={16}
        vertical
      >
        <Alert
          icon={<SvgIcon icon="ph:info" />}
          showIcon
          type="info"
          description="默认租户是同步源，只向状态正常的租户补充缺失项，已有的数据不会被覆盖。当前接口不返回目标数量和进度，只能看到成功或失败。"
          title="补齐，不覆盖"
        />

        <SyncTask
          description="补充默认租户新增的字典类型与字典项。"
          loading={dictLoading}
          title="同步租户字典"
          onStart={onSyncDict}
        />

        <SyncTask
          description="补充默认租户新增的系统参数配置。"
          loading={configLoading}
          title="同步租户参数"
          onStart={onSyncConfig}
        />
      </Flex>
    </Modal>
  );
};

export default TenantSyncModal;

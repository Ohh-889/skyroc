import { SvgIcon } from '@shell/ui/compose';
import { Alert, Descriptions, Flex, Input, Modal, Typography } from 'antd';
import { useEffect, useState } from 'react';

import type { OssConfigItem } from '@/service/api/system-oss-config';

interface OssConfigDeleteModalProps {
  /** 待删除的配置，为空时弹窗关闭。 */
  config?: OssConfigItem;
  /** 删除请求是否进行中。 */
  loading: boolean;
  /** 关闭弹窗。 */
  onCancel: () => void;
  /** 确认删除。 */
  onConfirm: (config: OssConfigItem) => Promise<void>;
}

/**
 * 存储配置的高风险删除确认。
 *
 * 后端目前只挡住四条内置配置，既不检查是否为当前默认，也不检查历史文件还在不在引用它。 在后端补上引用检查之前，只能用“手抄配置名”把误删的成本抬到用户必须看清楚为止。
 */
const OssConfigDeleteModal = (props: OssConfigDeleteModalProps) => {
  const { config, loading, onCancel, onConfirm } = props;

  const [confirmText, setConfirmText] = useState('');

  useEffect(() => {
    setConfirmText('');
  }, [config?.ossConfigId]);

  const matched = Boolean(config) && confirmText.trim() === config?.configKey;

  return (
    <Modal
      destroyOnHidden
      open={Boolean(config)}
      title={`删除存储配置“${config?.configKey ?? ''}”？`}
      okButtonProps={{ danger: true, disabled: !matched, loading }}
      okText="删除配置"
      onCancel={onCancel}
      onOk={() => config && onConfirm(config)}
    >
      <Flex
        className="pt-8px"
        gap={16}
        vertical
      >
        <Alert
          showIcon
          type="error"
          description="如果历史文件仍引用该配置，这些文件将无法预览、下载或删除。系统目前还不能显示引用文件数量，请先自行确认配置不再使用。"
          title="删除后不可恢复"
        />

        <Descriptions
          column={1}
          size="small"
          items={[
            { children: config?.configKey, key: 'configKey', label: '配置名称' },
            { children: config?.bucketName || '—', key: 'bucketName', label: '桶名称' },
            { children: config?.endpoint || '—', key: 'endpoint', label: '访问站点' }
          ]}
        />

        <div>
          <Typography.Text className="mb-8px block">
            请输入配置名称 <Typography.Text code>{config?.configKey}</Typography.Text> 以确认删除
          </Typography.Text>
          <Input
            autoComplete="off"
            placeholder="逐字输入配置名称"
            prefix={<SvgIcon icon="ph:keyboard" />}
            status={confirmText && !matched ? 'error' : undefined}
            value={confirmText}
            onChange={event => setConfirmText(event.target.value)}
          />
        </div>
      </Flex>
    </Modal>
  );
};

export default OssConfigDeleteModal;

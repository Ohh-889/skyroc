import { Alert, Button, Checkbox, Drawer, Flex, Form, Input, InputNumber, Radio, Select, Spin } from 'antd';
import { useEffect } from 'react';
import { useClientDetailQuery } from '@/service/api/system-client';
import type { ClientId, ClientSavePayload, ClientStatus } from '@/service/api/system-client';
import type { ClientOption } from './client-utils';

export type ClientEditorMode = 'create' | 'update';

interface ClientFormValues extends ClientSavePayload {
  clientId?: string;
  id?: ClientId;
}

interface ClientEditorDrawerProps {
  /** 当前编辑的客户端主键。 */
  clientRecordId?: ClientId;
  /** 可选设备类型。 */
  deviceOptions: ClientOption[];
  /** 可选授权方式。 */
  grantOptions: ClientOption[];
  /** 保存请求是否进行中。 */
  loading: boolean;
  /** 新增或编辑模式。 */
  mode: ClientEditorMode;
  /** 关闭编辑抽屉。 */
  onClose: () => void;
  /** 提交客户端表单。 */
  onSubmit: (values: ClientSavePayload & { id?: ClientId }) => Promise<void>;
  /** 抽屉是否打开。 */
  open: boolean;
}

const ClientEditorDrawer = (props: ClientEditorDrawerProps) => {
  const { clientRecordId, deviceOptions, grantOptions, loading, mode, onClose, onSubmit, open } = props;
  const [form] = Form.useForm<ClientFormValues>();
  const isUpdate = mode === 'update';
  const detailQuery = useClientDetailQuery(clientRecordId, open && isUpdate);

  useEffect(() => {
    if (!open) return;
    if (!isUpdate) {
      form.resetFields();
      form.setFieldsValue({
        activeTimeout: 1800,
        clientKey: '',
        clientSecret: '',
        deviceType: 'pc',
        grantTypeList: ['password'],
        status: '0',
        timeout: 604800
      });
      return;
    }
    if (detailQuery.data) {
      form.setFieldsValue({
        ...detailQuery.data,
        clientId: detailQuery.data.clientId ?? '',
        clientKey: detailQuery.data.clientKey ?? '',
        clientSecret: detailQuery.data.clientSecret ?? '',
        deviceType: detailQuery.data.deviceType ?? undefined
      });
    }
  }, [detailQuery.data, form, isUpdate, open]);

  async function handleFinish(values: ClientFormValues) {
    await onSubmit({
      ...values,
      clientKey: values.clientKey.trim(),
      clientSecret: values.clientSecret.trim(),
      deviceType: values.deviceType?.trim() || null,
      id: isUpdate ? clientRecordId : undefined
    });
  }

  return (
    <Drawer
      destroyOnHidden
      footer={
        <Flex
          gap={8}
          justify="flex-end"
        >
          <Button
            disabled={loading}
            onClick={onClose}
          >
            取消
          </Button>
          <Button
            loading={loading}
            type="primary"
            onClick={() => form.submit()}
          >
            保存客户端
          </Button>
        </Flex>
      }
      mask={{ closable: !loading }}
      open={open}
      title={isUpdate ? '修改客户端' : '新增客户端'}
      width={620}
      onClose={onClose}
    >
      {detailQuery.isError ? (
        <Alert
          action={<Button onClick={() => detailQuery.refetch()}>重试</Button>}
          className="mb-16px"
          showIcon
          title="客户端详情加载失败"
          type="error"
        />
      ) : null}
      <Spin spinning={isUpdate && detailQuery.isLoading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
        >
          {isUpdate ? (
            <Form.Item
              extra="clientId 在创建后保持稳定，修改 Key 或密钥不会重新生成。"
              label="客户端 ID"
              name="clientId"
            >
              <Input
                readOnly
                className="font-mono"
              />
            </Form.Item>
          ) : null}
          <div className="grid grid-cols-2 gap-x-16px lt-sm:grid-cols-1">
            <Form.Item
              label="客户端 Key"
              name="clientKey"
              rules={[
                { message: '请输入客户端 Key', required: true },
                { max: 32, message: '客户端 Key 最多 32 个字符' }
              ]}
            >
              <Input
                allowClear
                maxLength={32}
                placeholder="例如 pc、android"
              />
            </Form.Item>
            <Form.Item
              label="设备类型"
              name="deviceType"
            >
              <Select
                allowClear
                options={deviceOptions}
                placeholder="请选择设备类型"
              />
            </Form.Item>
          </div>
          <Form.Item
            extra={
              isUpdate
                ? '修改密钥不会改变 clientId，已分发客户端需要同步更新密钥。'
                : '客户端密钥当前由后端明文存储，请仅通过安全渠道分发。'
            }
            label="客户端密钥"
            name="clientSecret"
            rules={[
              { message: '请输入客户端密钥', required: true },
              { max: 255, message: '客户端密钥最多 255 个字符' }
            ]}
          >
            <Input.Password
              maxLength={255}
              placeholder="请输入客户端密钥"
            />
          </Form.Item>
          <Form.Item
            extra="至少选择一种。开通某种授权方式不代表服务端已经实现对应认证策略。"
            label="授权方式"
            name="grantTypeList"
            rules={[{ message: '请至少选择一种授权方式', required: true, type: 'array' }]}
          >
            <Checkbox.Group className="grid grid-cols-2 gap-10px lt-sm:grid-cols-1">
              {grantOptions.map(option => (
                <Checkbox
                  key={option.value}
                  className="m-0! min-h-38px flex items-center rounded-6px border border-solid border-border px-12px"
                  value={option.value}
                >
                  {option.label}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </Form.Item>
          <div className="grid grid-cols-2 gap-x-16px lt-sm:grid-cols-1">
            <Form.Item
              label="Token 活跃超时"
              name="activeTimeout"
              rules={[{ message: '请输入活跃超时时间', required: true }]}
            >
              <InputNumber
                addonAfter="秒"
                className="w-full"
                max={2147483647}
                min={-1}
                precision={0}
              />
            </Form.Item>
            <Form.Item
              label="Token 固定超时"
              name="timeout"
              rules={[{ message: '请输入固定超时时间', required: true }]}
            >
              <InputNumber
                addonAfter="秒"
                className="w-full"
                max={2147483647}
                min={-1}
                precision={0}
              />
            </Form.Item>
          </div>
          <Alert
            className="mb-20px"
            description="-1 表示永不过期。后端会保存这两个值，但当前令牌签发仍可能使用全局配置。"
            showIcon
            type="warning"
          />
          <Form.Item
            label="状态"
            name="status"
          >
            <Radio.Group
              buttonStyle="solid"
              options={[
                { label: '正常', value: '0' satisfies ClientStatus },
                { label: '停用', value: '1' satisfies ClientStatus }
              ]}
              optionType="button"
            />
          </Form.Item>
        </Form>
      </Spin>
    </Drawer>
  );
};

export default ClientEditorDrawer;

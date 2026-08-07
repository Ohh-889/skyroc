import { Alert, Button, Drawer, Flex, Form, Input, Radio, Spin } from 'antd';
import { useEffect } from 'react';
import { useConfigDetailQuery } from '@/service/api/system-config';
import type { ConfigId, ConfigSavePayload, ConfigType } from '@/service/api/system-config';
export type ConfigEditorMode = 'create' | 'update';
interface ConfigFormValues extends ConfigSavePayload {
  configId?: ConfigId;
}
interface ConfigEditorDrawerProps {
  /** 编辑参数 id。 */ configId?: ConfigId;
  /** 保存状态。 */ loading: boolean;
  /** 编辑模式。 */ mode: ConfigEditorMode;
  /** 关闭抽屉。 */ onClose: () => void;
  /** 提交表单。 */ onSubmit: (values: ConfigSavePayload & { configId?: ConfigId }) => Promise<void>;
  /** 是否打开。 */ open: boolean;
}
const ConfigEditorDrawer = (props: ConfigEditorDrawerProps) => {
  const { configId, loading, mode, onClose, onSubmit, open } = props;

  const [form] = Form.useForm<ConfigFormValues>();

  const isUpdate = mode === 'update';

  const detailQuery = useConfigDetailQuery(configId, open && isUpdate);

  async function handleFinish(values: ConfigFormValues) {
    await onSubmit({
      ...values,
      configId: isUpdate ? configId : undefined,
      configKey: values.configKey.trim(),
      configName: values.configName.trim(),
      configValue: values.configValue.trim(),
      remark: values.remark?.trim() || null
    });
  }

  useEffect(() => {
    if (!open) return;
    if (!isUpdate) {
      form.resetFields();
      form.setFieldsValue({ configKey: '', configName: '', configType: 'N', configValue: '', remark: '' });
      return;
    }
    if (detailQuery.data) form.setFieldsValue(detailQuery.data);
  }, [detailQuery.data, form, isUpdate, open]);

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
            保存参数
          </Button>
        </Flex>
      }
      mask={{ closable: !loading }}
      open={open}
      title={isUpdate ? '修改参数' : '新增参数'}
      size={520}
      onClose={onClose}
    >
      {detailQuery.isError ? (
        <Alert
          action={<Button onClick={() => detailQuery.refetch()}>重试</Button>}
          className="mb-16px"
          showIcon
          title="参数详情加载失败"
          type="error"
        />
      ) : null}
      <Spin spinning={isUpdate && detailQuery.isLoading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
        >
          <Form.Item
            label="参数名称"
            name="configName"
            rules={[
              { message: '请输入参数名称', required: true },
              { max: 100, message: '参数名称最多 100 个字符' }
            ]}
          >
            <Input
              allowClear
              maxLength={100}
              placeholder="请输入参数名称"
            />
          </Form.Item>
          <Form.Item
            label="参数键名"
            name="configKey"
            rules={[
              { message: '请输入参数键名', required: true },
              {
                pattern: /^[a-zA-Z][a-zA-Z0-9._-]*$/,
                message: '键名需以字母开头，仅支持字母、数字、点、下划线和短横线'
              }
            ]}
          >
            <Input
              allowClear
              disabled={isUpdate}
              maxLength={100}
              placeholder="请输入参数键名"
            />
          </Form.Item>
          <Form.Item
            label="参数键值"
            name="configValue"
            rules={[{ message: '请输入参数键值', required: true }]}
          >
            <Input.TextArea
              allowClear
              autoSize={{ minRows: 4, maxRows: 10 }}
              maxLength={2000}
              placeholder="请输入参数键值"
              showCount
            />
          </Form.Item>
          <Form.Item
            label="系统内置"
            name="configType"
          >
            <Radio.Group
              options={[
                { label: '是', value: 'Y' satisfies ConfigType },
                { label: '否', value: 'N' satisfies ConfigType }
              ]}
            />
          </Form.Item>
          <Form.Item
            label="备注"
            name="remark"
          >
            <Input.TextArea
              allowClear
              maxLength={500}
              placeholder="请输入备注"
              rows={3}
              showCount
            />
          </Form.Item>
        </Form>
      </Spin>
    </Drawer>
  );
};
export default ConfigEditorDrawer;

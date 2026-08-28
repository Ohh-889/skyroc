import { Alert, Button, Drawer, Flex, Form, Input, Spin } from 'antd';
import { useEffect } from 'react';

import { useDictTypeQuery } from '@/service/api/system-dict';
import type { DictId, DictTypeSavePayload } from '@/service/api/system-dict';

export type DictTypeEditorMode = 'create' | 'update';

interface DictTypeEditorValues extends DictTypeSavePayload {}
interface DictTypeEditorDrawerProps {
  /** 编辑中的类型 ID。 */
  dictId?: DictId;
  /** 保存请求是否正在执行。 */
  loading: boolean;
  /** 编辑器模式。 */
  mode: DictTypeEditorMode;
  /** 关闭抽屉。 */
  onClose: () => void;
  /** 提交表单。 */
  onSubmit: (values: DictTypeSavePayload) => Promise<void>;
  /** 是否打开抽屉。 */
  open: boolean;
}

const DictTypeEditorDrawer = (props: DictTypeEditorDrawerProps) => {
  const { dictId, loading, mode, onClose, onSubmit, open } = props;
  const [form] = Form.useForm<DictTypeEditorValues>();
  const detailQuery = useDictTypeQuery(dictId, open && mode === 'update');
  useEffect(() => {
    if (!open) return;
    if (mode === 'create') {
      form.resetFields();
      form.setFieldsValue({ dictName: '', dictType: '', remark: '' });
    } else if (detailQuery.data)
      form.setFieldsValue({
        dictName: detailQuery.data.dictName,
        dictType: detailQuery.data.dictType,
        remark: detailQuery.data.remark ?? ''
      });
  }, [detailQuery.data, form, mode, open]);

  async function handleFinish(values: DictTypeEditorValues) {
    await onSubmit({
      dictName: values.dictName.trim(),
      dictType: values.dictType.trim(),
      remark: values.remark?.trim() || null
    });
  }
  return (
    <Drawer
      destroyOnHidden
      open={open}
      title={mode === 'create' ? '新增字典类型' : '修改字典类型'}
      size={460}
      footer={
        <Flex justify="end">
          <Button
            disabled={loading}
            onClick={onClose}
          >
            取消
          </Button>
          <Button
            className="ml-8px"
            loading={loading}
            type="primary"
            onClick={() => form.submit()}
          >
            保存
          </Button>
        </Flex>
      }
      onClose={onClose}
    >
      {detailQuery.isError ? (
        <Alert
          className="mb-16px"
          title="字典类型加载失败"
          showIcon
          type="error"
        />
      ) : null}
      <Spin spinning={detailQuery.isLoading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
        >
          <Form.Item
            label="字典名称"
            name="dictName"
            rules={[{ required: true, message: '请输入字典名称' }]}
          >
            <Input maxLength={100} />
          </Form.Item>
          <Form.Item
            label="字典类型"
            name="dictType"
            rules={[
              { required: true, message: '请输入字典类型' },
              { pattern: /^[a-z][a-z0-9_]*$/, message: '请输入小写字母、数字和下划线' }
            ]}
          >
            <Input
              disabled={mode === 'update'}
              maxLength={100}
            />
          </Form.Item>
          <Form.Item
            label="备注"
            name="remark"
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Spin>
    </Drawer>
  );
};

export default DictTypeEditorDrawer;

import { Alert, Button, Drawer, Flex, Form, Input, InputNumber, Radio, Select, Spin } from 'antd';
import { useEffect } from 'react';

import { useDictDataDetailQuery } from '@/service/api/system-dict';
import type { DictDataSavePayload, DictId } from '@/service/api/system-dict';

export type DictDataEditorMode = 'create' | 'update';

interface DictDataEditorValues extends DictDataSavePayload {}
interface DictDataEditorDrawerProps {
  /** 编辑中的数据 ID。 */
  dictCode?: DictId;
  /** 当前字典类型。 */
  dictType: string;
  /** 保存请求是否正在执行。 */
  loading: boolean;
  /** 编辑器模式。 */
  mode: DictDataEditorMode;
  /** 关闭抽屉。 */
  onClose: () => void;
  /** 提交表单。 */
  onSubmit: (values: DictDataSavePayload) => Promise<void>;
  /** 是否打开抽屉。 */
  open: boolean;
  /** 字典类型下拉选项。 */
  typeOptions: Array<{ label: string; value: string }>;
}

const DictDataEditorDrawer = (props: DictDataEditorDrawerProps) => {
  const { dictCode, dictType, loading, mode, onClose, onSubmit, open, typeOptions } = props;
  const [form] = Form.useForm<DictDataEditorValues>();
  const detailQuery = useDictDataDetailQuery(dictCode, open && mode === 'update');
  useEffect(() => {
    if (!open) return;
    if (mode === 'create') {
      form.resetFields();
      form.setFieldsValue({
        dictType,
        dictLabel: '',
        dictValue: '',
        dictSort: 0,
        isDefault: 'N',
        listClass: null,
        cssClass: null,
        remark: null
      });
    } else if (detailQuery.data) form.setFieldsValue(detailQuery.data);
  }, [detailQuery.data, dictType, form, mode, open]);

  async function handleFinish(values: DictDataEditorValues) {
    await onSubmit({
      ...values,
      dictType,
      dictLabel: values.dictLabel.trim(),
      dictValue: values.dictValue.trim(),
      cssClass: values.cssClass?.trim() || null,
      listClass: values.listClass || null,
      remark: values.remark?.trim() || null
    });
  }
  return (
    <Drawer
      destroyOnHidden
      open={open}
      title={mode === 'create' ? '新增字典数据' : '修改字典数据'}
      size={520}
      footer={
        <Flex justify="end">
          <Button disabled={loading} onClick={onClose}>
            取消
          </Button>
          <Button className="ml-8px" loading={loading} type="primary" onClick={() => form.submit()}>
            保存
          </Button>
        </Flex>
      }
      onClose={onClose}
    >
      {detailQuery.isError ? <Alert className="mb-16px" message="字典数据加载失败" showIcon type="error" /> : null}
      <Spin spinning={detailQuery.isLoading}>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item label="字典类型" name="dictType">
            <Select disabled options={typeOptions} />
          </Form.Item>
          <Flex gap={12}>
            <Form.Item
              className="flex-1"
              label="字典标签"
              name="dictLabel"
              rules={[{ required: true, message: '请输入字典标签' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              className="flex-1"
              label="字典键值"
              name="dictValue"
              rules={[{ required: true, message: '请输入字典键值' }]}
            >
              <Input />
            </Form.Item>
          </Flex>
          <Flex gap={12}>
            <Form.Item className="flex-1" label="字典排序" name="dictSort">
              <InputNumber className="w-full" min={0} />
            </Form.Item>
            <Form.Item className="flex-1" label="是否默认" name="isDefault">
              <Radio.Group
                options={[
                  { label: '是', value: 'Y' },
                  { label: '否', value: 'N' }
                ]}
              />
            </Form.Item>
          </Flex>
          <Form.Item label="回显样式" name="listClass">
            <Select
              allowClear
              options={['default', 'primary', 'success', 'info', 'warning', 'danger'].map(value => ({
                label: value,
                value
              }))}
            />
          </Form.Item>
          <Form.Item label="样式属性" name="cssClass">
            <Input />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Spin>
    </Drawer>
  );
};

export default DictDataEditorDrawer;

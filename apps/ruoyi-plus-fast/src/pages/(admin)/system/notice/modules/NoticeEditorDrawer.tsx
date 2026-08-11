// oxlint-disable import/no-unassigned-import
import type { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import '@wangeditor/editor/dist/css/style.css';
import { Alert, Button, Drawer, Flex, Form, Input, Radio, Select, Spin } from 'antd';
import { useEffect, useState } from 'react';

import { useNoticeDetailQuery } from '@/service/api/system-notice';
import type { NoticeId, NoticeSavePayload, NoticeStatus, NoticeType } from '@/service/api/system-notice';

export type NoticeEditorMode = 'create' | 'update';

interface NoticeFormValues {
  noticeContent?: string;
  noticeTitle: string;
  noticeType: NoticeType;
  remark?: string;
  status: NoticeStatus;
}

interface NoticeEditorDrawerProps {
  /** 保存请求是否正在执行。 */
  loading: boolean;
  /** 抽屉当前处于新增还是编辑模式。 */
  mode: NoticeEditorMode;
  /** 编辑中的公告 ID。 */
  noticeId?: NoticeId;
  /** 关闭公告编辑抽屉。 */
  onClose: () => void;
  /** 提交经过校验的公告数据。 */
  onSubmit: (values: NoticeSavePayload) => Promise<void>;
  /** 抽屉是否打开。 */
  open: boolean;
}

interface RichTextEditorProps {
  /** 编辑器内容变化时同步 HTML。 */
  onChange?: (value: string) => void;
  /** 当前 HTML 内容。 */
  value?: string;
}

const EDITOR_CONFIG: Partial<IEditorConfig> = { placeholder: '请输入通知公告内容' };
const TOOLBAR_CONFIG: Partial<IToolbarConfig> = { excludeKeys: ['uploadImage', 'uploadVideo'] };

const RichTextEditor = (props: RichTextEditorProps) => {
  const { onChange, value = '' } = props;
  const [editor, setEditor] = useState<IDomEditor | null>(null);

  useEffect(() => {
    return () => editor?.destroy();
  }, [editor]);

  function handleChange(nextEditor: IDomEditor) {
    onChange?.(nextEditor.getHtml());
  }

  return (
    <div className="overflow-hidden rounded-6px border border-border-secondary bg-white dark:bg-black">
      <Toolbar editor={editor} defaultConfig={TOOLBAR_CONFIG} mode="default" />
      <Editor
        defaultConfig={EDITOR_CONFIG}
        mode="default"
        style={{ height: 300 }}
        value={value}
        onChange={handleChange}
        onCreated={setEditor}
      />
    </div>
  );
};

const NoticeEditorDrawer = (props: NoticeEditorDrawerProps) => {
  const { loading, mode, noticeId, onClose, onSubmit, open } = props;

  const [form] = Form.useForm<NoticeFormValues>();
  const isUpdate = mode === 'update';
  const detailQuery = useNoticeDetailQuery(noticeId, open && isUpdate);

  useEffect(() => {
    if (!open) return;
    if (!isUpdate) {
      form.resetFields();
      form.setFieldsValue({ noticeContent: '', noticeTitle: '', noticeType: '1', remark: '', status: '0' });
      return;
    }
    if (!detailQuery.data) return;
    form.setFieldsValue({
      noticeContent: detailQuery.data.noticeContent ?? '',
      noticeTitle: detailQuery.data.noticeTitle,
      noticeType: detailQuery.data.noticeType,
      remark: detailQuery.data.remark ?? '',
      status: detailQuery.data.status
    });
  }, [detailQuery.data, form, isUpdate, open]);

  async function handleFinish(values: NoticeFormValues) {
    await onSubmit({
      noticeContent: normalizeEditorContent(values.noticeContent),
      noticeTitle: values.noticeTitle.trim(),
      noticeType: values.noticeType,
      remark: values.remark?.trim() || null,
      status: values.status
    });
  }

  return (
    <Drawer
      destroyOnHidden
      footer={
        <Flex gap={8} justify="flex-end">
          <Button disabled={loading} onClick={onClose}>
            取消
          </Button>
          <Button loading={loading} type="primary" onClick={() => form.submit()}>
            保存公告
          </Button>
        </Flex>
      }
      mask={{ closable: !loading }}
      open={open}
      title={isUpdate ? '修改公告' : '新增公告'}
      width={780}
      onClose={onClose}
    >
      {detailQuery.isError ? (
        <Alert
          action={<Button onClick={() => detailQuery.refetch()}>重试</Button>}
          className="mb-16px"
          showIcon
          title="公告详情加载失败"
          type="error"
        />
      ) : null}
      <Spin spinning={isUpdate && detailQuery.isLoading}>
        <Form<NoticeFormValues> form={form} layout="vertical" onFinish={handleFinish}>
          <div className="grid grid-cols-2 gap-x-16px lt-sm:grid-cols-1">
            <Form.Item
              label="公告标题"
              name="noticeTitle"
              rules={[
                { message: '请输入公告标题', required: true },
                { max: 50, message: '公告标题最多 50 个字符' }
              ]}
            >
              <Input allowClear maxLength={50} placeholder="请输入公告标题" />
            </Form.Item>
            <Form.Item label="公告类型" name="noticeType" rules={[{ message: '请选择公告类型', required: true }]}>
              <Select
                options={[
                  { label: '通知', value: '1' },
                  { label: '公告', value: '2' }
                ]}
              />
            </Form.Item>
          </div>
          <Form.Item label="公告状态" name="status">
            <Radio.Group
              options={[
                { label: '正常', value: '0' },
                { label: '关闭', value: '1' }
              ]}
            />
          </Form.Item>
          <Form.Item label="公告内容" name="noticeContent">
            <RichTextEditor />
          </Form.Item>
          <Form.Item label="备注" name="remark" rules={[{ max: 255, message: '备注最多 255 个字符' }]}>
            <Input.TextArea allowClear maxLength={255} placeholder="请输入备注" rows={3} showCount />
          </Form.Item>
        </Form>
      </Spin>
    </Drawer>
  );
};

function normalizeEditorContent(value?: string) {
  if (!value || value === '<p><br></p>') return null;
  return value;
}

export default NoticeEditorDrawer;

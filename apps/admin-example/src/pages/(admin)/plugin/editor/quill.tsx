// oxlint-disable import/no-unassigned-import
import { createFileRoute } from '@tanstack/react-router';
import type { IDomEditor, IEditorConfig } from '@wangeditor/editor';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import '@wangeditor/editor/dist/css/style.css';
import { Space, Typography } from 'antd';
import { useEffect, useState } from 'react';

import { ExamplePanel, PluginPageHeader } from '../modules/shared';

const editorConfig: Partial<IEditorConfig> = {
  placeholder: '请输入富文本内容'
};

const defaultHtml =
  '<p><strong>SoybeanAdmin React</strong> 富文本插件示例</p><p>这里使用 wangEditor React 适配层。</p>';

const RichTextEditorDemo = () => {
  const [editor, setEditor] = useState<IDomEditor | null>(null);
  const [html, setHtml] = useState(defaultHtml);

  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  function handleEditorCreated(nextEditor: IDomEditor) {
    setEditor(nextEditor);
  }

  function handleEditorChange(nextEditor: IDomEditor) {
    setHtml(nextEditor.getHtml());
  }

  return (
    <Space
      className="w-full"
      orientation="vertical"
      size={16}
    >
      <PluginPageHeader
        icon="mdi:file-document-edit-outline"
        resources={[{ label: 'wangEditor React', url: 'https://www.wangeditor.com/v5/for-frame.html#react' }]}
        tags={['@wangeditor/editor-for-react', 'Rich Text']}
        title="富文本编辑器示例"
      />
      <ExamplePanel
        icon="mdi:file-document-edit-outline"
        title="富文本编辑器"
      >
        <div className="overflow-hidden rounded-lg border border-border bg-white dark:bg-black">
          <Toolbar
            editor={editor}
            mode="default"
          />
          <Editor
            defaultConfig={editorConfig}
            mode="default"
            style={{ height: 360 }}
            value={html}
            onChange={handleEditorChange}
            onCreated={handleEditorCreated}
          />
        </div>
      </ExamplePanel>
      <ExamplePanel
        icon="mdi:xml"
        title="HTML 输出"
      >
        <Typography.Paragraph
          className="mb-0 break-all"
          code
        >
          {html}
        </Typography.Paragraph>
      </ExamplePanel>
    </Space>
  );
};

export const Route = createFileRoute('/(admin)/plugin/editor/quill')({
  component: RichTextEditorDemo,
  staticData: {
    i18nKey: 'route.plugin_editor_quill',
    menu: {
      icon: 'mdi:file-document-edit-outline',
      order: 20
    },
    title: 'plugin_editor_quill'
  }
});

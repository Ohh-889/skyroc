// oxlint-disable import/no-unassigned-import
import { createFileRoute } from '@tanstack/react-router';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import { Space } from 'antd';
import { useState } from 'react';

import { ExamplePanel, PluginPageHeader } from '../modules/shared';

const defaultMarkdown = `# SoybeanAdmin React

- React 19
- TanStack Router
- Ant Design
- UnoCSS

\`\`\`tsx
const PluginDemo = () => <div>React plugin example</div>;
\`\`\`
`;

const MarkdownEditorDemo = () => {
  const [value, setValue] = useState(defaultMarkdown);

  function handleMarkdownChange(nextValue?: string) {
    setValue(nextValue || '');
  }

  return (
    <Space
      className="w-full"
      orientation="vertical"
      size={16}
    >
      <PluginPageHeader
        icon="mdi:language-markdown-outline"
        resources={[{ label: '@uiw/react-md-editor', url: 'https://uiwjs.github.io/react-md-editor/' }]}
        tags={['React Markdown Editor', 'Controlled Value']}
        title="Markdown 编辑器示例"
      />
      <ExamplePanel
        icon="mdi:language-markdown-outline"
        title="Markdown 编辑器"
      >
        <div data-color-mode="light">
          <MDEditor
            height={420}
            value={value}
            preview="edit"
            onChange={handleMarkdownChange}
          />
          <MDEditor.Markdown
            className="mt-4 rounded-lg border border-border p-4"
            source={value}
          />
        </div>
      </ExamplePanel>
    </Space>
  );
};

export const Route = createFileRoute('/(admin)/plugin/editor/markdown')({
  component: MarkdownEditorDemo,
  staticData: {
    i18nKey: 'route.plugin_editor_markdown',
    menu: {
      icon: 'mdi:language-markdown-outline',
      order: 10
    },
    title: 'plugin_editor_markdown'
  }
});

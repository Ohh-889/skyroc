import { createFileRoute } from '@tanstack/react-router';
import { Button, Input, Space, Typography } from 'antd';
import type { ChangeEvent } from 'react';
import { useState } from 'react';

import { showErrorMessage, showSuccessMessage } from '@/config';

import { ExamplePanel, PluginPageHeader } from './modules/shared';

const CopyDemo = () => {
  const [source, setSource] = useState('SoybeanAdmin React plugin example');

  function handleSourceChange(event: ChangeEvent<HTMLInputElement>) {
    setSource(event.target.value);
  }

  async function handleCopy() {
    if (!navigator.clipboard) {
      showErrorMessage('当前浏览器不支持 Clipboard API');
      return;
    }

    if (!source.trim()) {
      showErrorMessage('请输入要复制的内容');
      return;
    }

    await navigator.clipboard.writeText(source);
    showSuccessMessage(`复制成功：${source}`);
  }

  return (
    <Space
      className="w-full"
      orientation="vertical"
      size={16}
    >
      <PluginPageHeader
        icon="mdi:content-copy"
        resources={[{ label: 'Clipboard API', url: 'https://developer.mozilla.org/docs/Web/API/Clipboard_API' }]}
        tags={['Browser API', 'React State']}
        title="剪贴板示例"
      />
      <ExamplePanel
        icon="mdi:content-copy"
        title="文本复制"
      >
        <Space.Compact className="w-full">
          <Input
            placeholder="请输入要复制的内容"
            value={source}
            onChange={handleSourceChange}
            onPressEnter={handleCopy}
          />
          <Button
            type="primary"
            onClick={handleCopy}
          >
            复制
          </Button>
        </Space.Compact>
        <Typography.Paragraph
          className="mb-0 mt-12px"
          type="secondary"
        >
          {source}
        </Typography.Paragraph>
      </ExamplePanel>
    </Space>
  );
};

export const Route = createFileRoute('/(admin)/plugin/copy')({
  component: CopyDemo,
  staticData: {
    i18nKey: 'route.plugin_copy',
    menu: {
      icon: 'mdi:content-copy',
      order: 10
    },
    title: 'plugin_copy'
  }
});

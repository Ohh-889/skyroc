import { createFileRoute } from '@tanstack/react-router';
import { Input, Space } from 'antd';
import DOMPurify from 'dompurify';
import { html } from 'pinyin-pro';
import type { ChangeEvent } from 'react';
import { useState } from 'react';

import { ExamplePanel, PluginPageHeader } from './modules/shared';

const PinyinDemo = () => {
  const [source, setSource] = useState('SoybeanAdmin 是一个清新优雅、高颜值且功能强大的后台管理模板');

  const toneHtml = DOMPurify.sanitize(html(source));
  const plainHtml = DOMPurify.sanitize(html(source, { toneType: 'none' }));

  function handleTextChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setSource(event.target.value);
  }

  return (
    <Space
      className="w-full"
      orientation="vertical"
      size={16}
    >
      <PluginPageHeader
        icon="mdi:alphabetical-variant"
        resources={[{ label: 'pinyin-pro', url: 'https://pinyin-pro.cn/' }]}
        tags={['pinyin-pro', 'DOMPurify']}
        title="拼音示例"
      />
      <ExamplePanel
        icon="mdi:text-box-edit-outline"
        title="输入文本"
      >
        <Input.TextArea
          autoSize={{ minRows: 3 }}
          value={source}
          onChange={handleTextChange}
        />
      </ExamplePanel>
      <ExamplePanel
        icon="mdi:format-text"
        title="带音调"
      >
        <p
          className="text-18px"
          dangerouslySetInnerHTML={{ __html: toneHtml }}
        />
      </ExamplePanel>
      <ExamplePanel
        icon="mdi:format-letter-case"
        title="不带音调"
      >
        <p
          className="text-18px"
          dangerouslySetInnerHTML={{ __html: plainHtml }}
        />
      </ExamplePanel>
      <ExamplePanel
        icon="mdi:palette-outline"
        title="自定义样式"
      >
        <p
          className="plugin-pinyin-custom text-18px"
          dangerouslySetInnerHTML={{ __html: toneHtml }}
        />
        <style>
          {`
            .plugin-pinyin-custom .py-chinese-item { color: var(--primary); }
            .plugin-pinyin-custom .py-pinyin-item { color: var(--error); }
          `}
        </style>
      </ExamplePanel>
    </Space>
  );
};

export const Route = createFileRoute('/(admin)/plugin/pinyin')({
  component: PinyinDemo,
  staticData: {
    i18nKey: 'route.plugin_pinyin',
    menu: {
      icon: 'mdi:alphabetical-variant',
      order: 80
    },
    title: 'plugin_pinyin'
  }
});

import { createFileRoute } from '@tanstack/react-router';
import { Space } from 'antd';
import { useEffect, useRef } from 'react';
import TypeIt from 'typeit';
import type { Options } from 'typeit';

import { ExamplePanel, PluginPageHeader } from './modules/shared';

const TypeitDemo = () => {
  const textRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const options: Options = {
      lifeLike: true,
      loop: true,
      speed: 120,
      strings: 'SoybeanAdmin 是一个清新优雅、高颜值且功能强大的后台管理模板'
    };
    const instance = new TypeIt(textRef.current, options).go();

    return () => {
      instance.destroy();
    };
  }, []);

  return (
    <Space
      className="w-full"
      orientation="vertical"
      size={16}
    >
      <PluginPageHeader
        icon="mdi:typewriter"
        resources={[{ label: 'TypeIt', url: 'https://www.typeitjs.com/docs/vanilla/usage/' }]}
        tags={['typeit', 'DOM integration']}
        title="打字机示例"
      />
      <ExamplePanel
        icon="mdi:typewriter"
        title="基本示例"
      >
        <div className="min-h-120px flex items-center rounded-lg bg-layout px-6 text-20px font-medium">
          <span ref={textRef} />
        </div>
      </ExamplePanel>
    </Space>
  );
};

export const Route = createFileRoute('/(admin)/plugin/typeit')({
  component: TypeitDemo,
  staticData: {
    i18nKey: 'route.plugin_typeit',
    menu: {
      icon: 'mdi:typewriter',
      order: 130
    },
    title: 'plugin_typeit'
  }
});

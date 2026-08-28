import { createFileRoute } from '@tanstack/react-router';
import { Card, Space, Typography } from 'antd';
import JsBarcode from 'jsbarcode';
import { useEffect, useRef } from 'react';

import { barcodeExamples } from './modules/plugin-data';
import type { BarcodeExample } from './modules/plugin-data';
import { ExamplePanel, PluginPageHeader } from './modules/shared';

interface BarcodePreviewProps {
  /** 当前条形码示例的文本和渲染配置。 */
  item: BarcodeExample;
}

const BarcodePreview = (props: BarcodePreviewProps) => {
  const { item } = props;

  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    JsBarcode(svgRef.current, item.text, {
      displayValue: true,
      margin: 10,
      ...item.options
    });
  }, [item]);

  return (
    <Card
      className="h-full text-center"
      size="small"
    >
      <Typography.Text strong>{item.title}</Typography.Text>
      <div className="mt-3 flex justify-center overflow-x-auto">
        <svg ref={svgRef} />
      </div>
    </Card>
  );
};

const BarcodeDemo = () => {
  return (
    <Space
      className="w-full"
      orientation="vertical"
      size={16}
    >
      <PluginPageHeader
        icon="mdi:barcode"
        resources={[{ label: 'JsBarcode', url: 'https://github.com/lindell/JsBarcode' }]}
        tags={['JsBarcode', 'SVG']}
        title="条形码示例"
      />
      <ExamplePanel
        icon="mdi:barcode"
        title="常用条形码样式"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {barcodeExamples.map(item => (
            <BarcodePreview
              item={item}
              key={item.id}
            />
          ))}
        </div>
      </ExamplePanel>
    </Space>
  );
};

export const Route = createFileRoute('/(admin)/plugin/barcode')({
  component: BarcodeDemo,
  staticData: {
    i18nKey: 'route.plugin_barcode',
    menu: {
      icon: 'mdi:barcode',
      order: 60
    },
    title: 'plugin_barcode'
  }
});

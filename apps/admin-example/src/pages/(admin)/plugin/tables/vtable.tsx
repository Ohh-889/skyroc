import { createFileRoute } from '@tanstack/react-router';
import { ListTable } from '@visactor/vtable';
import type { ListTableConstructorOptions } from '@visactor/vtable';
import { Space } from 'antd';
import { useEffect, useRef } from 'react';

import { vtableRecords } from '../modules/plugin-data';
import { ExamplePanel, PluginPageHeader } from '../modules/shared';

const tableOptions: ListTableConstructorOptions = {
  columns: [
    { field: 'orderId', title: 'Order ID', width: 150 },
    { field: 'customer', title: 'Customer', width: 160 },
    { field: 'category', title: 'Category', width: 160 },
    { field: 'region', title: 'Region', width: 110 },
    { field: 'city', title: 'City', width: 140 },
    { field: 'quantity', title: 'Quantity', width: 110 },
    { field: 'sales', title: 'Sales', width: 110 },
    { field: 'profit', title: 'Profit', width: 110 }
  ],
  defaultRowHeight: 42,
  records: vtableRecords,
  widthMode: 'standard'
};

const VTableDemo = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const table = new ListTable(containerRef.current, tableOptions);

    return () => {
      table.release();
    };
  }, []);

  return (
    <Space
      className="w-full"
      orientation="vertical"
      size={16}
    >
      <PluginPageHeader
        icon="mdi:table-large"
        resources={[{ label: 'VTable', url: 'https://visactor.io/vtable' }]}
        tags={['@visactor/vtable', 'Canvas Table']}
        title="VTable 示例"
      />
      <ExamplePanel
        icon="mdi:table-large"
        title="List Table"
      >
        <div
          className="h-460px overflow-hidden rounded-lg border border-border"
          ref={containerRef}
        />
      </ExamplePanel>
    </Space>
  );
};

export const Route = createFileRoute('/(admin)/plugin/tables/vtable')({
  component: VTableDemo,
  staticData: {
    i18nKey: 'route.plugin_tables_vtable',
    menu: {
      icon: 'mdi:table-large',
      order: 10
    },
    title: 'plugin_tables_vtable'
  }
});

import { createFileRoute } from '@tanstack/react-router';
import { Button, Space, Table } from 'antd';
import printJS from 'print-js';

import { demoUsers } from './modules/plugin-data';
import { ExamplePanel, PluginPageHeader } from './modules/shared';

const tableColumns = [
  { dataIndex: 'userName', title: 'User Name' },
  { dataIndex: 'nickName', title: 'Nick Name' },
  { dataIndex: 'role', title: 'Role' },
  { dataIndex: 'status', title: 'Status' }
];

const printImageSource =
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80';

const PrintDemo = () => {
  function printTable() {
    printJS({
      printable: demoUsers,
      properties: ['userName', 'nickName', 'role', 'status'],
      type: 'json'
    });
  }

  function printImage() {
    printJS({
      header: 'React Plugin Image',
      imageStyle: 'width:100%;',
      printable: printImageSource,
      type: 'image'
    });
  }

  return (
    <Space
      className="w-full"
      orientation="vertical"
      size={16}
    >
      <PluginPageHeader
        icon="mdi:printer-outline"
        resources={[{ label: 'Print.js', url: 'https://printjs.crabbly.com/' }]}
        tags={['print-js', 'JSON', 'Image']}
        title="打印示例"
      />
      <ExamplePanel
        icon="mdi:printer-outline"
        title="打印数据"
      >
        <Space
          className="mb-4"
          wrap
        >
          <Button
            type="primary"
            onClick={printTable}
          >
            打印表格
          </Button>
          <Button onClick={printImage}>打印图片</Button>
        </Space>
        <Table
          columns={tableColumns}
          dataSource={demoUsers}
          pagination={false}
          rowKey="id"
          size="small"
        />
      </ExamplePanel>
    </Space>
  );
};

export const Route = createFileRoute('/(admin)/plugin/print')({
  component: PrintDemo,
  staticData: {
    i18nKey: 'route.plugin_print',
    menu: {
      icon: 'mdi:printer-outline',
      order: 90
    },
    title: 'plugin_print'
  }
});

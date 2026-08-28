import { createFileRoute } from '@tanstack/react-router';
import { Button, Space, Table, Tag } from 'antd';
import type { TableColumnsType } from 'antd';
import { utils, writeFile } from 'xlsx';

import { demoUsers } from './modules/plugin-data';
import type { DemoUserRow } from './modules/plugin-data';
import { ExamplePanel, PluginPageHeader } from './modules/shared';

const columns: TableColumnsType<DemoUserRow> = [
  { dataIndex: 'userName', title: 'User Name' },
  { dataIndex: 'nickName', title: 'Nick Name' },
  { dataIndex: 'userPhone', title: 'Phone' },
  { dataIndex: 'userEmail', title: 'Email' },
  { dataIndex: 'role', title: 'Role' },
  {
    dataIndex: 'status',
    title: 'Status',
    render: status => <Tag color={status === 'Enable' ? 'success' : 'warning'}>{status}</Tag>
  }
];

const ExcelDemo = () => {
  function exportExcel() {
    const worksheet = utils.json_to_sheet(demoUsers);
    const workbook = utils.book_new();

    worksheet['!cols'] = [{ wch: 10 }, { wch: 14 }, { wch: 16 }, { wch: 28 }, { wch: 14 }, { wch: 10 }];
    utils.book_append_sheet(workbook, worksheet, '用户列表');
    writeFile(workbook, 'react-plugin-users.xlsx');
  }

  return (
    <Space
      className="w-full"
      orientation="vertical"
      size={16}
    >
      <PluginPageHeader
        icon="file-icons:microsoft-excel"
        resources={[{ label: 'SheetJS', url: 'https://docs.sheetjs.com/' }]}
        tags={['xlsx', 'Ant Design Table']}
        title="Excel 导出示例"
      />
      <ExamplePanel
        icon="file-icons:microsoft-excel"
        title="用户数据导出"
      >
        <Button
          className="mb-4"
          type="primary"
          onClick={exportExcel}
        >
          导出 Excel
        </Button>
        <Table
          columns={columns}
          dataSource={demoUsers}
          pagination={false}
          rowKey="id"
          size="small"
        />
      </ExamplePanel>
    </Space>
  );
};

export const Route = createFileRoute('/(admin)/plugin/excel')({
  component: ExcelDemo,
  staticData: {
    i18nKey: 'route.plugin_excel',
    menu: {
      icon: 'file-icons:microsoft-excel',
      order: 100
    },
    title: 'plugin_excel'
  }
});

import { downloadFileFromBlob } from '@skyroc/utils/web';
import { useAdminState } from '@skyroc/web-admin-layouts';
import { showConfirmModal, showSuccessMessage } from '@skyroc/web-admin-theme';
import { TableHeaderOperation, useTable, useTableScroll } from '@skyroc/web-ui-compose';
import type { TableColumn, TableDataWithIndex, TableOnChange } from '@skyroc/web-ui-compose';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useLocation, useNavigate } from '@tanstack/react-router';
import { Alert, Badge, Button, Card, Collapse, Empty, Flex, Table, Tag, Typography } from 'antd';
import type { Key } from 'react';
import { useState } from 'react';

import {
  MONITOR_OPERLOG_QUERY_KEYS,
  exportOperLogs,
  useCleanOperLogsMutation,
  useDeleteOperLogsMutation,
  useOperLogListQuery
} from '@/service/api/monitor-operlog';
import type {
  OperLogBusinessType,
  OperLogItem,
  OperLogListPage,
  OperLogListParams,
  OperLogStatus
} from '@/service/api/monitor-operlog';

import OperLogDetailDrawer from './modules/OperLogDetailDrawer';
import OperLogSearch from './modules/OperLogSearch';
import {
  OperLogSearchSchema,
  getOperLogSearchInitialParams,
  hasOperLogFilters,
  normalizeOperLogSearchParams,
  toOperLogSearchQuery
} from './modules/shared';

interface OperLogManagementProps {
  /** 页面首次加载时使用的分页大小。 */
  initialPageSize?: number;
}

const OPERLOG_TABLE_SCROLL_X = 1360;
type OperLogTableRecord = TableDataWithIndex<OperLogItem>;

const OperLogManagement = (props: OperLogManagementProps) => {
  const { initialPageSize = 10 } = props;

  const navigate = useNavigate({ from: '/system/log/operlog/' });
  const location = useLocation();
  const { isMobile } = useAdminState();
  const queryClient = useQueryClient();
  const { scrollConfig, tableWrapperRef } = useTableScroll(OPERLOG_TABLE_SCROLL_X);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [detailRecord, setDetailRecord] = useState<OperLogItem>();
  const [exporting, setExporting] = useState(false);
  const deleteMutation = useDeleteOperLogsMutation();
  const cleanMutation = useCleanOperLogsMutation();
  const {
    columnChecks,
    data,
    getData,
    pageNum,
    query,
    searchParams,
    searchProps,
    setColumnChecks,
    tableProps,
    total,
    updateSearchParams
  } = useTable<OperLogListParams, OperLogListPage, OperLogItem>({
    apiParams: getOperLogSearchInitialParams(initialPageSize),
    columns: createColumns,
    isMobile,
    onChange: handleTableChange,
    onSearchParamsChange: syncSearchParams,
    pagination: { pageSizeOptions: [10, 20, 50, 100], showQuickJumper: true, showTotal: value => `共 ${value} 条` },
    queryHook: useOperLogListQuery,
    // 查询条件写在 URL 上，刷新和分享链接都能回到同一屏
    routeSearch: location.searchStr,
    rowKey: record => String(record.operId),
    transformParams: normalizeOperLogSearchParams
  });

  const selectedRecords = data.filter(record => selectedRowKeys.includes(String(record.operId)));

  /** 把提交后的查询条件写回地址栏，刷新后由 routeSearch 原样读回来。 */
  function syncSearchParams(params: Partial<OperLogListParams>) {
    navigate({ search: () => toOperLogSearchQuery(params) });
  }

  function createColumns(): TableColumn<OperLogTableRecord>[] {
    return [
      {
        dataIndex: 'index',
        fixed: 'left',
        key: 'index',
        title: '序号',
        width: 70
      },
      {
        dataIndex: 'title',
        key: 'title',
        render: value => <Typography.Text ellipsis={{ tooltip: value }}>{value}</Typography.Text>,
        title: '系统模块',
        width: 180
      },
      {
        dataIndex: 'businessType',
        key: 'businessType',
        render: value => <Tag color={getBusinessTypeColor(value)}>{getBusinessTypeLabel(value)}</Tag>,
        title: '操作类型',
        width: 110
      },
      {
        dataIndex: 'operName',
        key: 'operName',
        sorter: true,
        title: '操作人员',
        width: 120
      },
      {
        dataIndex: 'operIp',
        key: 'operIp',
        render: value => <Typography.Text className="font-mono text-12px">{value}</Typography.Text>,
        title: '操作 IP',
        width: 145
      },
      {
        dataIndex: 'operLocation',
        key: 'operLocation',
        render: value => value || '—',
        title: '操作地点',
        width: 200
      },
      {
        dataIndex: 'status',
        key: 'status',
        render: value => <Badge status={value === 0 ? 'success' : 'error'} text={getStatusLabel(value)} />,
        title: '操作状态',
        width: 110
      },
      {
        dataIndex: 'operTime',
        key: 'operTime',
        render: value => value || '—',
        sorter: true,
        title: '操作时间',
        width: 180
      },
      {
        dataIndex: 'costTime',
        key: 'costTime',
        render: value => `${value} ms`,
        sorter: true,
        title: '消耗时间',
        width: 110
      },
      {
        fixed: 'right',
        key: 'actions',
        render: (_value, record) => (
          <Button size="small" onClick={() => setDetailRecord(record)}>
            详情
          </Button>
        ),
        title: '操作',
        width: 80
      }
    ];
  }

  function handleTableChange(...args: TableOnChange<OperLogTableRecord>): Partial<OperLogListParams> {
    const [pagination, , sorter] = args;
    setSelectedRowKeys([]);
    const activeSorter = Array.isArray(sorter) ? sorter[0] : sorter;
    const field = activeSorter.field;
    const orderByColumn: OperLogListParams['orderByColumn'] =
      field === 'operName' || field === 'operTime' || field === 'costTime' ? field : undefined;
    let isAsc: OperLogListParams['isAsc'];
    if (activeSorter.order === 'ascend') isAsc = 'asc';
    if (activeSorter.order === 'descend') isAsc = 'desc';

    return {
      current: pagination.current ?? 1,
      isAsc,
      orderByColumn: activeSorter.order ? orderByColumn : undefined,
      size: pagination.pageSize ?? initialPageSize
    };
  }

  function handleBatchDelete() {
    if (!selectedRecords.length) return;
    showConfirmModal({
      content: '删除后不可恢复，且批量删除是原子操作。',
      okButtonProps: { danger: true },
      okText: `删除 ${selectedRecords.length} 条日志`,
      title: '确认删除已选操作日志？',
      onOk: () => deleteRecords(selectedRecords)
    });
  }

  async function deleteRecords(records: OperLogItem[]) {
    await deleteMutation.mutateAsync(records.map(record => record.operId));
    setSelectedRowKeys([]);
    if (pageNum > 1 && records.length >= data.length) updateSearchParams({ current: pageNum - 1 });
    await queryClient.invalidateQueries({ queryKey: MONITOR_OPERLOG_QUERY_KEYS.LISTS });
    showSuccessMessage(records.length > 1 ? '所选操作日志已删除' : '操作日志已删除');
  }

  function handleClean() {
    showConfirmModal({
      content: '将清空当前租户的全部操作日志，且清空操作本身会留下新的审计记录。',
      okButtonProps: { danger: true, loading: cleanMutation.isPending },
      okText: '确认清空',
      title: '确认清空操作日志？',
      onOk: async () => {
        await cleanMutation.mutateAsync();
        setSelectedRowKeys([]);
        await queryClient.invalidateQueries({ queryKey: MONITOR_OPERLOG_QUERY_KEYS.LISTS });
        showSuccessMessage('操作日志已清空');
      }
    });
  }

  async function handleRefresh() {
    await getData();
    setSelectedRowKeys([]);
    showSuccessMessage('操作日志已刷新');
  }

  async function handleExport() {
    setExporting(true);
    try {
      const { current: _current, size: _size, ...params } = normalizeOperLogSearchParams(searchProps.searchParams);
      const blob = await exportOperLogs(params);
      downloadFileFromBlob({ fileName: '操作日志.xlsx', source: blob });
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="h-full min-h-500px flex flex-col gap-16px overflow-hidden lt-sm:overflow-auto">
      <Collapse
        bordered={false}
        className="shrink-0 card-wrapper"
        defaultActiveKey={isMobile ? undefined : '1'}
        items={[{ children: <OperLogSearch {...searchProps} />, key: '1', label: '查询条件' }]}
      />
      <div ref={tableWrapperRef} className="min-h-0 min-w-0 flex flex-1 flex-col">
        <Card
          className="min-h-0 min-w-0 flex flex-1 flex-col card-wrapper"
          extra={
            <TableHeaderOperation
              batchDeleteText="批量删除"
              columns={columnChecks}
              disabledDelete={!selectedRecords.length}
              exportData={handleExport}
              exportLoading={exporting}
              exportText="导出"
              loading={tableProps.loading || deleteMutation.isPending || cleanMutation.isPending}
              refresh={handleRefresh}
              setColumnChecks={setColumnChecks}
              onDelete={handleBatchDelete}
              suffix={
                <Button danger ghost size="small" onClick={handleClean}>
                  清空
                </Button>
              }
            />
          }
          title={
            <Flex align="center" gap={8} wrap="wrap">
              <Typography.Text strong>操作日志列表</Typography.Text>
              <Typography.Text type="secondary">共 {total} 条</Typography.Text>
              {selectedRowKeys.length ? <Tag color="blue">已选 {selectedRowKeys.length} 项</Tag> : null}
            </Flex>
          }
          variant="borderless"
        >
          {query.isError ? (
            <Alert
              action={<Button onClick={getData}>重试</Button>}
              className="mb-12px"
              showIcon
              title="操作日志加载失败"
              type="error"
            />
          ) : null}
          <Table<OperLogTableRecord>
            {...tableProps}
            column={{ align: 'center' }}
            locale={{
              emptyText: (
                <Empty
                  description={hasOperLogFilters(searchParams) ? '没有找到符合条件的操作日志' : '当前还没有操作日志'}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )
            }}
            rowSelection={{
              align: 'center',
              preserveSelectedRowKeys: false,
              selectedRowKeys,
              onChange: setSelectedRowKeys
            }}
            scroll={scrollConfig}
            size="small"
          />
        </Card>
      </div>
      <OperLogDetailDrawer
        open={detailRecord !== undefined}
        record={detailRecord}
        onClose={() => setDetailRecord(undefined)}
      />
    </div>
  );
};

function getBusinessTypeLabel(value: OperLogBusinessType) {
  return ['其它', '新增', '修改', '删除', '授权', '导出', '导入', '强退', '生成代码', '清空数据'][value] ?? '未知';
}

function getBusinessTypeColor(value: OperLogBusinessType) {
  return (
    ['default', 'green', 'blue', 'red', 'purple', 'cyan', 'geekblue', 'orange', 'gold', 'volcano'][value] ?? 'default'
  );
}

function getStatusLabel(value: OperLogStatus) {
  return value === 0 ? '正常' : '异常';
}

export const Route = createFileRoute('/(admin)/system/log/operlog/')({
  component: OperLogManagement,
  staticData: {
    keepAlive: true,
    menu: { icon: 'ph:file-text', order: 5 },
    title: '操作日志'
  },
  validateSearch: OperLogSearchSchema
});

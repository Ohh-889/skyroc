import { useAdminState } from '@shell/layouts';
import { showConfirmModal, showSuccessMessage } from '@shell/theme';
import { SvgIcon, TableHeaderOperation, useTable, useTableScroll } from '@shell/ui/compose';
import type { TableColumn, TableDataWithIndex } from '@shell/ui/compose';
import { downloadFileFromBlob } from '@skyroc/utils/web';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useLocation, useNavigate } from '@tanstack/react-router';
import { Alert, Badge, Button, Card, Collapse, Empty, Flex, Table, Tag, Typography } from 'antd';
import type { Key } from 'react';
import { useState } from 'react';

import {
  MONITOR_LOGININFO_QUERY_KEYS,
  exportLoginInfos,
  useCleanLoginInfosMutation,
  useDeleteLoginInfosMutation,
  useLoginInfoListQuery,
  useUnlockLoginInfoMutation
} from '@/service/api/monitor-logininfo';
import type {
  LoginInfoItem,
  LoginInfoListPage,
  LoginInfoListParams,
  LoginInfoStatus
} from '@/service/api/monitor-logininfo';
import { getBrowserIcon, getOsIcon } from '@/utils/icon-tag-format';

import LoginInfoDetailDrawer from './modules/LoginInfoDetailDrawer';
import LoginInfoSearch from './modules/LoginInfoSearch';
import {
  LoginInfoSearchSchema,
  getLoginInfoSearchInitialParams,
  hasLoginInfoFilters,
  normalizeLoginInfoSearchParams,
  toLoginInfoSearchQuery
} from './modules/shared';

interface LoginInfoManagementProps {
  /** 页面首次加载时使用的分页大小。 */
  initialPageSize?: number;
}

const LOGININFO_TABLE_SCROLL_X = 1180;
type LoginInfoTableRecord = TableDataWithIndex<LoginInfoItem>;

const LoginInfoManagement = (props: LoginInfoManagementProps) => {
  const { initialPageSize = 10 } = props;

  const navigate = useNavigate({ from: '/system/log/logininfo/' });
  const location = useLocation();
  const { isMobile } = useAdminState();
  const queryClient = useQueryClient();
  const { scrollConfig, tableWrapperRef } = useTableScroll(LOGININFO_TABLE_SCROLL_X);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [detailRecord, setDetailRecord] = useState<LoginInfoItem>();
  const [exporting, setExporting] = useState(false);
  const deleteMutation = useDeleteLoginInfosMutation();
  const cleanMutation = useCleanLoginInfosMutation();
  const unlockMutation = useUnlockLoginInfoMutation();
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
  } = useTable<LoginInfoListParams, LoginInfoListPage, LoginInfoItem>({
    apiParams: getLoginInfoSearchInitialParams(initialPageSize),
    columns: createColumns,
    isMobile,
    onSearchParamsChange: syncSearchParams,
    pagination: { pageSizeOptions: [10, 20, 50, 100], showQuickJumper: true, showTotal: value => `共 ${value} 条` },
    queryHook: useLoginInfoListQuery,
    // 查询条件写在 URL 上，刷新和分享链接都能回到同一屏
    routeSearch: location.searchStr,
    rowKey: record => String(record.infoId),
    transformParams: normalizeLoginInfoSearchParams
  });
  const selectedRecords = data.filter(record => selectedRowKeys.includes(String(record.infoId)));

  /** 把提交后的查询条件写回地址栏，刷新后由 routeSearch 原样读回来。 */
  function syncSearchParams(params: Partial<LoginInfoListParams>) {
    navigate({ search: () => toLoginInfoSearchQuery(params) });
  }

  function createColumns(): TableColumn<LoginInfoTableRecord>[] {
    return [
      { dataIndex: 'index', fixed: 'left', key: 'index', title: '序号', width: 70 },
      {
        dataIndex: 'userName',
        key: 'userName',
        render: value => <Typography.Text strong>{value}</Typography.Text>,
        title: '用户账号',
        width: 130
      },
      {
        dataIndex: 'deviceType',
        key: 'deviceType',
        render: value => <Tag color="blue">{getDeviceTypeLabel(value)}</Tag>,
        title: '设备类型',
        width: 110
      },
      {
        dataIndex: 'ipaddr',
        key: 'ipaddr',
        render: value => <Typography.Text className="font-mono text-12px">{value || '—'}</Typography.Text>,
        title: '登录 IP 地址',
        width: 150
      },
      {
        dataIndex: 'loginLocation',
        key: 'loginLocation',
        render: value => value || '—',
        title: '登录地点',
        width: 170
      },
      {
        key: 'environment',
        render: (_value, record) => (
          <Flex
            align="center"
            vertical
          >
            <Flex
              align="center"
              gap={6}
            >
              <SvgIcon icon={getBrowserIcon(record.browser)} />
              <span>{record.browser || '未知浏览器'}</span>
            </Flex>
            <Flex
              align="center"
              className="text-12px text-tertiary"
              gap={6}
            >
              <SvgIcon icon={getOsIcon(record.os)} />
              <span>{record.os || '未知系统'}</span>
            </Flex>
          </Flex>
        ),
        title: '登录环境',
        width: 190
      },
      {
        dataIndex: 'status',
        key: 'status',
        render: value => (
          <Badge
            status={value === '0' ? 'success' : 'error'}
            text={getStatusLabel(value)}
          />
        ),
        title: '登录状态',
        width: 110
      },
      {
        dataIndex: 'loginTime',
        key: 'loginTime',
        render: value => value || '—',
        title: '访问时间',
        width: 180
      },
      {
        fixed: 'right',
        key: 'actions',
        render: (_value, record) => (
          <Flex
            align="center"
            gap={8}
            justify="center"
          >
            <Button
              size="small"
              onClick={() => setDetailRecord(record)}
            >
              详情
            </Button>
            <Button
              size="small"
              onClick={() => handleUnlock(record)}
            >
              解锁
            </Button>
          </Flex>
        ),
        title: '操作',
        width: 130
      }
    ];
  }

  function handleBatchDelete() {
    if (!selectedRecords.length) return;
    showConfirmModal({
      okButtonProps: { danger: true },
      okText: `删除 ${selectedRecords.length} 条日志`,
      title: '确认删除已选登录日志？',
      onOk: () => deleteRecords(selectedRecords)
    });
  }

  async function deleteRecords(records: LoginInfoItem[]) {
    await deleteMutation.mutateAsync(records.map(record => record.infoId));
    setSelectedRowKeys([]);
    if (pageNum > 1 && records.length >= data.length) updateSearchParams({ current: pageNum - 1 });
    await queryClient.invalidateQueries({ queryKey: MONITOR_LOGININFO_QUERY_KEYS.LISTS });
    showSuccessMessage(records.length > 1 ? '所选登录日志已删除' : '登录日志已删除');
  }

  function handleClean() {
    showConfirmModal({
      content: '将清空当前租户的全部登录日志，且清空操作不可恢复。',
      okButtonProps: { danger: true, loading: cleanMutation.isPending },
      okText: '确认清空',
      title: '确认清空登录日志？',
      onOk: async () => {
        await cleanMutation.mutateAsync();
        setSelectedRowKeys([]);
        await queryClient.invalidateQueries({ queryKey: MONITOR_LOGININFO_QUERY_KEYS.LISTS });
        showSuccessMessage('登录日志已清空');
      }
    });
  }

  function handleUnlock(record: LoginInfoItem) {
    showConfirmModal({
      okButtonProps: { loading: unlockMutation.isPending },
      okText: '确认解锁',
      title: `确认解锁用户“${record.userName}”？`,
      onOk: async () => {
        await unlockMutation.mutateAsync(record.userName);
        showSuccessMessage('账号已解锁');
      }
    });
  }

  async function handleExport() {
    setExporting(true);
    try {
      const { current: _current, size: _size, ...params } = normalizeLoginInfoSearchParams(searchProps.searchParams);
      const blob = await exportLoginInfos(params);
      downloadFileFromBlob({ fileName: '登录日志.xlsx', source: blob });
    } finally {
      setExporting(false);
    }
  }

  async function handleRefresh() {
    await getData();
    setSelectedRowKeys([]);
    showSuccessMessage('登录日志已刷新');
  }

  return (
    <div className="h-full min-h-500px flex flex-col gap-16px overflow-hidden lt-sm:overflow-auto">
      <Collapse
        bordered={false}
        className="shrink-0 card-wrapper"
        defaultActiveKey={isMobile ? undefined : '1'}
        items={[{ children: <LoginInfoSearch {...searchProps} />, key: '1', label: '查询条件' }]}
      />
      <div
        ref={tableWrapperRef}
        className="min-h-0 min-w-0 flex flex-1 flex-col"
      >
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
              loading={
                tableProps.loading || deleteMutation.isPending || cleanMutation.isPending || unlockMutation.isPending
              }
              refresh={handleRefresh}
              setColumnChecks={setColumnChecks}
              onDelete={handleBatchDelete}
              suffix={
                <Button
                  danger
                  ghost
                  size="small"
                  onClick={handleClean}
                >
                  清空
                </Button>
              }
            />
          }
          title={
            <Flex
              align="center"
              gap={8}
              wrap="wrap"
            >
              <Typography.Text strong>登录日志列表</Typography.Text>
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
              title="登录日志加载失败"
              type="error"
            />
          ) : null}
          <Table<LoginInfoTableRecord>
            {...tableProps}
            column={{ align: 'center' }}
            locale={{
              emptyText: (
                <Empty
                  description={hasLoginInfoFilters(searchParams) ? '没有找到符合条件的登录日志' : '当前还没有登录日志'}
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
      <LoginInfoDetailDrawer
        open={detailRecord !== undefined}
        record={detailRecord}
        onClose={() => setDetailRecord(undefined)}
      />
    </div>
  );
};

function getStatusLabel(value: LoginInfoStatus) {
  return value === '0' ? '成功' : '失败';
}
function getDeviceTypeLabel(value: string) {
  return ({ pc: '电脑端', mobile: '移动端', miniapp: '小程序' }[value.toLowerCase()] ?? value) || '未知';
}

export const Route = createFileRoute('/(admin)/system/log/logininfo/')({
  component: LoginInfoManagement,
  staticData: { keepAlive: true, menu: { icon: 'ph:sign-in', order: 6 }, title: '登录日志' },
  validateSearch: LoginInfoSearchSchema
});

import { useAdminState } from '@shell/layouts';
import { showConfirmModal } from '@shell/theme';
import { SvgIcon, TableHeaderOperation, useTable, useTableScroll } from '@shell/ui/compose';
import type { TableColumn, TableDataWithIndex } from '@shell/ui/compose';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useLocation, useNavigate } from '@tanstack/react-router';
import { Alert, Button, Card, Collapse, Empty, Flex, Table, Tag, Tooltip, Typography } from 'antd';
import dayjs from 'dayjs';

import {
  MONITOR_ONLINE_QUERY_KEYS,
  useForceLogoutSessionMutation,
  useOnlineSessionListQuery
} from '@/service/api/monitor-online';
import type { OnlineSession, OnlineSessionListParams, OnlineSessionPage } from '@/service/api/monitor-online';

import OnlineSearch from './modules/OnlineSearch';
import {
  OnlineSearchSchema,
  getOnlineSearchInitialParams,
  hasOnlineFilters,
  normalizeOnlineSearchParams,
  toOnlineSearchQuery
} from './modules/shared';

interface OnlineManagementProps {
  /** 页面首次加载时使用的分页大小。 */
  initialPageSize?: number;
}

const ONLINE_TABLE_SCROLL_X = 1640;

type OnlineTableRecord = TableDataWithIndex<OnlineSession>;

const OnlineManagement = (props: OnlineManagementProps) => {
  const { initialPageSize = 10 } = props;

  const navigate = useNavigate({ from: '/monitor/online/' });
  const location = useLocation();

  const queryClient = useQueryClient();
  const { isMobile } = useAdminState();
  const { scrollConfig, tableWrapperRef } = useTableScroll(ONLINE_TABLE_SCROLL_X);
  const forceLogoutMutation = useForceLogoutSessionMutation();
  const { columnChecks, getData, query, searchParams, searchProps, setColumnChecks, tableProps, total } = useTable<
    OnlineSessionListParams,
    OnlineSessionPage,
    OnlineSession
  >({
    apiParams: getOnlineSearchInitialParams(initialPageSize),
    columns: createColumns,
    isMobile,
    onSearchParamsChange: syncSearchParams,
    pagination: {
      pageSizeOptions: [10, 20, 50, 100],
      showQuickJumper: true,
      showTotal: value => `共 ${value} 个在线会话`
    },
    queryHook: useOnlineSessionListQuery,
    // 查询条件写在 URL 上，刷新和分享链接都能回到同一屏
    routeSearch: location.searchStr,
    rowKey: session => session.tokenId,
    transformParams: normalizeOnlineSearchParams
  });

  /** 把提交后的查询条件写回地址栏，刷新后由 routeSearch 原样读回来。 */
  function syncSearchParams(params: Partial<OnlineSessionListParams>) {
    navigate({ search: () => toOnlineSearchQuery(params) });
  }

  function createColumns(): TableColumn<OnlineTableRecord>[] {
    return [
      { dataIndex: 'index', fixed: 'left', key: 'index', title: '序号', width: 70 },
      {
        dataIndex: 'tokenId',
        key: 'tokenId',
        render: value => (
          <Tooltip title={value}>
            <Typography.Text className="block max-w-180px truncate font-mono text-12px">{value}</Typography.Text>
          </Tooltip>
        ),
        title: '会话编号',
        width: 210
      },
      {
        dataIndex: 'userName',
        key: 'userName',
        render: value => (
          <Flex
            align="center"
            gap={8}
          >
            <span className="size-30px grid shrink-0 place-items-center rounded-full bg-primary-50 text-primary">
              <SvgIcon icon="ph:user" />
            </span>
            <Typography.Text strong>{value}</Typography.Text>
          </Flex>
        ),
        title: '登录名称',
        width: 160
      },
      {
        dataIndex: 'clientKey',
        key: 'clientKey',
        render: value => value || <span className="text-tertiary">—</span>,
        title: '客户端',
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
        dataIndex: 'deptName',
        key: 'deptName',
        render: value => value || <span className="text-tertiary">—</span>,
        title: '所属部门',
        width: 150
      },
      {
        dataIndex: 'ipaddr',
        key: 'ipaddr',
        render: value => <Typography.Text className="font-mono text-12px">{value || '—'}</Typography.Text>,
        title: '主机',
        width: 140
      },
      {
        dataIndex: 'loginLocation',
        key: 'loginLocation',
        render: value => value || <span className="text-tertiary">未知</span>,
        title: '登录地点',
        width: 150
      },
      {
        key: 'environment',
        render: (_value, session) => (
          <div>
            <div>{session.os || '未知系统'}</div>
            <div className="text-12px text-tertiary">{session.browser || '未知浏览器'}</div>
          </div>
        ),
        title: '登录环境',
        width: 180
      },
      {
        dataIndex: 'loginTime',
        key: 'loginTime',
        render: value => formatTimestamp(value),
        title: '登录时间',
        width: 180
      },
      {
        dataIndex: 'lastSeenTime',
        key: 'lastSeenTime',
        render: (value, session) => formatTimestamp(value ?? session.loginTime),
        title: '最近活跃',
        width: 180
      },
      {
        fixed: 'right',
        key: 'actions',
        render: (_value, session) => (
          <Button
            danger
            ghost
            size="small"
            onClick={() => handleForceLogout(session)}
          >
            强制下线
          </Button>
        ),
        title: '操作',
        width: 120
      }
    ];
  }

  function handleForceLogout(session: OnlineSession) {
    showConfirmModal({
      closable: true,
      content: (
        <div>
          <div>强退后，这个会话的访问令牌和刷新令牌都会立即失效。</div>
          <div className="mt-10px rounded-6px bg-layout px-10px py-8px text-12px text-secondary">
            {session.userName} · {session.ipaddr || '未知 IP'} · {getDeviceTypeLabel(session.deviceType)}
          </div>
        </div>
      ),
      okButtonProps: { danger: true, loading: forceLogoutMutation.isPending },
      okText: '确认强制下线',
      title: `强退“${session.userName}”的当前会话？`,
      onOk: async () => {
        await forceLogoutMutation.mutateAsync(session.tokenId);
        await queryClient.invalidateQueries({ queryKey: MONITOR_ONLINE_QUERY_KEYS.LISTS });
        showSuccessMessage('会话已强制下线');
      }
    });
  }

  async function handleRefresh() {
    await getData();
    showSuccessMessage('在线会话已刷新');
  }

  return (
    <div className="h-full min-h-500px flex flex-col gap-16px overflow-hidden lt-sm:overflow-auto">
      <Collapse
        bordered={false}
        className="shrink-0 card-wrapper"
        defaultActiveKey={isMobile ? undefined : '1'}
        items={[{ children: <OnlineSearch {...searchProps} />, key: '1', label: '查询条件' }]}
      />

      <div
        className="min-h-0 min-w-0 flex flex-1 flex-col"
        ref={tableWrapperRef}
      >
        <Card
          className="min-h-0 min-w-0 flex flex-1 flex-col card-wrapper"
          extra={
            <TableHeaderOperation
              columns={columnChecks}
              loading={tableProps.loading}
              refresh={handleRefresh}
              setColumnChecks={setColumnChecks}
            />
          }
          title={
            <Flex
              align="center"
              gap={8}
              wrap="wrap"
            >
              <Typography.Text strong>在线用户</Typography.Text>
              <Typography.Text type="secondary">当前共 {total} 个在线会话</Typography.Text>
              <Tag color="green">实时会话</Tag>
            </Flex>
          }
          variant="borderless"
        >
          {query.isError ? (
            <Alert
              action={<Button onClick={getData}>重试</Button>}
              className="mb-12px"
              showIcon
              title="在线会话加载失败"
              type="error"
            />
          ) : null}
          <Table<OnlineTableRecord>
            {...tableProps}
            locale={{
              emptyText: (
                <Empty
                  description={hasOnlineFilters(searchParams) ? '没有找到符合条件的在线会话' : '当前没有在线用户'}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )
            }}
            scroll={scrollConfig}
            size="small"
          />
        </Card>
      </div>
    </div>
  );
};

function formatTimestamp(value: number) {
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
}

function getDeviceTypeLabel(value: null | string) {
  if (value === 'pc') return '电脑';
  if (value === 'android') return 'Android';
  if (value === 'ios') return 'iOS';
  if (value === 'mini_program') return '小程序';
  return value || '未知';
}

export const Route = createFileRoute('/(admin)/monitor/online/')({
  component: OnlineManagement,
  staticData: {
    keepAlive: true,
    menu: {
      icon: 'ph:users-three',
      order: 1
    },
    title: '在线用户'
  },
  validateSearch: OnlineSearchSchema
});

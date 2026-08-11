import { useAdminState } from '@skyroc/web-admin-layouts';
import { SvgIcon, TableHeaderOperation, useTable, useTableScroll } from '@skyroc/web-ui-compose';
import type { TableColumn, TableDataWithIndex, TableQueryHookOptions } from '@skyroc/web-ui-compose';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Alert, Button, Card, Collapse, Empty, Flex, Table, Tag, Tooltip, Typography } from 'antd';
import { Suspense, lazy, useState } from 'react';
import type { Key } from 'react';

import { deleteModal } from '@/features/antd/deleteModal';
import {
  SYSTEM_NOTICE_QUERY_KEYS,
  useCreateNoticeMutation,
  useDeleteNoticesMutation,
  useNoticeListQuery,
  useUpdateNoticeMutation
} from '@/service/api/system-notice';
import type {
  NoticeId,
  NoticeItem,
  NoticeListPage,
  NoticeListParams,
  NoticeSavePayload,
  NoticeStatus,
  NoticeType
} from '@/service/api/system-notice';

import type { NoticeEditorMode } from './modules/NoticeEditorDrawer';
import NoticeSearch from './modules/NoticeSearch';
import type { NoticeTableParams } from './modules/NoticeSearch';

const NoticeEditorDrawer = lazy(() => import('./modules/NoticeEditorDrawer'));

interface NoticeEditorState {
  mode: NoticeEditorMode;
  noticeId?: NoticeId;
  open: boolean;
}

interface NoticeManagementProps {
  /** 页面首次加载时使用的分页大小。 */
  initialPageSize?: number;
}

const INITIAL_EDITOR_STATE: NoticeEditorState = { mode: 'create', open: false };
const NOTICE_SEARCH_INITIAL_PARAMS: Partial<NoticeTableParams> = {
  createByName: undefined,
  createdRange: undefined,
  noticeTitle: undefined,
  noticeType: undefined,
  status: undefined
};
const NOTICE_TABLE_SCROLL_X = 1120;

type NoticeTableRecord = TableDataWithIndex<NoticeItem>;

const NoticeManagement = (props: NoticeManagementProps) => {
  const { initialPageSize = 10 } = props;

  const queryClient = useQueryClient();
  const { isMobile } = useAdminState();
  const { scrollConfig, tableWrapperRef } = useTableScroll(NOTICE_TABLE_SCROLL_X);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [editorState, setEditorState] = useState<NoticeEditorState>(INITIAL_EDITOR_STATE);

  const createMutation = useCreateNoticeMutation();
  const updateMutation = useUpdateNoticeMutation();
  const deleteMutation = useDeleteNoticesMutation();
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
  } = useTable<NoticeTableParams, NoticeListPage, NoticeItem>({
    apiParams: { ...NOTICE_SEARCH_INITIAL_PARAMS, size: initialPageSize },
    columns: createColumns,
    isChangeURL: false,
    isMobile,
    pagination: {
      pageSizeOptions: [10, 20, 50, 100],
      showQuickJumper: true,
      showTotal: value => `共 ${value} 条`
    },
    queryHook: useNoticeTableQuery,
    rowKey: notice => String(notice.noticeId),
    transformParams: normalizeNoticeSearchParams
  });
  const notices = data;
  const saving = createMutation.isPending || updateMutation.isPending;
  const selectedNotices = notices.filter(notice => selectedRowKeys.map(String).includes(String(notice.noticeId)));

  function createColumns(): TableColumn<NoticeTableRecord>[] {
    return [
      {
        dataIndex: 'noticeTitle',
        fixed: 'left',
        key: 'noticeTitle',
        render: (value, notice) => (
          <Flex
            align="center"
            gap={10}
          >
            <span className="size-32px grid shrink-0 place-items-center rounded-8px bg-primary-50 text-primary">
              <SvgIcon icon={notice.noticeType === '1' ? 'ph:bell' : 'ph:megaphone'} />
            </span>
            <div className="min-w-0">
              <Typography.Text className="block truncate font-600">{value}</Typography.Text>
              <Typography.Text
                className="block max-w-360px truncate text-12px"
                type="secondary"
              >
                {getNoticeSummary(notice.noticeContent)}
              </Typography.Text>
            </div>
          </Flex>
        ),
        title: '公告标题',
        width: 360
      },
      {
        dataIndex: 'noticeType',
        key: 'noticeType',
        render: value => <Tag color={value === '1' ? 'blue' : 'gold'}>{getNoticeTypeLabel(value)}</Tag>,
        title: '公告类型',
        width: 110
      },
      {
        dataIndex: 'status',
        key: 'status',
        render: value => <Tag color={value === '0' ? 'success' : 'default'}>{getNoticeStatusLabel(value)}</Tag>,
        title: '状态',
        width: 100
      },
      {
        dataIndex: 'createByName',
        key: 'createByName',
        render: value => value || <span className="text-tertiary">—</span>,
        title: '创建者',
        width: 140
      },
      {
        dataIndex: 'createTime',
        key: 'createTime',
        render: value => value || <span className="text-tertiary">—</span>,
        title: '创建时间',
        width: 180
      },
      {
        fixed: 'right',
        key: 'actions',
        render: (_value, notice) => (
          <div className="flex-center justify-end gap-8px">
            <Tooltip title="修改公告内容、类型和状态">
              <Button
                size="small"
                onClick={() => handleEdit(notice)}
              >
                编辑
              </Button>
            </Tooltip>
            <Button
              danger
              size="small"
              onClick={() => handleDelete([notice])}
            >
              删除
            </Button>
          </div>
        ),
        title: '操作',
        width: 140
      }
    ];
  }

  function handleEdit(notice: NoticeItem) {
    setEditorState({ mode: 'update', noticeId: notice.noticeId, open: true });
  }

  function handleCloseEditor() {
    if (!saving) setEditorState(INITIAL_EDITOR_STATE);
  }

  async function handleSubmit(values: NoticeSavePayload) {
    const mode = editorState.mode;
    if (mode === 'create') await createMutation.mutateAsync(values);
    else await updateMutation.mutateAsync({ ...values, noticeId: editorState.noticeId as NoticeId });

    setEditorState(INITIAL_EDITOR_STATE);
    await queryClient.invalidateQueries({ queryKey: SYSTEM_NOTICE_QUERY_KEYS.ALL });
    showSuccessMessage(mode === 'create' ? '公告新增成功' : '公告修改成功');
  }

  function handleDelete(targetNotices: NoticeItem[]) {
    const isBatch = targetNotices.length > 1;
    deleteModal({
      content: isBatch ? '批量删除是原子操作；任一公告不存在时整批都不会删除。' : '删除后不可恢复。',
      okText: isBatch ? `删除 ${targetNotices.length} 条公告` : '删除公告',
      title: isBatch ? `删除已选的 ${targetNotices.length} 条公告？` : `删除“${targetNotices[0]?.noticeTitle}”？`,
      onOk: () => deleteNoticeRecords(targetNotices)
    });
  }

  async function handleBatchDelete() {
    await deleteNoticeRecords(selectedNotices);
  }

  async function deleteNoticeRecords(targetNotices: NoticeItem[]) {
    await deleteMutation.mutateAsync(targetNotices.map(notice => notice.noticeId));
    setSelectedRowKeys([]);
    if (pageNum > 1 && targetNotices.length >= notices.length) updateSearchParams({ current: pageNum - 1 });
    await queryClient.invalidateQueries({ queryKey: SYSTEM_NOTICE_QUERY_KEYS.LISTS });
    showSuccessMessage(targetNotices.length > 1 ? '所选公告已删除' : '公告已删除');
  }

  async function handleRefresh() {
    await getData();
    setSelectedRowKeys([]);
    showSuccessMessage('公告数据已刷新');
  }

  return (
    <div className="h-full min-h-500px flex flex-col gap-16px overflow-hidden lt-sm:overflow-auto">
      <Collapse
        bordered={false}
        className="shrink-0 card-wrapper"
        defaultActiveKey={isMobile ? undefined : '1'}
        items={[{ children: <NoticeSearch {...searchProps} />, key: '1', label: '查询条件' }]}
      />

      <div
        className="min-h-0 min-w-0 flex flex-1 flex-col"
        ref={tableWrapperRef}
      >
        <Card
          className="min-h-0 min-w-0 flex flex-1 flex-col card-wrapper"
          extra={
            <TableHeaderOperation
              add={() => setEditorState({ mode: 'create', open: true })}
              addText="新增公告"
              batchDeleteText="批量删除"
              columns={columnChecks}
              disabledDelete={selectedNotices.length === 0}
              loading={tableProps.loading}
              refresh={handleRefresh}
              setColumnChecks={setColumnChecks}
              onDelete={handleBatchDelete}
            />
          }
          title={
            <Flex
              align="center"
              gap={8}
              wrap="wrap"
            >
              <Typography.Text strong>通知公告列表</Typography.Text>
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
              title="公告列表加载失败"
              type="error"
            />
          ) : null}
          <Table<NoticeTableRecord>
            {...tableProps}
            column={{ align: 'center' }}
            locale={{
              emptyText: (
                <Empty
                  description={hasNoticeFilters(searchParams) ? '没有找到符合条件的公告' : '当前还没有公告'}
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

      <Suspense fallback={null}>
        {editorState.open ? (
          <NoticeEditorDrawer
            open
            loading={saving}
            mode={editorState.mode}
            noticeId={editorState.noticeId}
            onClose={handleCloseEditor}
            onSubmit={handleSubmit}
          />
        ) : null}
      </Suspense>
    </div>
  );
};

function normalizeNoticeSearchParams(params: NoticeTableParams): NoticeTableParams {
  return {
    ...params,
    createByName: params.createByName?.trim() || undefined,
    noticeTitle: params.noticeTitle?.trim() || undefined
  };
}

function toNoticeListParams(params: NoticeTableParams): NoticeListParams {
  const { createdRange, ...listParams } = params;
  return {
    ...listParams,
    beginTime: createdRange?.[0]?.startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    endTime: createdRange?.[1]?.endOf('day').format('YYYY-MM-DD HH:mm:ss')
  };
}

function useNoticeTableQuery<Data = NoticeListPage>(
  params: NoticeTableParams,
  options?: TableQueryHookOptions<NoticeListPage, Data>
) {
  return useNoticeListQuery(toNoticeListParams(params), options);
}

function hasNoticeFilters(params: Partial<NoticeTableParams>) {
  return Boolean(
    params.createByName || params.createdRange || params.noticeTitle || params.noticeType || params.status
  );
}

function getNoticeTypeLabel(type: NoticeType) {
  return type === '1' ? '通知' : '公告';
}

function getNoticeStatusLabel(status: NoticeStatus) {
  return status === '0' ? '正常' : '关闭';
}

function getNoticeSummary(content: null | string) {
  if (!content) return '暂无内容';
  const text = content
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text || '暂无内容';
}

export const Route = createFileRoute('/(admin)/system/notice/')({
  component: NoticeManagement,
  staticData: {
    keepAlive: true,
    menu: { icon: 'ph:bell-ringing', order: 9 },
    title: '通知公告'
  }
});

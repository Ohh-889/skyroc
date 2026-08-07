import { downloadFileFromBlob } from '@skyroc/utils/web';
import { useAdminState } from '@skyroc/web-admin-layouts';
import { showConfirmModal, showSuccessMessage } from '@skyroc/web-admin-theme';
import { SvgIcon, TableHeaderOperation, useTable, useTableScroll } from '@skyroc/web-ui-compose';
import type { TableColumn, TableDataWithIndex, TableQueryHookOptions } from '@skyroc/web-ui-compose';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Alert, Badge, Button, Card, Collapse, Dropdown, Empty, Flex, Table, Tag, Tooltip, Typography } from 'antd';
import type { Key } from 'react';
import { Suspense, lazy, useState } from 'react';
import {
  SYSTEM_CLIENT_QUERY_KEYS,
  exportClients,
  useClientListQuery,
  useCreateClientMutation,
  useDeleteClientsMutation,
  useUpdateClientMutation,
  useUpdateClientStatusMutation
} from '@/service/api/system-client';
import type {
  ClientId,
  ClientItem,
  ClientListPage,
  ClientSavePayload,
  ClientStatus
} from '@/service/api/system-client';
import { useDictDataQuery } from '@/service/api/system-dict';
import type { ClientEditorMode } from './modules/ClientEditorDrawer';
import ClientSearch from './modules/ClientSearch';
import type { ClientTableParams } from './modules/ClientSearch';
import {
  FALLBACK_DEVICE_OPTIONS,
  FALLBACK_GRANT_OPTIONS,
  createClientOptions,
  formatClientDuration,
  getClientOptionLabel
} from './modules/client-utils';

const ClientDetailDrawer = lazy(() => import('./modules/ClientDetailDrawer'));
const ClientEditorDrawer = lazy(() => import('./modules/ClientEditorDrawer'));

interface ClientEditorState {
  clientRecordId?: ClientId;
  mode: ClientEditorMode;
  open: boolean;
}

interface ClientDetailState {
  clientRecordId?: ClientId;
  open: boolean;
}

interface ClientManagementProps {
  /** 首次加载分页大小。 */
  initialPageSize?: number;
}

const INITIAL_EDITOR_STATE: ClientEditorState = { mode: 'create', open: false };
const INITIAL_DETAIL_STATE: ClientDetailState = { open: false };
const INITIAL_PARAMS: Partial<ClientTableParams> = {
  clientId: undefined,
  clientKey: undefined,
  isAsc: 'desc',
  orderByColumn: 'id',
  status: undefined
};

type ClientRecord = TableDataWithIndex<ClientItem>;

const ClientManagement = (props: ClientManagementProps) => {
  const { initialPageSize = 10 } = props;
  const { isMobile } = useAdminState();
  const queryClient = useQueryClient();
  const { scrollConfig, tableWrapperRef } = useTableScroll(1120);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [editorState, setEditorState] = useState<ClientEditorState>(INITIAL_EDITOR_STATE);
  const [detailState, setDetailState] = useState<ClientDetailState>(INITIAL_DETAIL_STATE);
  const createMutation = useCreateClientMutation();
  const updateMutation = useUpdateClientMutation();
  const statusMutation = useUpdateClientStatusMutation();
  const deleteMutation = useDeleteClientsMutation();
  const grantDictQuery = useDictDataQuery({ current: 1, dictType: 'sys_grant_type', size: 100 });
  const deviceDictQuery = useDictDataQuery({ current: 1, dictType: 'sys_device_type', size: 100 });
  const grantOptions = createClientOptions(grantDictQuery.data?.records, FALLBACK_GRANT_OPTIONS);
  const deviceOptions = createClientOptions(deviceDictQuery.data?.records, FALLBACK_DEVICE_OPTIONS);
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
  } = useTable<ClientTableParams, ClientListPage, ClientItem>({
    apiParams: { ...INITIAL_PARAMS, current: 1, size: initialPageSize },
    columns: createColumns,
    isChangeURL: false,
    isMobile,
    pagination: { pageSizeOptions: [10, 20, 50, 100], showQuickJumper: true, showTotal: value => `共 ${value} 条` },
    queryHook: useClientTableQuery,
    rowKey: item => String(item.id),
    transformParams: normalizeParams
  });
  const selected = data.filter(item => selectedRowKeys.map(String).includes(String(item.id)));
  const saving = createMutation.isPending || updateMutation.isPending;

  function createColumns(): TableColumn<ClientRecord>[] {
    return [
      {
        dataIndex: 'clientKey',
        fixed: 'left',
        key: 'clientKey',
        render: (value, item) => (
          <div className="flex flex-col items-center text-center">
            <Typography.Text strong>{value || '未命名客户端'}</Typography.Text>
            <Typography.Text
              className="block max-w-260px text-center text-12px"
              copyable={item.clientId ? { text: item.clientId } : undefined}
              ellipsis={{ tooltip: item.clientId }}
              type="secondary"
            >
              {item.clientId || '无客户端 ID'}
            </Typography.Text>
          </div>
        ),
        title: '客户端',
        width: 300
      },
      {
        dataIndex: 'deviceType',
        key: 'deviceType',
        render: value => (
          <Flex
            align="center"
            gap={7}
            justify="center"
          >
            <span className="size-28px grid place-items-center rounded-6px bg-info-bg text-11px text-info font-700">
              <SvgIcon icon="ph:device-mobile" />
            </span>
            {getClientOptionLabel(deviceOptions, value)}
          </Flex>
        ),
        title: '设备类型',
        width: 150
      },
      {
        dataIndex: 'grantTypeList',
        key: 'grantTypeList',
        render: value => (
          <Flex
            gap={4}
            justify="center"
            wrap="wrap"
          >
            {value.slice(0, 3).map((grantType: string) => (
              <Tag
                key={grantType}
                color="blue"
              >
                {getClientOptionLabel(grantOptions, grantType)}
              </Tag>
            ))}
            {value.length > 3 ? <Tag>+{value.length - 3}</Tag> : null}
          </Flex>
        ),
        title: '授权方式',
        width: 260
      },
      {
        key: 'tokenPolicy',
        render: (_value, item) => (
          <div className="text-center">
            <Typography.Text strong>{formatClientDuration(item.activeTimeout)}活跃</Typography.Text>
            <Typography.Text
              className="block text-12px"
              type="secondary"
            >
              {formatClientDuration(item.timeout)}固定有效期
            </Typography.Text>
          </div>
        ),
        title: '令牌策略',
        width: 190
      },
      {
        dataIndex: 'status',
        key: 'status',
        render: value => (
          <Badge
            status={value === '0' ? 'success' : 'error'}
            text={value === '0' ? '正常' : '停用'}
          />
        ),
        title: '状态',
        width: 100
      },
      {
        fixed: 'right',
        key: 'actions',
        render: (_value, item) => (
          <Flex
            justify="center"
            gap={8}
          >
            <Button
              size="small"
              onClick={() => openDetail(item)}
            >
              查看
            </Button>
            <Button
              size="small"
              onClick={() => openEditor('update', item)}
            >
              编辑
            </Button>
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'status',
                    label: item.status === '0' ? '停用客户端' : '启用客户端',
                    onClick: () => handleStatusChange(item)
                  },
                  { danger: true, key: 'delete', label: '删除客户端', onClick: () => handleDelete([item]) }
                ]
              }}
              trigger={['click']}
            >
              <Tooltip title="更多操作">
                <Button
                  aria-label="更多操作"
                  icon={<SvgIcon icon="ph:dots-three" />}
                  size="small"
                />
              </Tooltip>
            </Dropdown>
          </Flex>
        ),
        title: '操作',
        width: 190
      }
    ];
  }

  function openEditor(mode: ClientEditorMode, item?: ClientItem) {
    setEditorState({ clientRecordId: item?.id, mode, open: true });
  }

  function closeEditor() {
    if (!saving) setEditorState(INITIAL_EDITOR_STATE);
  }

  function openDetail(item: ClientItem) {
    setDetailState({ clientRecordId: item.id, open: true });
  }

  function closeDetail() {
    setDetailState(INITIAL_DETAIL_STATE);
  }

  function editFromDetail() {
    const clientRecordId = detailState.clientRecordId;
    setDetailState(INITIAL_DETAIL_STATE);
    setEditorState({ clientRecordId, mode: 'update', open: true });
  }

  async function handleSubmit(values: ClientSavePayload & { id?: ClientId }) {
    if (editorState.mode === 'create') await createMutation.mutateAsync(values);
    else await updateMutation.mutateAsync({ ...values, id: editorState.clientRecordId as ClientId });
    setEditorState(INITIAL_EDITOR_STATE);
    await queryClient.invalidateQueries({ queryKey: SYSTEM_CLIENT_QUERY_KEYS.ALL });
    showSuccessMessage(editorState.mode === 'create' ? '客户端新增成功' : '客户端修改成功');
  }

  function handleStatusChange(item: ClientItem) {
    if (!item.clientId) return;
    const nextStatus: ClientStatus = item.status === '0' ? '1' : '0';
    const disabling = nextStatus === '1';
    showConfirmModal({
      content: disabling
        ? '停用后将阻止该客户端发起新的登录，但已建立的会话不会立即失效。'
        : '启用后，该客户端可以再次使用已开通的授权方式登录。',
      okButtonProps: { danger: disabling, loading: statusMutation.isPending },
      okText: disabling ? '确认停用' : '确认启用',
      title: `${disabling ? '停用' : '启用'}客户端“${item.clientKey || item.clientId}”？`,
      onOk: async () => {
        await statusMutation.mutateAsync({ clientId: item.clientId as string, status: nextStatus });
        await queryClient.invalidateQueries({ queryKey: SYSTEM_CLIENT_QUERY_KEYS.ALL });
        showSuccessMessage(disabling ? '客户端已停用' : '客户端已启用');
      }
    });
  }

  function handleDelete(items: ClientItem[]) {
    const batch = items.length > 1;
    showConfirmModal({
      content: batch
        ? '批量删除为原子操作，任一客户端已不存在时整批不会执行。删除后现有会话不会立即下线。'
        : '删除后无法通过页面恢复，且现有会话不会立即下线。',
      okButtonProps: { danger: true, loading: deleteMutation.isPending },
      okText: batch ? `删除 ${items.length} 个客户端` : '删除客户端',
      title: batch ? `确认删除已选的 ${items.length} 个客户端？` : `确认删除“${items[0]?.clientKey || '该客户端'}”？`,
      onOk: async () => {
        await deleteMutation.mutateAsync(items.map(item => item.id));
        setSelectedRowKeys([]);
        if (pageNum > 1 && items.length >= data.length) updateSearchParams({ current: pageNum - 1 });
        await queryClient.invalidateQueries({ queryKey: SYSTEM_CLIENT_QUERY_KEYS.ALL });
        showSuccessMessage('客户端删除成功');
      }
    });
  }

  function handleRefresh() {
    getData().then(() => {
      setSelectedRowKeys([]);
      showSuccessMessage('客户端列表已刷新');
    });
  }

  function handleExport() {
    showConfirmModal({
      content: '导出文件包含明文客户端密钥，请按敏感凭据管理，不要通过公开渠道传输。',
      okText: '确认导出',
      title: '导出客户端数据？',
      onOk: async () => {
        const { current: _current, size: _size, ...params } = normalizeParams(searchParams as ClientTableParams);
        const blob = await exportClients(params);
        downloadFileFromBlob({ fileName: '客户端管理.xlsx', source: blob });
        showSuccessMessage('客户端数据导出成功');
      }
    });
  }

  return (
    <div className="h-full min-h-500px flex flex-col gap-16px overflow-hidden lt-sm:overflow-auto">
      <Alert
        className="shrink-0"
        description="客户端密钥属于敏感凭据。列表不展示密钥，查看、复制和导出操作应保留审计记录。"
        showIcon
        type="warning"
      />
      <Collapse
        bordered={false}
        className="shrink-0 card-wrapper"
        defaultActiveKey={isMobile ? undefined : '1'}
        items={[{ children: <ClientSearch {...searchProps} />, key: '1', label: '查询条件' }]}
      />
      <div
        ref={tableWrapperRef}
        className="min-h-0 min-w-0 flex flex-1 flex-col"
      >
        <Card
          className="min-h-0 min-w-0 flex flex-1 flex-col card-wrapper"
          extra={
            <TableHeaderOperation
              add={() => openEditor('create')}
              addText="新增客户端"
              batchDeleteText="批量删除"
              columns={columnChecks}
              disabledDelete={!selected.length}
              exportData={handleExport}
              exportText="导出"
              loading={tableProps.loading || deleteMutation.isPending || statusMutation.isPending}
              refresh={handleRefresh}
              setColumnChecks={setColumnChecks}
              onDelete={() => handleDelete(selected)}
            />
          }
          title={
            <Flex
              align="center"
              gap={8}
              wrap="wrap"
            >
              <Typography.Text strong>客户端列表</Typography.Text>
              <Typography.Text type="secondary">共 {total} 条</Typography.Text>
              {selected.length ? <Tag color="blue">已选 {selected.length} 项</Tag> : null}
            </Flex>
          }
          variant="borderless"
        >
          {query.isError ? (
            <Alert
              action={<Button onClick={getData}>重试</Button>}
              className="mb-12px"
              showIcon
              title="客户端列表加载失败"
              type="error"
            />
          ) : null}
          <Table<ClientRecord>
            {...tableProps}
            column={{ align: 'center' }}
            locale={{
              emptyText: (
                <Empty
                  description={hasFilters(searchParams) ? '没有找到符合条件的客户端' : '当前还没有客户端'}
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
        {detailState.open ? (
          <ClientDetailDrawer
            clientRecordId={detailState.clientRecordId}
            deviceOptions={deviceOptions}
            grantOptions={grantOptions}
            open
            onClose={closeDetail}
            onEdit={editFromDetail}
          />
        ) : null}
        {editorState.open ? (
          <ClientEditorDrawer
            clientRecordId={editorState.clientRecordId}
            deviceOptions={deviceOptions}
            grantOptions={grantOptions}
            loading={saving}
            mode={editorState.mode}
            open
            onClose={closeEditor}
            onSubmit={handleSubmit}
          />
        ) : null}
      </Suspense>
    </div>
  );
};

function normalizeParams(params: ClientTableParams): ClientTableParams {
  return {
    ...params,
    clientId: params.clientId?.trim() || undefined,
    clientKey: params.clientKey?.trim() || undefined
  };
}

function useClientTableQuery<Data = ClientListPage>(
  params: ClientTableParams,
  options?: TableQueryHookOptions<ClientListPage, Data>
) {
  return useClientListQuery(params, options);
}

function hasFilters(params: Partial<ClientTableParams>) {
  return Boolean(params.clientId || params.clientKey || params.status);
}

export const Route = createFileRoute('/(admin)/system/client/')({
  component: ClientManagement,
  staticData: { keepAlive: true, menu: { icon: 'ph:devices', order: 6 }, title: '客户端管理' }
});

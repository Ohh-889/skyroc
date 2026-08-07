import { downloadFileFromBlob } from '@skyroc/utils/web';
import { useAdminState } from '@skyroc/web-admin-layouts';
import { showConfirmModal, showSuccessMessage } from '@skyroc/web-admin-theme';
import { TableHeaderOperation, useTable, useTableScroll } from '@skyroc/web-ui-compose';
import type { TableColumn, TableDataWithIndex, TableQueryHookOptions } from '@skyroc/web-ui-compose';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Alert, Button, Card, Collapse, Empty, Flex, Table, Tag, Tooltip, Typography } from 'antd';
import type { Key } from 'react';
import { Suspense, lazy, useState } from 'react';
import {
  SYSTEM_CONFIG_QUERY_KEYS,
  exportConfigs,
  useConfigListQuery,
  useCreateConfigMutation,
  useDeleteConfigsMutation,
  useRefreshConfigCacheMutation,
  useUpdateConfigMutation
} from '@/service/api/system-config';
import type { ConfigItem, ConfigListPage, ConfigSavePayload } from '@/service/api/system-config';
import type { ConfigEditorMode } from './modules/ConfigEditorDrawer';
import ConfigSearch from './modules/ConfigSearch';
import type { ConfigTableParams } from './modules/ConfigSearch';
const ConfigEditorDrawer = lazy(() => import('./modules/ConfigEditorDrawer'));
interface ConfigEditorState {
  configId?: ConfigItem['configId'];
  mode: ConfigEditorMode;
  open: boolean;
}
interface ConfigManagementProps {
  /** 首次加载分页大小。 */ initialPageSize?: number;
}
const INITIAL_EDITOR_STATE: ConfigEditorState = { mode: 'create', open: false };
const INITIAL_PARAMS: Partial<ConfigTableParams> = {
  configKey: undefined,
  configName: undefined,
  configType: undefined,
  createdRange: undefined
};
type ConfigRecord = TableDataWithIndex<ConfigItem>;
const ConfigManagement = (props: ConfigManagementProps) => {
  const { initialPageSize = 10 } = props;
  const { isMobile } = useAdminState();
  const queryClient = useQueryClient();
  const { scrollConfig, tableWrapperRef } = useTableScroll(1120);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [editorState, setEditorState] = useState<ConfigEditorState>(INITIAL_EDITOR_STATE);
  const createMutation = useCreateConfigMutation();
  const updateMutation = useUpdateConfigMutation();
  const deleteMutation = useDeleteConfigsMutation();
  const refreshMutation = useRefreshConfigCacheMutation();
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
  } = useTable<ConfigTableParams, ConfigListPage, ConfigItem>({
    apiParams: { ...INITIAL_PARAMS, current: 1, size: initialPageSize },
    columns: createColumns,
    isChangeURL: false,
    isMobile,
    pagination: { pageSizeOptions: [10, 20, 50, 100], showQuickJumper: true, showTotal: value => `共 ${value} 条` },
    queryHook: useConfigTableQuery,
    rowKey: item => String(item.configId),
    transformParams: normalizeParams
  });
  const selected = data.filter(item => selectedRowKeys.map(String).includes(String(item.configId)));
  const saving = createMutation.isPending || updateMutation.isPending;
  function createColumns(): TableColumn<ConfigRecord>[] {
    return [
      {
        dataIndex: 'configName',
        fixed: 'left',
        key: 'configName',
        render: value => (
          <Tooltip title={value}>
            <Typography.Text className="block max-w-180px truncate font-bold">{value}</Typography.Text>
          </Tooltip>
        ),
        title: '参数名称',
        width: 190
      },
      {
        dataIndex: 'configKey',
        key: 'configKey',
        render: value => (
          <Typography.Text
            code
            copyable={{ text: value }}
          >
            {value}
          </Typography.Text>
        ),
        title: '参数键名',
        width: 235
      },
      {
        dataIndex: 'configValue',
        key: 'configValue',
        render: value => (
          <Typography.Text
            ellipsis={{ tooltip: value }}
            className="max-w-240px inline-block align-middle"
          >
            {value}
          </Typography.Text>
        ),
        title: '参数键值',
        width: 235
      },
      {
        dataIndex: 'configType',
        key: 'configType',
        render: value => <Tag color={value === 'Y' ? 'gold' : 'blue'}>{value === 'Y' ? '内置' : '自定义'}</Tag>,
        title: '系统内置',
        width: 110
      },
      {
        dataIndex: 'remark',
        key: 'remark',
        render: value =>
          value ? (
            <Tooltip title={value}>
              <Typography.Text className="block max-w-180px truncate font-mono text-12px">{value}</Typography.Text>
            </Tooltip>
          ) : (
            <span className="text-tertiary">—</span>
          ),
        title: '备注',
        width: 180
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
        render: (_value, item) => (
          <Flex
            justify="center"
            gap={8}
          >
            <Tooltip title={item.configType === 'Y' ? '内置参数不可修改键名' : '修改参数'}>
              <Button
                size="small"
                onClick={() => openEditor('update', item)}
              >
                编辑
              </Button>
            </Tooltip>
            <Button
              danger
              size="small"
              disabled={item.configType === 'Y'}
              onClick={() => handleDelete([item])}
            >
              删除
            </Button>
          </Flex>
        ),
        title: '操作',
        width: 150
      }
    ];
  }

  function openEditor(mode: ConfigEditorMode, item?: ConfigItem) {
    setEditorState({ mode, configId: item?.configId, open: true });
  }

  function closeEditor() {
    if (!saving) setEditorState(INITIAL_EDITOR_STATE);
  }

  async function handleSubmit(values: ConfigSavePayload & { configId?: ConfigItem['configId'] }) {
    if (editorState.mode === 'create') await createMutation.mutateAsync(values);
    else await updateMutation.mutateAsync({ ...values, configId: editorState.configId as ConfigItem['configId'] });
    setEditorState(INITIAL_EDITOR_STATE);
    await queryClient.invalidateQueries({ queryKey: SYSTEM_CONFIG_QUERY_KEYS.LISTS });
    showSuccessMessage(editorState.mode === 'create' ? '参数新增成功' : '参数修改成功');
  }

  function handleDelete(items: ConfigItem[]) {
    if (items.some(item => item.configType === 'Y')) return;
    const batch = items.length > 1;
    showConfirmModal({
      content: batch ? '批量删除为原子操作，任一参数无效时整批不会删除。' : '删除后不可恢复。',
      okButtonProps: { danger: true, loading: deleteMutation.isPending },
      okText: batch ? `删除 ${items.length} 条参数` : '删除参数',
      title: batch ? `确认删除已选的 ${items.length} 条参数？` : `确认删除“${items[0]?.configName}”？`,
      onOk: async () => {
        await deleteMutation.mutateAsync(items.map(item => item.configId));
        setSelectedRowKeys([]);
        if (pageNum > 1 && items.length >= data.length) updateSearchParams({ current: pageNum - 1 });
        await queryClient.invalidateQueries({ queryKey: SYSTEM_CONFIG_QUERY_KEYS.LISTS });
        showSuccessMessage('参数删除成功');
      }
    });
  }

  function handleRefresh() {
    getData().then(() => {
      setSelectedRowKeys([]);
      showSuccessMessage('参数列表已刷新');
    });
  }

  function handleRefreshCache() {
    showConfirmModal({
      content: '将清除当前租户的参数缓存。',
      okButtonProps: { loading: refreshMutation.isPending },
      okText: '确认刷新',
      title: '刷新参数缓存？',
      onOk: async () => {
        await refreshMutation.mutateAsync();
        showSuccessMessage('参数缓存已刷新');
      }
    });
  }

  async function handleExport() {
    const { createdRange, ...params } = normalizeParams(searchParams as ConfigTableParams);
    const blob = await exportConfigs({
      ...params,
      rangeBegin: createdRange?.[0]?.format('YYYY-MM-DD HH:mm:ss'),
      rangeEnd: createdRange?.[1]?.format('YYYY-MM-DD HH:mm:ss')
    });
    downloadFileFromBlob({ fileName: '参数数据.xlsx', source: blob });
  }

  return (
    <div className="h-full min-h-500px flex flex-col gap-16px overflow-hidden lt-sm:overflow-auto">
      <Collapse
        bordered={false}
        className="shrink-0 card-wrapper"
        defaultActiveKey={isMobile ? undefined : '1'}
        items={[{ children: <ConfigSearch {...searchProps} />, key: '1', label: '查询条件' }]}
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
              addText="新增参数"
              batchDeleteText="批量删除"
              columns={columnChecks}
              disabledDelete={!selected.length}
              exportData={handleExport}
              exportText="导出"
              loading={tableProps.loading || deleteMutation.isPending || refreshMutation.isPending}
              refresh={handleRefresh}
              setColumnChecks={setColumnChecks}
              onDelete={() => handleDelete(selected)}
              suffix={
                <Button
                  danger
                  ghost
                  size="small"
                  onClick={handleRefreshCache}
                >
                  刷新缓存
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
              <Typography.Text strong>参数配置列表</Typography.Text>
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
              title="参数列表加载失败"
              type="error"
            />
          ) : null}
          <Table<ConfigRecord>
            {...tableProps}
            column={{ align: 'center' }}
            locale={{
              emptyText: (
                <Empty
                  description={hasFilters(searchParams) ? '没有找到符合条件的参数' : '当前还没有参数配置'}
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
          <ConfigEditorDrawer
            configId={editorState.configId}
            loading={saving}
            mode={editorState.mode}
            onClose={closeEditor}
            onSubmit={handleSubmit}
            open
          />
        ) : null}
      </Suspense>
    </div>
  );
};
function normalizeParams(params: ConfigTableParams): ConfigTableParams {
  return {
    ...params,
    configKey: params.configKey?.trim() || undefined,
    configName: params.configName?.trim() || undefined
  };
}
function useConfigTableQuery<Data = ConfigListPage>(
  params: ConfigTableParams,
  options?: TableQueryHookOptions<ConfigListPage, Data>
) {
  const { createdRange, ...listParams } = params;
  return useConfigListQuery(
    {
      ...listParams,
      rangeBegin: createdRange?.[0]?.format('YYYY-MM-DD HH:mm:ss'),
      rangeEnd: createdRange?.[1]?.format('YYYY-MM-DD HH:mm:ss')
    },
    options
  );
}
function hasFilters(params: Partial<ConfigTableParams>) {
  return Boolean(params.configKey || params.configName || params.configType || params.createdRange);
}
export const Route = createFileRoute('/(admin)/system/config/')({
  component: ConfigManagement,
  staticData: { keepAlive: true, menu: { icon: 'ph:sliders-horizontal', order: 5 }, title: '参数配置' }
});

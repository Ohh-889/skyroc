import { downloadFileFromBlob } from '@skyroc/utils/web';
import { useAdminState } from '@shell/layouts';
import { TableHeaderOperation, useTable, useTableScroll } from '@shell/ui/compose';
import type { TableColumn, TableDataWithIndex } from '@shell/ui/compose';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, getRouteApi, useNavigate } from '@tanstack/react-router';
import { Alert, Button, Card, Collapse, Empty, Flex, Table, Tag, Typography } from 'antd';
import type { Key } from 'react';
import { Suspense, lazy, useEffect, useMemo, useState } from 'react';

import { deleteModal } from '@/features/antd/deleteModal';
import {
  SYSTEM_DICT_QUERY_KEYS,
  useCreateDictDataMutation,
  useCreateDictTypeMutation,
  useDeleteDictDataMutation,
  useDeleteDictTypesMutation,
  useDictDataQuery,
  useDictTypeOptionsQuery,
  useDictTypesQuery,
  useRefreshDictCacheMutation,
  useUpdateDictDataMutation,
  useUpdateDictTypeMutation
} from '@/service/api/system-dict';
import type {
  DictDataItem,
  DictDataListParams,
  DictDataSavePayload,
  DictDataUpdatePayload,
  DictId,
  DictListPage,
  DictTypeItem,
  DictTypeListParams,
  DictTypeSavePayload,
  DictTypeUpdatePayload
} from '@/service/api/system-dict';
import { exportDictData, exportDictTypes } from '@/service/api/system-dict/api';

import DictDataSearch from './modules/DictDataSearch';
import {
  DictSearchSchema,
  getDictDataSearchInitialParams,
  getDictTypeSearchInitialParams,
  toDictDataSearchQuery,
  toDictTypeSearchQuery
} from './modules/shared';
import DictTypePanel from './modules/DictTypePanel';

const DictDataEditorDrawer = lazy(() => import('./modules/DictDataEditorDrawer'));
const DictTypeEditorDrawer = lazy(() => import('./modules/DictTypeEditorDrawer'));

const dictRouteApi = getRouteApi('/(admin)/system/dict/');
const DATA_TABLE_SCROLL_X = 760;
type DictDataTableRecord = TableDataWithIndex<DictDataItem>;

interface DictManagementProps {
  /** 页面首次加载时使用的分页大小。 */
  initialPageSize?: number;
}

interface EditorState<T extends DictId = DictId> {
  id?: T;
  mode: 'create' | 'update';
  open: boolean;
}

const INITIAL_EDITOR_STATE: EditorState = { mode: 'create', open: false };

const DictManagement = (props: DictManagementProps) => {
  const { initialPageSize = 10 } = props;
  const routeSearch = dictRouteApi.useSearch();
  const routeDictType = routeSearch.dictType;
  const navigate = useNavigate({ from: '/system/dict/' });
  const queryClient = useQueryClient();
  const { isMobile } = useAdminState();
  const { scrollConfig, tableWrapperRef } = useTableScroll(DATA_TABLE_SCROLL_X);
  const [selectedType, setSelectedType] = useState<DictTypeItem>();
  const [selectedDataKeys, setSelectedDataKeys] = useState<Key[]>([]);
  const [typeEditor, setTypeEditor] = useState<EditorState>(INITIAL_EDITOR_STATE);
  const [dataEditor, setDataEditor] = useState<EditorState>(INITIAL_EDITOR_STATE);
  const [typeExporting, setTypeExporting] = useState(false);
  const [dataExporting, setDataExporting] = useState(false);
  const typeOptionsQuery = useDictTypeOptionsQuery();

  // 两张表共用一条地址栏，各自只覆盖自己那几个 key，别把对方的条件冲掉。
  const typeTable = useTable<DictTypeListParams, DictListPage<DictTypeItem>, DictTypeItem>({
    apiParams: getDictTypeSearchInitialParams(routeSearch, initialPageSize),
    columns: createTypeColumns,
    onSearchParamsChange: params => navigate({ search: prev => ({ ...prev, ...toDictTypeSearchQuery(params) }) }),
    pagination: { pageSizeOptions: [10, 20, 50], showSizeChanger: false, showTotal: total => `共 ${total} 条` },
    queryHook: useDictTypesQuery,
    rowKey: item => String(item.dictId)
  });

  const dataTable = useTable<DictDataListParams, DictListPage<DictDataItem>, DictDataItem>({
    apiParams: getDictDataSearchInitialParams(routeSearch, initialPageSize),
    columns: createDataColumns,
    onSearchParamsChange: params => navigate({ search: prev => ({ ...prev, ...toDictDataSearchQuery(params) }) }),
    pagination: { pageSizeOptions: [10, 20, 50], showQuickJumper: true, showTotal: total => `共 ${total} 条` },
    queryHook: useDictDataQuery,
    rowKey: item => String(item.dictCode)
  });

  const createTypeMutation = useCreateDictTypeMutation();
  const updateTypeMutation = useUpdateDictTypeMutation();
  const deleteTypeMutation = useDeleteDictTypesMutation();
  const createDataMutation = useCreateDictDataMutation();
  const updateDataMutation = useUpdateDictDataMutation();
  const deleteDataMutation = useDeleteDictDataMutation();
  const refreshMutation = useRefreshDictCacheMutation();

  const data = dataTable.data;

  const selectedData = data.filter(item => selectedDataKeys.map(String).includes(String(item.dictCode)));

  const typeOptions = useMemo(
    () =>
      (typeOptionsQuery.data ?? []).map(item => ({
        label: `${item.dictName}（${item.dictType}）`,
        value: item.dictType
      })),
    [typeOptionsQuery.data]
  );

  const saving =
    createTypeMutation.isPending ||
    updateTypeMutation.isPending ||
    createDataMutation.isPending ||
    updateDataMutation.isPending;

  useEffect(() => {
    if (selectedType || !typeOptionsQuery.data?.length) return;
    setSelectedType(typeOptionsQuery.data.find(item => item.dictType === routeDictType) ?? typeOptionsQuery.data[0]);
  }, [routeDictType, selectedType, typeOptionsQuery.data]);

  useEffect(() => {
    dataTable.updateSearchParams({ current: 1, dictType: selectedType?.dictType });
    setSelectedDataKeys([]);
  }, [selectedType?.dictType]);

  function createDataColumns(): TableColumn<DictDataTableRecord>[] {
    return [
      {
        dataIndex: 'dictLabel',
        key: 'dictLabel',
        render: (value, item) => (
          <Tag color={item.listClass && item.listClass !== 'default' ? item.listClass : undefined}>{value}</Tag>
        ),
        title: '字典标签',
        width: 150
      },
      { dataIndex: 'dictValue', key: 'dictValue', title: '字典键值', width: 140 },
      { dataIndex: 'dictSort', key: 'dictSort', title: '字典排序', width: 100 },
      {
        dataIndex: 'remark',
        key: 'remark',
        render: value => value || <span className="text-tertiary">—</span>,
        title: '备注'
      },
      { dataIndex: 'createTime', key: 'createTime', title: '创建时间', width: 180 },
      {
        fixed: 'right',
        key: 'actions',
        render: (_value, item) => (
          <Flex
            justify="end"
            gap={4}
          >
            <Button
              size="small"
              onClick={() => setDataEditor({ id: item.dictCode, mode: 'update', open: true })}
            >
              编辑
            </Button>
            <Button
              danger
              size="small"
              onClick={() => removeData([item])}
            >
              删除
            </Button>
          </Flex>
        ),
        title: '操作',
        width: 100
      }
    ];
  }

  function selectType(item: DictTypeItem) {
    setSelectedType(item);
    navigate({ search: prev => ({ ...prev, dictType: item.dictType }) });
  }

  /**
   * 字典数据的重置。
   *
   * 不能直接用表格 Hook 的 reset：它把表单清回 apiParams，而这一页的 apiParams 是从 URL 还原出来的， 清了等于又把 URL
   * 上那个关键词填回去。这里显式清空。
   */
  function resetDataSearch() {
    dataTable.searchProps.form.setFieldsValue({ dictLabel: undefined });
    dataTable.updateSearchParams({ current: 1, dictLabel: undefined });
  }

  function removeTypes(item: DictTypeItem) {
    deleteModal({
      content: '删除后不可恢复，存在字典数据的类型将无法删除。',
      okText: '删除字典类型',
      title: `删除“${item.dictName}”？`,
      onOk: async () => {
        await deleteTypeMutation.mutateAsync([item.dictId]);
        await queryClient.invalidateQueries({ queryKey: SYSTEM_DICT_QUERY_KEYS.ALL });
      }
    });
  }

  function removeData(items: DictDataItem[]) {
    deleteModal({
      content: '删除后不可恢复。',
      okText: `删除 ${items.length} 条数据`,
      title: `删除已选的 ${items.length} 条数据？`,
      onOk: async () => {
        await deleteDataMutation.mutateAsync(items.map(item => item.dictCode));
        setSelectedDataKeys([]);
        await queryClient.invalidateQueries({ queryKey: SYSTEM_DICT_QUERY_KEYS.ALL });
      }
    });
  }

  async function saveType(values: DictTypeSavePayload) {
    const payload = {
      ...values,
      dictName: values.dictName.trim(),
      dictType: values.dictType.trim(),
      remark: values.remark?.trim() || null
    };
    if (typeEditor.mode === 'create') await createTypeMutation.mutateAsync(payload);
    else await updateTypeMutation.mutateAsync({ ...payload, dictId: typeEditor.id as DictId } as DictTypeUpdatePayload);
    setTypeEditor(INITIAL_EDITOR_STATE);
    await queryClient.invalidateQueries({ queryKey: SYSTEM_DICT_QUERY_KEYS.ALL });
    showSuccessMessage('字典类型已保存');
  }

  async function saveData(values: DictDataSavePayload) {
    if (!selectedType) return;
    if (dataEditor.mode === 'create')
      await createDataMutation.mutateAsync({ ...values, dictType: selectedType.dictType });
    else
      await updateDataMutation.mutateAsync({
        ...values,
        dictCode: dataEditor.id as DictId,
        dictType: selectedType.dictType
      } as DictDataUpdatePayload);
    setDataEditor(INITIAL_EDITOR_STATE);
    await queryClient.invalidateQueries({ queryKey: SYSTEM_DICT_QUERY_KEYS.ALL });
    showSuccessMessage('字典数据已保存');
  }

  async function refreshAll() {
    await Promise.all([typeTable.getData(), dataTable.getData(), typeOptionsQuery.refetch()]);
    setSelectedDataKeys([]);
    showSuccessMessage('字典数据已刷新');
  }

  async function handleExportTypes() {
    setTypeExporting(true);
    try {
      const { current: _current, size: _size, ...params } = typeTable.searchProps.searchParams;
      const blob = await exportDictTypes(params);
      downloadFileFromBlob({ fileName: '字典类型.xlsx', source: blob });
    } finally {
      setTypeExporting(false);
    }
  }

  async function handleExportData() {
    if (!selectedType) return;
    setDataExporting(true);
    try {
      const { current: _current, size: _size, ...params } = dataTable.searchProps.searchParams;
      const blob = await exportDictData({ ...params, dictType: selectedType.dictType });
      downloadFileFromBlob({ fileName: '字典数据.xlsx', source: blob });
    } finally {
      setDataExporting(false);
    }
  }

  return (
    <div className="h-full min-h-500px flex flex-col gap-16px overflow-hidden lt-xl:overflow-auto">
      <div className="min-h-0 grid flex-1 grid-cols-[300px_minmax(0,1fr)] gap-16px lt-xl:grid-cols-1">
        <DictTypePanel
          onAdd={() => setTypeEditor({ mode: 'create', open: true })}
          exportLoading={typeExporting}
          onExport={handleExportTypes}
          onDelete={removeTypes}
          onEdit={item => setTypeEditor({ id: item.dictId, mode: 'update', open: true })}
          defaultKeyword={routeSearch.dictName}
          onSearch={dictName => typeTable.updateSearchParams({ current: 1, dictName })}
          onRefresh={typeTable.getData}
          onSelect={selectType}
          selectedTypeId={selectedType?.dictId}
          tableProps={typeTable.tableProps}
        />
        <div className="h-full min-h-0 min-w-0 flex flex-col gap-16px">
          <Collapse
            bordered={false}
            className="shrink-0 card-wrapper"
            defaultActiveKey={isMobile ? undefined : '1'}
            items={[
              {
                children: (
                  <DictDataSearch
                    disabled={!selectedType}
                    searchProps={{ ...dataTable.searchProps, reset: resetDataSearch }}
                  />
                ),
                key: '1',
                label: '查询条件'
              }
            ]}
          />
          <div
            className="min-h-0 min-w-0 flex flex-1 flex-col"
            ref={tableWrapperRef}
          >
            <Card
              className="min-h-0 min-w-0 flex flex-1 flex-col card-wrapper"
              extra={
                <TableHeaderOperation
                  add={() => selectedType && setDataEditor({ mode: 'create', open: true })}
                  addText="新增"
                  batchDeleteText="批量删除"
                  columns={dataTable.columnChecks}
                  disabledDelete={!selectedData.length}
                  exportData={handleExportData}
                  exportLoading={dataExporting}
                  loading={dataTable.tableProps.loading || refreshMutation.isPending}
                  refresh={refreshAll}
                  setColumnChecks={dataTable.setColumnChecks}
                  onDelete={() => removeData(selectedData)}
                />
              }
              title={
                <Flex
                  align="center"
                  gap={8}
                >
                  <Typography.Text strong>字典列表</Typography.Text>
                  <Typography.Text type="secondary">
                    {selectedType ? `${selectedType.dictName}（${selectedType.dictType}）` : '请选择字典类型'}
                  </Typography.Text>
                </Flex>
              }
              variant="borderless"
            >
              {dataTable.query.isError ? (
                <Alert
                  className="mb-12px"
                  title="字典数据加载失败"
                  showIcon
                  type="error"
                />
              ) : null}
              <Table<DictDataTableRecord>
                {...dataTable.tableProps}
                column={{ align: 'center' }}
                locale={{
                  emptyText: (
                    <Empty
                      description={selectedType ? '当前类型暂无字典数据' : '请先选择字典类型'}
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  )
                }}
                rowSelection={{ align: 'center', selectedRowKeys: selectedDataKeys, onChange: setSelectedDataKeys }}
                scroll={scrollConfig}
                size="small"
              />
            </Card>
          </div>
        </div>
      </div>

      <Suspense fallback={null}>
        <DictTypeEditorDrawer
          dictId={typeEditor.id}
          loading={saving}
          mode={typeEditor.mode}
          open={typeEditor.open}
          onClose={() => setTypeEditor(INITIAL_EDITOR_STATE)}
          onSubmit={saveType}
        />

        <DictDataEditorDrawer
          dictCode={dataEditor.id}
          dictType={selectedType?.dictType ?? ''}
          loading={saving}
          mode={dataEditor.mode}
          open={dataEditor.open}
          typeOptions={typeOptions}
          onClose={() => setDataEditor(INITIAL_EDITOR_STATE)}
          onSubmit={saveData}
        />
      </Suspense>
    </div>
  );
};

function createTypeColumns(): TableColumn<TableDataWithIndex<DictTypeItem>>[] {
  return [];
}

export const Route = createFileRoute('/(admin)/system/dict/')({
  component: DictManagement,
  validateSearch: DictSearchSchema,
  staticData: { keepAlive: true, menu: { icon: 'ph:book-open-text', order: 8 }, title: '字典管理' }
});

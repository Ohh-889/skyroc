import { downloadFileFromBlob } from '@skyroc/utils/web';
import { useAdminState } from '@shell/layouts';
import { showConfirmModal, showSuccessMessage } from '@shell/theme';
import { SvgIcon, TableHeaderOperation, useTable, useTableScroll } from '@shell/ui/compose';
import type { TableColumn, TableDataWithIndex } from '@shell/ui/compose';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useLocation, useNavigate } from '@tanstack/react-router';
import { Alert, Badge, Button, Card, Collapse, Dropdown, Empty, Flex, Table, Tag, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { Suspense, lazy, useState } from 'react';
import type { Key } from 'react';

import { deleteModal } from '@/features/antd/deleteModal';
import {
  SYSTEM_TENANT_PACKAGE_QUERY_KEYS,
  exportTenantPackages,
  useCreateTenantPackageMutation,
  useDeleteTenantPackagesMutation,
  useTenantPackageListQuery,
  useUpdateTenantPackageMutation,
  useUpdateTenantPackageStatusMutation
} from '@/service/api/system-tenant-package';
import type {
  TenantPackageId,
  TenantPackageItem,
  TenantPackageListPage,
  TenantPackageListParams,
  TenantPackageStatus
} from '@/service/api/system-tenant-package';

import { formatTenantMinute } from '../modules/tenant-utils';

import {
  TENANT_PACKAGE_DELETE_LIMIT,
  TenantPackageSearchSchema,
  formatPackageMenuScope,
  getTenantPackageSearchInitialParams,
  hasTenantPackageFilters,
  normalizeTenantPackageSearchParams,
  toTenantPackageSearchQuery
} from './modules/tenant-package-utils';
import type { TenantPackageEditorMode, TenantPackageEditorSubmitValues } from './modules/TenantPackageEditorDrawer';
import TenantPackageSearch from './modules/TenantPackageSearch';

const TenantPackageDetailDrawer = lazy(() => import('./modules/TenantPackageDetailDrawer'));
const TenantPackageEditorDrawer = lazy(() => import('./modules/TenantPackageEditorDrawer'));

const TENANT_PACKAGE_TABLE_SCROLL_X = 1080;
interface TenantPackageEditorState {
  mode: TenantPackageEditorMode;
  open: boolean;
  packageId?: TenantPackageId;
}

const INITIAL_EDITOR_STATE: TenantPackageEditorState = { mode: 'create', open: false };

type TenantPackageTableRecord = TableDataWithIndex<TenantPackageItem>;

interface TenantPackageManagementProps {
  /** 页面首次加载时使用的分页大小。 */
  initialPageSize?: number;
}

const TenantPackageManagement = (props: TenantPackageManagementProps) => {
  const { initialPageSize = 10 } = props;

  const navigate = useNavigate({ from: '/tenant/package/' });
  const location = useLocation();
  const queryClient = useQueryClient();
  const { isMobile } = useAdminState();
  const { scrollConfig, tableWrapperRef } = useTableScroll(TENANT_PACKAGE_TABLE_SCROLL_X);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [editorState, setEditorState] = useState<TenantPackageEditorState>(INITIAL_EDITOR_STATE);
  const [detailPackageId, setDetailPackageId] = useState<TenantPackageId>();
  const [exporting, setExporting] = useState(false);

  const createMutation = useCreateTenantPackageMutation();
  const updateMutation = useUpdateTenantPackageMutation();
  const statusMutation = useUpdateTenantPackageStatusMutation();
  const deleteMutation = useDeleteTenantPackagesMutation();

  const {
    columnChecks,
    data,
    getData,
    pageNum,
    query,
    searchProps,
    setColumnChecks,
    tableProps,
    total,
    updateSearchParams
  } = useTable<TenantPackageListParams, TenantPackageListPage, TenantPackageItem>({
    apiParams: getTenantPackageSearchInitialParams(initialPageSize),
    columns: createColumns,
    isMobile,
    onSearchParamsChange: syncSearchParams,
    pagination: {
      pageSizeOptions: [10, 20, 50, 100],
      showQuickJumper: true,
      showTotal: value => `共 ${value} 条`
    },
    queryHook: useTenantPackageListQuery,
    // 查询条件写在 URL 上，刷新和分享链接都能回到同一屏
    routeSearch: location.searchStr,
    rowKey: item => String(item.packageId),
    transformParams: normalizeTenantPackageSearchParams
  });

  const packages = data;
  const saving = createMutation.isPending || updateMutation.isPending;
  const hasActiveFilters = hasTenantPackageFilters(searchProps.searchParams);
  const selectedPackages = packages.filter(item => selectedRowKeys.map(String).includes(String(item.packageId)));

  /** 把提交后的查询条件写回地址栏，刷新后由 routeSearch 原样读回来。 */
  function syncSearchParams(params: Partial<TenantPackageListParams>) {
    navigate({ search: () => toTenantPackageSearchQuery(params) });
  }

  function createColumns(): TableColumn<TenantPackageTableRecord>[] {
    return [
      {
        dataIndex: 'packageName',
        fixed: 'left',
        key: 'packageName',
        render: (value: string, item) => (
          <div className="text-left">
            <Typography.Text
              className="block font-600"
              ellipsis={{ tooltip: value }}
            >
              {value || '未命名套餐'}
            </Typography.Text>
            <Typography.Text
              className="block font-mono text-12px"
              type="secondary"
            >
              #{item.packageId}
            </Typography.Text>
          </div>
        ),
        title: '套餐',
        width: 220
      },
      {
        dataIndex: 'menuIds',
        key: 'menuIds',
        render: (value: number[]) =>
          value?.length ? (
            <Tag className="m-0">{formatPackageMenuScope(value)}</Tag>
          ) : (
            <span className="text-tertiary">未授权菜单</span>
          ),
        title: '菜单范围',
        width: 140
      },
      {
        dataIndex: 'menuCheckStrictly',
        key: 'menuCheckStrictly',
        render: (value: boolean) => (value ? '父子联动' : '独立选择'),
        title: '选择方式',
        width: 120
      },
      {
        dataIndex: 'remark',
        key: 'remark',
        render: (value: null | string) =>
          value?.trim() ? (
            <Typography.Text
              className="block text-left"
              ellipsis={{ tooltip: value }}
            >
              {value}
            </Typography.Text>
          ) : (
            <span className="text-tertiary">—</span>
          ),
        title: '备注',
        width: 220
      },
      {
        dataIndex: 'status',
        key: 'status',
        render: (value: TenantPackageStatus) => (
          <Badge
            status={value === '0' ? 'success' : 'error'}
            text={value === '0' ? '正常' : '停用'}
          />
        ),
        title: '状态',
        width: 110
      },
      {
        dataIndex: 'createTime',
        key: 'createTime',
        render: value => formatTenantMinute(value) || <span className="text-tertiary">—</span>,
        title: '创建时间',
        width: 160
      },
      {
        fixed: 'right',
        key: 'actions',
        render: (_value, item) => renderPackageActions(item),
        title: '操作',
        width: 190
      }
    ];
  }

  function renderPackageActions(item: TenantPackageItem) {
    return (
      <div className="flex-center justify-end gap-8px">
        <Button
          size="small"
          onClick={() => setDetailPackageId(item.packageId)}
        >
          详情
        </Button>
        <Button
          size="small"
          onClick={() => handleEdit(item)}
        >
          编辑
        </Button>
        <Dropdown
          menu={{ items: createMoreMenu(item) }}
          placement="bottomRight"
          trigger={['click']}
        >
          <Button
            aria-label={`${item.packageName || `套餐 #${item.packageId}`}的更多操作`}
            icon={<SvgIcon icon="ph:dots-three" />}
            size="small"
          />
        </Dropdown>
      </div>
    );
  }

  function createMoreMenu(item: TenantPackageItem): MenuProps['items'] {
    return [
      {
        icon: <SvgIcon icon="ph:buildings" />,
        key: 'tenants',
        // 只切页面，不带筛选条件过去：租户页的查询参数不进 URL，带过去也不会生效
        label: '去租户页查看占用',
        onClick: () => navigate({ to: '/tenant/list' })
      },
      { type: 'divider' },
      {
        icon: <SvgIcon icon={item.status === '0' ? 'ph:prohibit' : 'ph:check-circle'} />,
        key: 'status',
        label: item.status === '0' ? '停用套餐' : '启用套餐',
        onClick: () => handleStatusChange(item)
      },
      {
        danger: true,
        icon: <SvgIcon icon="ph:trash" />,
        key: 'delete',
        label: '删除套餐',
        onClick: () => handleDelete([item])
      }
    ];
  }

  function handleAdd() {
    setEditorState({ mode: 'create', open: true });
  }

  function handleEdit(item: TenantPackageItem) {
    setEditorState({ mode: 'update', open: true, packageId: item.packageId });
  }

  function handleCloseEditor() {
    if (!saving) setEditorState(INITIAL_EDITOR_STATE);
  }

  async function handleSubmit(values: TenantPackageEditorSubmitValues) {
    if (values.mode === 'create') {
      await createMutation.mutateAsync(values.payload);
      setEditorState(INITIAL_EDITOR_STATE);
      updateSearchParams({ current: 1 });
      await invalidatePackageData();
      showSuccessMessage(`套餐「${values.payload.packageName}」已新增`);
      return;
    }

    await updateMutation.mutateAsync(values.payload);
    setEditorState(INITIAL_EDITOR_STATE);
    await invalidatePackageData();

    // 改完菜单不会自动重算存量租户，这一步必须由人去租户页做，光提示"已保存"会让人以为生效了
    showConfirmModal({
      closable: true,
      content: `已经挂在这个套餐上的租户，权限不会自动跟着变。要让改动生效，需要到租户管理页按“套餐 = ${values.payload.packageName}”筛出这些租户，对每一家执行一次“同步套餐”。`,
      okText: '去租户管理',
      cancelText: '稍后处理',
      title: `套餐「${values.payload.packageName}」已更新`,
      onOk: () => navigate({ to: '/tenant/list' })
    });
  }

  function handleStatusChange(item: TenantPackageItem) {
    const nextStatus: TenantPackageStatus = item.status === '0' ? '1' : '0';
    const actionLabel = nextStatus === '1' ? '停用' : '启用';

    showConfirmModal({
      closable: true,
      content:
        nextStatus === '1'
          ? '停用后新增租户时选不到这个套餐。已经在使用它的租户不受影响，权限一项都不会变。'
          : '启用后这个套餐会重新出现在新增租户的套餐下拉里。',
      okButtonProps: { danger: nextStatus === '1', loading: statusMutation.isPending },
      okText: `确认${actionLabel}`,
      title: `${actionLabel}「${item.packageName || `套餐 #${item.packageId}`}」？`,
      onOk: async () => {
        await statusMutation.mutateAsync({ packageId: Number(item.packageId), status: nextStatus });
        await invalidatePackageData();
        showSuccessMessage(`套餐已${actionLabel}`);
      }
    });
  }

  function handleDelete(targetPackages: TenantPackageItem[]) {
    const isBatch = targetPackages.length > 1;

    deleteModal({
      okText: isBatch ? `删除 ${targetPackages.length} 个套餐` : '删除套餐',
      title: isBatch
        ? `删除已选择的 ${targetPackages.length} 个套餐？`
        : `删除「${targetPackages[0].packageName || `套餐 #${targetPackages[0].packageId}`}」？`,
      content: (
        <div className="flex flex-col gap-8px">
          <div>这是软删除，但当前没有恢复接口，请当成不可撤销的操作。</div>
          <div>只要还有租户挂在某个套餐上，后端就会拒绝，并且整批都不会删除。</div>
          {isBatch ? <div>失败时选择会保留，可以先去租户页按套餐筛出占用它的租户。</div> : null}
        </div>
      ),
      onOk: () => deletePackageRecords(targetPackages)
    });
  }

  function handleBatchDelete() {
    if (selectedPackages.length === 0) return;

    if (selectedPackages.length > TENANT_PACKAGE_DELETE_LIMIT) {
      showConfirmModal({
        content: `一次最多删除 ${TENANT_PACKAGE_DELETE_LIMIT} 个套餐，当前选中了 ${selectedPackages.length} 个，请分批处理。`,
        okCancel: false,
        okText: '知道了',
        title: '选中的套餐过多'
      });
      return;
    }

    handleDelete(selectedPackages);
  }

  async function deletePackageRecords(targetPackages: TenantPackageItem[]) {
    // 后端整批失败时保留选择，用户可以直接去租户页排查是哪个套餐还被占用
    await deleteMutation.mutateAsync(targetPackages.map(item => item.packageId));

    setSelectedRowKeys([]);
    setDetailPackageId(undefined);

    if (pageNum > 1 && targetPackages.length >= packages.length) {
      updateSearchParams({ current: pageNum - 1 });
    }

    await invalidatePackageData();
    showSuccessMessage(targetPackages.length > 1 ? '所选套餐已删除' : '套餐已删除');
  }

  async function handleExport() {
    setExporting(true);

    try {
      const { current: _current, size: _size, ...exportParams } = normalizeTenantPackageSearchParams(searchProps.searchParams);

      const blob = await exportTenantPackages(exportParams);

      downloadFileFromBlob({ fileName: '租户套餐.xlsx', source: blob });
    } finally {
      setExporting(false);
    }
  }

  async function handleRefresh() {
    await getData();
    setSelectedRowKeys([]);
  }

  async function invalidatePackageData() {
    await queryClient.invalidateQueries({ queryKey: SYSTEM_TENANT_PACKAGE_QUERY_KEYS.ALL });
  }

  return (
    <div className="h-full min-h-500px flex flex-col gap-16px overflow-hidden lt-sm:overflow-auto">
      <Alert
        className="shrink-0"
        showIcon
        type="info"
        description="套餐是可复用的菜单授权模板，决定一家租户最多能看到哪些菜单。改动套餐不会自动作用到存量租户，需要在租户管理页显式同步。"
        title="套餐只是模板，不直接改变租户权限"
        action={
          <Button
            icon={<SvgIcon icon="ph:buildings" />}
            size="small"
            onClick={() => navigate({ to: '/tenant/list' })}
          >
            查看租户
          </Button>
        }
      />

      <Collapse
        bordered={false}
        className="shrink-0 card-wrapper"
        defaultActiveKey={isMobile ? undefined : '1'}
        items={[
          {
            children: <TenantPackageSearch {...searchProps} />,
            key: '1',
            label: '查询条件'
          }
        ]}
      />

      <div
        className="min-h-0 flex flex-1 flex-col"
        ref={tableWrapperRef}
      >
        <Card
          className="min-h-0 min-w-0 flex flex-1 flex-col card-wrapper"
          variant="borderless"
          extra={
            <TableHeaderOperation
              columns={columnChecks}
              exportData={handleExport}
              exportLoading={exporting}
              loading={tableProps.loading}
              refresh={handleRefresh}
              setColumnChecks={setColumnChecks}
            >
              <Button
                ghost
                icon={<SvgIcon icon="ic:round-plus" />}
                size="small"
                type="primary"
                onClick={handleAdd}
              >
                新增套餐
              </Button>
              <Button
                danger
                ghost
                disabled={selectedPackages.length === 0}
                icon={<SvgIcon icon="ic:round-delete" />}
                size="small"
                onClick={handleBatchDelete}
              >
                批量删除
              </Button>
            </TableHeaderOperation>
          }
          title={
            <Flex
              align="center"
              gap={8}
              wrap="wrap"
            >
              <Typography.Text strong>套餐列表</Typography.Text>
              <Typography.Text type="secondary">
                {hasActiveFilters ? '命中' : '共'} {total} 个套餐
              </Typography.Text>
              {selectedRowKeys.length > 0 ? (
                <Tag
                  color="geekblue"
                  variant="filled"
                >
                  已选 {selectedRowKeys.length} 项
                </Tag>
              ) : null}
            </Flex>
          }
        >
          {query.isError ? (
            <Alert
              className="mb-12px"
              showIcon
              type="error"
              description={resolveListErrorDescription(query.error)}
              title="套餐列表加载失败"
              action={
                <Button
                  size="small"
                  onClick={getData}
                >
                  重新加载
                </Button>
              }
            />
          ) : null}

          <Table<TenantPackageTableRecord>
            {...tableProps}
            column={{ align: 'center' }}
            scroll={scrollConfig}
            size="small"
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    hasActiveFilters
                      ? '没有找到符合条件的套餐'
                      : '还没有套餐。至少建一个正常状态的套餐，才能开通新的租户'
                  }
                />
              )
            }}
            rowSelection={{
              align: 'center',
              preserveSelectedRowKeys: false,
              selectedRowKeys,
              onChange: setSelectedRowKeys
            }}
          />
        </Card>
      </div>

      <Suspense fallback={null}>
        <TenantPackageDetailDrawer
          open={Boolean(detailPackageId)}
          packageId={detailPackageId}
          onClose={() => setDetailPackageId(undefined)}
          onEdit={() => {
            const packageId = detailPackageId;

            setDetailPackageId(undefined);
            setEditorState({ mode: 'update', open: true, packageId });
          }}
        />

        <TenantPackageEditorDrawer
          loading={saving}
          mode={editorState.mode}
          open={editorState.open}
          packageId={editorState.packageId}
          onClose={handleCloseEditor}
          onSubmit={handleSubmit}
        />
      </Suspense>
    </div>
  );
};

/** 整个 /system/tenant 路由族只在后端开启多租户时才挂载，关着的时候是 404 而不是空列表。 */
function resolveListErrorDescription(error: unknown) {
  const httpStatus = (error as { response?: { status?: number } })?.response?.status;

  if (httpStatus === 404) return '当前部署没有启用多租户，租户套餐接口未挂载。需要开启请联系平台运维。';
  if (httpStatus === 403) return '当前账号缺少套餐查看权限，或者不是平台超级管理员。';

  return '请检查网络后重试；筛选条件和已选项都已保留。';
}

export const Route = createFileRoute('/(admin)/tenant/package/')({
  component: TenantPackageManagement,
  staticData: {
    keepAlive: true,
    menu: {
      icon: 'ph:package',
      order: 2
    },
    title: '租户套餐'
  },
  validateSearch: TenantPackageSearchSchema
});

import { useAdminState } from '@shell/layouts';
import { showConfirmModal, showSuccessMessage, showSuccessModal } from '@shell/theme';
import { SvgIcon, TableHeaderOperation, useTable, useTableScroll } from '@shell/ui/compose';
import type { TableColumn, TableDataWithIndex } from '@shell/ui/compose';
import { downloadFileFromBlob } from '@skyroc/utils/web';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useLocation, useNavigate } from '@tanstack/react-router';
import { Alert, Badge, Button, Card, Collapse, Dropdown, Empty, Flex, Table, Tag, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { Suspense, lazy, useState } from 'react';
import type { Key } from 'react';

import { deleteModal } from '@/features/antd/deleteModal';
import {
  SYSTEM_TENANT_QUERY_KEYS,
  exportTenants,
  useCreateTenantMutation,
  useDeleteTenantsMutation,
  useSyncTenantConfigMutation,
  useSyncTenantDictMutation,
  useSyncTenantPackageMutation,
  useTenantListQuery,
  useUpdateTenantMutation,
  useUpdateTenantStatusMutation
} from '@/service/api/system-tenant';
import type { TenantId, TenantItem, TenantListPage, TenantListParams, TenantStatus } from '@/service/api/system-tenant';
import { useTenantPackageOptionsQuery } from '@/service/api/system-tenant-package';

import {
  TENANT_DELETE_LIMIT,
  TenantSearchSchema,
  formatAccountCount,
  formatTenantMinute,
  getTenantSearchInitialParams,
  hasTenantFilters,
  isManagementTenant,
  normalizeTenantSearchParams,
  resolveTenantExpiry,
  resolveTenantExpiryColor,
  resolveTenantPackageName,
  toTenantSearchQuery
} from '../modules/tenant-utils';
import type { TenantEditorMode, TenantEditorSubmitValues } from '../modules/TenantEditorDrawer';
import TenantSearch from '../modules/TenantSearch';

const TenantDetailDrawer = lazy(() => import('../modules/TenantDetailDrawer'));
const TenantEditorDrawer = lazy(() => import('../modules/TenantEditorDrawer'));
const TenantSyncModal = lazy(() => import('../modules/TenantSyncModal'));

const TENANT_TABLE_SCROLL_X = 1280;
interface TenantEditorState {
  mode: TenantEditorMode;
  open: boolean;
  tenantId?: TenantId;
}

const INITIAL_EDITOR_STATE: TenantEditorState = { mode: 'create', open: false };

type TenantTableRecord = TableDataWithIndex<TenantItem>;

interface TenantManagementProps {
  /** 页面首次加载时使用的分页大小。 */
  initialPageSize?: number;
}

interface OverviewCardProps {
  /** 统计口径说明，避免被读成全平台数字。 */
  hint: string;
  /** 指标名称。 */
  label: string;
  /** 指标数值。 */
  value: number;
}

const OverviewCard = (props: OverviewCardProps) => {
  const { hint, label, value } = props;

  return (
    <Card
      className="min-w-180px flex-1 card-wrapper"
      size="small"
      variant="borderless"
    >
      <Flex
        align="center"
        gap={12}
        justify="space-between"
      >
        <div>
          <Typography.Text type="secondary">{label}</Typography.Text>
          <Typography.Text
            className="block text-12px"
            type="secondary"
          >
            {hint}
          </Typography.Text>
        </div>
        <Typography.Text className="text-22px font-700">{value}</Typography.Text>
      </Flex>
    </Card>
  );
};

const TenantManagement = (props: TenantManagementProps) => {
  const { initialPageSize = 10 } = props;

  const navigate = useNavigate({ from: '/tenant/list/' });
  const location = useLocation();
  const queryClient = useQueryClient();
  const { isMobile } = useAdminState();
  const { scrollConfig, tableWrapperRef } = useTableScroll(TENANT_TABLE_SCROLL_X);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [editorState, setEditorState] = useState<TenantEditorState>(INITIAL_EDITOR_STATE);
  const [detailTenantId, setDetailTenantId] = useState<TenantId>();
  const [syncOpen, setSyncOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  const packageOptionsQuery = useTenantPackageOptionsQuery();
  const createMutation = useCreateTenantMutation();
  const updateMutation = useUpdateTenantMutation();
  const statusMutation = useUpdateTenantStatusMutation();
  const deleteMutation = useDeleteTenantsMutation();
  const syncPackageMutation = useSyncTenantPackageMutation();
  const syncDictMutation = useSyncTenantDictMutation();
  const syncConfigMutation = useSyncTenantConfigMutation();

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
  } = useTable<TenantListParams, TenantListPage, TenantItem>({
    apiParams: getTenantSearchInitialParams(initialPageSize),
    columns: createColumns,
    isMobile,
    onSearchParamsChange: syncSearchParams,
    pagination: {
      pageSizeOptions: [10, 20, 50, 100],
      showQuickJumper: true,
      showTotal: value => `共 ${value} 条`
    },
    queryHook: useTenantListQuery,
    // 查询条件写在 URL 上，刷新和分享链接都能回到同一屏
    routeSearch: location.searchStr,
    rowKey: tenant => String(tenant.id),
    transformParams: normalizeTenantSearchParams
  });

  const tenants = data;
  const packageOptions = packageOptionsQuery.data ?? [];
  const saving = createMutation.isPending || updateMutation.isPending;
  const hasActiveFilters = hasTenantFilters(searchProps.searchParams);
  const selectedTenants = tenants.filter(tenant => selectedRowKeys.map(String).includes(String(tenant.id)));
  // 概览只统计已经加载到手里的这一页，标注清楚口径，不伪装成全量统计
  const overview = {
    disabled: tenants.filter(tenant => tenant.status === '1').length,
    expiring: tenants.filter(tenant => {
      const level = resolveTenantExpiry(tenant.expireTime).level;

      return level === 'expired' || level === 'warning';
    }).length,
    normal: tenants.filter(tenant => tenant.status === '0').length
  };

  /** 把提交后的查询条件写回地址栏，刷新后由 routeSearch 原样读回来。 */
  function syncSearchParams(params: Partial<TenantListParams>) {
    navigate({ search: () => toTenantSearchQuery(params) });
  }

  function createColumns(): TableColumn<TenantTableRecord>[] {
    return [
      {
        dataIndex: 'companyName',
        fixed: 'left',
        key: 'companyName',
        render: (value: string, tenant) => (
          <div className="text-left">
            <Flex
              align="center"
              gap={7}
            >
              <Typography.Text
                className="truncate font-600"
                ellipsis={{ tooltip: value }}
              >
                {value || '未命名企业'}
              </Typography.Text>
              {isManagementTenant(tenant) ? (
                <Tag
                  className="m-0 text-10px"
                  color="gold"
                  variant="filled"
                >
                  平台基座
                </Tag>
              ) : null}
            </Flex>
            <Typography.Text
              className="block font-mono text-12px"
              type="secondary"
            >
              {tenant.tenantId}
            </Typography.Text>
          </div>
        ),
        title: '企业 / 租户编号',
        width: 240
      },
      {
        dataIndex: 'contactUserName',
        key: 'contactUserName',
        render: (value: string, tenant) => (
          <div className="text-left">
            <Typography.Text className="block">{value || '—'}</Typography.Text>
            <Typography.Text
              className="block text-12px"
              type="secondary"
            >
              {tenant.contactPhone || '—'}
            </Typography.Text>
          </div>
        ),
        title: '联系方式',
        width: 170
      },
      {
        dataIndex: 'packageId',
        key: 'packageId',
        render: (_value, tenant) => {
          const packageName = resolveTenantPackageName(packageOptions, tenant.packageId);

          return packageName ? (
            <Tag className="m-0">{packageName}</Tag>
          ) : (
            <span className="text-tertiary">未挂套餐</span>
          );
        },
        title: '套餐',
        width: 150
      },
      {
        dataIndex: 'accountCount',
        key: 'accountCount',
        render: (value: number) => formatAccountCount(value),
        title: '用户上限',
        width: 110
      },
      {
        dataIndex: 'expireTime',
        key: 'expireTime',
        render: (_value, tenant) => {
          const expiry = resolveTenantExpiry(tenant.expireTime);

          if (expiry.level === 'never') return <span className="text-tertiary">永不过期</span>;

          return (
            <div>
              <Typography.Text className={resolveTenantExpiryColor(expiry.level)}>{expiry.date}</Typography.Text>
              <Typography.Text
                className={`block text-12px ${resolveTenantExpiryColor(expiry.level) ?? ''}`}
                type={resolveTenantExpiryColor(expiry.level) ? undefined : 'secondary'}
              >
                {expiry.note}
              </Typography.Text>
            </div>
          );
        },
        title: '有效期',
        width: 150
      },
      {
        dataIndex: 'status',
        key: 'status',
        // 用状态点加文字而不是行内开关：停用租户是有影响的操作，不能一次误触就生效
        render: (value: TenantStatus) => (
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
        render: (_value, tenant) => renderTenantActions(tenant),
        title: '操作',
        width: 190
      }
    ];
  }

  function renderTenantActions(tenant: TenantItem) {
    const protectedTenant = isManagementTenant(tenant);

    if (protectedTenant) {
      return (
        <div className="flex-center justify-end gap-8px">
          <Button
            size="small"
            onClick={() => setDetailTenantId(tenant.id)}
          >
            详情
          </Button>
          <Tag
            color="warning"
            className="m-0"
          >
            系统保护
          </Tag>
        </div>
      );
    }

    return (
      <div className="flex-center justify-end gap-8px">
        <Button
          size="small"
          onClick={() => setDetailTenantId(tenant.id)}
        >
          详情
        </Button>
        <Button
          size="small"
          onClick={() => handleEdit(tenant)}
        >
          编辑
        </Button>
        <Dropdown
          menu={{ items: createMoreMenu(tenant) }}
          placement="bottomRight"
          trigger={['click']}
        >
          <Button
            aria-label={`${tenant.companyName || tenant.tenantId}的更多操作`}
            icon={<SvgIcon icon="ph:dots-three" />}
            size="small"
          />
        </Dropdown>
      </div>
    );
  }

  function createMoreMenu(tenant: TenantItem): MenuProps['items'] {
    return [
      {
        disabled: !tenant.packageId,
        icon: <SvgIcon icon="ph:arrows-clockwise" />,
        key: 'sync-package',
        label: '同步套餐',
        onClick: () => handleSyncPackage(tenant)
      },
      { type: 'divider' },
      {
        icon: <SvgIcon icon={tenant.status === '0' ? 'ph:prohibit' : 'ph:check-circle'} />,
        key: 'status',
        label: tenant.status === '0' ? '停用租户' : '启用租户',
        onClick: () => handleStatusChange(tenant)
      },
      {
        danger: true,
        icon: <SvgIcon icon="ph:trash" />,
        key: 'delete',
        label: '删除租户',
        onClick: () => handleDelete([tenant])
      }
    ];
  }

  function handleAdd() {
    setEditorState({ mode: 'create', open: true });
  }

  function handleEdit(tenant: TenantItem) {
    setEditorState({ mode: 'update', open: true, tenantId: tenant.id });
  }

  function handleCloseEditor() {
    if (!saving) setEditorState(INITIAL_EDITOR_STATE);
  }

  async function handleSubmit(values: TenantEditorSubmitValues) {
    if (values.mode === 'update') {
      await updateMutation.mutateAsync(values.payload);
      setEditorState(INITIAL_EDITOR_STATE);
      await invalidateTenantData();
      showSuccessMessage(`「${values.payload.companyName}」的资料已更新`);
      return;
    }

    const created = await createMutation.mutateAsync(values.payload);

    setEditorState(INITIAL_EDITOR_STATE);
    setSelectedRowKeys([]);
    updateSearchParams({ current: 1 });
    await invalidateTenantData();

    // 编号是服务端生成的，不当场显示出来，新租户的管理员就不知道登录时该选哪一家
    showSuccessModal({
      okText: '知道了',
      title: `「${created.companyName}」已开通`,
      content: (
        <div>
          <Typography.Paragraph className="mb-4px!">
            租户编号{' '}
            <Typography.Text
              copyable
              strong
            >
              {created.tenantId}
            </Typography.Text>
          </Typography.Paragraph>
          <Typography.Text type="secondary">
            请把编号和管理员账号一起交给对方，登录时需要用它选择租户。根部门、管理员角色和初始字典参数已一并创建。
          </Typography.Text>
        </div>
      )
    });
  }

  function handleSyncPackage(tenant: TenantItem) {
    showConfirmModal({
      closable: true,
      content:
        '按该租户当前的套餐重算所有角色的菜单授权：管理员角色整体替换成套餐里的菜单，其余角色只移除套餐之外的菜单。这不会更换租户的套餐，也不会返回进度。',
      okButtonProps: { loading: syncPackageMutation.isPending },
      okText: '开始同步',
      title: `同步「${tenant.companyName || tenant.tenantId}」的套餐授权？`,
      onOk: async () => {
        await syncPackageMutation.mutateAsync({
          packageId: Number(tenant.packageId),
          tenantId: tenant.tenantId
        });
        showSuccessMessage('套餐授权已同步');
      }
    });
  }

  function handleStatusChange(tenant: TenantItem) {
    const nextStatus: TenantStatus = tenant.status === '0' ? '1' : '0';
    const actionLabel = nextStatus === '1' ? '停用' : '启用';

    showConfirmModal({
      closable: true,
      content:
        nextStatus === '1'
          ? '停用后该租户的用户不能再发起新的登录；已经建立的会话不会立即退出，最长可能持续到刷新令牌失效。'
          : '启用后该租户的用户可以重新登录。已经过期的租户即使启用，登录仍会因过期被拒绝。',
      okButtonProps: { danger: nextStatus === '1', loading: statusMutation.isPending },
      okText: `确认${actionLabel}`,
      title: `${actionLabel}「${tenant.companyName || tenant.tenantId}」？`,
      onOk: async () => {
        await statusMutation.mutateAsync({ id: Number(tenant.id), status: nextStatus });
        await invalidateTenantData();
        showSuccessMessage(`租户已${actionLabel}`);
      }
    });
  }

  function handleDelete(targetTenants: TenantItem[]) {
    const isBatch = targetTenants.length > 1;

    deleteModal({
      okText: isBatch ? `删除 ${targetTenants.length} 家租户` : '删除租户',
      title: isBatch
        ? `删除已选择的 ${targetTenants.length} 家租户？`
        : `删除「${targetTenants[0].companyName || targetTenants[0].tenantId}」？`,
      content: (
        <div className="flex flex-col gap-8px">
          <div>这是软删除，但当前没有恢复接口，请当成不可撤销的操作。</div>
          <div>租户名下的用户和业务数据一行不删，租户编号也不会回收。</div>
          {isBatch ? <div>批量删除是原子操作：任一目标已经变化，整批都不会执行。</div> : null}
        </div>
      ),
      onOk: () => deleteTenantRecords(targetTenants)
    });
  }

  function handleBatchDelete() {
    if (selectedTenants.length === 0) return;

    // 上限卡在这里，超了后端直接 422，不如提前说清楚
    if (selectedTenants.length > TENANT_DELETE_LIMIT) {
      showConfirmModal({
        content: `一次最多删除 ${TENANT_DELETE_LIMIT} 家租户，当前选中了 ${selectedTenants.length} 家，请分批处理。`,
        okCancel: false,
        okText: '知道了',
        title: '选中的租户过多'
      });
      return;
    }

    handleDelete(selectedTenants);
  }

  async function deleteTenantRecords(targetTenants: TenantItem[]) {
    await deleteMutation.mutateAsync(targetTenants.map(tenant => tenant.id));

    setSelectedRowKeys([]);
    setDetailTenantId(undefined);

    // 整页删光时留在空页上，只会看到一个空表格，往前退一页
    if (pageNum > 1 && targetTenants.length >= tenants.length) {
      updateSearchParams({ current: pageNum - 1 });
    }

    await invalidateTenantData();
    showSuccessMessage(targetTenants.length > 1 ? '所选租户已删除' : '租户已删除');
  }

  async function handleSyncDict() {
    await syncDictMutation.mutateAsync();
    setSyncOpen(false);
    showSuccessMessage('租户字典已同步');
  }

  async function handleSyncConfig() {
    await syncConfigMutation.mutateAsync();
    setSyncOpen(false);
    showSuccessMessage('租户参数配置已同步');
  }

  async function handleExport() {
    setExporting(true);

    try {
      // 导出的是筛选命中的全部数据，分页参数带上去也不生效
      const { current: _current, size: _size, ...exportParams } = normalizeTenantSearchParams(searchProps.searchParams);

      const blob = await exportTenants(exportParams);

      downloadFileFromBlob({ fileName: '租户数据.xlsx', source: blob });
    } finally {
      setExporting(false);
    }
  }

  async function handleRefresh() {
    await getData();
    setSelectedRowKeys([]);
  }

  async function invalidateTenantData() {
    await queryClient.invalidateQueries({ queryKey: SYSTEM_TENANT_QUERY_KEYS.ALL });
  }

  return (
    <div className="h-full min-h-500px flex flex-col gap-16px overflow-hidden lt-sm:overflow-auto">
      <Alert
        className="shrink-0"
        showIcon
        type="warning"
        description="租户是平台级控制面，开通一家企业会同时创建根部门、管理员角色、管理员账号和初始字典参数。管理租户是系统基座，不能修改、停用或删除。"
        title="这里管理的是整个平台的企业客户"
        action={
          <Button
            icon={<SvgIcon icon="ph:package" />}
            size="small"
            onClick={() => navigate({ to: '/tenant/package' })}
          >
            管理套餐
          </Button>
        }
      />

      <Flex
        className="shrink-0"
        gap={12}
        wrap="wrap"
      >
        <OverviewCard
          hint="当前页"
          label="正常租户"
          value={overview.normal}
        />
        <OverviewCard
          hint="当前页"
          label="临期或已过期"
          value={overview.expiring}
        />
        <OverviewCard
          hint="当前页"
          label="停用租户"
          value={overview.disabled}
        />
      </Flex>

      <Collapse
        bordered={false}
        className="shrink-0 card-wrapper"
        defaultActiveKey={isMobile ? undefined : '1'}
        items={[
          {
            children: (
              <TenantSearch
                {...searchProps}
                packageOptions={packageOptions}
              />
            ),
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
              suffix={
                <Button
                  icon={<SvgIcon icon="ph:wrench" />}
                  size="small"
                  onClick={() => setSyncOpen(true)}
                >
                  平台同步
                </Button>
              }
            >
              <Button
                ghost
                icon={<SvgIcon icon="ic:round-plus" />}
                size="small"
                type="primary"
                onClick={handleAdd}
              >
                新增租户
              </Button>
              <Button
                danger
                ghost
                disabled={selectedTenants.length === 0}
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
              <Typography.Text strong>租户列表</Typography.Text>
              <Typography.Text type="secondary">
                {hasActiveFilters ? '命中' : '共'} {total} 家租户
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
              title="租户列表加载失败"
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

          <Table<TenantTableRecord>
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
                      ? '没有找到符合条件的租户，试着调整编号、企业名称或状态'
                      : '还没有开通任何企业客户，新增租户后可以在这里统一维护'
                  }
                />
              )
            }}
            rowSelection={{
              align: 'center',
              // 管理租户后端拒删，勾上它只会让整批删除全部失败
              getCheckboxProps: tenant => ({
                disabled: isManagementTenant(tenant),
                name: tenant.companyName || tenant.tenantId
              }),
              preserveSelectedRowKeys: false,
              selectedRowKeys,
              onChange: setSelectedRowKeys
            }}
          />
        </Card>
      </div>

      <Suspense fallback={null}>
        <TenantDetailDrawer
          open={Boolean(detailTenantId)}
          packageOptions={packageOptions}
          tenantId={detailTenantId}
          onClose={() => setDetailTenantId(undefined)}
          onEdit={() => {
            const tenantId = detailTenantId;

            setDetailTenantId(undefined);
            setEditorState({ mode: 'update', open: true, tenantId });
          }}
        />

        <TenantEditorDrawer
          loading={saving}
          mode={editorState.mode}
          open={editorState.open}
          packageOptions={packageOptions}
          packageOptionsError={packageOptionsQuery.isError}
          packageOptionsLoading={packageOptionsQuery.isLoading}
          tenantId={editorState.tenantId}
          onClose={handleCloseEditor}
          onSubmit={handleSubmit}
        />

        <TenantSyncModal
          configLoading={syncConfigMutation.isPending}
          dictLoading={syncDictMutation.isPending}
          open={syncOpen}
          onClose={() => setSyncOpen(false)}
          onSyncConfig={handleSyncConfig}
          onSyncDict={handleSyncDict}
        />
      </Suspense>
    </div>
  );
};

/** 整个 /system/tenant 路由族只在后端开启多租户时才挂载，关着的时候是 404 而不是空列表。 */
function resolveListErrorDescription(error: unknown) {
  const httpStatus = (error as { response?: { status?: number } })?.response?.status;

  if (httpStatus === 404) return '当前部署没有启用多租户，租户接口未挂载。需要开启请联系平台运维。';
  if (httpStatus === 403) return '当前账号不是平台超级管理员，没有查看租户的权限。';

  return '请检查网络后重试；筛选条件和已选项都已保留。';
}

export const Route = createFileRoute('/(admin)/tenant/list/')({
  component: TenantManagement,
  staticData: {
    keepAlive: true,
    menu: {
      icon: 'ph:building',
      order: 1
    },
    title: '租户列表'
  },
  validateSearch: TenantSearchSchema
});

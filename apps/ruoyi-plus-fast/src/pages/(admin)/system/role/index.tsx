import { useAdminState } from '@skyroc/web-admin-layouts';
import { showConfirmModal } from '@skyroc/web-admin-theme';
import { SvgIcon, TableHeaderOperation, useTable, useTableScroll } from '@skyroc/web-ui-compose';
import type {
  TableColumn,
  TableDataWithIndex,
  TableQueryHookOptions
} from '@skyroc/web-ui-compose';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Alert, Badge, Button, Card, Collapse, Dropdown, Empty, Flex, Table, Tag, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { useState } from 'react';
import type { Key } from 'react';

import { deleteModal } from '@/features/antd/deleteModal';
import {
  SYSTEM_ROLE_QUERY_KEYS,
  useCreateRoleMutation,
  useDeleteRolesMutation,
  useRoleListQuery,
  useUpdateRoleDataScopeMutation,
  useUpdateRoleMutation,
  useUpdateRoleStatusMutation
} from '@/service/api/system-role';
import type {
  RoleDataScope,
  RoleDataScopePayload,
  RoleItem,
  RoleListPage,
  RoleListParams,
  RoleSavePayload,
  RoleStatus,
  RoleUpdatePayload
} from '@/service/api/system-role';

import RoleDataScopeModal from './modules/RoleDataScopeModal';
import RoleDetailDrawer from './modules/RoleDetailDrawer';
import RoleEditorDrawer from './modules/RoleEditorDrawer';
import type { RoleEditorMode, RoleEditorTab } from './modules/RoleEditorDrawer';
import RoleMemberDrawer from './modules/RoleMemberDrawer';
import RoleSearch from './modules/RoleSearch';
import type { RoleTableParams } from './modules/RoleSearch';

const ROLE_TABLE_SCROLL_X = 1080;
const ROLE_SEARCH_INITIAL_PARAMS: Partial<RoleTableParams> = {
  createdRange: undefined,
  roleKey: undefined,
  roleName: undefined,
  status: undefined
};

const DATA_SCOPE_LABELS: Record<RoleDataScope, string> = {
  '1': '全部数据',
  '2': '自定义部门',
  '3': '本部门',
  '4': '本部门及以下',
  '5': '仅本人',
  '6': '部门及以下或本人'
};

const INITIAL_EDITOR_STATE: RoleEditorState = {
  initialTab: 'basic',
  mode: 'create',
  open: false
};

type RoleTableRecord = TableDataWithIndex<RoleItem>;

interface RoleEditorState {
  initialTab: RoleEditorTab;
  mode: RoleEditorMode;
  open: boolean;
  roleId?: RoleItem['roleId'];
}

interface RoleManagementProps {
  /** 页面首次加载时使用的分页大小。 */
  initialPageSize?: number;
}

const RoleManagement = (props: RoleManagementProps) => {
  const { initialPageSize = 10 } = props;

  const queryClient = useQueryClient();
  const { isMobile } = useAdminState();
  const { scrollConfig, tableWrapperRef } = useTableScroll(ROLE_TABLE_SCROLL_X);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [editorState, setEditorState] = useState<RoleEditorState>(INITIAL_EDITOR_STATE);
  const [detailRoleId, setDetailRoleId] = useState<RoleItem['roleId']>();
  const [scopeRole, setScopeRole] = useState<RoleItem>();
  const [memberRole, setMemberRole] = useState<RoleItem>();

  const createMutation = useCreateRoleMutation();
  const updateMutation = useUpdateRoleMutation();
  const deleteMutation = useDeleteRolesMutation();
  const statusMutation = useUpdateRoleStatusMutation();
  const dataScopeMutation = useUpdateRoleDataScopeMutation();
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
  } = useTable<RoleTableParams, RoleListPage, RoleItem>({
    apiParams: {
      ...ROLE_SEARCH_INITIAL_PARAMS,
      size: initialPageSize
    },
    columns: createColumns,
    isChangeURL: false,
    isMobile,
    pagination: {
      pageSizeOptions: [10, 20, 50, 100],
      showQuickJumper: true,
      showTotal: value => `共 ${value} 条`
    },
    queryHook: useRoleTableQuery,
    rowKey: role => String(role.roleId),
    transformParams: normalizeRoleSearchParams
  });
  const roles = data;
  const selectedRoles = roles.filter(role => selectedRowKeys.map(String).includes(String(role.roleId)));
  const saving = createMutation.isPending || updateMutation.isPending;
  const hasActiveFilters = hasRoleFilters(searchProps.searchParams);

  function createColumns(): TableColumn<RoleTableRecord>[] {
    return [
      {
        dataIndex: 'roleName',
        fixed: 'left',
        key: 'roleName',
        render: (_value, role) => (
          <Flex align="center" gap={10}>
            <span className="size-32px grid shrink-0 place-items-center rounded-8px bg-primary-1 text-primary">
              <SvgIcon icon={role.superAdmin ? 'ph:shield-star' : 'ph:shield-check'} />
            </span>
            <Flex align="center" className="min-w-0" gap={7}>
              <Typography.Text className="truncate font-600">{role.roleName}</Typography.Text>
              {role.superAdmin ? (
                <Tag className="m-0 text-10px" color="gold" variant="filled">
                  受保护
                </Tag>
              ) : null}
            </Flex>
          </Flex>
        ),
        title: '角色',
        width: 205
      },
      {
        dataIndex: 'roleKey',
        key: 'roleKey',
        render: (value: string) => (
          <Tag className="m-0 font-mono text-11px" variant="filled">
            {value}
          </Tag>
        ),
        title: '权限字符',
        width: 165
      },
      {
        dataIndex: 'dataScope',
        key: 'dataScope',
        render: (value: RoleDataScope) => (
          <Tag color={resolveDataScopeColor(value)} variant="filled">
            {DATA_SCOPE_LABELS[value]}
          </Tag>
        ),
        title: '数据范围',
        width: 165
      },
      {
        dataIndex: 'roleSort',
        key: 'roleSort',
        title: '排序',
        width: 85
      },
      {
        dataIndex: 'status',
        key: 'status',
        render: value => (
          <Badge status={value === '0' ? 'success' : 'warning'} text={value === '0' ? '正常' : '停用'} />
        ),
        title: '状态',
        width: 100
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
        render: (_value, role) => renderRoleActions(role),
        title: '操作',
        width: 260
      }
    ];
  }

  function renderRoleActions(role: RoleItem) {
    if (role.superAdmin) {
      return (
        <div className="flex-center justify-end gap-8px">
          <Button size="small" onClick={() => handleDetail(role)}>
            详情
          </Button>
          <Typography.Text type="secondary">系统保护</Typography.Text>
        </div>
      );
    }

    return (
      <div className="flex-center justify-end gap-8px">
        <Button size="small" onClick={() => handleDetail(role)}>
          详情
        </Button>
        <Button size="small" onClick={() => handleEdit(role)}>
          编辑
        </Button>
        <Button ghost size="small" type="primary" onClick={() => handlePermission(role)}>
          授权
        </Button>
        <Dropdown menu={{ items: createMoreMenu(role) }} placement="bottomRight" trigger={['click']}>
          <Button aria-label={`${role.roleName}更多操作`} icon={<SvgIcon icon="ph:dots-three" />} size="small" />
        </Dropdown>
      </div>
    );
  }

  function createMoreMenu(role: RoleItem): MenuProps['items'] {
    return [
      {
        icon: <SvgIcon icon="ph:tree-structure" />,
        key: 'scope',
        label: '数据范围',
        onClick: () => setScopeRole(role)
      },
      {
        icon: <SvgIcon icon="ph:users-three" />,
        key: 'members',
        label: '成员管理',
        onClick: () => setMemberRole(role)
      },
      { type: 'divider' },
      {
        icon: <SvgIcon icon={role.status === '0' ? 'ph:prohibit' : 'ph:check-circle'} />,
        key: 'status',
        label: role.status === '0' ? '停用角色' : '启用角色',
        onClick: () => handleStatusChange(role)
      },
      {
        danger: true,
        icon: <SvgIcon icon="ph:trash" />,
        key: 'delete',
        label: '删除角色',
        onClick: () => handleDelete([role])
      }
    ];
  }

  function handleAdd() {
    setEditorState({ initialTab: 'basic', mode: 'create', open: true });
  }

  function handleDetail(role: RoleItem) {
    setDetailRoleId(role.roleId);
  }

  function handleEdit(role: RoleItem) {
    setEditorState({ initialTab: 'basic', mode: 'update', open: true, roleId: role.roleId });
  }

  function handlePermission(role: RoleItem) {
    setEditorState({ initialTab: 'permission', mode: 'update', open: true, roleId: role.roleId });
  }

  function handleCloseEditor() {
    if (!saving) setEditorState(INITIAL_EDITOR_STATE);
  }

  async function handleSubmit(values: RoleSavePayload | RoleUpdatePayload) {
    const mode = editorState.mode;
    if (mode === 'create') await createMutation.mutateAsync(values as RoleSavePayload);
    else await updateMutation.mutateAsync(values as RoleUpdatePayload);
    setEditorState(INITIAL_EDITOR_STATE);
    await invalidateRoleData();
    showSuccessMessage(mode === 'create' ? '角色新增成功' : '角色信息与权限已更新');
  }

  async function handleDataScopeSubmit(values: RoleDataScopePayload) {
    await dataScopeMutation.mutateAsync(values);
    setScopeRole(undefined);
    await invalidateRoleData();
    showSuccessMessage('角色数据范围已更新');
  }

  function handleStatusChange(role: RoleItem) {
    const nextStatus: RoleStatus = role.status === '0' ? '1' : '0';
    const actionLabel = nextStatus === '1' ? '停用' : '启用';
    showConfirmModal({
      closable: true,
      content:
        nextStatus === '1'
          ? '停用会影响该角色全部成员的访问权限，后端也可能因成员占用而拒绝操作。'
          : '启用后，该角色成员将重新获得角色授予的权限。',
      okButtonProps: { danger: nextStatus === '1', loading: statusMutation.isPending },
      okText: `确认${actionLabel}`,
      title: `${actionLabel}“${role.roleName}”？`,
      onOk: async () => {
        await statusMutation.mutateAsync({ roleId: role.roleId, status: nextStatus });
        await invalidateRoleData();
        showSuccessMessage(`角色已${actionLabel}`);
      }
    });
  }

  function handleDelete(targetRoles: RoleItem[]) {
    const names = targetRoles.map(role => role.roleName);
    const isBatch = targetRoles.length > 1;
    deleteModal({
      content: isBatch
        ? '批量删除是原子操作：任一角色受保护、已分配用户或数据已变化时，整批都不会删除。'
        : '删除后不可恢复；已分配用户或系统保护角色会被后端拒绝。',
      okText: isBatch ? `删除 ${targetRoles.length} 个角色` : '删除角色',
      title: isBatch ? `删除已选的 ${targetRoles.length} 个角色？` : `删除“${names[0]}”？`,
      onOk: () => deleteRoleRecords(targetRoles)
    });
  }

  async function handleBatchDelete() {
    await deleteRoleRecords(selectedRoles);
  }

  async function deleteRoleRecords(targetRoles: RoleItem[]) {
    await deleteMutation.mutateAsync(targetRoles.map(role => role.roleId));
    setSelectedRowKeys([]);
    if (pageNum > 1 && targetRoles.length >= roles.length) {
      updateSearchParams({ current: pageNum - 1 });
    }
    await invalidateRoleData();
    showSuccessMessage(targetRoles.length > 1 ? '所选角色已删除' : '角色已删除');
  }

  async function handleRefresh() {
    await getData();
    setSelectedRowKeys([]);
    showSuccessMessage('角色数据已刷新');
  }

  async function invalidateRoleData() {
    await queryClient.invalidateQueries({ queryKey: SYSTEM_ROLE_QUERY_KEYS.ALL });
  }

  return (
    <div className="h-full min-h-500px flex flex-col gap-16px overflow-hidden lt-sm:overflow-auto">
      <Collapse
        bordered={false}
        className="shrink-0 card-wrapper"
        defaultActiveKey={isMobile ? undefined : '1'}
        items={[
          {
            children: <RoleSearch {...searchProps} />,
            key: '1',
            label: '查询条件'
          }
        ]}
      />

      <div className="min-h-0 flex flex-1 flex-col" ref={tableWrapperRef}>
        <Card
          className="min-h-0 min-w-0 flex flex-1 flex-col card-wrapper"
          extra={
            <TableHeaderOperation
              add={handleAdd}
              addText="新增角色"
              batchDeleteText="批量删除"
              columns={columnChecks}
              disabledDelete={selectedRoles.length === 0}
              loading={tableProps.loading}
              refresh={handleRefresh}
              setColumnChecks={setColumnChecks}
              onDelete={handleBatchDelete}
            />
          }
          title={
            <Flex align="center" gap={8} wrap="wrap">
              <Typography.Text strong>角色列表</Typography.Text>
              <Typography.Text type="secondary">
                {hasActiveFilters ? '命中' : '共'} {total} 个角色
              </Typography.Text>
              {selectedRowKeys.length > 0 ? (
                <Tag color="geekblue" variant="filled">
                  已选 {selectedRowKeys.length} 项
                </Tag>
              ) : null}
            </Flex>
          }
          variant="borderless"
        >
          {query.isError ? (
            <Alert
              action={
                <Button size="small" onClick={getData}>
                  重试
                </Button>
              }
              className="mb-12px"
              showIcon
              title="角色列表加载失败"
              type="error"
            />
          ) : null}

          <Table<RoleTableRecord>
            {...tableProps}
            locale={{
              emptyText: (
                <Empty
                  description={hasActiveFilters ? '没有找到符合条件的角色' : '当前还没有角色'}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )
            }}
            rowSelection={{
              getCheckboxProps: role => ({ disabled: role.superAdmin, name: role.roleName }),
              preserveSelectedRowKeys: false,
              selectedRowKeys,
              onChange: setSelectedRowKeys
            }}
            scroll={scrollConfig}
            size="small"
          />
        </Card>
      </div>

      <RoleDetailDrawer
        open={detailRoleId !== undefined}
        roleId={detailRoleId}
        onClose={() => setDetailRoleId(undefined)}
        onEdit={() => {
          const roleId = detailRoleId;
          setDetailRoleId(undefined);
          if (roleId !== undefined) {
            setEditorState({ initialTab: 'basic', mode: 'update', open: true, roleId });
          }
        }}
      />
      <RoleEditorDrawer
        initialTab={editorState.initialTab}
        loading={saving}
        mode={editorState.mode}
        open={editorState.open}
        roleId={editorState.roleId}
        onClose={handleCloseEditor}
        onSubmit={handleSubmit}
      />
      <RoleDataScopeModal
        loading={dataScopeMutation.isPending}
        open={scopeRole !== undefined}
        role={scopeRole}
        onClose={() => setScopeRole(undefined)}
        onSubmit={handleDataScopeSubmit}
      />
      <RoleMemberDrawer open={memberRole !== undefined} role={memberRole} onClose={() => setMemberRole(undefined)} />
    </div>
  );
};

function normalizeRoleSearchParams(params: RoleTableParams): RoleTableParams {
  return {
    ...params,
    roleKey: params.roleKey?.trim() || undefined,
    roleName: params.roleName?.trim() || undefined
  };
}

function toRoleListParams(params: RoleTableParams): RoleListParams {
  const { createdRange, ...listParams } = params;
  return {
    ...listParams,
    beginTime: createdRange?.[0]?.startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    endTime: createdRange?.[1]?.endOf('day').format('YYYY-MM-DD HH:mm:ss')
  };
}

function useRoleTableQuery<Data = RoleListPage>(
  params: RoleTableParams,
  options?: TableQueryHookOptions<RoleListPage, Data>
) {
  return useRoleListQuery(toRoleListParams(params), options);
}

function hasRoleFilters(params: Partial<RoleTableParams>) {
  return Boolean(params.createdRange || params.roleKey || params.roleName || params.status);
}

function resolveDataScopeColor(value: RoleDataScope) {
  if (value === '1') return 'gold';
  if (value === '2') return 'blue';
  return undefined;
}

export const Route = createFileRoute('/(admin)/system/role/')({
  component: RoleManagement,
  staticData: {
    keepAlive: true,
    menu: {
      icon: 'ph:shield-check',
      order: 4
    },
    title: '角色管理'
  }
});

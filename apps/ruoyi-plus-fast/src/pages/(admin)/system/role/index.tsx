import { showConfirmModal } from '@skyroc/web-admin-theme';
import { ButtonIcon } from '@skyroc/web-ui-antd';
import { SvgIcon } from '@skyroc/web-ui-compose';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import {
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
  DatePicker,
  Dropdown,
  Empty,
  Flex,
  Input,
  Popover,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography
} from 'antd';
import type { MenuProps, TableColumnsType, TableProps } from 'antd';
import type { Dayjs } from 'dayjs';
import { useState } from 'react';
import type { Key } from 'react';

import { deleteModal } from '@/features/antd/deleteModal';
import {
  SYSTEM_ROLE_QUERY_KEYS,
  useCreateRoleMutation,
  useDeleteRolesMutation,
  useRoleListQuery,
  useRoleOverviewQuery,
  useUpdateRoleDataScopeMutation,
  useUpdateRoleMutation,
  useUpdateRoleStatusMutation
} from '@/service/api/system-role';
import type {
  RoleDataScope,
  RoleDataScopePayload,
  RoleItem,
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

type RoleOptionalColumn = 'createTime' | 'roleSort';

type RoleSortField = 'createTime' | 'roleSort';

interface SubmittedRoleFilters {
  beginTime?: string;
  endTime?: string;
  roleKey?: string;
  roleName?: string;
  status?: RoleStatus;
}

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

const STATUS_OPTIONS = [
  { label: '正常', value: '0' },
  { label: '停用', value: '1' }
] satisfies Array<{ label: string; value: RoleStatus }>;

const COLUMN_OPTIONS = [
  { label: '显示顺序', value: 'roleSort' },
  { label: '创建时间', value: 'createTime' }
] satisfies Array<{ label: string; value: RoleOptionalColumn }>;

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

function resolveDataScopeColor(value: RoleDataScope) {
  if (value === '1') return 'gold';
  if (value === '2') return 'blue';
  return undefined;
}

// oxlint-disable-next-line complexity -- 页面组件只编排现有查询、弹窗和抽屉状态，业务交互已拆入独立组件。
const RoleManagement = (props: RoleManagementProps) => {
  const { initialPageSize = 10 } = props;

  const queryClient = useQueryClient();
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [roleName, setRoleName] = useState('');
  const [roleKey, setRoleKey] = useState('');
  const [status, setStatus] = useState<RoleStatus>();
  const [createdRange, setCreatedRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [filters, setFilters] = useState<SubmittedRoleFilters>({});
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [visibleOptionalColumns, setVisibleOptionalColumns] = useState<RoleOptionalColumn[]>([
    'roleSort',
    'createTime'
  ]);
  const [sortField, setSortField] = useState<RoleSortField>();
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>();
  const [editorState, setEditorState] = useState<RoleEditorState>(INITIAL_EDITOR_STATE);
  const [detailRoleId, setDetailRoleId] = useState<RoleItem['roleId']>();
  const [scopeRole, setScopeRole] = useState<RoleItem>();
  const [memberRole, setMemberRole] = useState<RoleItem>();

  const listParams: RoleListParams = { ...filters, current, size: pageSize };
  if (sortField && sortDirection) {
    listParams.orderByColumn = sortField;
    listParams.isAsc = sortDirection;
  }
  const roleQuery = useRoleListQuery(listParams);
  const overviewQuery = useRoleOverviewQuery();
  const createMutation = useCreateRoleMutation();
  const updateMutation = useUpdateRoleMutation();
  const deleteMutation = useDeleteRolesMutation();
  const statusMutation = useUpdateRoleStatusMutation();
  const dataScopeMutation = useUpdateRoleDataScopeMutation();
  const roles = roleQuery.data?.records ?? [];
  const selectedRoles = roles.filter(role => selectedRowKeys.map(String).includes(String(role.roleId)));
  const overviewRoles = overviewQuery.data ?? [];
  const overviewTotal = overviewRoles.length;
  const overviewDisabled = overviewRoles.filter(role => role.status === '1').length;
  const overviewCustomScope = overviewRoles.filter(role => role.dataScope === '2').length;
  const overviewProtected = overviewRoles.filter(role => role.superAdmin).length;
  const saving = createMutation.isPending || updateMutation.isPending;
  const hasMoreFilters = Boolean(filters.beginTime || filters.endTime);
  const columns = createColumns();

  function createColumns(): TableColumnsType<RoleItem> {
    function resolveSortOrder(field: RoleSortField) {
      if (sortField !== field || !sortDirection) return null;
      return sortDirection === 'asc' ? 'ascend' : 'descend';
    }

    const result: TableColumnsType<RoleItem> = [
      {
        dataIndex: 'roleName',
        fixed: 'left',
        key: 'roleName',
        render: (_value, role) => (
          <Flex align="center" gap={10}>
            <span className="size-32px grid shrink-0 place-items-center rounded-8px bg-primary-1 text-primary">
              <SvgIcon icon={role.superAdmin ? 'ph:shield-star' : 'ph:shield-check'} />
            </span>
            <div className="min-w-0">
              <Flex align="center" gap={7}>
                <Typography.Text className="truncate font-600">{role.roleName}</Typography.Text>
                {role.superAdmin ? (
                  <Tag className="m-0 text-10px" color="gold" variant="filled">
                    受保护
                  </Tag>
                ) : null}
              </Flex>
            </div>
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
      }
    ];

    if (visibleOptionalColumns.includes('roleSort')) {
      result.push({
        dataIndex: 'roleSort',
        key: 'roleSort',
        sorter: true,
        sortOrder: resolveSortOrder('roleSort'),
        title: '排序',
        width: 85
      });
    }

    result.push({
      dataIndex: 'status',
      key: 'status',
      render: value => <Badge status={value === '0' ? 'success' : 'warning'} text={value === '0' ? '正常' : '停用'} />,
      title: '状态',
      width: 100
    });

    if (visibleOptionalColumns.includes('createTime')) {
      result.push({
        dataIndex: 'createTime',
        key: 'createTime',
        render: value => value || <span className="text-tertiary">—</span>,
        sorter: true,
        sortOrder: resolveSortOrder('createTime'),
        title: '创建时间',
        width: 180
      });
    }

    result.push({
      fixed: 'right',
      key: 'actions',
      render: (_value, role) => {
        if (role.superAdmin) {
          return (
            <Space size={4}>
              <Button size="small" type="link" onClick={() => handleDetail(role)}>
                详情
              </Button>
              <Typography.Text type="secondary">系统保护</Typography.Text>
            </Space>
          );
        }
        return (
          <Space size={0}>
            <Button size="small" type="link" onClick={() => handleDetail(role)}>
              详情
            </Button>
            <Button size="small" type="link" onClick={() => handleEdit(role)}>
              编辑
            </Button>
            <Button size="small" type="link" onClick={() => handlePermission(role)}>
              授权
            </Button>
            <Dropdown menu={{ items: createMoreMenu(role) }} placement="bottomRight" trigger={['click']}>
              <Button
                aria-label={`${role.roleName}更多操作`}
                icon={<SvgIcon icon="ph:dots-three" />}
                size="small"
                type="text"
              />
            </Dropdown>
          </Space>
        );
      },
      title: '操作',
      width: 220
    });
    return result;
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

  function handleSearch() {
    const nextFilters: SubmittedRoleFilters = {
      roleKey: roleKey.trim() || undefined,
      roleName: roleName.trim() || undefined,
      status
    };
    if (createdRange?.[0]) nextFilters.beginTime = createdRange[0].startOf('day').format('YYYY-MM-DD HH:mm:ss');
    if (createdRange?.[1]) nextFilters.endTime = createdRange[1].endOf('day').format('YYYY-MM-DD HH:mm:ss');
    setCurrent(1);
    setSelectedRowKeys([]);
    setFilters(nextFilters);
  }

  function handleReset() {
    setRoleName('');
    setRoleKey('');
    setStatus(undefined);
    setCreatedRange(null);
    setFilters({});
    setCurrent(1);
    setSortField(undefined);
    setSortDirection(undefined);
    setSelectedRowKeys([]);
  }

  function handleTableChange(...args: Parameters<NonNullable<TableProps<RoleItem>['onChange']>>) {
    const [pagination, , sorter] = args;
    setCurrent(pagination.current ?? 1);
    setPageSize(pagination.pageSize ?? initialPageSize);
    setSelectedRowKeys([]);
    const activeSorter = Array.isArray(sorter) ? sorter[0] : sorter;
    const nextSortField =
      activeSorter.field === 'roleSort' || activeSorter.field === 'createTime' ? activeSorter.field : undefined;
    setSortField(activeSorter.order ? nextSortField : undefined);
    if (activeSorter.order === 'ascend') setSortDirection('asc');
    else if (activeSorter.order === 'descend') setSortDirection('desc');
    else setSortDirection(undefined);
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

  async function invalidateRoleData() {
    await queryClient.invalidateQueries({ queryKey: SYSTEM_ROLE_QUERY_KEYS.ALL });
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
      content: (
        <div>
          <div>
            {isBatch
              ? '批量删除是原子操作：任一角色受保护、已分配用户或数据已变化时，整批都不会删除。'
              : '删除后不可恢复；已分配用户或系统保护角色会被后端拒绝。'}
          </div>
          <div className="mt-10px rounded-6px bg-fill-2 px-10px py-8px text-12px text-text-2">
            {isBatch
              ? `${names.slice(0, 3).join('、')}${names.length > 3 ? ` 等 ${names.length} 个角色` : ''}`
              : `权限字符：${targetRoles[0]?.roleKey}`}
          </div>
        </div>
      ),
      okText: isBatch ? `删除 ${targetRoles.length} 个角色` : '删除角色',
      title: isBatch ? `删除已选的 ${targetRoles.length} 个角色？` : `删除“${names[0]}”？`,
      onOk: async () => {
        await deleteMutation.mutateAsync(targetRoles.map(role => role.roleId));
        setSelectedRowKeys([]);
        if (current > 1 && targetRoles.length >= roles.length) setCurrent(current - 1);
        await invalidateRoleData();
        showSuccessMessage(isBatch ? '所选角色已删除' : '角色已删除');
      }
    });
  }

  async function handleRefresh() {
    await Promise.all([roleQuery.refetch(), overviewQuery.refetch()]);
    setSelectedRowKeys([]);
    showSuccessMessage('角色数据已刷新');
  }

  return (
    <div className="min-h-full flex flex-col gap-16px">
      <Flex align="flex-end" gap={16} justify="space-between" wrap="wrap">
        <div>
          <Typography.Title className="m-0!" level={2}>
            角色管理
          </Typography.Title>
          <Typography.Text type="secondary">维护访问权限、数据范围与角色成员，授权写入直接由后端校验。</Typography.Text>
        </div>
        <span className="rounded-full bg-container px-12px py-7px shadow-sm">
          <Badge status={roleQuery.isError ? 'error' : 'success'} text="角色服务已连接" />
        </span>
      </Flex>

      <div className="grid grid-cols-4 gap-12px lt-xl:grid-cols-2 lt-sm:grid-cols-1">
        {[
          { icon: 'ph:shield-check', label: '角色总数', value: overviewTotal },
          { icon: 'ph:shield-warning', label: '停用角色', value: overviewDisabled },
          { icon: 'ph:tree-structure', label: '自定义数据范围', value: overviewCustomScope },
          { icon: 'ph:lock-key', label: '系统保护角色', value: overviewProtected }
        ].map(item => (
          <Card className="card-wrapper" key={item.label} size="small" variant="borderless">
            <Flex align="center" gap={12}>
              <span className="size-36px grid shrink-0 place-items-center rounded-9px bg-primary-1 text-primary">
                <SvgIcon className="text-19px" icon={item.icon} />
              </span>
              <div>
                <Typography.Text className="block text-12px" type="secondary">
                  {item.label}
                </Typography.Text>
                <Typography.Text className="text-22px leading-tight" strong>
                  {item.value}
                </Typography.Text>
              </div>
            </Flex>
          </Card>
        ))}
      </div>

      <Card className="card-wrapper" variant="borderless">
        <div className="grid grid-cols-[minmax(180px,1fr)_minmax(180px,1fr)_150px_auto] items-end gap-12px lt-lg:grid-cols-2 lt-sm:grid-cols-1">
          <div>
            <div className="mb-7px text-13px text-text-2">角色名称</div>
            <Input
              allowClear
              placeholder="请输入角色名称"
              value={roleName}
              onChange={event => setRoleName(event.target.value)}
              onPressEnter={handleSearch}
            />
          </div>
          <div>
            <div className="mb-7px text-13px text-text-2">权限字符</div>
            <Input
              allowClear
              placeholder="例如 admin、dept-lead"
              value={roleKey}
              onChange={event => setRoleKey(event.target.value)}
              onPressEnter={handleSearch}
            />
          </div>
          <div>
            <div className="mb-7px text-13px text-text-2">状态</div>
            <Select
              allowClear
              className="w-full"
              options={STATUS_OPTIONS}
              placeholder="全部状态"
              value={status}
              onChange={setStatus}
            />
          </div>
          <Space className="lt-lg:justify-self-end lt-sm:justify-self-stretch">
            <Button icon={<SvgIcon icon="ph:magnifying-glass" />} type="primary" onClick={handleSearch}>
              查询
            </Button>
            <Button icon={<SvgIcon icon="ph:arrow-counter-clockwise" />} onClick={handleReset}>
              重置
            </Button>
          </Space>
        </div>
        <Button
          className="mt-9px px-0!"
          icon={<SvgIcon icon={moreFiltersOpen ? 'ph:caret-up' : 'ph:caret-down'} />}
          iconPlacement="end"
          type="link"
          onClick={() => setMoreFiltersOpen(value => !value)}
        >
          {moreFiltersOpen ? '收起筛选' : '更多筛选'}
        </Button>
        {moreFiltersOpen ? (
          <div className="mt-10px max-w-420px border-t border-dashed border-border-2 pt-14px">
            <div className="mb-7px text-13px text-text-2">创建时间</div>
            <DatePicker.RangePicker
              className="w-full"
              value={createdRange}
              onChange={value => setCreatedRange(value)}
            />
          </div>
        ) : null}
        {hasMoreFilters && !moreFiltersOpen ? (
          <Tag className="mt-8px" color="blue" variant="filled">
            已应用创建时间筛选
          </Tag>
        ) : null}
      </Card>

      <Card
        className="min-w-0 card-wrapper"
        extra={
          <Space size={8} wrap>
            <Button icon={<SvgIcon icon="ph:plus" />} type="primary" onClick={handleAdd}>
              新增角色
            </Button>
            <Button
              disabled={selectedRoles.length !== 1}
              icon={<SvgIcon icon="ph:pencil-simple" />}
              onClick={() => handleEdit(selectedRoles[0] as RoleItem)}
            >
              编辑
            </Button>
            <Button
              danger
              disabled={selectedRoles.length === 0}
              icon={<SvgIcon icon="ph:trash" />}
              loading={deleteMutation.isPending}
              onClick={() => handleDelete(selectedRoles)}
            >
              批量删除
            </Button>
            <Tooltip title="刷新角色列表和概览">
              <ButtonIcon
                aria-label="刷新角色数据"
                icon="ph:arrows-clockwise"
                loading={roleQuery.isFetching || overviewQuery.isFetching}
                onClick={handleRefresh}
              />
            </Tooltip>
            <Popover
              content={
                <Checkbox.Group
                  options={COLUMN_OPTIONS}
                  value={visibleOptionalColumns}
                  onChange={values => setVisibleOptionalColumns(values as RoleOptionalColumn[])}
                />
              }
              placement="bottomRight"
              title="可选列"
              trigger="click"
            >
              <ButtonIcon aria-label="列设置" icon="ph:columns" />
            </Popover>
          </Space>
        }
        title={
          <Flex align="center" gap={8} wrap="wrap">
            <Typography.Text strong>角色列表</Typography.Text>
            <Typography.Text type="secondary">共 {roleQuery.data?.total ?? 0} 个角色</Typography.Text>
            {selectedRowKeys.length > 0 ? (
              <Tag color="geekblue" variant="filled">
                已选 {selectedRowKeys.length} 项
              </Tag>
            ) : null}
          </Flex>
        }
        variant="borderless"
      >
        {roleQuery.isError ? (
          <Alert
            action={
              <Button size="small" onClick={() => roleQuery.refetch()}>
                重试
              </Button>
            }
            className="mb-12px"
            showIcon
            title="角色列表加载失败"
            type="error"
          />
        ) : null}
        <Table<RoleItem>
          columns={columns}
          dataSource={roles}
          loading={roleQuery.isLoading}
          locale={{
            emptyText: (
              <Empty
                description={Object.keys(filters).length ? '没有找到符合条件的角色' : '当前还没有角色'}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )
          }}
          pagination={{
            current: roleQuery.data?.current ?? current,
            pageSize: roleQuery.data?.size ?? pageSize,
            pageSizeOptions: [10, 20, 50, 100],
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: total => `共 ${total} 条`,
            total: roleQuery.data?.total ?? 0
          }}
          rowKey={role => String(role.roleId)}
          rowSelection={{
            getCheckboxProps: role => ({ disabled: role.superAdmin, name: role.roleName }),
            preserveSelectedRowKeys: false,
            selectedRowKeys,
            onChange: setSelectedRowKeys
          }}
          scroll={{ x: 1080 }}
          size="middle"
          onChange={handleTableChange}
        />
      </Card>

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

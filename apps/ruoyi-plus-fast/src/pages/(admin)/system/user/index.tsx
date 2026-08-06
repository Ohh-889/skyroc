import { useAdminState } from '@skyroc/web-admin-layouts';
import { showConfirmModal } from '@skyroc/web-admin-theme';
import { SvgIcon, TableHeaderOperation, useTable, useTableScroll } from '@skyroc/web-ui-compose';
import type { TableColumn, TableDataWithIndex, TableQueryHookOptions } from '@skyroc/web-ui-compose';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, getRouteApi } from '@tanstack/react-router';
import { Alert, Avatar, Badge, Button, Card, Collapse, Dropdown, Empty, Flex, Table, Tag, Tooltip } from 'antd';
import type { MenuProps } from 'antd';
import { Suspense, lazy, useEffect, useState } from 'react';
import type { Key } from 'react';
import { z } from 'zod';

import { deleteModal } from '@/features/antd/deleteModal';
import {
  SYSTEM_USER_QUERY_KEYS,
  useCreateUserMutation,
  useDeleteUsersMutation,
  useDeptTreeQuery,
  useResetUserPasswordMutation,
  useUpdateUserMutation,
  useUpdateUserRolesMutation,
  useUpdateUserStatusMutation,
  useUserListQuery
} from '@/service/api/system-user';
import type {
  UserId,
  UserListItem,
  UserListPage,
  UserListParams,
  UserSavePayload,
  UserStatus
} from '@/service/api/system-user';

import UserDepartmentPanel from './modules/UserDepartmentPanel';
import type { UserEditorMode } from './modules/UserEditorDrawer';
import UserSearch from './modules/UserSearch';
import type { UserTableParams } from './modules/UserSearch';

const UserDetailDrawer = lazy(() => import('./modules/UserDetailDrawer'));
const UserEditorDrawer = lazy(() => import('./modules/UserEditorDrawer'));
const UserPasswordModal = lazy(() => import('./modules/UserPasswordModal'));
const UserRoleDrawer = lazy(() => import('./modules/UserRoleDrawer'));

const USER_TABLE_SCROLL_X = 1520;
const USER_SEARCH_INITIAL_PARAMS: Partial<UserTableParams> = {
  deptId: undefined,
  keyword: undefined,
  searchField: 'username',
  status: undefined
};

type UserOperation = 'delete' | 'edit' | 'reset-password' | 'roles' | 'status' | 'view';
type UserTableRecord = TableDataWithIndex<UserListItem>;

interface UserEditorState {
  mode: UserEditorMode;
  open: boolean;
  userId?: UserId;
}

interface UserManagementProps {
  /** 页面首次加载时使用的分页大小。 */
  initialPageSize?: number;
}

const INITIAL_EDITOR_STATE: UserEditorState = { mode: 'create', open: false };
const userRouteApi = getRouteApi('/(admin)/system/user/');

function createRowMenu(user: UserListItem): MenuProps['items'] {
  return [
    {
      icon: <SvgIcon icon={user.status === '0' ? 'ph:prohibit' : 'ph:check-circle'} />,
      key: 'status',
      label: user.status === '0' ? '停用账号' : '启用账号'
    },
    { icon: <SvgIcon icon="ph:key" />, key: 'reset-password', label: '重置密码' },
    { type: 'divider' },
    { danger: true, icon: <SvgIcon icon="ph:trash" />, key: 'delete', label: '删除用户' }
  ];
}

const UserManagement = (props: UserManagementProps) => {
  const { initialPageSize = 20 } = props;

  const { deptId: routeDeptId } = userRouteApi.useSearch();
  const queryClient = useQueryClient();
  const { isMobile } = useAdminState();
  const { scrollConfig, tableWrapperRef } = useTableScroll(USER_TABLE_SCROLL_X);
  const [selectedDeptId, setSelectedDeptId] = useState<UserId | undefined>(routeDeptId);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [editorState, setEditorState] = useState<UserEditorState>(INITIAL_EDITOR_STATE);
  const [detailUserId, setDetailUserId] = useState<UserId>();
  const [roleUser, setRoleUser] = useState<UserListItem>();
  const [passwordUser, setPasswordUser] = useState<UserListItem>();

  const deptQuery = useDeptTreeQuery();
  const createMutation = useCreateUserMutation();
  const updateMutation = useUpdateUserMutation();
  const deleteMutation = useDeleteUsersMutation();
  const statusMutation = useUpdateUserStatusMutation();
  const passwordMutation = useResetUserPasswordMutation();
  const roleMutation = useUpdateUserRolesMutation();
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
  } = useTable<UserTableParams, UserListPage, UserListItem>({
    apiParams: {
      ...USER_SEARCH_INITIAL_PARAMS,
      deptId: routeDeptId,
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
    queryHook: useUserTableQuery,
    rowKey: user => String(user.userId),
    transformParams: normalizeUserSearchParams
  });
  const users = data;
  const selectedUsers = users.filter(user => selectedRowKeys.map(String).includes(String(user.userId)));
  const saving = createMutation.isPending || updateMutation.isPending;
  const hasActiveFilters = hasUserFilters(searchProps.searchParams);

  useEffect(() => {
    if (routeDeptId === undefined) return;
    setSelectedDeptId(routeDeptId);
    searchProps.form.setFieldValue('deptId', routeDeptId);
    updateSearchParams({ current: 1, deptId: routeDeptId });
  }, [routeDeptId]);

  function createColumns(): TableColumn<UserTableRecord>[] {
    return [
      {
        dataIndex: 'userName',
        fixed: 'left',
        key: 'userName',
        render: (_value, user) => (
          <Flex align="center" gap={10}>
            <Avatar className="shrink-0 bg-primary text-white">{getAvatarText(user)}</Avatar>
            <div className="min-w-0">
              <div className="truncate font-600">{user.nickName || user.userName}</div>
              <div className="truncate text-12px text-tertiary">{user.userName}</div>
            </div>
          </Flex>
        ),
        title: '用户',
        width: 220
      },
      {
        dataIndex: 'deptName',
        key: 'deptName',
        render: value => value || <span className="text-tertiary">未分配</span>,
        title: '部门',
        width: 160
      },
      {
        dataIndex: 'roles',
        key: 'roles',
        render: roles => renderRoles(roles),
        title: '角色',
        width: 190
      },
      {
        key: 'contact',
        render: (_value, user) => (
          <div>
            <div>{user.phonenumber ? maskPhone(user.phonenumber) : '—'}</div>
            {user.email ? <div className="text-12px text-tertiary">{maskEmail(user.email)}</div> : null}
          </div>
        ),
        title: '联系方式',
        width: 210
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
        dataIndex: 'loginDate',
        key: 'loginDate',
        render: value =>
          value ? (
            <Tooltip title={value}>{formatRelativeTime(value)}</Tooltip>
          ) : (
            <span className="text-tertiary">从未登录</span>
          ),
        title: '最近登录',
        width: 160
      },
      {
        dataIndex: 'createTime',
        key: 'createTime',
        title: '创建时间',
        width: 170
      },
      {
        fixed: 'right',
        key: 'actions',
        render: (_value, user) => (
          <div className="flex-center justify-end gap-8px">
            <Button size="small" onClick={() => handleUserOperation('view', user)}>
              查看
            </Button>
            <Button size="small" onClick={() => handleUserOperation('edit', user)}>
              编辑
            </Button>
            <Button ghost size="small" type="primary" onClick={() => handleUserOperation('roles', user)}>
              分配角色
            </Button>
            <Dropdown
              menu={{
                items: createRowMenu(user),
                onClick: ({ key }) => handleUserOperation(key as UserOperation, user)
              }}
              trigger={['click']}
            >
              <Button size="small">更多</Button>
            </Dropdown>
          </div>
        ),
        title: '操作',
        width: 300
      }
    ];
  }

  function handleUserOperation(operation: UserOperation, user: UserListItem) {
    if (operation === 'view') setDetailUserId(user.userId);
    if (operation === 'edit') setEditorState({ mode: 'update', open: true, userId: user.userId });
    if (operation === 'roles') setRoleUser(user);
    if (operation === 'reset-password') setPasswordUser(user);
    if (operation === 'status') handleStatusChange(user);
    if (operation === 'delete') handleDelete([user]);
  }

  function handleDeptSelect(keys: Key[]) {
    if (keys.length === 0) {
      handleAllDepartments();
      return;
    }
    const deptId = String(keys[0]);
    setSelectedDeptId(deptId);
    setSelectedRowKeys([]);
    updateSearchParams({ current: 1, deptId });
  }

  function handleAllDepartments() {
    setSelectedDeptId(undefined);
    setSelectedRowKeys([]);
    updateSearchParams({ current: 1, deptId: undefined });
  }

  async function handleSubmit(values: UserSavePayload) {
    if (editorState.mode === 'create') await createMutation.mutateAsync(values);
    else await updateMutation.mutateAsync({ ...values, userId: editorState.userId as UserId });
    setEditorState(INITIAL_EDITOR_STATE);
    await refreshUserData();
    showSuccessMessage(editorState.mode === 'create' ? '用户新增成功' : '用户信息已更新');
  }

  function handleStatusChange(user: UserListItem) {
    const nextStatus: UserStatus = user.status === '0' ? '1' : '0';
    const action = nextStatus === '1' ? '停用' : '启用';
    showConfirmModal({
      closable: true,
      content: nextStatus === '1' ? '停用后该用户将无法继续登录。' : '启用后将恢复该用户的登录能力。',
      okButtonProps: { danger: nextStatus === '1', loading: statusMutation.isPending },
      okText: `确认${action}`,
      title: `${action}“${user.nickName || user.userName}”？`,
      onOk: async () => {
        await statusMutation.mutateAsync({ status: nextStatus, userId: user.userId });
        await refreshUserData();
        showSuccessMessage(`用户已${action}`);
      }
    });
  }

  function handleDelete(targetUsers: UserListItem[]) {
    const names = targetUsers.map(user => user.nickName || user.userName);
    deleteModal({
      content:
        targetUsers.length > 1
          ? '批量删除是原子操作；任一用户不可删除时整批都会失败。'
          : '删除后用户将被逻辑归档且无法继续登录。',
      okText: targetUsers.length > 1 ? `删除 ${targetUsers.length} 位用户` : '删除用户',
      title: targetUsers.length > 1 ? `删除已选的 ${targetUsers.length} 位用户？` : `删除“${names[0]}”？`,
      onOk: () => deleteUserRecords(targetUsers)
    });
  }

  async function handleBatchDelete() {
    await deleteUserRecords(selectedUsers);
  }

  async function deleteUserRecords(targetUsers: UserListItem[]) {
    await deleteMutation.mutateAsync(targetUsers.map(user => user.userId));
    setSelectedRowKeys([]);
    if (pageNum > 1 && targetUsers.length >= users.length) updateSearchParams({ current: pageNum - 1 });
    await refreshUserData();
    showSuccessMessage(targetUsers.length > 1 ? '所选用户已删除' : '用户已删除');
  }

  async function handlePasswordSubmit(password: string) {
    if (!passwordUser) return;
    await passwordMutation.mutateAsync({ password, userId: passwordUser.userId });
    setPasswordUser(undefined);
    showSuccessMessage('用户密码已重置');
  }

  async function handleRoleSubmit(roleIds: UserId[]) {
    if (!roleUser) return;
    await roleMutation.mutateAsync({ roleIds, userId: roleUser.userId });
    setRoleUser(undefined);
    await refreshUserData();
    showSuccessMessage('用户角色已更新');
  }

  async function handleRefresh() {
    await Promise.all([getData(), deptQuery.refetch()]);
    setSelectedRowKeys([]);
    showSuccessMessage('用户和部门数据已刷新');
  }

  async function refreshUserData() {
    await queryClient.invalidateQueries({ queryKey: SYSTEM_USER_QUERY_KEYS.ALL });
  }

  return (
    <div className="h-full min-h-500px flex flex-col overflow-hidden lt-xl:overflow-auto">
      <div className="min-h-0 grid flex-1 grid-cols-[240px_minmax(0,1fr)] items-stretch gap-16px lt-xl:grid-cols-1">
        <UserDepartmentPanel
          departments={deptQuery.data ?? []}
          error={deptQuery.isError}
          fetching={deptQuery.isFetching}
          loading={deptQuery.isLoading}
          refresh={deptQuery.refetch}
          selectedDeptId={selectedDeptId}
          onSelectAll={handleAllDepartments}
          onSelectDepartment={handleDeptSelect}
        />

        <div className="h-full min-h-0 min-w-0 flex flex-col gap-16px">
          <Collapse
            bordered={false}
            className="shrink-0 card-wrapper"
            defaultActiveKey={isMobile ? undefined : '1'}
            items={[{ children: <UserSearch {...searchProps} />, key: '1', label: '查询条件' }]}
          />
          <div className="min-h-0 min-w-0 flex flex-1 flex-col" ref={tableWrapperRef}>
            <Card
              className="min-h-0 min-w-0 flex flex-1 flex-col card-wrapper"
              extra={
                <TableHeaderOperation
                  add={() => setEditorState({ mode: 'create', open: true })}
                  addText="新增用户"
                  batchDeleteText="批量删除"
                  columns={columnChecks}
                  disabledDelete={selectedUsers.length === 0}
                  loading={tableProps.loading || deptQuery.isFetching}
                  refresh={handleRefresh}
                  setColumnChecks={setColumnChecks}
                  onDelete={handleBatchDelete}
                />
              }
              title={
                <Flex gap={8}>
                  <strong>用户列表</strong>
                  <span className="text-tertiary">
                    {hasActiveFilters ? '命中' : '共'} {total} 位用户
                  </span>
                  {selectedRowKeys.length ? <Tag color="blue">已选 {selectedRowKeys.length} 人</Tag> : null}
                </Flex>
              }
              variant="borderless"
            >
              {query.isError ? (
                <Alert
                  action={<Button onClick={getData}>重试</Button>}
                  className="mb-12px"
                  showIcon
                  title="用户列表加载失败"
                  type="error"
                />
              ) : null}
              <Table<UserTableRecord>
                {...tableProps}
                locale={{
                  emptyText: (
                    <Empty
                      description={hasActiveFilters ? '没有找到符合条件的用户' : '当前还没有用户'}
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  )
                }}
                rowSelection={{ preserveSelectedRowKeys: false, selectedRowKeys, onChange: setSelectedRowKeys }}
                scroll={scrollConfig}
                size="small"
              />
            </Card>
          </div>
        </div>
      </div>

      <Suspense fallback={null}>
        <UserDetailDrawer
          open={Boolean(detailUserId)}
          userId={String(detailUserId)}
          onClose={() => setDetailUserId(undefined)}
          onEdit={() => {
            const userId = detailUserId;
            setDetailUserId(undefined);
            setEditorState({ mode: 'update', open: true, userId });
          }}
        />

        <UserEditorDrawer
          departments={deptQuery.data ?? []}
          loading={saving}
          mode={editorState.mode}
          open={editorState.open}
          userId={editorState.userId}
          onClose={() => {
            if (!saving) setEditorState(INITIAL_EDITOR_STATE);
          }}
          onSubmit={handleSubmit}
        />

        <UserRoleDrawer
          loading={roleMutation.isPending}
          open={Boolean(roleUser)}
          userId={roleUser?.userId ?? ''}
          onClose={() => setRoleUser(undefined)}
          onSubmit={handleRoleSubmit}
        />

        <UserPasswordModal
          loading={passwordMutation.isPending}
          open={Boolean(passwordUser)}
          userName={passwordUser?.nickName || passwordUser?.userName || ''}
          onClose={() => setPasswordUser(undefined)}
          onSubmit={handlePasswordSubmit}
        />
      </Suspense>
    </div>
  );
};

function normalizeUserSearchParams(params: UserTableParams): UserTableParams {
  return { ...params, keyword: params.keyword?.trim() || undefined };
}

function toUserListParams(params: UserTableParams): UserListParams {
  const { keyword, searchField, ...listParams } = params;
  const result: UserListParams = { ...listParams, nickName: undefined, phonenumber: undefined, userName: undefined };
  if (keyword && searchField === 'nickname') result.nickName = keyword;
  if (keyword && searchField === 'phone') result.phonenumber = keyword;
  if (keyword && searchField === 'username') result.userName = keyword;
  return result;
}

function useUserTableQuery<Data = UserListPage>(
  params: UserTableParams,
  options?: TableQueryHookOptions<UserListPage, Data>
) {
  return useUserListQuery(toUserListParams(params), options);
}

function hasUserFilters(params: Partial<UserTableParams>) {
  return Boolean(params.deptId || params.keyword || params.status);
}

function getAvatarText(user: UserListItem) {
  return (user.nickName.trim() || user.userName.trim()).slice(0, 1).toLocaleUpperCase();
}

function renderRoles(roles: UserListItem['roles']) {
  if (!roles?.length) return <span className="text-tertiary">—</span>;
  return (
    <Flex gap={4} wrap="wrap">
      {roles.slice(0, 2).map((role, index) => (
        <Tag color={index === 0 ? 'geekblue' : undefined} key={String(role.roleId ?? role.roleKey ?? index)}>
          {role.roleName || role.roleKey || '未命名角色'}
        </Tag>
      ))}
    </Flex>
  );
}

function maskPhone(phone: string) {
  return phone.length < 7 ? phone : `${phone.slice(0, 3)}****${phone.slice(-4)}`;
}

function maskEmail(email: string) {
  const index = email.indexOf('@');
  return index <= 1 ? email : `${email.slice(0, Math.min(4, index))}***${email.slice(index)}`;
}

function formatRelativeTime(value: string) {
  const timestamp = Date.parse(value.replace(' ', 'T'));
  if (Number.isNaN(timestamp)) return value;
  const minutes = Math.floor((Date.now() - timestamp) / 60_000);
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes} 分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小时前`;
  const days = Math.floor(hours / 24);
  return days < 30 ? `${days} 天前` : value.slice(0, 10);
}

export const Route = createFileRoute('/(admin)/system/user/')({
  component: UserManagement,
  staticData: { keepAlive: true, menu: { icon: 'ph:users-three', order: 1 }, title: '用户管理' },
  validateSearch: z.object({ deptId: z.string().optional() })
});

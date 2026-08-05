import { AppTree, ButtonIcon } from '@skyroc/web-ui-antd';
import { SvgIcon } from '@skyroc/web-ui-compose';
import { createFileRoute } from '@tanstack/react-router';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Dropdown,
  Empty,
  Flex,
  Input,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Tooltip,
  Typography
} from 'antd';
import type { MenuProps, TableColumnsType, TablePaginationConfig, TreeDataNode } from 'antd';

import { useDeptTreeQuery, useUserListQuery } from '@/service/api/system-user';
import type { DeptTreeNode, UserId, UserListItem, UserListParams, UserStatus } from '@/service/api/system-user';
type SearchField = 'nickname' | 'phone' | 'username';

type UserOperation = 'delete' | 'edit' | 'enable' | 'reset-password' | 'roles' | 'view';

interface SubmittedFilters {
  deptId?: UserId;
  keyword: string;
  searchField: SearchField;
  status?: UserStatus;
}

interface UserManagementProps {
  /** 页面首次加载时使用的分页大小。 */
  initialPageSize?: number;
}

const SEARCH_FIELD_OPTIONS = [
  { label: '用户账号', value: 'username' },
  { label: '用户昵称', value: 'nickname' },
  { label: '手机号码', value: 'phone' }
] satisfies Array<{ label: string; value: SearchField }>;

const STATUS_OPTIONS = [
  { label: '正常', value: '0' },
  { label: '停用', value: '1' }
] satisfies Array<{ label: string; value: UserStatus }>;

function buildUserListParams(submittedFilters: SubmittedFilters, page: number, size: number): UserListParams {
  const params: UserListParams = {
    current: page,
    size
  };
  const normalizedKeyword = submittedFilters.keyword.trim();

  if (submittedFilters.deptId !== undefined) params.deptId = submittedFilters.deptId;
  if (submittedFilters.status !== undefined) params.status = submittedFilters.status;
  if (normalizedKeyword) {
    if (submittedFilters.searchField === 'username') params.userName = normalizedKeyword;
    if (submittedFilters.searchField === 'nickname') params.nickName = normalizedKeyword;
    if (submittedFilters.searchField === 'phone') params.phonenumber = normalizedKeyword;
  }
  return params;
}

function buildDeptTreeData(nodes: DeptTreeNode[], filterKeyword: string): TreeDataNode[] {
  const normalizedKeyword = filterKeyword.toLocaleLowerCase();

  return nodes.flatMap(node => {
    const children = buildDeptTreeData(node.children ?? [], filterKeyword);
    const matches = !normalizedKeyword || node.label.toLocaleLowerCase().includes(normalizedKeyword);
    if (!matches && children.length === 0) return [];

    return [
      {
        children,
        key: String(node.id),
        title: (
          <Flex align="center" gap={6}>
            <span className="min-w-0 flex-1 truncate">{node.label}</span>
            {node.disabled ? (
              <Tag bordered={false} color="warning" className="m-0 text-11px">
                停用
              </Tag>
            ) : null}
          </Flex>
        )
      }
    ];
  });
}

function createColumns(
  onOperation: (operation: UserOperation, user: UserListItem) => void
): TableColumnsType<UserListItem> {
  return [
    {
      dataIndex: 'userName',
      fixed: 'left',
      key: 'user',
      minWidth: 190,
      render: (_value, record) => (
        <Flex align="center" gap={10}>
          <Avatar className="shrink-0 bg-primary text-white">{getAvatarText(record)}</Avatar>
          <div className="min-w-0">
            <div className="truncate font-600 text-text-1">{record.nickName || record.userName}</div>
            <div className="mt-2px truncate text-12px text-text-3">{record.userName}</div>
          </div>
        </Flex>
      ),
      title: '用户',
      width: 220
    },
    {
      dataIndex: 'deptName',
      key: 'deptName',
      minWidth: 140,
      render: value => value || <span className="text-text-3">未分配</span>,
      title: '部门',
      width: 160
    },
    {
      dataIndex: 'roles',
      key: 'roles',
      minWidth: 160,
      render: roles => renderRoles(roles),
      title: '角色',
      width: 190
    },
    {
      key: 'contact',
      minWidth: 190,
      render: (_value, record) => (
        <div>
          <div>{record.phonenumber ? maskPhone(record.phonenumber) : '—'}</div>
          {record.email ? <div className="mt-2px text-12px text-text-3">{maskEmail(record.email)}</div> : null}
        </div>
      ),
      title: '联系方式',
      width: 210
    },
    {
      dataIndex: 'status',
      key: 'status',
      render: value => <Badge status={value === '0' ? 'success' : 'warning'} text={value === '0' ? '正常' : '停用'} />,
      title: '状态',
      width: 100
    },
    {
      dataIndex: 'loginDate',
      key: 'loginDate',
      minWidth: 150,
      render: value =>
        value ? (
          <Tooltip title={value}>
            <span>{formatRelativeTime(value)}</span>
          </Tooltip>
        ) : (
          <span className="text-text-3">从未登录</span>
        ),
      title: '最近登录',
      width: 160
    },
    {
      dataIndex: 'createTime',
      key: 'createTime',
      minWidth: 160,
      title: '创建时间',
      width: 170
    },
    {
      fixed: 'right',
      key: 'actions',
      render: (_value, record) => (
        <Space size={0}>
          <Button size="small" type="link" onClick={() => onOperation('view', record)}>
            查看
          </Button>
          <Button size="small" type="link" onClick={() => onOperation('edit', record)}>
            编辑
          </Button>
          <Button size="small" type="link" onClick={() => onOperation('roles', record)}>
            分配角色
          </Button>
          <Dropdown
            menu={{
              items: createRowOperationItems(record),
              onClick: ({ key }) => onOperation(key as UserOperation, record)
            }}
            placement="bottomRight"
            trigger={['click']}
          >
            <Button size="small" type="link">
              更多
              <SvgIcon icon="ph:caret-down" />
            </Button>
          </Dropdown>
        </Space>
      ),
      title: '操作',
      width: 285
    }
  ];
}

function createRowOperationItems(user: UserListItem): MenuProps['items'] {
  const isEnabled = user.status === '0';

  return [
    {
      icon: <SvgIcon icon={isEnabled ? 'ph:prohibit' : 'ph:check-circle'} />,
      key: 'enable',
      label: isEnabled ? '停用账号' : '启用账号'
    },
    {
      icon: <SvgIcon icon="ph:key" />,
      key: 'reset-password',
      label: '重置密码'
    },
    { type: 'divider' },
    {
      danger: true,
      icon: <SvgIcon icon="ph:trash" />,
      key: 'delete',
      label: '删除用户'
    }
  ];
}

function handleMoreOperation(info: { key: string }) {
  const label = info.key === 'import' ? '导入用户' : '导出当前结果';
  showInfoMessage(`${label}界面已预留，待接口对接`);
}

function getAvatarText(user: UserListItem) {
  const name = user.nickName.trim() || user.userName.trim();
  return name.slice(0, 1).toLocaleUpperCase();
}

function renderRoles(roles: UserListItem['roles']) {
  if (!roles?.length) return <span className="text-text-3">—</span>;

  const visibleRoles = roles.slice(0, 2);
  return (
    <Flex gap={4} wrap="wrap">
      {visibleRoles.map((role, index) => (
        <Tag color={index === 0 ? 'geekblue' : 'default'} key={String(role.roleId ?? role.roleKey ?? index)}>
          {role.roleName || role.roleKey || '未命名角色'}
        </Tag>
      ))}
      {roles.length > visibleRoles.length ? <Tag>+{roles.length - visibleRoles.length}</Tag> : null}
    </Flex>
  );
}

function maskPhone(phone: string) {
  if (phone.length < 7) return phone;
  return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
}

function maskEmail(email: string) {
  const atIndex = email.indexOf('@');
  if (atIndex <= 1) return email;
  const visibleLength = Math.min(4, atIndex);
  return `${email.slice(0, visibleLength)}***${email.slice(atIndex)}`;
}

function formatRelativeTime(value: string) {
  const timestamp = Date.parse(value.replace(' ', 'T'));
  if (Number.isNaN(timestamp)) return value;

  const difference = Date.now() - timestamp;
  if (difference < 0) return value;
  const minutes = Math.floor(difference / 60_000);
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes} 分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小时前`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} 天前`;
  return value.slice(0, 10);
}

const UserManagement = (props: UserManagementProps) => {
  const { initialPageSize = 20 } = props;

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [deptKeyword, setDeptKeyword] = useState('');
  const [keyword, setKeyword] = useState('');
  const [searchField, setSearchField] = useState<SearchField>('username');
  const [status, setStatus] = useState<UserStatus>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [filters, setFilters] = useState<SubmittedFilters>({
    keyword: '',
    searchField: 'username'
  });

  const userListParams = buildUserListParams(filters, current, pageSize);
  const userQuery = useUserListQuery(userListParams);
  const deptQuery = useDeptTreeQuery();
  const deptTreeData = useMemo(
    () => buildDeptTreeData(deptQuery.data ?? [], deptKeyword.trim()),
    [deptKeyword, deptQuery.data]
  );
  const columns = createColumns(handleUserOperation);

  const batchOperationItems: MenuProps['items'] = [
    {
      icon: <SvgIcon icon="ph:check-circle" />,
      key: 'batch-enable',
      label: '批量启用'
    },
    {
      icon: <SvgIcon icon="ph:prohibit" />,
      key: 'batch-disable',
      label: '批量停用'
    }
  ];

  const moreOperationItems: MenuProps['items'] = [
    {
      icon: <SvgIcon icon="ph:upload-simple" />,
      key: 'import',
      label: '导入用户'
    },
    {
      icon: <SvgIcon icon="ph:download-simple" />,
      key: 'export',
      label: '导出当前结果'
    }
  ];

  function handleSearch() {
    setCurrent(1);
    setFilters(previous => ({
      ...previous,
      keyword,
      searchField,
      status
    }));
  }

  function handleReset() {
    setKeyword('');
    setSearchField('username');
    setStatus(undefined);
    setCurrent(1);
    setFilters({
      keyword: '',
      searchField: 'username'
    });
  }

  function handleDeptSelect(selectedKeys: React.Key[]) {
    if (selectedKeys.length === 0) {
      handleClearDept();
      return;
    }
    const deptId = String(selectedKeys[0]);
    setCurrent(1);
    setFilters(previous => ({
      ...previous,
      deptId
    }));
  }

  function handleClearDept() {
    setCurrent(1);
    setFilters(previous => {
      const nextFilters = { ...previous };
      delete nextFilters.deptId;
      return nextFilters;
    });
  }

  function handleTableChange(pagination: TablePaginationConfig) {
    setCurrent(pagination.current ?? 1);
    setPageSize(pagination.pageSize ?? initialPageSize);
  }

  async function handleRefresh() {
    await Promise.all([userQuery.refetch(), deptQuery.refetch()]);
    showSuccessMessage('用户和部门数据已刷新');
  }

  function handleUserOperation(operation: UserOperation, user: UserListItem) {
    const operationLabels: Record<UserOperation, string> = {
      delete: '删除用户',
      edit: '编辑用户',
      enable: user.status === '0' ? '停用账号' : '启用账号',
      'reset-password': '重置密码',
      roles: '分配角色',
      view: '查看详情'
    };
    showInfoMessage(`${operationLabels[operation]}“${user.nickName || user.userName}”的界面已预留，待接口对接`);
  }

  function handleBatchOperation(info: { key: string }) {
    const label = info.key === 'batch-enable' ? '批量启用' : '批量停用';
    showInfoMessage(`${label} ${selectedRowKeys.length} 位用户的界面已预留，待接口对接`);
  }

  function renderDeptTreeContent() {
    if (deptQuery.isError) {
      return (
        <Alert
          action={
            <Button size="small" onClick={() => deptQuery.refetch()}>
              重试
            </Button>
          }
          title="部门树加载失败"
          type="error"
        />
      );
    }

    if (deptTreeData.length === 0) {
      return <Empty description="暂无部门" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }

    return (
      <AppTree
        blockNode
        defaultExpandAll
        selectedKeys={filters.deptId ? [String(filters.deptId)] : []}
        treeData={deptTreeData}
        onSelect={handleDeptSelect}
      />
    );
  }

  return (
    <div className="min-h-full flex flex-col gap-16px">
      <div className="grid grid-cols-[240px_minmax(0,1fr)] h-full gap-16px lt-xl:grid-cols-1">
        <Card
          className="card-wrapper overflow-hidden  h-full"
          extra={<ButtonIcon icon="ph:arrows-clockwise" className="px-2" onClick={handleRefresh} />}
          title="部门"
          variant="borderless"
        >
          <Input
            allowClear
            className="mb-12px"
            placeholder="搜索部门"
            prefix={<SvgIcon className="text-text-3" icon="ph:magnifying-glass" />}
            value={deptKeyword}
            onChange={event => setDeptKeyword(event.target.value)}
          />

          <ASegmented<string>
            options={[
              { label: '仅当前部门', value: '0' },
              { label: '包含下级', value: '1' }
            ]}
            className="mb-3"
            onChange={value => {
              if (value === '0') {
                handleClearDept();
              } else {
                handleDeptSelect([String(filters.deptId)]);
              }
            }}
          />

          <Spin spinning={deptQuery.isLoading}>{renderDeptTreeContent()}</Spin>
        </Card>

        <Card className="min-w-0 card-wrapper h-full" variant="borderless">
          <Flex align="center" className="mb-16px" gap={10} justify="space-between" wrap="wrap">
            <Space.Compact className="min-w-320px flex-1 lt-sm:min-w-full">
              <Select
                className="w-112px"
                options={SEARCH_FIELD_OPTIONS}
                value={searchField}
                onChange={setSearchField}
              />
              <Input
                allowClear
                placeholder={`请输入${SEARCH_FIELD_OPTIONS.find(item => item.value === searchField)?.label}`}
                value={keyword}
                onChange={event => setKeyword(event.target.value)}
                onPressEnter={handleSearch}
              />
            </Space.Compact>
            <Select
              allowClear
              className="w-136px"
              options={STATUS_OPTIONS}
              placeholder="全部状态"
              value={status}
              onChange={setStatus}
            />
            <Button icon={<SvgIcon icon="ph:magnifying-glass" />} type="primary" onClick={handleSearch}>
              查询
            </Button>
            <Button icon={<SvgIcon icon="ph:arrow-counter-clockwise" />} onClick={handleReset}>
              重置
            </Button>
          </Flex>

          <Flex align="center" className="mb-12px" justify="space-between" wrap="wrap" gap={8}>
            <Space size={8}>
              <Typography.Text strong>用户列表</Typography.Text>
              <Typography.Text type="secondary">共 {userQuery.data?.total ?? 0} 位用户</Typography.Text>
              {selectedRowKeys.length > 0 ? (
                <Tag bordered={false} color="blue">
                  已选 {selectedRowKeys.length} 人
                </Tag>
              ) : null}
            </Space>
            <Space size={8} wrap>
              <Button
                icon={<SvgIcon icon="ph:user-plus" />}
                type="primary"
                onClick={() => showInfoMessage('新增用户界面已预留，待接口对接')}
              >
                新增用户
              </Button>
              <Dropdown
                disabled={selectedRowKeys.length === 0}
                menu={{
                  items: batchOperationItems,
                  onClick: handleBatchOperation
                }}
                trigger={['click']}
              >
                <Button>
                  批量操作
                  <SvgIcon icon="ph:caret-down" />
                </Button>
              </Dropdown>
              <Dropdown
                menu={{
                  items: moreOperationItems,
                  onClick: handleMoreOperation
                }}
                trigger={['click']}
              >
                <Button>
                  更多
                  <SvgIcon icon="ph:caret-down" />
                </Button>
              </Dropdown>
              <Tooltip title="刷新用户和部门数据">
                <Button
                  aria-label="刷新用户和部门数据"
                  icon={<SvgIcon icon="ph:arrows-clockwise" />}
                  loading={userQuery.isFetching || deptQuery.isFetching}
                  onClick={handleRefresh}
                />
              </Tooltip>
            </Space>
          </Flex>

          {userQuery.isError ? (
            <Alert
              action={
                <Button size="small" onClick={() => userQuery.refetch()}>
                  重试
                </Button>
              }
              className="mb-12px"
              message="用户列表加载失败"
              type="error"
            />
          ) : null}

          <Table<UserListItem>
            columns={columns}
            dataSource={userQuery.data?.records ?? []}
            loading={userQuery.isLoading}
            pagination={{
              current: userQuery.data?.current ?? current,
              pageSize: userQuery.data?.size ?? pageSize,
              pageSizeOptions: [10, 20, 50, 100],
              showQuickJumper: true,
              showSizeChanger: true,
              showTotal: total => `共 ${total} 条`,
              total: userQuery.data?.total ?? 0
            }}
            rowSelection={{
              preserveSelectedRowKeys: true,
              selectedRowKeys,
              onChange: setSelectedRowKeys
            }}
            rowKey={record => String(record.userId)}
            scroll={{ x: 1520 }}
            size="middle"
            onChange={handleTableChange}
          />
        </Card>
      </div>
    </div>
  );
};

export const Route = createFileRoute('/(admin)/system/user/')({
  component: UserManagement,
  staticData: {
    keepAlive: true,
    menu: {
      icon: 'ph:users-three',
      order: 1
    },
    title: '用户管理'
  }
});

import { AppTree, ButtonIcon } from '@skyroc/web-ui-antd';
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
  Empty,
  Flex,
  Input,
  Popover,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Tooltip,
  Typography
} from 'antd';
import type { TableColumnsType, TableProps, TreeDataNode } from 'antd';
import type { Dayjs } from 'dayjs';
import { useMemo, useState } from 'react';
import type { Key } from 'react';

import { deleteModal } from '@/features/antd/deleteModal';
import {
  SYSTEM_POST_QUERY_KEYS,
  useCreatePostMutation,
  useDeletePostsMutation,
  usePostDeptTreeQuery,
  usePostListQuery,
  useUpdatePostMutation
} from '@/service/api/system-post';
import type {
  PostDeptTreeNode,
  PostId,
  PostItem,
  PostListParams,
  PostSavePayload,
  PostStatus
} from '@/service/api/system-post';

import PostEditorDrawer from './modules/PostEditorDrawer';
import type { PostEditorMode } from './modules/PostEditorDrawer';

type PostOptionalColumn = 'category' | 'createTime';

type PostSortField = 'createTime' | 'postSort';

interface SubmittedPostFilters {
  beginTime?: string;
  belongDeptId?: PostId;
  deptId?: PostId;
  endTime?: string;
  postCategory?: string;
  postCode?: string;
  postName?: string;
  status?: PostStatus;
}

interface PostEditorState {
  mode: PostEditorMode;
  open: boolean;
  postId?: PostId;
  presetDeptId?: PostId;
}

interface DepartmentOption {
  disabled: boolean;
  label: string;
  shortLabel: string;
  value: PostId;
}

interface PostManagementProps {
  /** 页面首次加载时使用的分页大小。 */
  initialPageSize?: number;
}

const STATUS_OPTIONS = [
  { label: '正常', value: '0' },
  { label: '停用', value: '1' }
] satisfies Array<{ label: string; value: PostStatus }>;

const COLUMN_OPTIONS = [
  { label: '类别编码', value: 'category' },
  { label: '创建时间', value: 'createTime' }
] satisfies Array<{ label: string; value: PostOptionalColumn }>;

const INITIAL_EDITOR_STATE: PostEditorState = {
  mode: 'create',
  open: false
};

const PostManagement = (props: PostManagementProps) => {
  const { initialPageSize = 10 } = props;

  const queryClient = useQueryClient();
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [departmentKeyword, setDepartmentKeyword] = useState('');
  const [postName, setPostName] = useState('');
  const [postCode, setPostCode] = useState('');
  const [postCategory, setPostCategory] = useState('');
  const [status, setStatus] = useState<PostStatus>();
  const [exactDeptId, setExactDeptId] = useState<PostId>();
  const [selectedDeptId, setSelectedDeptId] = useState<PostId>();
  const [createdRange, setCreatedRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [filters, setFilters] = useState<SubmittedPostFilters>({});
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [visibleOptionalColumns, setVisibleOptionalColumns] = useState<PostOptionalColumn[]>([
    'category',
    'createTime'
  ]);
  const [sortField, setSortField] = useState<PostSortField>();
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>();
  const [editorState, setEditorState] = useState<PostEditorState>(INITIAL_EDITOR_STATE);

  const departmentQuery = usePostDeptTreeQuery();
  const departmentTreeData = useMemo(() => {
    const normalizedKeyword = departmentKeyword.trim().toLocaleLowerCase();

    function createTreeData(nodes: PostDeptTreeNode[]): TreeDataNode[] {
      return nodes.flatMap(node => {
        const children = createTreeData(node.children ?? []);
        const matches = !normalizedKeyword || node.label.toLocaleLowerCase().includes(normalizedKeyword);
        if (!matches && children.length === 0) return [];

        return [
          {
            children,
            key: String(node.id),
            title: (
              <Flex align="center" gap={6}>
                <SvgIcon className="shrink-0 text-tertiary" icon="ph:buildings" />
                <span className="min-w-0 flex-1 truncate">{node.label}</span>
                {node.disabled ? (
                  <Tag bordered={false} className="m-0 text-11px" color="warning">
                    停用
                  </Tag>
                ) : null}
              </Flex>
            )
          }
        ];
      });
    }

    return createTreeData(departmentQuery.data ?? []);
  }, [departmentKeyword, departmentQuery.data]);
  const departmentOptions = useMemo(() => {
    function flattenDepartments(nodes: PostDeptTreeNode[], parentPath = ''): DepartmentOption[] {
      return nodes.flatMap(node => {
        const label = parentPath ? `${parentPath} / ${node.label}` : node.label;
        return [
          {
            disabled: node.disabled,
            label,
            shortLabel: node.label,
            value: node.id
          },
          ...flattenDepartments(node.children ?? [], label)
        ];
      });
    }

    return flattenDepartments(departmentQuery.data ?? []);
  }, [departmentQuery.data]);

  const listParams: PostListParams = {
    ...filters,
    current,
    size: pageSize
  };
  if (sortField && sortDirection) {
    listParams.orderByColumn = sortField;
    listParams.isAsc = sortDirection;
  }

  const postQuery = usePostListQuery(listParams);
  const createMutation = useCreatePostMutation();
  const updateMutation = useUpdatePostMutation();
  const deleteMutation = useDeletePostsMutation();
  const posts = postQuery.data?.records ?? [];
  const saving = createMutation.isPending || updateMutation.isPending;
  const deleting = deleteMutation.isPending;
  const selectedPosts = posts.filter(post => selectedRowKeys.map(String).includes(String(post.postId)));
  const selectedDepartment = departmentOptions.find(option => String(option.value) === String(selectedDeptId));
  const exactDepartment = departmentOptions.find(option => String(option.value) === String(filters.deptId));
  const scopeLabel = exactDepartment
    ? `${exactDepartment.shortLabel}（精确）`
    : selectedDepartment
      ? `${selectedDepartment.shortLabel}及下级`
      : '全部部门';
  const hasMoreFilters = Boolean(filters.beginTime || filters.deptId || filters.endTime || filters.postCategory);
  const columns = createPostColumns();

  function createPostColumns(): TableColumnsType<PostItem> {
    const result: TableColumnsType<PostItem> = [
      {
        dataIndex: 'postName',
        fixed: 'left',
        key: 'postName',
        minWidth: 180,
        render: (_value, post) => (
          <Flex align="center" gap={10}>
            <span className="size-30px grid shrink-0 place-items-center rounded-8px bg-primary-1 text-primary">
              <SvgIcon icon="ph:briefcase" />
            </span>
            <div className="min-w-0">
              <Typography.Text className="block truncate font-600">{post.postName}</Typography.Text>
              <Typography.Text className="block truncate font-mono text-11px" type="secondary">
                {post.postCode}
              </Typography.Text>
            </div>
          </Flex>
        ),
        title: '岗位名称',
        width: 220
      },
      {
        dataIndex: 'postCode',
        key: 'postCode',
        render: value => (
          <Tooltip title="点击复制岗位编码">
            <Button className="h-auto p-0! font-mono text-12px" type="link" onClick={() => handleCopyCode(value)}>
              {value}
            </Button>
          </Tooltip>
        ),
        title: '岗位编码',
        width: 150
      }
    ];

    if (visibleOptionalColumns.includes('category')) {
      result.push({
        dataIndex: 'postCategory',
        key: 'postCategory',
        render: value =>
          value ? (
            <Tag bordered={false} className="m-0 font-mono text-11px">
              {value}
            </Tag>
          ) : (
            <span className="text-tertiary">—</span>
          ),
        title: '类别编码',
        width: 120
      });
    }

    result.push(
      {
        dataIndex: 'deptName',
        key: 'deptName',
        render: value =>
          value ? (
            <Flex align="center" gap={6}>
              <SvgIcon className="text-tertiary" icon="ph:buildings" />
              <span className="truncate">{value}</span>
            </Flex>
          ) : (
            <Tag bordered={false} color="error">
              部门已失效
            </Tag>
          ),
        title: '所属部门',
        width: 160
      },
      {
        dataIndex: 'postSort',
        key: 'postSort',
        sorter: true,
        sortOrder: sortField === 'postSort' ? (sortDirection === 'asc' ? 'ascend' : 'descend') : null,
        title: '排序',
        width: 90
      },
      {
        dataIndex: 'status',
        key: 'status',
        render: value => (
          <Badge status={value === '0' ? 'success' : 'warning'} text={value === '0' ? '正常' : '停用'} />
        ),
        title: '状态',
        width: 100
      }
    );

    if (visibleOptionalColumns.includes('createTime')) {
      result.push({
        dataIndex: 'createTime',
        key: 'createTime',
        render: value => value || <span className="text-tertiary">—</span>,
        sorter: true,
        sortOrder: sortField === 'createTime' ? (sortDirection === 'asc' ? 'ascend' : 'descend') : null,
        title: '创建时间',
        width: 180
      });
    }

    result.push({
      fixed: 'right',
      key: 'actions',
      render: (_value, post) => (
        <Space size={0}>
          <Button size="small" type="link" onClick={() => handleEdit(post)}>
            编辑
          </Button>
          <Button danger size="small" type="link" onClick={() => handleDelete([post])}>
            删除
          </Button>
        </Space>
      ),
      title: '操作',
      width: 130
    });

    return result;
  }

  function handleSearch() {
    const nextFilters: SubmittedPostFilters = {
      postCategory: postCategory.trim() || undefined,
      postCode: postCode.trim() || undefined,
      postName: postName.trim() || undefined,
      status
    };

    if (exactDeptId !== undefined) {
      nextFilters.deptId = exactDeptId;
      setSelectedDeptId(undefined);
    } else if (selectedDeptId !== undefined) {
      nextFilters.belongDeptId = selectedDeptId;
    }
    if (createdRange?.[0]) nextFilters.beginTime = createdRange[0].startOf('day').format('YYYY-MM-DD HH:mm:ss');
    if (createdRange?.[1]) nextFilters.endTime = createdRange[1].endOf('day').format('YYYY-MM-DD HH:mm:ss');

    setCurrent(1);
    setSelectedRowKeys([]);
    setFilters(nextFilters);
  }

  function handleReset() {
    setPostName('');
    setPostCode('');
    setPostCategory('');
    setStatus(undefined);
    setExactDeptId(undefined);
    setSelectedDeptId(undefined);
    setCreatedRange(null);
    setFilters({});
    setCurrent(1);
    setSortField(undefined);
    setSortDirection(undefined);
    setSelectedRowKeys([]);
  }

  function handleDepartmentSelect(keys: Key[]) {
    if (keys.length === 0) {
      handleAllDepartments();
      return;
    }

    const deptId = String(keys[0]);
    setSelectedDeptId(deptId);
    setExactDeptId(undefined);
    setCurrent(1);
    setSelectedRowKeys([]);
    setFilters(previous => {
      const nextFilters = { ...previous, belongDeptId: deptId };
      delete nextFilters.deptId;
      return nextFilters;
    });
  }

  function handleAllDepartments() {
    setSelectedDeptId(undefined);
    setExactDeptId(undefined);
    setCurrent(1);
    setSelectedRowKeys([]);
    setFilters(previous => {
      const nextFilters = { ...previous };
      delete nextFilters.belongDeptId;
      delete nextFilters.deptId;
      return nextFilters;
    });
  }

  function handleTableChange(...args: Parameters<NonNullable<TableProps<PostItem>['onChange']>>) {
    const [pagination, , sorter] = args;
    setCurrent(pagination.current ?? 1);
    setPageSize(pagination.pageSize ?? initialPageSize);
    setSelectedRowKeys([]);

    const activeSorter = Array.isArray(sorter) ? sorter[0] : sorter;
    const nextSortField =
      activeSorter.field === 'postSort' || activeSorter.field === 'createTime' ? activeSorter.field : undefined;
    setSortField(activeSorter.order ? nextSortField : undefined);
    setSortDirection(activeSorter.order === 'ascend' ? 'asc' : activeSorter.order === 'descend' ? 'desc' : undefined);
  }

  function handleAdd() {
    const presetDepartment = departmentOptions.find(option => String(option.value) === String(selectedDeptId));
    setEditorState({
      mode: 'create',
      open: true,
      presetDeptId: presetDepartment?.disabled ? undefined : selectedDeptId
    });
  }

  function handleEdit(post: PostItem) {
    setEditorState({ mode: 'update', open: true, postId: post.postId });
  }

  function handleCloseEditor() {
    if (!saving) setEditorState(INITIAL_EDITOR_STATE);
  }

  async function handleSubmit(values: PostSavePayload) {
    const mode = editorState.mode;
    if (mode === 'create') {
      await createMutation.mutateAsync(values);
    } else {
      await updateMutation.mutateAsync({
        ...values,
        postId: editorState.postId as PostId
      });
    }

    setEditorState(INITIAL_EDITOR_STATE);
    await queryClient.invalidateQueries({ queryKey: SYSTEM_POST_QUERY_KEYS.ALL });
    showSuccessMessage(mode === 'create' ? '岗位新增成功' : '岗位信息已更新');
  }

  function handleDelete(targetPosts: PostItem[]) {
    const targetNames = targetPosts.map(post => post.postName);
    const isBatch = targetPosts.length > 1;
    deleteModal({
      content: (
        <div>
          <div>
            {isBatch
              ? '批量删除是原子操作：任一岗位已分配用户或数据过期时，整批都不会删除。'
              : '删除后不可恢复；如果岗位已分配用户，系统将拒绝删除。'}
          </div>
          <div className="mt-10px rounded-6px bg-fill-2 px-10px py-8px text-12px text-text-2">
            {isBatch
              ? `${targetNames.slice(0, 3).join('、')}${targetNames.length > 3 ? ` 等 ${targetNames.length} 个岗位` : ''}`
              : `岗位编码：${targetPosts[0]?.postCode} · 所属部门：${targetPosts[0]?.deptName || '部门已失效'}`}
          </div>
        </div>
      ),
      okText: isBatch ? `删除 ${targetPosts.length} 个岗位` : '删除岗位',
      title: isBatch ? `删除已选的 ${targetPosts.length} 个岗位？` : `删除“${targetNames[0]}”？`,
      onOk: async () => {
        await deleteMutation.mutateAsync(targetPosts.map(post => post.postId));
        setSelectedRowKeys([]);
        if (current > 1 && targetPosts.length >= posts.length) setCurrent(current - 1);
        await queryClient.invalidateQueries({ queryKey: SYSTEM_POST_QUERY_KEYS.LISTS });
        showSuccessMessage(isBatch ? '所选岗位已删除' : '岗位已删除');
      }
    });
  }

  async function handleRefresh() {
    await Promise.all([postQuery.refetch(), departmentQuery.refetch()]);
    setSelectedRowKeys([]);
    showSuccessMessage('岗位和部门数据已刷新');
  }

  async function handleCopyCode(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      showSuccessMessage('岗位编码已复制');
    } catch {
      showErrorMessage('复制失败，请手动复制岗位编码');
    }
  }

  function renderDepartmentTree() {
    if (departmentQuery.isError) {
      return (
        <Alert
          action={
            <Button size="small" onClick={() => departmentQuery.refetch()}>
              重试
            </Button>
          }
          message="部门树加载失败"
          showIcon
          type="error"
        />
      );
    }
    if (departmentTreeData.length === 0) {
      return (
        <Empty
          description={departmentKeyword ? '没有找到符合条件的部门' : '暂无部门'}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      );
    }

    return (
      <AppTree
        blockNode
        defaultExpandAll
        selectedKeys={selectedDeptId === undefined ? [] : [String(selectedDeptId)]}
        treeData={departmentTreeData}
        onSelect={handleDepartmentSelect}
      />
    );
  }

  return (
    <div className="min-h-full flex flex-col gap-16px">
      <Flex align="flex-end" gap={16} justify="space-between" wrap="wrap">
        <div>
          <Typography.Title className="m-0!" level={2}>
            岗位管理
          </Typography.Title>
          <Typography.Text type="secondary">维护部门岗位与用户任职基础，岗位不直接代表系统权限。</Typography.Text>
        </div>
        <span className="rounded-full bg-container px-12px py-7px shadow-sm">
          <Badge status={postQuery.isError ? 'error' : 'success'} text="岗位服务已连接" />
        </span>
      </Flex>

      <div className="grid grid-cols-[240px_minmax(0,1fr)] items-start gap-16px lt-xl:grid-cols-1">
        <Card
          className="card-wrapper sticky top-16px max-h-[calc(100vh-112px)] overflow-hidden lt-xl:static lt-xl:max-h-none"
          extra={
            <ButtonIcon
              aria-label="刷新部门树"
              icon="ph:arrows-clockwise"
              loading={departmentQuery.isFetching}
              onClick={() => departmentQuery.refetch()}
            />
          }
          title={
            <Flex align="center" gap={8}>
              <SvgIcon icon="ph:buildings" />
              组织部门
            </Flex>
          }
          variant="borderless"
        >
          <Input
            allowClear
            className="mb-10px"
            placeholder="搜索部门"
            prefix={<SvgIcon className="text-tertiary" icon="ph:magnifying-glass" />}
            value={departmentKeyword}
            onChange={event => setDepartmentKeyword(event.target.value)}
          />
          <Button
            block
            className="mb-8px justify-start!"
            icon={<SvgIcon icon="ph:buildings" />}
            type={selectedDeptId === undefined ? 'primary' : 'text'}
            onClick={handleAllDepartments}
          >
            全部部门
          </Button>
          <div className="max-h-[calc(100vh-274px)] overflow-auto lt-xl:max-h-360px">
            <Spin spinning={departmentQuery.isLoading}>{renderDepartmentTree()}</Spin>
          </div>
          <div className="mt-12px border-t border-border-2 pt-10px text-11px text-tertiary">
            单击部门查看该部门及全部下级岗位
          </div>
        </Card>

        <div className="min-w-0 flex flex-col gap-16px">
          <Card className="card-wrapper" variant="borderless">
            <div className="grid grid-cols-[minmax(180px,1fr)_minmax(180px,1fr)_150px_auto] items-end gap-12px lt-lg:grid-cols-2 lt-sm:grid-cols-1">
              <div>
                <div className="mb-7px text-13px text-text-2">岗位名称</div>
                <Input
                  allowClear
                  placeholder="请输入岗位名称"
                  value={postName}
                  onChange={event => setPostName(event.target.value)}
                  onPressEnter={handleSearch}
                />
              </div>
              <div>
                <div className="mb-7px text-13px text-text-2">岗位编码</div>
                <Input
                  allowClear
                  placeholder="请输入岗位编码"
                  value={postCode}
                  onChange={event => setPostCode(event.target.value)}
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
              iconPosition="end"
              type="link"
              onClick={() => setMoreFiltersOpen(value => !value)}
            >
              {moreFiltersOpen ? '收起筛选' : '更多筛选'}
            </Button>

            {moreFiltersOpen ? (
              <div className="mt-10px grid grid-cols-3 gap-12px border-t border-dashed border-border-2 pt-14px lt-lg:grid-cols-1">
                <div>
                  <div className="mb-7px text-13px text-text-2">类别编码</div>
                  <Input
                    allowClear
                    placeholder="请输入类别编码"
                    value={postCategory}
                    onChange={event => setPostCategory(event.target.value)}
                    onPressEnter={handleSearch}
                  />
                </div>
                <div>
                  <div className="mb-7px text-13px text-text-2">精确部门</div>
                  <Select
                    allowClear
                    showSearch
                    className="w-full"
                    optionFilterProp="label"
                    options={departmentOptions.map(option => ({ label: option.label, value: option.value }))}
                    placeholder="只查询一个部门"
                    value={exactDeptId}
                    onChange={setExactDeptId}
                  />
                </div>
                <div>
                  <div className="mb-7px text-13px text-text-2">创建时间</div>
                  <DatePicker.RangePicker
                    className="w-full"
                    value={createdRange}
                    onChange={value => setCreatedRange(value)}
                  />
                </div>
              </div>
            ) : null}

            {hasMoreFilters && !moreFiltersOpen ? (
              <Tag bordered={false} className="mt-8px" color="blue">
                已应用更多筛选
              </Tag>
            ) : null}
          </Card>

          <Card
            className="min-w-0 card-wrapper"
            extra={
              <Space size={8} wrap>
                <Button icon={<SvgIcon icon="ph:plus" />} type="primary" onClick={handleAdd}>
                  新增岗位
                </Button>
                <Button
                  disabled={selectedPosts.length !== 1}
                  icon={<SvgIcon icon="ph:pencil-simple" />}
                  onClick={() => handleEdit(selectedPosts[0] as PostItem)}
                >
                  编辑
                </Button>
                <Button
                  danger
                  disabled={selectedPosts.length === 0}
                  icon={<SvgIcon icon="ph:trash" />}
                  loading={deleting}
                  onClick={() => handleDelete(selectedPosts)}
                >
                  批量删除
                </Button>
                <Tooltip title="当前后端尚未提供岗位导出接口">
                  <span>
                    <Button disabled icon={<SvgIcon icon="ph:download-simple" />}>
                      导出
                    </Button>
                  </span>
                </Tooltip>
                <Tooltip title="刷新岗位和部门数据">
                  <ButtonIcon
                    aria-label="刷新岗位和部门数据"
                    icon="ph:arrows-clockwise"
                    loading={postQuery.isFetching || departmentQuery.isFetching}
                    onClick={handleRefresh}
                  />
                </Tooltip>
                <Popover
                  content={
                    <Checkbox.Group
                      options={COLUMN_OPTIONS}
                      value={visibleOptionalColumns}
                      onChange={values => setVisibleOptionalColumns(values as PostOptionalColumn[])}
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
                <Typography.Text strong>岗位列表</Typography.Text>
                <Typography.Text type="secondary">共 {postQuery.data?.total ?? 0} 个岗位</Typography.Text>
                <Tag bordered={false} color="blue">
                  {scopeLabel}
                </Tag>
                {selectedRowKeys.length > 0 ? (
                  <Tag bordered={false} color="geekblue">
                    已选 {selectedRowKeys.length} 项
                  </Tag>
                ) : null}
              </Flex>
            }
            variant="borderless"
          >
            {postQuery.isError ? (
              <Alert
                action={
                  <Button size="small" onClick={() => postQuery.refetch()}>
                    重试
                  </Button>
                }
                className="mb-12px"
                message="岗位列表加载失败"
                showIcon
                type="error"
              />
            ) : null}

            <Table<PostItem>
              columns={columns}
              dataSource={posts}
              loading={postQuery.isLoading}
              locale={{
                emptyText: (
                  <Empty
                    description={Object.keys(filters).length > 0 ? '没有找到符合条件的岗位' : '当前还没有岗位'}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                )
              }}
              pagination={{
                current: postQuery.data?.current ?? current,
                pageSize: postQuery.data?.size ?? pageSize,
                pageSizeOptions: [10, 20, 50, 100],
                showQuickJumper: true,
                showSizeChanger: true,
                showTotal: total => `共 ${total} 条`,
                total: postQuery.data?.total ?? 0
              }}
              rowKey={post => String(post.postId)}
              rowSelection={{
                preserveSelectedRowKeys: false,
                selectedRowKeys,
                onChange: setSelectedRowKeys
              }}
              scroll={{ x: 1120 }}
              size="middle"
              onChange={handleTableChange}
            />
          </Card>
        </div>
      </div>

      <PostEditorDrawer
        departments={departmentQuery.data ?? []}
        loading={saving}
        mode={editorState.mode}
        open={editorState.open}
        postId={editorState.postId}
        presetDeptId={editorState.presetDeptId}
        onClose={handleCloseEditor}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export const Route = createFileRoute('/(admin)/system/post/')({
  component: PostManagement,
  staticData: {
    keepAlive: true,
    menu: {
      icon: 'ph:briefcase',
      order: 3
    },
    title: '岗位管理'
  }
});

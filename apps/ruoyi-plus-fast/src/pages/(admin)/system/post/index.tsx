import { useAdminState } from '@shell/layouts';
import { SvgIcon, TableHeaderOperation, useTable, useTableScroll } from '@shell/ui/compose';
import type { TableColumn, TableDataWithIndex, TableOnChange } from '@shell/ui/compose';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useLocation, useNavigate } from '@tanstack/react-router';
import { Alert, Badge, Button, Card, Collapse, Empty, Flex, Table, Tag, Tooltip, Typography } from 'antd';
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
  PostListPage,
  PostListParams,
  PostSavePayload
} from '@/service/api/system-post';

import PostDepartmentPanel from './modules/PostDepartmentPanel';
import PostEditorDrawer from './modules/PostEditorDrawer';
import type { PostEditorMode } from './modules/PostEditorDrawer';
import PostSearch from './modules/PostSearch';
import type { PostDepartmentOption } from './modules/PostSearch';
import {
  PostSearchSchema,
  getPostSearchInitialParams,
  hasPostFilters,
  normalizePostSearchParams,
  toPostSearchQuery
} from './modules/shared';

interface PostEditorState {
  mode: PostEditorMode;
  open: boolean;
  postId?: PostId;
  presetDeptId?: PostId;
}

interface PostManagementProps {
  /** 页面首次加载时使用的分页大小。 */
  initialPageSize?: number;
}

const INITIAL_EDITOR_STATE: PostEditorState = {
  mode: 'create',
  open: false
};

const POST_TABLE_SCROLL_X = 1120;

type PostTableRecord = TableDataWithIndex<PostItem>;

const PostManagement = (props: PostManagementProps) => {
  const { initialPageSize = 10 } = props;

  const navigate = useNavigate({ from: '/system/post/' });
  const location = useLocation();

  const queryClient = useQueryClient();
  const { isMobile } = useAdminState();
  const { scrollConfig, tableWrapperRef } = useTableScroll(POST_TABLE_SCROLL_X);
  const [selectedDeptId, setSelectedDeptId] = useState<PostId>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [editorState, setEditorState] = useState<PostEditorState>(INITIAL_EDITOR_STATE);

  const departmentQuery = usePostDeptTreeQuery();
  const departmentOptions = useMemo(() => {
    return flattenDepartments(departmentQuery.data ?? []);
  }, [departmentQuery.data]);

  const createMutation = useCreatePostMutation();
  const updateMutation = useUpdatePostMutation();
  const deleteMutation = useDeletePostsMutation();
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
  } = useTable<PostListParams, PostListPage, PostItem>({
    apiParams: getPostSearchInitialParams(initialPageSize),
    columns: createPostColumns,
    isMobile,
    onChange: handleTableChange,
    onSearchParamsChange: syncSearchParams,
    pagination: {
      pageSizeOptions: [10, 20, 50, 100],
      showQuickJumper: true,
      showTotal: value => `共 ${value} 条`
    },
    queryHook: usePostListQuery,
    // 查询条件写在 URL 上，刷新和分享链接都能回到同一屏
    routeSearch: location.searchStr,
    rowKey: post => String(post.postId),
    transformParams: normalizePostSearchParams
  });
  const posts = data;
  const saving = createMutation.isPending || updateMutation.isPending;
  const selectedPosts = posts.filter(post => selectedRowKeys.map(String).includes(String(post.postId)));
  const selectedDepartment = departmentOptions.find(option => String(option.value) === String(selectedDeptId));
  const exactDepartment = departmentOptions.find(option => String(option.value) === String(searchParams.deptId));
  const scopeLabel = getScopeLabel(exactDepartment, selectedDepartment);

  /** 把提交后的查询条件写回地址栏，刷新后由 routeSearch 原样读回来。 */
  function syncSearchParams(params: Partial<PostListParams>) {
    navigate({ search: () => toPostSearchQuery(params) });
  }

  function createPostColumns(): TableColumn<PostTableRecord>[] {
    const result: TableColumn<PostTableRecord>[] = [
      {
        dataIndex: 'postName',
        fixed: 'left',
        key: 'postName',
        minWidth: 180,
        render: (_value, post) => (
          <Flex
            align="center"
            gap={10}
          >
            <span className="size-30px grid shrink-0 place-items-center rounded-8px bg-primary-50 text-primary">
              <SvgIcon icon="ph:briefcase" />
            </span>
            <div className="min-w-0">
              <Typography.Text className="block truncate font-600">{post.postName}</Typography.Text>
              <Typography.Text
                className="block truncate font-mono text-11px"
                type="secondary"
              >
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
            <Button
              className="h-auto p-0! font-mono text-12px"
              type="link"
              onClick={() => copyPostCode(value)}
            >
              {value}
            </Button>
          </Tooltip>
        ),
        title: '岗位编码',
        width: 150
      }
    ];

    result.push({
      dataIndex: 'postCategory',
      key: 'postCategory',
      render: value =>
        value ? (
          <Tag
            variant="filled"
            className="m-0 font-mono text-11px"
          >
            {value}
          </Tag>
        ) : (
          <span className="text-tertiary">—</span>
        ),
      title: '类别编码',
      width: 120
    });

    result.push(
      {
        dataIndex: 'deptName',
        key: 'deptName',
        render: value =>
          value ? (
            <Flex
              align="center"
              gap={6}
            >
              <SvgIcon
                className="text-tertiary"
                icon="ph:buildings"
              />
              <span className="truncate">{value}</span>
            </Flex>
          ) : (
            <Tag
              variant="filled"
              color="error"
            >
              部门已失效
            </Tag>
          ),
        title: '所属部门',
        width: 160
      },
      {
        dataIndex: 'postSort',
        key: 'postSort',
        title: '排序',
        width: 90
      },
      {
        dataIndex: 'status',
        key: 'status',
        render: value => (
          <Badge
            status={value === '0' ? 'success' : 'warning'}
            text={value === '0' ? '正常' : '停用'}
          />
        ),
        title: '状态',
        width: 100
      }
    );

    result.push({
      dataIndex: 'createTime',
      key: 'createTime',
      render: value => value || <span className="text-tertiary">—</span>,
      title: '创建时间',
      width: 180
    });

    result.push({
      fixed: 'right',
      key: 'actions',
      render: (_value, post) => (
        <div className="flex-center justify-end gap-8px">
          <Button
            size="small"
            onClick={() => handleEdit(post)}
          >
            编辑
          </Button>
          <Button
            danger
            size="small"
            onClick={() => handleDelete([post])}
          >
            删除
          </Button>
        </div>
      ),
      title: '操作',
      width: 130
    });

    return result;
  }

  function handleResetSearchScope() {
    setSelectedDeptId(undefined);
    setSelectedRowKeys([]);
  }

  function handleExactDepartmentChange(deptId?: PostId) {
    if (deptId) setSelectedDeptId(undefined);
  }

  function handleDepartmentSelect(keys: Key[]) {
    if (keys.length === 0) {
      handleAllDepartments();
      return;
    }

    const deptId = String(keys[0]);
    setSelectedDeptId(deptId);
    setSelectedRowKeys([]);
    searchProps.form.setFieldsValue({ belongDeptId: deptId, deptId: undefined });
    updateSearchParams({ belongDeptId: deptId, current: 1, deptId: undefined });
  }

  function handleAllDepartments() {
    setSelectedDeptId(undefined);
    setSelectedRowKeys([]);
    searchProps.form.setFieldsValue({ belongDeptId: undefined, deptId: undefined });
    updateSearchParams({ belongDeptId: undefined, current: 1, deptId: undefined });
  }

  function handleTableChange(...args: TableOnChange<PostTableRecord>): Partial<PostListParams> {
    const [pagination, , sorter] = args;
    setSelectedRowKeys([]);

    const activeSorter = Array.isArray(sorter) ? sorter[0] : sorter;
    const nextSortField: PostListParams['orderByColumn'] =
      activeSorter.field === 'postSort' || activeSorter.field === 'createTime' ? activeSorter.field : undefined;
    let nextSortDirection: PostListParams['isAsc'];
    if (activeSorter.order === 'ascend') nextSortDirection = 'asc';
    if (activeSorter.order === 'descend') nextSortDirection = 'desc';

    return {
      current: pagination.current ?? 1,
      isAsc: nextSortDirection,
      orderByColumn: activeSorter.order ? nextSortField : undefined,
      size: pagination.pageSize ?? initialPageSize
    };
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
          <div className="mt-10px rounded-6px bg-layout px-10px py-8px text-12px text-secondary">
            {isBatch
              ? `${targetNames.slice(0, 3).join('、')}${targetNames.length > 3 ? ` 等 ${targetNames.length} 个岗位` : ''}`
              : `岗位编码：${targetPosts[0]?.postCode} · 所属部门：${targetPosts[0]?.deptName || '部门已失效'}`}
          </div>
        </div>
      ),
      okText: isBatch ? `删除 ${targetPosts.length} 个岗位` : '删除岗位',
      title: isBatch ? `删除已选的 ${targetPosts.length} 个岗位？` : `删除“${targetNames[0]}”？`,
      onOk: () => deletePostRecords(targetPosts)
    });
  }

  async function handleBatchDelete() {
    await deletePostRecords(selectedPosts);
  }

  async function deletePostRecords(targetPosts: PostItem[]) {
    await deleteMutation.mutateAsync(targetPosts.map(post => post.postId));
    setSelectedRowKeys([]);
    if (pageNum > 1 && targetPosts.length >= posts.length) {
      updateSearchParams({ current: pageNum - 1 });
    }
    await queryClient.invalidateQueries({ queryKey: SYSTEM_POST_QUERY_KEYS.LISTS });
    showSuccessMessage(targetPosts.length > 1 ? '所选岗位已删除' : '岗位已删除');
  }

  async function handleRefresh() {
    await Promise.all([getData(), departmentQuery.refetch()]);
    setSelectedRowKeys([]);
    showSuccessMessage('岗位和部门数据已刷新');
  }

  return (
    <div className="h-full min-h-500px flex flex-col gap-16px overflow-hidden lt-xl:overflow-auto">
      <div className="min-h-0 grid flex-1 grid-cols-[240px_minmax(0,1fr)] items-stretch gap-16px lt-xl:grid-cols-1">
        <PostDepartmentPanel
          departments={departmentQuery.data ?? []}
          error={departmentQuery.isError}
          fetching={departmentQuery.isFetching}
          loading={departmentQuery.isLoading}
          refresh={departmentQuery.refetch}
          selectedDeptId={selectedDeptId}
          onSelectAll={handleAllDepartments}
          onSelectDepartment={handleDepartmentSelect}
        />

        <div className="h-full min-h-0 min-w-0 flex flex-col gap-16px">
          <Collapse
            bordered={false}
            className="shrink-0 card-wrapper"
            defaultActiveKey={isMobile ? undefined : '1'}
            items={[
              {
                children: (
                  <PostSearch
                    {...searchProps}
                    departments={departmentOptions}
                    onExactDepartmentChange={handleExactDepartmentChange}
                    onReset={handleResetSearchScope}
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
                  add={handleAdd}
                  addText="新增岗位"
                  batchDeleteText="批量删除"
                  columns={columnChecks}
                  disabledDelete={selectedPosts.length === 0}
                  loading={tableProps.loading || departmentQuery.isFetching}
                  refresh={handleRefresh}
                  setColumnChecks={setColumnChecks}
                  onDelete={handleBatchDelete}
                />
              }
              title={
                <Flex
                  align="center"
                  gap={8}
                  wrap="wrap"
                >
                  <Typography.Text strong>岗位列表</Typography.Text>
                  <Typography.Text type="secondary">共 {total} 个岗位</Typography.Text>
                  <Tag
                    variant="filled"
                    color="blue"
                  >
                    {scopeLabel}
                  </Tag>
                  {selectedRowKeys.length > 0 ? (
                    <Tag
                      variant="filled"
                      color="geekblue"
                    >
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
                    <Button
                      size="small"
                      onClick={getData}
                    >
                      重试
                    </Button>
                  }
                  className="mb-12px"
                  title="岗位列表加载失败"
                  showIcon
                  type="error"
                />
              ) : null}

              <Table<PostTableRecord>
                {...tableProps}
                column={{ align: 'center' }}
                locale={{
                  emptyText: (
                    <Empty
                      description={hasPostFilters(searchParams) ? '没有找到符合条件的岗位' : '当前还没有岗位'}
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

function flattenDepartments(nodes: PostDeptTreeNode[], parentPath = ''): PostDepartmentOption[] {
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

function getScopeLabel(exactDepartment?: PostDepartmentOption, selectedDepartment?: PostDepartmentOption) {
  if (exactDepartment) return `${exactDepartment.shortLabel}（精确）`;
  if (selectedDepartment) return `${selectedDepartment.shortLabel}及下级`;
  return '全部部门';
}

async function copyPostCode(code: string) {
  try {
    await navigator.clipboard.writeText(code);
    showSuccessMessage('岗位编码已复制');
  } catch {
    showErrorMessage('复制失败，请手动复制岗位编码');
  }
}

export const Route = createFileRoute('/(admin)/system/post/')({
  component: PostManagement,
  staticData: {
    keepAlive: true,
    menu: {
      icon: 'ph:briefcase',
      order: 4
    },
    title: '岗位管理'
  },
  validateSearch: PostSearchSchema
});

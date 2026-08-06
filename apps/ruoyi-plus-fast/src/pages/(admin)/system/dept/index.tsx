import { useAdminState } from '@skyroc/web-admin-layouts';
import { SvgIcon, TableHeaderOperation, useTable, useTableScroll } from '@skyroc/web-ui-compose';
import type { PaginationData, TableColumn, TableDataWithIndex } from '@skyroc/web-ui-compose';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Alert, Avatar, Button, Card, Collapse, Empty, Flex, Table, Tag, Tooltip, Typography } from 'antd';
import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import type { Key } from 'react';

import { deleteModal } from '@/features/antd/deleteModal';
import {
  SYSTEM_DEPT_QUERY_KEYS,
  useCreateDeptMutation,
  useDeleteDeptMutation,
  useDeptListQuery,
  useUpdateDeptMutation
} from '@/service/api/system-dept';
import type { DeptId, DeptItem, DeptListParams, DeptSavePayload } from '@/service/api/system-dept';
import { SYSTEM_USER_QUERY_KEYS } from '@/service/api/system-user';

import { buildDeptTree, collectExpandableDeptKeys, hasDirectChildren, maskDeptPhone } from './modules/dept-utils';
import type { DeptEditorMode } from './modules/DeptEditorDrawer';
import DeptSearch from './modules/DeptSearch';

const DeptEditorDrawer = lazy(() => import('./modules/DeptEditorDrawer'));

const DEPT_TABLE_SCROLL_X = 1150;
const DEPT_SEARCH_INITIAL_PARAMS: DeptListParams = {
  deptCategory: undefined,
  deptName: undefined,
  status: undefined
};
const EMPTY_DEPARTMENTS: DeptTableRecord[] = [];

type DeptTableRecord = TableDataWithIndex<DeptItem>;

interface DeptEditorState {
  deptId?: DeptId;
  mode: DeptEditorMode;
  open: boolean;
  parentId?: DeptId;
}

interface DeptManagementProps {
  /** 页面首次加载完成后是否展开全部组织节点。 */
  initialExpandAll?: boolean;
}

const INITIAL_EDITOR_STATE: DeptEditorState = {
  mode: 'create',
  open: false
};

function renderLeader(department: DeptItem) {
  if (department.leader === null) return <span className="text-tertiary">未设置</span>;
  const label = department.leaderName || `用户 #${department.leader}`;
  return (
    <Flex align="center" gap={8}>
      <Avatar className="shrink-0 bg-primary-bg text-primary" size={25}>
        {label.slice(0, 1)}
      </Avatar>
      <span className="truncate">{label}</span>
    </Flex>
  );
}

const DeptManagement = (props: DeptManagementProps) => {
  const { initialExpandAll = true } = props;

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isMobile } = useAdminState();
  const { scrollConfig, tableWrapperRef } = useTableScroll(DEPT_TABLE_SCROLL_X);
  const [expandedRowKeys, setExpandedRowKeys] = useState<Key[]>([]);
  const [editorState, setEditorState] = useState<DeptEditorState>(INITIAL_EDITOR_STATE);

  const createMutation = useCreateDeptMutation();
  const updateMutation = useUpdateDeptMutation();
  const deleteMutation = useDeleteDeptMutation();
  const { columnChecks, data, getData, query, searchProps, setColumnChecks, tableProps } = useTable<
    DeptListParams,
    DeptItem[],
    DeptItem
  >({
    apiParams: DEPT_SEARCH_INITIAL_PARAMS,
    columns: createColumns,
    getColumnVisible: column => column.key !== 'createTime',
    isChangeURL: false,
    isMobile,
    pagination: false,
    queryHook: useDeptListQuery,
    rowKey: department => String(department.deptId),
    transformer: transformDeptList,
    transformParams: normalizeDeptSearchParams
  });
  const departments = data.length > 0 ? data : EMPTY_DEPARTMENTS;
  const deptTree = useMemo(() => buildDeptTree(departments), [departments]);
  const allExpandableKeys = useMemo(() => collectExpandableDeptKeys(deptTree), [deptTree]);
  const hasActiveFilters = Boolean(
    searchProps.searchParams.deptCategory || searchProps.searchParams.deptName || searchProps.searchParams.status
  );
  const saving = createMutation.isPending || updateMutation.isPending;
  const areAllExpanded =
    allExpandableKeys.length > 0 && allExpandableKeys.every(key => expandedRowKeys.map(String).includes(String(key)));

  useEffect(() => {
    const nextExpandedRowKeys = initialExpandAll ? allExpandableKeys : [];
    setExpandedRowKeys(currentKeys => {
      const unchanged =
        currentKeys.length === nextExpandedRowKeys.length &&
        currentKeys.every((key, index) => String(key) === String(nextExpandedRowKeys[index]));
      return unchanged ? currentKeys : nextExpandedRowKeys;
    });
  }, [allExpandableKeys, initialExpandAll]);

  function createColumns(): TableColumn<DeptTableRecord>[] {
    return [
      {
        dataIndex: 'deptName',
        fixed: 'left',
        key: 'deptName',
        minWidth: 240,
        render: value => (
          <Flex align="center" gap={9}>
            <span className="size-27px grid shrink-0 place-items-center rounded-7px bg-primary-1 text-primary">
              <SvgIcon icon="ph:buildings" />
            </span>
            <Typography.Text className="min-w-0 truncate font-600">{value}</Typography.Text>
          </Flex>
        ),
        title: '部门名称',
        width: 300
      },
      {
        dataIndex: 'deptCategory',
        key: 'deptCategory',
        render: value =>
          value ? (
            <Tag variant="filled" className="m-0">
              {value}
            </Tag>
          ) : (
            <span className="text-tertiary">—</span>
          ),
        title: '类别编码',
        width: 130
      },
      {
        dataIndex: 'leader',
        key: 'leader',
        render: (_leader, department) => renderLeader(department),
        title: '负责人',
        width: 150
      },
      {
        dataIndex: 'phone',
        key: 'phone',
        render: value => maskDeptPhone(value),
        title: '联系电话',
        width: 150
      },
      {
        dataIndex: 'orderNum',
        key: 'orderNum',
        title: '排序',
        width: 90
      },
      {
        dataIndex: 'status',
        key: 'status',
        render: value => (
          <Tag variant="filled" color={value === '0' ? 'success' : 'warning'}>
            {value === '0' ? '正常' : '停用'}
          </Tag>
        ),
        title: '状态',
        width: 100
      },
      {
        dataIndex: 'createTime',
        key: 'createTime',
        render: value => value || <span className="text-tertiary">—</span>,
        title: '创建时间',
        width: 170
      },
      {
        fixed: 'right',
        key: 'actions',
        render: (_value, department) => (
          <div className="flex-center justify-end gap-8px">
            {department.status === '0' ? (
              <Button ghost size="small" type="primary" onClick={() => handleAddChild(department)}>
                新增下级
              </Button>
            ) : (
              <Tooltip title="停用部门不能新增下级">
                <Button disabled ghost size="small" type="primary">
                  新增下级
                </Button>
              </Tooltip>
            )}
            <Button size="small" onClick={() => handleEdit(department)}>
              编辑
            </Button>
            <Button size="small" onClick={() => handleViewMembers(department)}>
              成员
            </Button>
            <Button danger size="small" onClick={() => handleDelete(department)}>
              删除
            </Button>
          </div>
        ),
        title: '操作',
        width: 280
      }
    ];
  }

  function handleAddRoot() {
    setEditorState({ mode: 'create', open: true, parentId: 0 });
  }

  function handleAddChild(department: DeptItem) {
    setEditorState({ mode: 'create', open: true, parentId: department.deptId });
  }

  function handleEdit(department: DeptItem) {
    setEditorState({ deptId: department.deptId, mode: 'update', open: true });
  }

  function handleCloseEditor() {
    if (!saving) setEditorState(INITIAL_EDITOR_STATE);
  }

  async function handleSubmit(values: DeptSavePayload) {
    if (editorState.mode === 'create') {
      await createMutation.mutateAsync(values);
    } else {
      await updateMutation.mutateAsync({
        ...values,
        deptId: editorState.deptId as DeptId
      });
    }

    setEditorState(INITIAL_EDITOR_STATE);
    await refreshDeptCaches();
    showSuccessMessage(editorState.mode === 'create' ? '部门新增成功' : '部门信息已更新');
  }

  function handleDelete(department: DeptItem) {
    if (hasDirectChildren(departments, department.deptId)) {
      showWarningMessage(`“${department.deptName}”存在下级部门，不能删除`);
      return;
    }

    deleteModal({
      content: '删除后将不能继续分配用户，历史审计记录仍会保留。后端还会检查关联用户和岗位。',
      okText: '删除部门',
      title: `删除“${department.deptName}”`,
      onOk: async () => {
        await deleteMutation.mutateAsync(department.deptId);
        await refreshDeptCaches();
        showSuccessMessage('部门已删除');
      }
    });
  }

  function handleViewMembers(department: DeptItem) {
    navigate({
      search: { deptId: String(department.deptId) },
      to: '/system/user'
    });
  }

  function handleToggleExpandAll() {
    setExpandedRowKeys(areAllExpanded ? [] : allExpandableKeys);
  }

  async function handleRefresh() {
    await getData();
    showSuccessMessage('部门数据已刷新');
  }

  async function refreshDeptCaches() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: SYSTEM_DEPT_QUERY_KEYS.ALL }),
      queryClient.invalidateQueries({ queryKey: SYSTEM_USER_QUERY_KEYS.DEPT_TREE }),
    ]);
  }

  return (
    <div className="h-full min-h-500px flex flex-col gap-16px overflow-hidden lt-sm:overflow-auto">
      <Collapse
        bordered={false}
        className="card-wrapper"
        defaultActiveKey={isMobile ? undefined : '1'}
        items={[
          {
            children: <DeptSearch {...searchProps} />,
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
              add={handleAddRoot}
              addText="新增顶级部门"
              columns={columnChecks}
              loading={tableProps.loading}
              prefix={
                <Button
                  icon={<SvgIcon icon="ph:arrows-in-line-vertical" />}
                  size="small"
                  onClick={handleToggleExpandAll}
                >
                  {areAllExpanded ? '全部收起' : '全部展开'}
                </Button>
              }
              refresh={handleRefresh}
              setColumnChecks={setColumnChecks}
            />
          }
          title={
            <Flex align="center" gap={8}>
              <Typography.Text strong>组织架构</Typography.Text>
              <Typography.Text type="secondary">
                {hasActiveFilters ? '命中' : '共'} {departments.length} 个部门
              </Typography.Text>
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
              title="部门列表加载失败"
              showIcon
              type="error"
            />
          ) : null}

          <Table<DeptTableRecord>
            {...tableProps}
            dataSource={deptTree}
            expandable={{
              expandedRowKeys,
              indentSize: 24,
              onExpandedRowsChange: keys => setExpandedRowKeys([...keys])
            }}
            locale={{
              emptyText: (
                <Empty
                  description={hasActiveFilters ? '没有找到符合条件的部门' : '还没有部门'}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )
            }}
            scroll={scrollConfig}
            size="small"
          />
        </Card>
      </div>

      <Suspense fallback={null}>
        <DeptEditorDrawer
          deptId={editorState.deptId}
          loading={saving}
          mode={editorState.mode}
          open={editorState.open}
          parentId={editorState.parentId}
          onClose={handleCloseEditor}
          onSubmit={handleSubmit}
        />
      </Suspense>
    </div>
  );
};

function normalizeDeptSearchParams(params: DeptListParams): DeptListParams {
  return {
    deptCategory: params.deptCategory?.trim() || undefined,
    deptName: params.deptName?.trim() || undefined,
    status: params.status
  };
}

function transformDeptList(response: DeptItem[]): PaginationData<DeptItem> {
  return {
    data: response,
    pageNum: 1,
    pageSize: response.length,
    total: response.length
  };
}

export const Route = createFileRoute('/(admin)/system/dept/')({
  component: DeptManagement,
  staticData: {
    keepAlive: true,
    menu: {
      icon: 'ph:buildings',
      order: 2
    },
    title: '部门管理'
  }
});

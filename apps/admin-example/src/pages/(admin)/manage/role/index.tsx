import { useAdminState } from '@shell/layouts';
import { TableHeaderOperation, useTable, useTableOperate, useTableScroll } from '@shell/ui/compose';
import type { TableColumn, TableDataWithIndex } from '@shell/ui/compose';
import { createFileRoute, useLocation, useNavigate } from '@tanstack/react-router';
import { Button, Card, Collapse, Popconfirm, Table, Tag } from 'antd';
import { Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';

import { useRoleListQuery } from '@/service/api/system-manage/hooks';

import RoleSearch from './modules/RoleSearch';
import {
  RoleSearchSchema,
  enableStatusTagColorRecord,
  getRoleSearchInitialParams,
  normalizeRoleSearchParams,
  roleStatusRecord
} from './modules/shared';

const RoleOperateDrawer = lazy(() => import('./modules/RoleOperateDrawer'));

const ROLE_TABLE_SCROLL_X = 792;

type RoleTableRecord = TableDataWithIndex<Api.SystemManage.Role>;

const RoleManage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate({ from: '/manage/role/' });
  const location = useLocation();
  const { isMobile } = useAdminState();
  const { scrollConfig, tableWrapperRef } = useTableScroll(ROLE_TABLE_SCROLL_X);

  const { columnChecks, data, getData, searchProps, setColumnChecks, tableProps } = useTable({
    apiParams: getRoleSearchInitialParams(),
    columns: createColumns,
    isMobile,
    onSearchParamsChange: syncSearchParams,
    pagination: {
      showQuickJumper: true
    },
    queryHook: useRoleListQuery,
    routeSearch: location.searchStr,
    transformParams: normalizeRoleSearchParams
  });

  const {
    checkedRowKeys,
    editingData,
    generalPopupOperation,
    handleAdd,
    handleEdit,
    onBatchDeleted,
    onDeleted,
    rowSelection
  } = useTableOperate<RoleTableRecord>(data, getData);

  async function handleBatchDelete() {
    await onBatchDeleted();
  }

  async function handleDelete(_id: number) {
    await onDeleted();
  }

  function edit(id: number) {
    handleEdit(id);
  }

  function goDetail(id: number) {
    navigate({ params: { id: String(id) }, to: '/manage/role/$id' });
  }

  function syncSearchParams(params: Partial<Api.SystemManage.RoleSearchParams>) {
    navigate({
      search: _previous => params
    });
  }

  function createColumns(): TableColumn<RoleTableRecord>[] {
    return [
      {
        align: 'center',
        dataIndex: 'index',
        fixed: 'left',
        key: 'index',
        minWidth: 64,
        title: t('common.index'),
        width: 64
      },
      {
        align: 'center',
        dataIndex: 'roleName',
        key: 'roleName',
        minWidth: 120,
        title: t('page.manage.role.roleName')
      },
      {
        align: 'center',
        dataIndex: 'roleCode',
        key: 'roleCode',
        minWidth: 120,
        title: t('page.manage.role.roleCode')
      },
      {
        dataIndex: 'roleDesc',
        key: 'roleDesc',
        minWidth: 120,
        title: t('page.manage.role.roleDesc')
      },
      {
        align: 'center',
        dataIndex: 'status',
        key: 'status',
        minWidth: 100,
        render: (_, record) => {
          if (!record.status) return null;

          return (
            <Tag color={enableStatusTagColorRecord[record.status]}>{t(roleStatusRecord.status[record.status])}</Tag>
          );
        },
        title: t('page.manage.role.roleStatus'),
        width: 100
      },
      {
        align: 'center',
        fixed: 'right',
        key: 'operate',
        minWidth: 220,
        render: (_, record) => (
          <div className="flex-center gap-8px">
            <Button
              ghost
              size="small"
              type="primary"
              onClick={() => edit(record.id)}
            >
              {t('common.edit')}
            </Button>
            <Button
              size="small"
              onClick={() => goDetail(record.id)}
            >
              {t('common.detail')}
            </Button>
            <Popconfirm
              title={t('common.confirmDelete')}
              onConfirm={() => handleDelete(record.id)}
            >
              <Button
                danger
                size="small"
              >
                {t('common.delete')}
              </Button>
            </Popconfirm>
          </div>
        ),
        title: t('common.operate'),
        width: 220
      }
    ];
  }

  return (
    <div className="h-full min-h-500px flex flex-col gap-16px overflow-hidden lt-sm:overflow-auto">
      <Collapse
        bordered={false}
        className="card-wrapper"
        defaultActiveKey={isMobile ? undefined : '1'}
        items={[
          {
            children: <RoleSearch {...searchProps} />,
            key: '1',
            label: t('common.search')
          }
        ]}
      />

      <div
        className="min-h-0 flex flex-1 flex-col"
        ref={tableWrapperRef}
      >
        <Card
          className="min-h-0 flex flex-1 flex-col card-wrapper"
          extra={
            <TableHeaderOperation
              add={handleAdd}
              columns={columnChecks}
              disabledDelete={checkedRowKeys.length === 0}
              loading={tableProps.loading}
              refresh={getData}
              setColumnChecks={setColumnChecks}
              onDelete={handleBatchDelete}
            />
          }
          title={t('page.manage.role.title')}
          variant="borderless"
        >
          <Table
            rowSelection={rowSelection}
            scroll={scrollConfig}
            size="small"
            {...tableProps}
          />
          <Suspense fallback={null}>
            <RoleOperateDrawer
              {...generalPopupOperation}
              rowId={editingData?.id ?? -1}
            />
          </Suspense>
        </Card>
      </div>
    </div>
  );
};

export const Route = createFileRoute('/(admin)/manage/role/')({
  component: RoleManage,
  staticData: {
    i18nKey: 'route.manage_role',
    menu: {
      icon: 'carbon:user-role',
      order: 2
    },
    keepAlive: true,
    permissions: ['R_ADMIN'],
    title: 'role'
  },
  validateSearch: RoleSearchSchema
});

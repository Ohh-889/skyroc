import { useAdminState } from '@shell/layouts';
import { TableHeaderOperation, useTable, useTableOperate, useTableScroll } from '@shell/ui/compose';
import type { TableColumn, TableDataWithIndex } from '@shell/ui/compose';
import { createFileRoute, useLocation, useNavigate } from '@tanstack/react-router';
import { Button, Card, Collapse, Popconfirm, Table, Tag } from 'antd';
import { Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';

import { useUserListQuery } from '@/service/api/system-manage/hooks';

import {
  UserSearchSchema,
  enableStatusTagColorRecord,
  getUserSearchInitialParams,
  normalizeUserSearchParams,
  userGenderTagColorRecord,
  userStatusRecord
} from './modules/shared';
import UserSearch from './modules/UserSearch';

const UserOperateDrawer = lazy(() => import('./modules/UserOperateDrawer'));

const USER_TABLE_SCROLL_X = 1132;

type UserTableRecord = TableDataWithIndex<Api.SystemManage.User>;

const UserManage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate({ from: '/manage/user/' });
  const location = useLocation();
  const { isMobile } = useAdminState();
  const { scrollConfig, tableWrapperRef } = useTableScroll(USER_TABLE_SCROLL_X);

  const { columnChecks, data, getData, searchProps, setColumnChecks, tableProps } = useTable({
    apiParams: getUserSearchInitialParams(),
    columns: createColumns,
    isMobile,
    onSearchParamsChange: syncSearchParams,
    pagination: {
      showQuickJumper: true
    },
    queryHook: useUserListQuery,
    routeSearch: location.searchStr,
    transformParams: normalizeUserSearchParams
  });

  const { checkedRowKeys, generalPopupOperation, handleAdd, handleEdit, onBatchDeleted, onDeleted, rowSelection } =
    useTableOperate<UserTableRecord>(data, getData);

  async function handleBatchDelete() {
    await onBatchDeleted();
  }

  async function handleDelete() {
    await onDeleted();
  }

  function edit(id: number) {
    handleEdit(id);
  }

  function goDetail(id: number) {
    navigate({ params: { id: String(id) }, to: '/manage/user/$id' });
  }

  function syncSearchParams(params: Partial<Api.SystemManage.UserSearchParams>) {
    navigate({
      search: _previous => params
    });
  }

  function createColumns(): TableColumn<UserTableRecord>[] {
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
        dataIndex: 'userName',
        key: 'userName',
        minWidth: 120,
        title: t('page.manage.user.userName')
      },
      {
        align: 'center',
        dataIndex: 'userGender',
        key: 'userGender',
        minWidth: 100,
        render: (_, record) => {
          if (!record.userGender) return null;

          return (
            <Tag color={userGenderTagColorRecord[record.userGender]}>
              {t(userStatusRecord.gender[record.userGender])}
            </Tag>
          );
        },
        title: t('page.manage.user.userGender'),
        width: 100
      },
      {
        align: 'center',
        dataIndex: 'nickName',
        key: 'nickName',
        minWidth: 120,
        title: t('page.manage.user.nickName')
      },
      {
        align: 'center',
        dataIndex: 'userPhone',
        key: 'userPhone',
        minWidth: 140,
        title: t('page.manage.user.userPhone'),
        width: 140
      },
      {
        align: 'center',
        dataIndex: 'userEmail',
        key: 'userEmail',
        minWidth: 220,
        title: t('page.manage.user.userEmail')
      },
      {
        align: 'center',
        dataIndex: 'status',
        key: 'status',
        minWidth: 100,
        render: (_, record) => {
          if (!record.status) return null;

          return (
            <Tag color={enableStatusTagColorRecord[record.status]}>{t(userStatusRecord.status[record.status])}</Tag>
          );
        },
        title: t('page.manage.user.userStatus'),
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
              onConfirm={handleDelete}
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
            children: <UserSearch {...searchProps} />,
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
          title={t('page.manage.user.title')}
          variant="borderless"
        >
          <Table
            rowSelection={rowSelection}
            scroll={scrollConfig}
            size="small"
            {...tableProps}
          />
          <Suspense fallback={null}>
            <UserOperateDrawer {...generalPopupOperation} />
          </Suspense>
        </Card>
      </div>
    </div>
  );
};

export const Route = createFileRoute('/(admin)/manage/user/')({
  component: UserManage,
  staticData: {
    i18nKey: 'route.manage_user',
    keepAlive: true,
    menu: {
      icon: 'ph:users-three',
      order: 1
    },
    permissions: ['R_ADMIN'],
    title: 'user'
  },
  validateSearch: UserSearchSchema
});

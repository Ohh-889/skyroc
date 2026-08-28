import { useAdminState } from '@shell/layouts';
import { SvgIcon, TableHeaderOperation, useTable, useTableOperate, useTableScroll } from '@shell/ui/compose';
import type { TableColumn, TableDataWithIndex } from '@shell/ui/compose';
import type { QueryKey, UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useLocation, useNavigate } from '@tanstack/react-router';
import { Button, Card, Collapse, Popconfirm, Table, Tag } from 'antd';
import { Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';

import { menuExtras } from '@/features/menus/extras';
import { menuCategoryKeys } from '@/features/menus/menu-category';
import { fetchGetBackendRoutes } from '@/service/api/route/api';

import MenuSearch from './modules/MenuSearch';
import {
  MenuSearchSchema,
  collectRouteBranchIds,
  createBackendRouteFormModel,
  createDefaultBackendRouteFormModel,
  filterBackendRouteResponse,
  flattenParentRouteOptions,
  flattenRoutePathOptions,
  getBackendRouteSearchInitialParams,
  normalizeMenuSearchParams,
  routeMenuRecord,
  routeMenuTypeTagColorRecord
} from './modules/shared';
import type {
  BackendRouteFormModel,
  BackendRouteListResponse,
  BackendRouteTableRecord,
  MenuSearchParams
} from './modules/shared';

const MenuOperateDrawer = lazy(() => import('./modules/MenuOperateDrawer'));

const DEFAULT_MENU_ICON = import.meta.env.VITE_MENU_ICON || 'mdi:menu';

const MENU_TABLE_SCROLL_X = 1260;

type MenuTableRecord = TableDataWithIndex<BackendRouteTableRecord>;
type BackendRouteListQueryOptions<Data = BackendRouteListResponse> = Omit<
  UseQueryOptions<BackendRouteListResponse, Error, Data, QueryKey>,
  'queryFn' | 'queryKey'
>;

const layoutOptions = createLayoutOptions();
const extraOptions = createExtraOptions();

const MenuManage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate({ from: '/manage/menu/' });
  const location = useLocation();
  const { isMobile } = useAdminState();
  const { scrollConfig, tableWrapperRef } = useTableScroll(MENU_TABLE_SCROLL_X);

  const { columnChecks, data, getData, searchProps, setColumnChecks, tableProps } = useTable({
    apiParams: getBackendRouteSearchInitialParams(),
    columns: createColumns,
    defaultExpandAllRows: true,
    isMobile,
    onSearchParamsChange: syncSearchParams,
    pagination: false,
    queryHook: useBackendRouteListQuery,
    routeSearch: location.searchStr,
    transformParams: normalizeMenuSearchParams
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
  } = useTableOperate<MenuTableRecord>(data, getData);

  const ignoredParentIds = editingData ? collectRouteBranchIds(editingData) : new Set<string>();
  const menuOptions = flattenParentRouteOptions(data, ignoredParentIds);
  const routePathOptions = flattenRoutePathOptions(data);

  async function handleBatchDelete() {
    await onBatchDeleted();
  }

  async function handleDelete() {
    await onDeleted();
  }

  function handleAddMenu() {
    handleAdd();
    setMenuFormValues(
      createDefaultBackendRouteFormModel({
        layout: layoutOptions[0]?.value ?? null
      })
    );
  }

  function handleAddChildMenu(record: MenuTableRecord) {
    handleAdd();
    setMenuFormValues(
      createDefaultBackendRouteFormModel({
        layout: record.layout,
        parentId: record.id,
        type: 'item'
      })
    );
  }

  function edit(record: MenuTableRecord) {
    handleEdit({
      ...record,
      ...createBackendRouteFormModel(record)
    });
  }

  function syncSearchParams(params: Partial<MenuSearchParams>) {
    navigate({
      search: _previous => params
    });
  }

  function setMenuFormValues(values: BackendRouteFormModel) {
    generalPopupOperation.form.setFieldsValue(
      values as unknown as Parameters<typeof generalPopupOperation.form.setFieldsValue>[0]
    );
  }

  function createColumns(): TableColumn<MenuTableRecord>[] {
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
        key: 'icon',
        minWidth: 72,
        render: (_, record) => renderRouteIcon(record),
        title: t('page.manage.menu.icon'),
        width: 72
      },
      {
        align: 'center',
        key: 'menuType',
        minWidth: 100,
        render: (_, record) => (
          <Tag color={routeMenuTypeTagColorRecord[record.type]}>{t(routeMenuRecord.type[record.type])}</Tag>
        ),
        title: t('page.manage.menu.menuType'),
        width: 100
      },
      {
        key: 'menuName',
        minWidth: 220,
        render: (_, record) => <span className="font-medium">{getMenuTitle(record, t)}</span>,
        title: t('page.manage.menu.menuName')
      },
      {
        dataIndex: 'path',
        key: 'routePath',
        minWidth: 200,
        title: t('page.manage.menu.routePath')
      },
      {
        dataIndex: 'layout',
        key: 'layout',
        minWidth: 120,
        title: t('page.manage.menu.layout'),
        width: 120
      },
      {
        align: 'center',
        key: 'hideInMenu',
        minWidth: 96,
        render: (_, record) => renderBooleanTag(record.hideInMenu),
        title: t('page.manage.menu.hideInMenu'),
        width: 96
      },
      {
        align: 'center',
        dataIndex: 'order',
        key: 'order',
        minWidth: 72,
        title: t('page.manage.menu.order'),
        width: 72
      },
      {
        align: 'center',
        fixed: 'right',
        key: 'operate',
        minWidth: 240,
        render: (_, record) => (
          <div className="flex-center justify-end gap-8px">
            {record.type !== 'divider' && (
              <Button
                ghost
                size="small"
                type="primary"
                onClick={() => handleAddChildMenu(record)}
              >
                {t('page.manage.menu.addChildMenu')}
              </Button>
            )}
            <Button
              size="small"
              onClick={() => edit(record)}
            >
              {t('common.edit')}
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
        width: 240
      }
    ];
  }

  function renderBooleanTag(value: boolean) {
    return value ? (
      <Tag color="warning">{t('common.yesOrNo.yes')}</Tag>
    ) : (
      <Tag color="default">{t('common.yesOrNo.no')}</Tag>
    );
  }

  return (
    <div className="h-full min-h-500px flex flex-col gap-16px overflow-hidden lt-sm:overflow-auto">
      <Collapse
        bordered={false}
        className="card-wrapper"
        defaultActiveKey={isMobile ? undefined : '1'}
        items={[
          {
            children: (
              <MenuSearch
                {...searchProps}
                layoutOptions={layoutOptions}
              />
            ),
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
              add={handleAddMenu}
              columns={columnChecks}
              disabledDelete={checkedRowKeys.length === 0}
              loading={tableProps.loading}
              refresh={getData}
              setColumnChecks={setColumnChecks}
              onDelete={handleBatchDelete}
            />
          }
          title={t('page.manage.menu.title')}
          variant="borderless"
        >
          <Table
            rowSelection={rowSelection}
            scroll={scrollConfig}
            size="small"
            {...tableProps}
          />
          <Suspense fallback={null}>
            <MenuOperateDrawer
              {...generalPopupOperation}
              extraOptions={extraOptions}
              layoutOptions={layoutOptions}
              menuOptions={menuOptions}
              routePathOptions={routePathOptions}
            />
          </Suspense>
        </Card>
      </div>
    </div>
  );
};

function useBackendRouteListQuery<Data = BackendRouteListResponse>(
  params: MenuSearchParams,
  options?: BackendRouteListQueryOptions<Data>
) {
  return useQuery({
    ...options,
    queryFn: () => fetchBackendRouteList(params),
    queryKey: backendRouteListQueryKey(params)
  });
}

async function fetchBackendRouteList(params: MenuSearchParams): Promise<BackendRouteListResponse> {
  const response = await fetchGetBackendRoutes();

  return filterBackendRouteResponse(response, params);
}

function backendRouteListQueryKey(params: MenuSearchParams) {
  return ['route', 'backendRouteList', params] as const;
}

function renderRouteIcon(record: MenuTableRecord) {
  const icon = record.localIcon ? (
    <SvgIcon
      className="text-20px"
      localIcon={record.localIcon}
    />
  ) : (
    <SvgIcon
      className="text-20px"
      icon={record.icon || DEFAULT_MENU_ICON}
    />
  );

  return <span className="inline-flex w-full items-center justify-center">{icon}</span>;
}

function getMenuTitle(record: MenuTableRecord, t: (key: string) => string) {
  return getTranslatedRouteTitle(record.i18nKey, t) ?? getFallbackMenuTitle(record);
}

function getTranslatedRouteTitle(i18nKey: string | null, t: (key: string) => string) {
  if (!i18nKey) return null;

  const candidates = [i18nKey, ...getRouteI18nFallbackKeys(i18nKey)];

  for (const candidate of candidates) {
    const translated = t(candidate);

    if (translated !== candidate) {
      return translated;
    }
  }

  return null;
}

function getRouteI18nFallbackKeys(i18nKey: string) {
  const match = i18nKey.match(/^route\.\([^)]+\)_(.+)$/);

  if (!match?.[1]) return [];

  return [`route.${match[1]}`];
}

function getFallbackMenuTitle(record: MenuTableRecord) {
  const candidates = [record.title, record.name, record.path];

  return candidates.find(Boolean) ?? record.id;
}

function createLayoutOptions(): Common.Option<Router.MenuCategoryKey>[] {
  return menuCategoryKeys.map(key => ({
    label: key,
    value: key
  }));
}

function createExtraOptions(): Common.Option<Router.Extra>[] {
  return (Object.keys(menuExtras) as Router.Extra[]).map(key => ({
    label: key,
    value: key
  }));
}

export const Route = createFileRoute('/(admin)/manage/menu/')({
  component: MenuManage,
  staticData: {
    i18nKey: 'route.manage_menu',
    keepAlive: true,
    menu: {
      icon: 'material-symbols:account-tree-outline',
      order: 3
    },
    permissions: ['R_ADMIN'],
    title: 'menu'
  },
  validateSearch: MenuSearchSchema
});

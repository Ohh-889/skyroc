import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Suspense, lazy, useEffect, useState } from 'react';
import type { Key } from 'react';

import { deleteModal } from '@/features/antd/deleteModal';
import { ROUTE_QUERY_KEYS } from '@/service/api/route/keys';
import {
  SYSTEM_MENU_QUERY_KEYS,
  useCreateMenuMutation,
  useDeleteMenuMutation,
  useDeleteMenusCascadeMutation,
  useMenuDetailQuery,
  useMenuListQuery,
  useUpdateMenuMutation
} from '@/service/api/system-menu';
import type { MenuId, MenuItem, MenuSavePayload, MenuType } from '@/service/api/system-menu';

import {
  collectDescendantIds,
  findMenu,
  getButtonPermissions,
  getDirectChildren,
  getMenuPath,
  isRouteMenu,
  normalizeMenuPayload
} from './modules/menu-utils';
import MenuDetailCard from './modules/MenuDetailCard';
import type { EditorMode } from './modules/MenuEditorDrawer';
import MenuResourceCard from './modules/MenuResourceCard';
import MenuTreePanel from './modules/MenuTreePanel';

const MenuEditorDrawer = lazy(() => import('./modules/MenuEditorDrawer'));

interface MenuManagementProps {
  /** 首次进入页面时优先选中的菜单 ID。 */
  initialSelectedMenuId?: MenuId;
}

interface MenuEditorState {
  fixedType?: MenuType;
  menuId?: MenuId;
  mode: EditorMode;
  open: boolean;
  parentId?: MenuId;
}

const INITIAL_EDITOR_STATE: MenuEditorState = {
  mode: 'create',
  open: false
};

const MenuManagement = (props: MenuManagementProps) => {
  const { initialSelectedMenuId } = props;

  const queryClient = useQueryClient();
  const [selectedMenuId, setSelectedMenuId] = useState<MenuId | undefined>(initialSelectedMenuId);
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
  const [editorState, setEditorState] = useState<MenuEditorState>(INITIAL_EDITOR_STATE);

  const menuListQuery = useMenuListQuery();
  const menuDetailQuery = useMenuDetailQuery(selectedMenuId);
  const createMutation = useCreateMenuMutation();
  const updateMutation = useUpdateMenuMutation();
  const deleteMutation = useDeleteMenuMutation();
  const cascadeDeleteMutation = useDeleteMenusCascadeMutation();
  const menus = menuListQuery.data ?? [];
  const selectedMenu = menuDetailQuery.data ?? findMenu(menus, selectedMenuId);
  const directChildren = selectedMenu ? getDirectChildren(menus, selectedMenu.menuId) : [];
  const permissions = selectedMenu ? getButtonPermissions(menus, selectedMenu.menuId) : [];
  const editorMenu = findMenu(menus, editorState.menuId);
  const editorLoading = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    const routeMenus = menus.filter(isRouteMenu);
    if (routeMenus.length === 0) {
      setSelectedMenuId(undefined);
      return;
    }

    const currentMenu = findMenu(routeMenus, selectedMenuId);
    if (currentMenu) return;

    const initialMenu =
      findMenu(routeMenus, initialSelectedMenuId) ?? routeMenus.find(menu => menu.menuType === 'C') ?? routeMenus[0];
    setSelectedMenuId(initialMenu.menuId);
    setExpandedKeys(collectAncestorKeys(routeMenus, initialMenu.menuId));
  }, [initialSelectedMenuId, menus, selectedMenuId]);

  function handleSelectMenu(menuId: MenuId) {
    setSelectedMenuId(menuId);
    setExpandedKeys(current => mergeKeys(current, collectAncestorKeys(menus, menuId)));
  }

  function handleAddRoot() {
    setEditorState({
      fixedType: 'M',
      mode: 'create',
      open: true,
      parentId: 0
    });
  }

  function handleAddChild(parent: MenuItem) {
    setEditorState({
      fixedType: parent.menuType === 'C' ? 'F' : 'C',
      mode: 'create',
      open: true,
      parentId: parent.menuId
    });
  }

  function handleAddResource() {
    if (!selectedMenu) return;
    handleAddChild(selectedMenu);
  }

  function handleEditMenu(menu: MenuItem) {
    setEditorState({
      menuId: menu.menuId,
      mode: 'update',
      open: true,
      parentId: menu.parentId
    });
  }

  function handleEditPermission(permission: MenuItem) {
    setEditorState({
      fixedType: 'F',
      menuId: permission.menuId,
      mode: 'update',
      open: true,
      parentId: permission.parentId
    });
  }

  function handleCloseEditor() {
    setEditorState(INITIAL_EDITOR_STATE);
  }

  async function handleSubmit(values: MenuSavePayload) {
    const payload = normalizeMenuPayload(values);
    const savedMenu =
      editorState.mode === 'create'
        ? await createMutation.mutateAsync(payload)
        : await updateMutation.mutateAsync({
            ...payload,
            menuId: editorState.menuId as MenuId
          });

    handleCloseEditor();
    await refreshMenuCaches();
    if (savedMenu.menuType !== 'F') {
      setSelectedMenuId(savedMenu.menuId);
      setExpandedKeys(current => mergeKeys(current, [String(savedMenu.parentId)]));
    }
    showSuccessMessage(editorState.mode === 'create' ? '菜单新增成功' : '菜单修改成功');
  }

  function handleDeleteSelectedMenu() {
    if (selectedMenu) handleDeleteMenu(selectedMenu);
  }

  function handleDeleteMenu(menu: MenuItem) {
    const deleteIds = collectDescendantIds(menus, menu.menuId);
    const descendantCount = deleteIds.length - 1;

    deleteModal({
      content:
        descendantCount > 0
          ? `将同时删除 ${descendantCount} 个后代节点，并解除相关角色菜单绑定。此操作不可撤销。`
          : '删除前后端会检查角色引用。此操作不可撤销。',
      okText: descendantCount > 0 ? '级联删除' : '确认删除',
      title: `删除“${menu.menuName}”`,
      onOk: async () => {
        if (descendantCount > 0) {
          await cascadeDeleteMutation.mutateAsync(deleteIds);
        } else {
          await deleteMutation.mutateAsync(menu.menuId);
        }

        const parentId = menu.parentId;
        await refreshMenuCaches();
        const parent = findMenu(menus, parentId);
        setSelectedMenuId(parent && isRouteMenu(parent) ? parent.menuId : undefined);
        showSuccessMessage('菜单删除成功');
      }
    });
  }

  async function handleRefresh() {
    await menuListQuery.refetch();
    if (selectedMenuId) await menuDetailQuery.refetch();
    showSuccessMessage('菜单数据已刷新');
  }

  async function refreshMenuCaches() {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: SYSTEM_MENU_QUERY_KEYS.ALL
      }),
      queryClient.invalidateQueries({
        queryKey: ROUTE_QUERY_KEYS.USER_ROUTES
      })
    ]);
  }

  return (
    <div className="min-h-full">
      <div className="grid min-h-[calc(100vh-150px)] grid-cols-[286px_minmax(0,1fr)] gap-12px lt-lg:grid-cols-1">
        <MenuTreePanel
          error={menuListQuery.isError}
          expandedKeys={expandedKeys}
          loading={menuListQuery.isLoading || menuListQuery.isFetching}
          menus={menus}
          selectedMenuId={selectedMenuId}
          onAddChild={handleAddChild}
          onAddRoot={handleAddRoot}
          onDelete={handleDeleteSelectedMenu}
          onExpand={setExpandedKeys}
          onRefresh={handleRefresh}
          onRetry={menuListQuery.refetch}
          onSelect={handleSelectMenu}
        />

        <div className="min-w-0 flex flex-col gap-12px">
          <MenuDetailCard
            childCount={directChildren.length}
            menu={selectedMenu}
            menuPath={selectedMenu ? getMenuPath(menus, selectedMenu.menuId) : ''}
            onDelete={handleDeleteSelectedMenu}
            onEdit={() => selectedMenu && handleEditMenu(selectedMenu)}
          />

          <MenuResourceCard
            children={directChildren}
            permissions={permissions}
            selectedMenu={selectedMenu}
            onAdd={handleAddResource}
            onDeletePermission={handleDeleteMenu}
            onEditPermission={handleEditPermission}
            onSelectChild={handleSelectMenu}
          />
        </div>
      </div>

      <Suspense fallback={null}>
        <MenuEditorDrawer
          fixedType={editorState.fixedType}
          loading={editorLoading}
          menu={editorMenu}
          menus={menus}
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

function collectAncestorKeys(menus: MenuItem[], menuId: MenuId) {
  const keys: Key[] = [];
  const visited = new Set<string>();
  let current = findMenu(menus, menuId);

  while (current && !visited.has(String(current.menuId))) {
    visited.add(String(current.menuId));
    const parent = findMenu(menus, current.parentId);
    if (!parent) break;
    keys.unshift(String(parent.menuId));
    current = parent;
  }
  return keys;
}

function mergeKeys(current: Key[], incoming: Key[]) {
  const merged = new Set(current.map(String));
  for (const key of incoming) {
    if (String(key) !== '0') merged.add(String(key));
  }
  return [...merged];
}

export const Route = createFileRoute('/(admin)/system/menu/')({
  component: MenuManagement,
  staticData: {
    keepAlive: true,
    menu: {
      icon: 'ph:list-dashes',
      order: 3
    },
    title: '菜单管理'
  }
});

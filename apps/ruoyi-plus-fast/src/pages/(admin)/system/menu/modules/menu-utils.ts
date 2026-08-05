import type { MenuId, MenuItem, MenuSavePayload, MenuType } from '@/service/api/system-menu';

export interface MenuHierarchyNode {
  children: MenuHierarchyNode[];
  menu: MenuItem;
}

export function isSameMenuId(left: MenuId, right: MenuId) {
  return String(left) === String(right);
}

export function isRouteMenu(menu: MenuItem) {
  return menu.menuType !== 'F';
}

export function buildMenuForest(menus: MenuItem[]) {
  const routeMenus = menus.filter(isRouteMenu);
  const nodeMap = new Map<string, MenuHierarchyNode>();

  for (const menu of routeMenus) {
    nodeMap.set(String(menu.menuId), { children: [], menu });
  }

  const roots: MenuHierarchyNode[] = [];
  for (const menu of routeMenus) {
    const node = nodeMap.get(String(menu.menuId));
    if (node) {
      const parent = nodeMap.get(String(menu.parentId));
      if (parent) parent.children.push(node);
      else roots.push(node);
    }
  }

  return sortMenuNodes(roots);
}

export function filterMenuForest(nodes: MenuHierarchyNode[], keyword: string): MenuHierarchyNode[] {
  const normalizedKeyword = keyword.trim().toLocaleLowerCase();
  if (!normalizedKeyword) return nodes;

  return nodes.flatMap(node => {
    const children = filterMenuForest(node.children, keyword);
    const matches =
      node.menu.menuName.toLocaleLowerCase().includes(normalizedKeyword) ||
      node.menu.path.toLocaleLowerCase().includes(normalizedKeyword);

    if (!matches && children.length === 0) return [];
    return [{ children, menu: node.menu }];
  });
}

export function findMenu(menus: MenuItem[], menuId: MenuId | undefined) {
  if (menuId === undefined) return undefined;
  return menus.find(menu => isSameMenuId(menu.menuId, menuId));
}

export function getDirectChildren(menus: MenuItem[], parentId: MenuId) {
  return menus.filter(menu => isRouteMenu(menu) && isSameMenuId(menu.parentId, parentId)).toSorted(compareMenus);
}

export function getButtonPermissions(menus: MenuItem[], parentId: MenuId) {
  return menus.filter(menu => menu.menuType === 'F' && isSameMenuId(menu.parentId, parentId)).toSorted(compareMenus);
}

export function getMenuPath(menus: MenuItem[], menuId: MenuId) {
  const parts: string[] = [];
  const visited = new Set<string>();
  let current = findMenu(menus, menuId);

  while (current && !visited.has(String(current.menuId))) {
    visited.add(String(current.menuId));
    parts.unshift(current.menuName);
    current = findMenu(menus, current.parentId);
  }
  return parts.join(' / ');
}

export function getMenuTypeLabel(menuType: MenuType) {
  if (menuType === 'M') return '目录';
  if (menuType === 'C') return '菜单';
  return '按钮';
}

export function getMenuTypeIcon(menuType: MenuType) {
  if (menuType === 'M') return 'ph:folder-simple';
  if (menuType === 'C') return 'ph:file-text';
  return 'ph:key';
}

export function collectDescendantIds(menus: MenuItem[], menuId: MenuId) {
  const result: MenuId[] = [menuId];
  const visited = new Set([String(menuId)]);
  let index = 0;

  while (index < result.length) {
    const parentId = result[index];
    index += 1;

    for (const menu of menus) {
      const menuKey = String(menu.menuId);
      if (isSameMenuId(menu.parentId, parentId) && !visited.has(menuKey)) {
        visited.add(menuKey);
        result.push(menu.menuId);
      }
    }
  }
  return result;
}

export function normalizeMenuPayload(values: MenuSavePayload): MenuSavePayload {
  const common = {
    ...values,
    menuName: values.menuName.trim(),
    perms: normalizeOptionalText(values.perms),
    queryParam: normalizeOptionalText(values.queryParam)
  };

  if (values.menuType === 'F') {
    return {
      ...common,
      component: null,
      icon: '#',
      isCache: '0',
      isFrame: '1',
      path: '',
      queryParam: null,
      remark: '',
      visible: '0'
    };
  }

  if (values.menuType === 'M') {
    return {
      ...common,
      component: null,
      isCache: '0',
      perms: null,
      queryParam: null
    };
  }

  return {
    ...common,
    component: normalizeOptionalText(values.component)
  };
}

function compareMenus(left: MenuItem, right: MenuItem) {
  if (left.orderNum !== right.orderNum) return left.orderNum - right.orderNum;
  return String(left.menuId).localeCompare(String(right.menuId));
}

function sortMenuNodes(nodes: MenuHierarchyNode[]): MenuHierarchyNode[] {
  return nodes
    .toSorted((left, right) => compareMenus(left.menu, right.menu))
    .map(node => ({
      children: sortMenuNodes(node.children),
      menu: node.menu
    }));
}

function normalizeOptionalText(value: string | null) {
  const normalized = value?.trim();
  return normalized || null;
}

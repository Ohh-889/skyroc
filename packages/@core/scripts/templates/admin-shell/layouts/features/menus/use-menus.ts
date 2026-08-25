import { atomWithPartial, getAtomValue } from '@skyroc/core-state';
import { useAtom } from 'jotai';

import { getAdminLayoutsOptions } from '../../setup';
import type { GeneratedMenus } from './menu-generator';
import { menuGenerator, normalizePath } from './menu-generator';
import { hasRoutePermission } from './permissions';

interface MenusAtom {
  /** 当前用户首页路由 */
  home: Router.RoutePath;
  /** 原始菜单数据：RouteId(layoutId) -> 菜单列表 */
  menus: GeneratedMenus;
  quickReferenceMenus: Menu.QuickReferenceMenus;
}

function createInitialState(): MenusAtom {
  return {
    home: getAdminLayoutsOptions().defaultHome,
    menus: new Map(),
    quickReferenceMenus: new Map()
  };
}

const menusAtom = atomWithPartial<MenusAtom>({
  home: '' as Router.RoutePath,
  menus: new Map(),
  quickReferenceMenus: new Map()
});

export const useMenus = () => {
  const [menusState, setMenusState] = useAtom(menusAtom);

  async function initMenus(userInfo?: Api.Auth.UserInfo | null) {
    const { loadDynamicRoutes, routeMode } = getAdminLayoutsOptions();

    if (routeMode === 'dynamic') {
      if (!loadDynamicRoutes) {
        throw new Error('Admin layouts routeMode is dynamic, but loadDynamicRoutes is not configured.');
      }

      const routeData = await loadDynamicRoutes();
      const { allMenus, home, quickReferenceMenus } = menuGenerator.generate({
        backendRoutes: routeData.routes,
        home: routeData.home,
        userInfo
      });

      setMenusState({ home, menus: allMenus, quickReferenceMenus });
      return;
    }

    const { allMenus, home, quickReferenceMenus } = menuGenerator.generate({ userInfo });
    setMenusState({ home, menus: allMenus, quickReferenceMenus });
  }

  function clearMenus() {
    setMenusState(createInitialState());
  }

  function getHomeRoute() {
    return getAtomValue(menusAtom).home;
  }

  return {
    ...menusState,
    initMenus,
    clearMenus,
    getHomeRoute
  };
};

export function getQuickReferenceMenuByPath(path: string) {
  const normalizedPath = normalizePath(path) as Router.RoutePath;
  const { quickReferenceMenus } = getAtomValue(menusAtom);

  for (const quickReferenceMenuMap of quickReferenceMenus.values()) {
    const menu = quickReferenceMenuMap.get(normalizedPath);

    if (menu) {
      return menu;
    }
  }

  return null;
}

export function hasAuthorizedRoutePath(path: string, userInfo?: Api.Auth.UserInfo | null) {
  const { routeMode } = getAdminLayoutsOptions();

  if (routeMode !== 'dynamic') {
    return true;
  }

  const menu = getQuickReferenceMenuByPath(path);

  return Boolean(menu && hasRoutePermission(menu, userInfo));
}

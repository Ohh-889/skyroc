/* eslint-disable complexity */
import { atomWithPartial } from '@skyroc/core-state';
import { useNavigate } from '@tanstack/react-router';
import { useUpdateEffect } from 'ahooks';
import { useAtom } from 'jotai';
import { useMemo } from 'react';

import { useAdminLayoutContext } from '../../context';
import { normalizePath } from '../../features/menus/menu-generator';
import type { GeneratedMenu } from '../../features/menus/menu-generator';
import { renderCommonMenus } from '../../features/menus/menu-renderer';
import { useMenus } from '../../features/menus/use-menus';
import { useRoute } from '../../features/use-route';

interface MenusAtom {
  activeFirstLevelMenuKey: string;
  activeSecondLevelMenuKey: string;
  drawerVisible: boolean;
}

const initialState: MenusAtom = {
  activeFirstLevelMenuKey: '',
  activeSecondLevelMenuKey: '',
  drawerVisible: false
};

const EMPTY_GENERATED_MENUS: GeneratedMenu[] = [];

const menusAtom = atomWithPartial(initialState);

export const useAdminMenus = (categoryKey?: string) => {
  const [menuState, setMenuState] = useAtom(menusAtom);
  const { activeFirstLevelMenuKey, activeSecondLevelMenuKey, drawerVisible } = menuState;
  const adminLayoutContext = useAdminLayoutContext();

  const route = useRoute();

  const navigate = useNavigate();

  const { home, menus: allMenus, quickReferenceMenus: allQuickReferenceMenus } = useMenus();
  const activeCategoryKey = categoryKey ?? adminLayoutContext.categoryKey;

  const rawMenus = allMenus?.get(activeCategoryKey) || EMPTY_GENERATED_MENUS;
  const menus = useMemo(() => renderCommonMenus(rawMenus), [rawMenus]);
  const quickReferenceMenus = allQuickReferenceMenus?.get(activeCategoryKey);

  const fullPath = normalizePath(route.originPath) as Router.RoutePath;
  const currentMenu = quickReferenceMenus?.get(fullPath);

  const { activeMenu, hide } = currentMenu?.menu || {};

  const selectedRouteKey = (hide ? activeMenu : currentMenu?.key) || currentMenu?.key || '';
  const activeMenuInfo = activeMenu ? getMenuInfoByPath(activeMenu) : currentMenu;
  const openKeys = activeMenuInfo?.parentKeys || [];

  const selectedKey = [selectedRouteKey];
  const routeFirstLevelMenuKey = openKeys[0] || selectedRouteKey;
  const routeSecondLevelMenuKey = openKeys[1] || selectedRouteKey;
  const derivedActiveFirstLevelMenuKey = activeFirstLevelMenuKey || routeFirstLevelMenuKey;
  const derivedActiveSecondLevelMenuKey = activeSecondLevelMenuKey || routeSecondLevelMenuKey;

  const firstLevelMenus = menus.map(menu => {
    const { children: _, ...rest } = menu;

    return rest;
  });

  const secondLevelMenus = menus.find(item => item?.key === derivedActiveFirstLevelMenuKey)?.children || [];

  const isActiveFirstLevelMenuHasChildren = derivedActiveFirstLevelMenuKey ? Boolean(secondLevelMenus.length) : false;

  const childLevelMenus = secondLevelMenus.find(menu => menu.key === derivedActiveSecondLevelMenuKey)?.children || [];

  const isActiveSecondLevelMenuHasChildren = derivedActiveSecondLevelMenuKey ? Boolean(childLevelMenus.length) : false;

  function routerPushByKey(key: string) {
    const newRoute = quickReferenceMenus?.get(key as Router.RoutePath);

    if (newRoute) {
      if (newRoute.href) {
        window.open(newRoute.href, '_blank', 'noopener,noreferrer');
        return;
      }

      const search = createRouteSearch(newRoute.query);

      if (search) {
        navigate({
          search,
          to: newRoute.path
        });
        return;
      }

      navigate({
        to: newRoute.path
      });
    }
  }

  /** 可以手动指定菜单或者是默认当前路由的一级菜单 */
  function changeActiveFirstLevelMenuKey(key?: string) {
    setMenuState({ activeFirstLevelMenuKey: key || '' });
  }

  /** 可以手动指定菜单或者是默认当前路由的二级菜单 */
  function changeActiveSecondLevelMenuKey(key?: string) {
    setMenuState({ activeSecondLevelMenuKey: key || '' });
  }

  function setDrawerVisible(visible: boolean) {
    setMenuState({ drawerVisible: visible });
  }

  function getMenuInfoByPath(path: Router.RoutePath) {
    return quickReferenceMenus?.get(path);
  }

  useUpdateEffect(() => {
    setMenuState({
      activeFirstLevelMenuKey: '',
      activeSecondLevelMenuKey: '',
      drawerVisible: false
    });
  }, [selectedRouteKey]);

  return {
    menus,
    home,
    quickReferenceMenus,
    firstLevelMenus,
    secondLevelMenus,
    childLevelMenus,
    activeFirstLevelMenuKey: derivedActiveFirstLevelMenuKey,
    activeSecondLevelMenuKey: derivedActiveSecondLevelMenuKey,
    isActiveFirstLevelMenuHasChildren,
    isActiveSecondLevelMenuHasChildren,
    route,
    openKeys,
    currentMenu,
    activeMenu,
    selectedKey,
    drawerVisible,
    setDrawerVisible,
    routerPushByKey,
    changeActiveFirstLevelMenuKey,
    changeActiveSecondLevelMenuKey,
    getMenuInfoByPath
  };
};

function createRouteSearch(query: Api.Route.BackendRouteQuery[] | null | undefined) {
  const search: Record<string, string> = {};

  query?.forEach(item => {
    const key = item.key.trim();

    if (key) {
      search[key] = item.value;
    }
  });

  return Object.keys(search).length ? search : undefined;
}

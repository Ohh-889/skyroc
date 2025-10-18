import { useEmit, useOn } from '@sa/hooks';

import { useRoute, useRouter } from '@/features/router';
import {
  addTab,
  changeTabLabel,
  clearTabData,
  selectActiveTabId,
  selectTabs,
  setActiveFirstLevelMenuKey,
  setActiveTabId,
  setTabs,
  updateTab
} from '@/features/tab/tabStore';
import { localStg } from '@/utils/storage';

import { getActiveFirstLevelMenuKey } from '../menu/MenuUtil';
import { setRemoveCacheKey } from '../router/routeStore';
import { useThemeSettings } from '../theme';

import { getFixedTabs, getTabByRoute, isTabInTabs } from './shared';
import { TabEvent } from './tabEnum';

export function useUpdateTabs() {
  const dispatch = useAppDispatch();

  /**
   * 更新标签页
   *
   * @param newTabs
   */
  function updateTabs(newTabs: App.Global.Tab[]) {
    dispatch(setTabs(newTabs));
  }

  return updateTabs;
}

export function useTabActions() {
  const dispatch = useAppDispatch();

  const tabs = useAppSelector(selectTabs);

  const updateTabs = useUpdateTabs();

  const { navigate } = useRouter();

  const activeTabId = useAppSelector(selectActiveTabId);

  const _fixedTabs = getFixedTabs(tabs);

  const _tabIds = tabs.map(tab => tab.id);

  /**
   * 切换激活的标签页
   *
   * @param tabId
   */
  function changeActiveTabId(tabId: string) {
    dispatch(setActiveTabId(tabId));
  }

  /**
   * 根据标签页切换路由
   *
   * @param tab
   */
  async function switchRouteByTab(tab: App.Global.Tab) {
    navigate(tab.fullPath);

    changeActiveTabId(tab.id);
  }

  /**
   * 清除标签页
   *
   * @param excludes
   */
  function _clearTabs(excludes: string[] = []) {
    const remainTabIds = [..._fixedTabs.map(tab => tab.id), ...excludes];

    // ② 单次遍历拆分：收集待删除 tab，收集 keepAlive‑cache key
    const removeKeepKeys: string[] = [];
    const updatedTabs: App.Global.Tab[] = [];

    for (const tab of tabs) {
      if (remainTabIds.includes(tab.id)) {
        updatedTabs.push(tab);
      } else if (tab.keepAlive) removeKeepKeys.push(tab.routePath);
    }

    // 如果一次都没删，直接返回
    if (updatedTabs.length === tabs.length) return;

    // ③ 处理激活页逻辑
    if (!remainTabIds.includes(activeTabId)) {
      const currentIndex = tabs.findIndex(tab => tab.id === activeTabId);

      const newActive = tabs[currentIndex + 1] || tabs[currentIndex - 1] || updatedTabs.at(-1);

      if (newActive) switchRouteByTab(newActive);
    }
    updateTabs(updatedTabs);

    if (removeKeepKeys.length > 0) {
      dispatch(setRemoveCacheKey(removeKeepKeys));
    }
  }

  /**
   * 清除左侧标签页
   *
   * @param tabId
   */
  function _clearLeftTabs(tabId: string) {
    const index = _tabIds.indexOf(tabId);

    if (index === -1) return;

    const excludes = _tabIds.slice(index);

    _clearTabs(excludes);
  }

  /**
   * 清除右侧标签页
   *
   * @param tabId
   */
  function _clearRightTabs(tabId: string) {
    const index = _tabIds.indexOf(tabId);

    if (index === 0) {
      _clearTabs();
      return;
    }

    if (index === -1) return;

    const excludes = _tabIds.slice(0, index + 1);

    _clearTabs(excludes);
  }

  /**
   * 删除标签页
   *
   * @param tabId
   */
  function removeTabById(tabId: string) {
    const excludes = _tabIds // 除了要删的，其余都保留
      .filter(t => t !== tabId);

    _clearTabs(excludes);
  }

  function removeActiveTab() {
    removeTabById(activeTabId);
  }

  /**
   * 判断标签页是否保留
   *
   * @param tabId
   * @returns
   */
  function isTabRetain(tabId: string) {
    return _fixedTabs.some(tab => tab.id === tabId);
  }

  useOn(TabEvent.UPDATE_TABS, (eventName: TabEvent, id: string) => {
    // 清除左侧标签页
    if (eventName === TabEvent.CLEAR_LEFT_TABS) return _clearLeftTabs(id);

    // 清除右侧标签页
    if (eventName === TabEvent.CLEAR_RIGHT_TABS) return _clearRightTabs(id);

    // 关闭当前标签页
    if (eventName === TabEvent.CLOSE_CURRENT) return removeTabById(id);

    // 关闭其他标签页
    if (eventName === TabEvent.CLOSE_OTHER) return _clearTabs([id]);

    // 清除所有标签页
    return _clearTabs();
  });

  return {
    activeTabId,
    dispatch,
    isTabRetain,
    navigate,
    removeActiveTab,
    removeTabById,
    tabs
  };
}

export function useTabController() {
  const emit = useEmit();

  function _operateTab(eventName: TabEvent, id?: string) {
    emit(TabEvent.UPDATE_TABS, eventName, id);
  }

  function clearLeftTabs(id: string) {
    _operateTab(TabEvent.CLEAR_LEFT_TABS, id);
  }

  function clearRightTabs(id: string) {
    _operateTab(TabEvent.CLEAR_RIGHT_TABS, id);
  }

  function closeCurrentTab(id: string) {
    _operateTab(TabEvent.CLOSE_CURRENT, id);
  }

  function closeOtherTabs(id: string) {
    _operateTab(TabEvent.CLOSE_OTHER, id);
  }

  function closeAllTabs() {
    _operateTab(TabEvent.CLOSE_ALL);
  }

  return {
    clearLeftTabs,
    clearRightTabs,
    closeAllTabs,
    closeCurrentTab,
    closeOtherTabs
  };
}

export function initTab(cache: boolean, updateTabs: (tabs: App.Global.Tab[]) => void) {
  const storageTabs = localStg.get('globalTabs');

  if (cache && storageTabs) {
    updateTabs(storageTabs);

    return storageTabs;
  }

  return [];
}

// 新增：清空所有标签页相关数据
export function useClearTabs() {
  const dispatch = useAppDispatch();
  function clearTabs() {
    localStg.remove('globalTabs');
    dispatch(clearTabData());
  }
  return clearTabs;
}

export function useCacheTabs() {
  const themeSettings = useThemeSettings();

  const tabs = useAppSelector(selectTabs);

  function cacheTabs() {
    if (!themeSettings.tab.cache) return;

    localStg.set('globalTabs', tabs);
  }

  return cacheTabs;
}

export function useTabManager() {
  const isInit = useRef(false);

  const themeSettings = useThemeSettings();

  const cacheTabs = useCacheTabs();

  const tabs = useAppSelector(selectTabs);

  const dispatch = useAppDispatch();

  const updateTabs = useUpdateTabs();

  const _route = useRoute();

  function _addTab(route: Router.Route) {
    const tab = getTabByRoute(route);

    if (!isInit.current) {
      isInit.current = true;

      const initTabs = initTab(themeSettings.tab.cache, updateTabs);

      const existsInInit = Array.isArray(initTabs) && initTabs.length > 0 && isTabInTabs(tab.id, initTabs);
      const existsInStore = isTabInTabs(tab.id, tabs);

      if (!existsInInit && !existsInStore) {
        dispatch(addTab(tab));
      }
    } else if (!isTabInTabs(tab.id, tabs)) {
      dispatch(addTab(tab));
    } else {
      const index = tabs.findIndex(item => item.id === tab.id);

      dispatch(updateTab({ index, tab }));
    }

    dispatch(setActiveTabId(tab.id));

    const firstLevelRouteName = getActiveFirstLevelMenuKey(route);
    dispatch(setActiveFirstLevelMenuKey(firstLevelRouteName));
  }

  useEffect(() => {
    _addTab(_route);
  }, [_route.fullPath]);

  useEventListener(
    'beforeunload',
    () => {
      cacheTabs();
    },
    { target: window }
  );
}

export function useTabLabel() {
  const dispatch = useAppDispatch();

  const activeTabId = useAppSelector(selectActiveTabId);

  const tabs = useAppSelector(selectTabs);

  function setTabLabel(label: string, tabId?: string) {
    const id = tabId || activeTabId;

    const tab = tabs.findIndex(item => item.id === id);

    if (tab < 0) return;

    dispatch(changeTabLabel({ index: tab, label }));
  }

  function resetTabLabel(tabId?: string) {
    const id = tabId || activeTabId;

    const tab = tabs.findIndex(item => item.id === id);

    if (tab < 0) return;

    dispatch(changeTabLabel({ index: tab }));
  }

  return {
    resetTabLabel,
    setTabLabel
  };
}

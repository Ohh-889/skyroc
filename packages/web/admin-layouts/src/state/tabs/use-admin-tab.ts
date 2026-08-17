import { atomWithPartial, createAtomWithStorage, getAtomValue, setAtomValue } from '@skyroc/core-state';
import { useSettingsTheme } from '@skyroc/web-admin-theme';
import { useNavigate } from '@tanstack/react-router';
import { useAtom } from 'jotai';

import { ADMIN_LAYOUTS_STORAGE } from '../../setup';
import { useAdminMenus } from '../menus/use-admin-menus';

import {
  extractTabsByAllRoutes,
  filterTabsByIds,
  getAllTabs,
  getFixedTabIds,
  getTabByMenuInfo,
  getTabIdByRoute,
  reorderFixedTabs
} from './shared';

interface TabState {
  /** Active tab id */
  activeTabId: string;
  /** Home tab */
  homeTab: App.Global.Tab | null;
  /** All tabs (excluding home) */
  tabs: App.Global.Tab[];
}

const initialState: TabState = {
  homeTab: null,
  tabs: [],
  activeTabId: ''
};

const tabStateAtom = atomWithPartial(initialState);

/** Tabs persisted across reloads, restored on init when the tab cache setting is on. */
const cachedTabsAtom = createAtomWithStorage<App.Global.Tab[]>('globalTabs', [], {
  storageName: ADMIN_LAYOUTS_STORAGE
});

/** Cache tabs to local storage */
export function cacheTabs() {
  setAtomValue(cachedTabsAtom, getAtomValue(tabStateAtom).tabs);
}

export const useAdminTab = () => {
  const [tabState, setTabState] = useAtom(tabStateAtom);

  const navigate = useNavigate();

  const { getMenuInfoByPath, home, quickReferenceMenus, route } = useAdminMenus();

  const {
    tab: { cache }
  } = useSettingsTheme();

  /** Get all tabs (including home tab and reordered by fixed index) */
  const allTabs = getAllTabs(tabState.tabs, tabState.homeTab);

  /**
   * Set active tab id
   *
   * @param id Tab id
   */
  function setActiveTabId(id: string) {
    setTabState({ activeTabId: id });
  }

  /**
   * Init home tab
   *
   * @param homeRoute The home route path
   */
  function initHomeTab(homeRoute: Router.RoutePath) {
    const routeInfo = getMenuInfoByPath(homeRoute);

    if (!routeInfo) return null;

    const info = {
      fixedIndex: 0,
      ...routeInfo?.tab
    };

    routeInfo.tab = info;

    if (routeInfo) {
      const homeTab = getTabByMenuInfo(routeInfo, homeRoute, homeRoute);

      return homeTab;
    }

    return null;
  }

  /**
   * Init tab store
   *
   * @param cache Whether to cache tabs
   * @param allRoutes All available route IDs for validation
   */
  function initTabStore() {
    const storageTabs = getAtomValue(cachedTabsAtom);

    const homeTab = initHomeTab(home);

    let tabs: App.Global.Tab[] = [];

    if (cache && storageTabs.length) {
      const allRoutes = Array.from(quickReferenceMenus?.keys() || []);

      const extractedTabs = extractTabsByAllRoutes(allRoutes, storageTabs);
      tabs = extractedTabs;
    }

    setTabState({ tabs, homeTab });

    addTab(route.fullPath, route.originPath);
  }

  /**
   * Add tab
   *
   * @param route Tab route
   * @param active Whether to activate the added tab
   */
  function addTab(fullPath: string, routePath: Router.RoutePath, active = true) {
    const routeInfo = getMenuInfoByPath(routePath);

    if (!routeInfo) return;

    const tab = getTabByMenuInfo(routeInfo, routePath, fullPath);

    const homeTabId = tabState.homeTab?.id;

    const isHomeTab = homeTabId && homeTabId === tab.id;

    const oldTabs = getAtomValue(tabStateAtom).tabs;
    const existingTab = oldTabs.find(item => item.id === tab.id);

    if (!isHomeTab && !existingTab) {
      setTabState({ tabs: [...oldTabs, tab] });
    }

    if (!isHomeTab && existingTab) {
      setTabState({ tabs: oldTabs.map(item => (item.id === tab.id ? { ...item, ...tab } : item)) });
    }

    if (active) {
      setActiveTabId(tab.id);
    }
  }

  /**
   * Remove tab
   *
   * @param tabId Tab id
   */
  async function removeTab(tabId: string) {
    const removeTabIndex = tabState.tabs.findIndex(tab => tab.id === tabId);
    if (removeTabIndex === -1) return;

    const isRemoveActiveTab = tabState.activeTabId === tabId;

    // if remove the last tab, then switch to the second last tab
    const nextTab = tabState.tabs[removeTabIndex + 1] || tabState.tabs[removeTabIndex - 1] || tabState.homeTab;

    // remove tab
    const newTabs = [...tabState.tabs];
    newTabs.splice(removeTabIndex, 1);
    setTabState({ tabs: newTabs });

    // if current tab is removed, then switch to next tab
    if (isRemoveActiveTab && nextTab) {
      await switchRouteByTab(nextTab);
    }
  }

  /** Remove active tab */
  async function removeActiveTab() {
    await removeTab(tabState.activeTabId);
  }

  /**
   * Clear tabs
   *
   * @param excludes Exclude tab ids
   */
  async function clearTabs(excludes: string[] = []) {
    const remainTabIds = [...getFixedTabIds(tabState.tabs), ...excludes];

    const tabsToRemove = tabState.tabs.filter(tab => !remainTabIds.includes(tab.id));
    const removedTabsIds = tabsToRemove.map(tab => tab.id);

    if (removedTabsIds.length === 0) {
      return;
    }

    const isRemoveActiveTab = removedTabsIds.includes(tabState.activeTabId);
    const updatedTabs = filterTabsByIds(removedTabsIds, tabState.tabs);

    if (!isRemoveActiveTab) {
      setTabState({ tabs: updatedTabs });
    } else {
      const activeTabCandidate = updatedTabs[updatedTabs.length - 1] || tabState.homeTab;

      if (activeTabCandidate) {
        await switchRouteByTab(activeTabCandidate);
      }
      setTabState({ tabs: updatedTabs });
    }
  }

  /**
   * Switch route by tab
   *
   * @param tab
   */
  async function switchRouteByTab(tab: App.Global.Tab) {
    navigate({ to: tab.fullPath });
  }

  /**
   * Clear left tabs
   *
   * @param tabId
   */
  async function clearLeftTabs(tabId: string) {
    const tabIds = tabState.tabs.map(tab => tab.id);
    const index = tabIds.indexOf(tabId);
    if (index === -1) return;

    const excludes = tabIds.slice(index);
    await clearTabs(excludes);
  }

  /**
   * Clear right tabs
   *
   * @param tabId
   */
  async function clearRightTabs(tabId: string) {
    const isHomeTab = tabId === tabState.homeTab?.id;
    if (isHomeTab) {
      clearTabs();
      return;
    }

    const tabIds = tabState.tabs.map(tab => tab.id);
    const index = tabIds.indexOf(tabId);
    if (index === -1) return;

    const excludes = tabIds.slice(0, index + 1);
    await clearTabs(excludes);
  }

  /**
   * Fix tab
   *
   * @param tabId
   */
  function fixTab(tabId: string) {
    const tabIndex = tabState.tabs.findIndex(t => t.id === tabId);
    if (tabIndex === -1) return;

    const newTabs = [...tabState.tabs];
    const tab = newTabs[tabIndex];
    const fixedCount = getFixedTabIds(newTabs).length;
    tab.fixedIndex = fixedCount;

    if (tabIndex !== fixedCount) {
      newTabs.splice(tabIndex, 1);
      newTabs.splice(fixedCount, 0, tab);
    }

    reorderFixedTabs(newTabs);
    setTabState({ tabs: newTabs });
  }

  /**
   * Unfix tab
   *
   * @param tabId
   */
  function unfixTab(tabId: string) {
    const tabIndex = tabState.tabs.findIndex(t => t.id === tabId);
    if (tabIndex === -1) return;

    const newTabs = [...tabState.tabs];
    const tab = newTabs[tabIndex];
    tab.fixedIndex = undefined;

    const fixedCount = getFixedTabIds(newTabs).length;
    if (tabIndex !== fixedCount) {
      newTabs.splice(tabIndex, 1);
      newTabs.splice(fixedCount, 0, tab);
    }

    reorderFixedTabs(newTabs);
    setTabState({ tabs: newTabs });
  }

  /**
   * Set new label of tab
   *
   * @default activeTabId
   * @param label New tab label
   * @param tabId Tab id
   */
  function setTabLabel(label: string, tabId?: string) {
    const id = tabId || tabState.activeTabId;

    const newTabs = [...tabState.tabs];
    const tab = newTabs.find(item => item.id === id);
    if (!tab) return;

    tab.i18nKey = label as I18n.I18nKey;

    setTabState({ tabs: newTabs });
  }

  /**
   * Reset tab label
   *
   * @default activeTabId
   * @param tabId Tab id
   */
  function resetTabLabel(tabId?: string) {
    const id = tabId || tabState.activeTabId;

    const newTabs = [...tabState.tabs];
    const tab = newTabs.find(item => item.id === id);
    if (!tab) return;

    tab.i18nKey = tab.oldLabel as I18n.I18nKey;
    setTabState({ tabs: newTabs });
  }

  /**
   * Is tab retain (home tab or fixed tab)
   *
   * @param tabId
   */
  function isTabRetain(tabId: string) {
    if (tabId === tabState.homeTab?.id) return true;

    const fixedTabIds = getFixedTabIds(allTabs);

    return fixedTabIds.includes(tabId);
  }

  return {
    // State
    tabs: allTabs,
    activeTabId: tabState.activeTabId,
    homeTab: tabState.homeTab,
    route,

    // Actions
    initHomeTab,
    initTabStore,
    addTab,
    removeTab,
    removeActiveTab,
    clearTabs,
    clearLeftTabs,
    clearRightTabs,
    fixTab,
    unfixTab,
    switchRouteByTab,
    setTabLabel,
    resetTabLabel,
    isTabRetain,
    getTabIdByRoute,
    cacheTabs,
    setActiveTabId
  };
};

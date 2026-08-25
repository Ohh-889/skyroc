import { getAdminLayoutsOptions } from '../../setup';

/**
 * Get all tabs
 *
 * @param tabs Tabs
 * @param homeTab Home tab
 */
export function getAllTabs(tabs: App.Global.Tab[], homeTab: App.Global.Tab | null) {
  if (!homeTab) {
    return [];
  }

  const filterHomeTabs = tabs.filter(tab => tab.id !== homeTab.id);

  const fixedTabs = filterHomeTabs.filter(isFixedTab).toSorted((a, b) => a.fixedIndex! - b.fixedIndex!);

  const remainTabs = filterHomeTabs.filter(tab => !isFixedTab(tab));

  const allTabs = [homeTab, ...fixedTabs, ...remainTabs];

  return allTabs;
}

/**
 * Is fixed tab
 *
 * @param tab
 */
function isFixedTab(tab: App.Global.Tab) {
  return tab.fixedIndex !== undefined && tab.fixedIndex !== null;
}

/**
 * Get tab id by route
 *
 * @param route
 */
export function getTabIdByRoute(pathname: string, multiTab: boolean, fullPath: string) {
  let id = pathname;

  if (multiTab) {
    id = fullPath;
  }

  return id;
}

/**
 * Get tab by route
 *
 * @param route
 */
export function getTabByMenuInfo(
  menuInfo: Menu.QuickReferenceMenu,
  pathname: Router.RoutePath,
  fullPath: string
): App.Global.Tab {
  const { defaultIcon } = getAdminLayoutsOptions();

  return {
    id: getTabIdByRoute(pathname, menuInfo.tab?.multi ?? false, fullPath),
    routePath: pathname,
    fullPath,
    fixedIndex: menuInfo.tab?.fixedIndex,
    i18nKey: menuInfo.i18nKey,
    icon: menuInfo.menu?.icon || defaultIcon,
    keepAlive: menuInfo.keepAlive,
    localIcon: menuInfo.menu?.localIcon,
    label: menuInfo.title || '',
    oldLabel: menuInfo.title
  };
}

/**
 * Is tab in tabs
 *
 * @param tabId
 * @param tabs
 */
export function isTabInTabs(tabId: string, tabs: App.Global.Tab[]) {
  return tabs.some(tab => tab.id === tabId);
}

/**
 * Filter tabs by ids
 *
 * @param tabIds
 * @param tabs
 */
export function filterTabsByIds(tabIds: string[], tabs: App.Global.Tab[]) {
  return tabs.filter(tab => !tabIds.includes(tab.id));
}

/**
 * Extract tabs by all routes
 *
 * @param routeIds All route IDs
 * @param tabs Cached tabs
 */
export function extractTabsByAllRoutes(routeIds: string[], tabs: App.Global.Tab[]) {
  return tabs.filter(tab => routeIds.includes(tab.routePath));
}

/**
 * Get fixed tabs
 *
 * @param tabs
 */
export function getFixedTabs(tabs: App.Global.Tab[]) {
  return tabs.filter(isFixedTab);
}

/**
 * Get fixed tab ids
 *
 * @param tabs
 */
export function getFixedTabIds(tabs: App.Global.Tab[]) {
  const fixedTabs = getFixedTabs(tabs);

  return fixedTabs.map(tab => tab.id);
}

/**
 * Reorder fixed tabs fixedIndex
 *
 * @param tabs
 */
export function reorderFixedTabs(tabs: App.Global.Tab[]) {
  const fixedTabs = getFixedTabs(tabs);
  fixedTabs.forEach((t, i) => {
    t.fixedIndex = i;
  });
}

/**
 * Find tab by route name
 *
 * @param routePath
 * @param tabs
 */
export function findTabByRoutePath(routePath: Router.RoutePath, tabs: App.Global.Tab[]) {
  const tabId = routePath;
  const multiTabId = `${routePath}?`;

  return tabs.find(tab => tab.id === tabId || tab.id.startsWith(multiTabId));
}

export { default as AdminLayout } from './AdminLayout';
export type { AdminLayoutProps } from './AdminLayout';
export type { AdminLayoutLogoComponent, AdminLayoutLogoProps, AdminLayoutSlots } from './context';
export type {
  CreateAdminDynamicRouteLoaderOptions,
  NormalizeBackendRouteResponseOptions
} from './features/menus/dynamic-routes';
export {
  collectAvailableRoutePaths,
  createAdminDynamicRouteLoader,
  createBackendRouteNormalizer,
  normalizeBackendRouteResponse
} from './features/menus/dynamic-routes';
export { normalizePath } from './features/menus/menu-generator';
export type {
  GeneratedMenu,
  GeneratedMenus,
  GenerateMenuOptions,
  GenerateMenuResult
} from './features/menus/menu-generator';

export { hasAnyRoutePermission, hasMatchedRoutePermission, hasRoutePermission } from './features/menus/permissions';
export { getQuickReferenceMenuByPath, hasAuthorizedRoutePath, useMenus } from './features/menus/use-menus';
export { useRoute } from './features/use-route';
export type {
  AdminLayoutMenuCategory,
  AdminLayoutsDynamicRoutes,
  AdminLayoutsOptions,
  AdminLayoutsStorage,
  MenuNodeCallback,
  MenuNodeConfig
} from './setup';
export { setupAdminLayouts } from './setup';
export type { MenuBadgeValues } from './state/menus/use-admin-menu-badges';
export {
  clearMenuBadgeValues,
  setMenuBadgeValue,
  setMenuBadgeValues,
  useAdminMenuBadges
} from './state/menus/use-admin-menu-badges';
export { useAdminMenus } from './state/menus/use-admin-menus';
export { cacheTabs, useAdminTab } from './state/tabs/use-admin-tab';
export { useAdminState } from './state/use-admin-state';
export * from './types/storage';

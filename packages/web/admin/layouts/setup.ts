import { registerStorage } from '@skyroc/core-state';
import type { AnyRoute } from '@tanstack/react-router';
import type { ComponentType } from 'react';

/** 布局持久化 atom 解析存储时使用的注册名。 */
export const ADMIN_LAYOUTS_STORAGE = 'admin-layouts';

export interface AdminLayoutsStorage {
  /** 读取布局需要的本地缓存。 */
  get<K extends keyof StorageType.Local>(key: K): StorageType.Local[K] | null;
  /** 删除布局需要的本地缓存。 */
  remove(key: keyof StorageType.Local): void;
  /** 写入布局需要的本地缓存。 */
  set<K extends keyof StorageType.Local>(key: K, value: StorageType.Local[K]): void;
}

export interface AdminLayoutMenuCategory {
  /** 菜单分类标识，通常对应一个布局分组。 */
  key: string;
  /** TanStack Router 中承载该菜单分类的 layout route id。 */
  layout: Router.RouteId;
}

export interface AdminLayoutsDynamicRoutes {
  /** 动态菜单接口返回的首页。 */
  home?: Router.RoutePath | null;
  /** 动态菜单接口返回的路由树。 */
  routes: Api.Route.BackendRoute[];
}

/** 菜单节点扩展配置，用于追加 divider、固定入口或项目级菜单节点。 */
export type MenuNodeConfig = Partial<Omit<Api.Route.BackendRoute, 'layout' | 'parentId'>>;

/**
 * 菜单节点回调函数类型，用于在特定路由节点添加额外菜单。
 *
 * @param routeId 当前路由 ID
 */
export type MenuNodeCallback = (routeId: Router.RouteId) => MenuNodeConfig[];

export interface AdminLayoutsOptions {
  /** 默认首页路由。 */
  defaultHome: Router.RoutePath;
  /** 默认菜单图标。 */
  defaultIcon: string;
  /** 自定义菜单额外内容组件映射，用于标准 badge 无法覆盖的业务 UI。 */
  extras?: Partial<Record<Router.Extra, ComponentType<any>>>;
  /** 动态菜单加载器，仅 routeMode 为 dynamic 时使用。 */
  loadDynamicRoutes?: () => Promise<AdminLayoutsDynamicRoutes>;
  /** 菜单分类配置。 */
  menuCategories: Record<string, AdminLayoutMenuCategory>;
  /** 菜单节点扩展配置。 */
  menuNodeCallback?: MenuNodeCallback;
  /** 权限校验中的超级角色标识。 */
  permissionSuperRole?: string;
  /** 菜单生成模式。 */
  routeMode: 'dynamic' | 'static';
  /** TanStack Router 生成的 routeTree。 */
  routeTree: AnyRoute;
  /** 布局本地缓存适配器。 */
  storage: AdminLayoutsStorage;
}

let options: AdminLayoutsOptions | null = null;

export function setupAdminLayouts(adminLayoutsOptions: AdminLayoutsOptions) {
  options = adminLayoutsOptions;

  // 把宿主传入的 storage 桥接到 core-state 注册表，供 createAtomWithStorage 按名解析。
  registerStorage(ADMIN_LAYOUTS_STORAGE, {
    getItem: key => adminLayoutsOptions.storage.get(key as keyof StorageType.Local),
    removeItem: key => adminLayoutsOptions.storage.remove(key as keyof StorageType.Local),
    setItem: (key, value) =>
      adminLayoutsOptions.storage.set(key as keyof StorageType.Local, value as StorageType.Local[keyof StorageType.Local])
  });
}

export function getAdminLayoutsOptions() {
  if (!options) {
    throw new Error('Admin layouts are not initialized. Call setupAdminLayouts before rendering AdminLayout.');
  }

  return options;
}

export function getDefaultMenuCategoryKey() {
  const { menuCategories } = getAdminLayoutsOptions();

  return Object.values(menuCategories)[0]?.key ?? 'admin';
}

export function getMenuCategoryKey(layout: Router.RouteId) {
  const { menuCategories } = getAdminLayoutsOptions();

  return Object.values(menuCategories).find(category => category.layout === layout)?.key;
}

export function getConfiguredCategoryKeys() {
  const { menuCategories } = getAdminLayoutsOptions();

  return Object.values(menuCategories).map(category => category.key);
}

import type { TenantPackageId } from './types';

export const SYSTEM_TENANT_PACKAGE_URLS = {
  CHANGE_STATUS: '/system/tenant/package/changeStatus',
  CREATE: '/system/tenant/package',
  DELETE: (ids: TenantPackageId[]) => `/system/tenant/package/${ids.map(String).join(',')}`,
  DETAIL: (id: TenantPackageId) => `/system/tenant/package/${id}`,
  EXPORT: '/system/tenant/package/export',
  LIST: '/system/tenant/package/list',
  // 菜单树挂在 menu 模块下，不在套餐前缀里。传 0 表示还没保存过的新套餐
  MENU_TREE: (packageId: TenantPackageId) => `/system/menu/tenantPackageMenuTreeselect/${packageId}`,
  SELECT_LIST: '/system/tenant/package/selectList',
  UPDATE: '/system/tenant/package'
} as const;

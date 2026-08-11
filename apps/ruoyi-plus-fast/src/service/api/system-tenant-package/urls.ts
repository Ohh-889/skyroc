import type { TenantPackageId } from './types';

export const SYSTEM_TENANT_PACKAGE_URLS = {
  CHANGE_STATUS: '/system/tenant/package/changeStatus',
  CREATE: '/system/tenant/package',
  DELETE: (ids: TenantPackageId[]) => `/system/tenant/package/${ids.map(String).join(',')}`,
  DETAIL: (id: TenantPackageId) => `/system/tenant/package/${id}`,
  EXPORT: '/system/tenant/package/export',
  LIST: '/system/tenant/package/list',
  SELECT_LIST: '/system/tenant/package/selectList',
  UPDATE: '/system/tenant/package'
} as const;

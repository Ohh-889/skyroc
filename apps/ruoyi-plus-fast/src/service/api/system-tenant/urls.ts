import type { TenantId } from './types';

export const SYSTEM_TENANT_URLS = {
  CHANGE_STATUS: '/system/tenant/changeStatus',
  CLEAR_DYNAMIC: '/system/tenant/dynamic/clear',
  CREATE: '/system/tenant',
  DELETE: (ids: TenantId[]) => `/system/tenant/${ids.map(String).join(',')}`,
  DETAIL: (id: TenantId) => `/system/tenant/${id}`,
  EXPORT: '/system/tenant/export',
  LIST: '/system/tenant/list',
  SWITCH_DYNAMIC: (tenantId: string) => `/system/tenant/dynamic/${tenantId}`,
  SYNC_CONFIG: '/system/tenant/syncTenantConfig',
  SYNC_DICT: '/system/tenant/syncTenantDict',
  SYNC_PACKAGE: '/system/tenant/syncTenantPackage',
  UPDATE: '/system/tenant'
} as const;

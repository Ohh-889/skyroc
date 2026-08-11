import type { TenantPackageId, TenantPackageListParams } from './types';

export const SYSTEM_TENANT_PACKAGE_QUERY_KEYS = {
  ALL: ['system-tenant-package'] as const,
  DETAIL: (id: TenantPackageId) => ['system-tenant-package', 'detail', String(id)] as const,
  LIST: (params: TenantPackageListParams) => ['system-tenant-package', 'list', params] as const,
  LISTS: ['system-tenant-package', 'list'] as const,
  SELECT_LIST: ['system-tenant-package', 'select-list'] as const
} as const;

export const SYSTEM_TENANT_PACKAGE_MUTATION_KEYS = {
  CREATE: ['system-tenant-package', 'create'] as const,
  DELETE: ['system-tenant-package', 'delete'] as const,
  UPDATE: ['system-tenant-package', 'update'] as const,
  UPDATE_STATUS: ['system-tenant-package', 'update-status'] as const
} as const;

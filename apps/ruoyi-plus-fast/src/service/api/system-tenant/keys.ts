import type { TenantId, TenantListParams } from './types';

export const SYSTEM_TENANT_QUERY_KEYS = {
  ALL: ['system-tenant'] as const,
  DETAIL: (id: TenantId) => ['system-tenant', 'detail', String(id)] as const,
  LIST: (params: TenantListParams) => ['system-tenant', 'list', params] as const,
  LISTS: ['system-tenant', 'list'] as const
} as const;

export const SYSTEM_TENANT_MUTATION_KEYS = {
  CLEAR_DYNAMIC: ['system-tenant', 'clear-dynamic'] as const,
  CREATE: ['system-tenant', 'create'] as const,
  DELETE: ['system-tenant', 'delete'] as const,
  SWITCH_DYNAMIC: ['system-tenant', 'switch-dynamic'] as const,
  SYNC_CONFIG: ['system-tenant', 'sync-config'] as const,
  SYNC_DICT: ['system-tenant', 'sync-dict'] as const,
  SYNC_PACKAGE: ['system-tenant', 'sync-package'] as const,
  UPDATE: ['system-tenant', 'update'] as const,
  UPDATE_STATUS: ['system-tenant', 'update-status'] as const
} as const;

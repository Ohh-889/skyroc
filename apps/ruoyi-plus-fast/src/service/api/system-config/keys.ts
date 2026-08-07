import type { ConfigId, ConfigListParams } from './types';
export const SYSTEM_CONFIG_QUERY_KEYS = {
  ALL: ['system-config'] as const,
  DETAIL: (id: ConfigId) => ['system-config', 'detail', String(id)] as const,
  LIST: (params: ConfigListParams) => ['system-config', 'list', params] as const,
  LISTS: ['system-config', 'list']
} as const;
export const SYSTEM_CONFIG_MUTATION_KEYS = {
  CREATE: ['system-config', 'create'] as const,
  DELETE: ['system-config', 'delete'] as const,
  REFRESH_CACHE: ['system-config', 'refresh-cache'] as const,
  UPDATE: ['system-config', 'update'] as const
} as const;

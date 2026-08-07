import type { ClientId, ClientListParams } from './types';

export const SYSTEM_CLIENT_QUERY_KEYS = {
  ALL: ['system-client'] as const,
  DETAIL: (id: ClientId) => ['system-client', 'detail', String(id)] as const,
  LIST: (params: ClientListParams) => ['system-client', 'list', params] as const,
  LISTS: ['system-client', 'list'] as const
} as const;

export const SYSTEM_CLIENT_MUTATION_KEYS = {
  CREATE: ['system-client', 'create'] as const,
  DELETE: ['system-client', 'delete'] as const,
  UPDATE: ['system-client', 'update'] as const,
  UPDATE_STATUS: ['system-client', 'update-status'] as const
} as const;

import type { LoginInfoListParams } from './types';

export const MONITOR_LOGININFO_QUERY_KEYS = {
  ALL: ['monitor-logininfo'] as const,
  LIST: (params: LoginInfoListParams) => ['monitor-logininfo', 'list', params] as const,
  LISTS: ['monitor-logininfo', 'list'] as const
} as const;

export const MONITOR_LOGININFO_MUTATION_KEYS = {
  CLEAN: ['monitor-logininfo', 'clean'] as const,
  DELETE: ['monitor-logininfo', 'delete'] as const,
  UNLOCK: ['monitor-logininfo', 'unlock'] as const
} as const;

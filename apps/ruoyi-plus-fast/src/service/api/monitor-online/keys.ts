import type { OnlineSessionListParams } from './types';

export const MONITOR_ONLINE_QUERY_KEYS = {
  ALL: ['monitor-online'] as const,
  LIST: (params: OnlineSessionListParams) => ['monitor-online', 'list', params] as const,
  LISTS: ['monitor-online', 'list'] as const
} as const;

export const MONITOR_ONLINE_MUTATION_KEYS = {
  FORCE_LOGOUT: ['monitor-online', 'force-logout'] as const
} as const;

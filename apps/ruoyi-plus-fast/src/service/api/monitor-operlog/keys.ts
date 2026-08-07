import type { OperLogListParams } from './types';

export const MONITOR_OPERLOG_QUERY_KEYS = {
  ALL: ['monitor-operlog'] as const,
  LIST: (params: OperLogListParams) => ['monitor-operlog', 'list', params] as const,
  LISTS: ['monitor-operlog', 'list'] as const
} as const;

export const MONITOR_OPERLOG_MUTATION_KEYS = {
  CLEAN: ['monitor-operlog', 'clean'] as const,
  DELETE: ['monitor-operlog', 'delete'] as const
} as const;

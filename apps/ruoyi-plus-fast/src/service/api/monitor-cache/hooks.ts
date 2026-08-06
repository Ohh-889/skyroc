import { useQuery } from '@tanstack/react-query';

import { fetchCacheInfo } from './api';

export const MONITOR_CACHE_QUERY_KEYS = {
  ALL: ['monitor-cache'] as const,
  INFO: ['monitor-cache', 'info'] as const
} as const;

export function useCacheInfoQuery() {
  return useQuery({ queryFn: fetchCacheInfo, queryKey: MONITOR_CACHE_QUERY_KEYS.INFO });
}

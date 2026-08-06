import { request } from '../../request';

import type { CacheInfo } from './types';
import { MONITOR_CACHE_URLS } from './urls';

export function fetchCacheInfo() {
  return request<CacheInfo>({ method: 'get', url: MONITOR_CACHE_URLS.INFO });
}

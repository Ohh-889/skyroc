import type { ConfigId } from './types';
export const SYSTEM_CONFIG_URLS = {
  CREATE: '/system/config',
  DELETE: (ids: ConfigId[]) => `/system/config/${ids.map(String).join(',')}`,
  DETAIL: (id: ConfigId) => `/system/config/${id}`,
  EXPORT: '/system/config/export',
  LIST: '/system/config/list',
  REFRESH_CACHE: '/system/config/refreshCache',
  UPDATE: '/system/config'
} as const;

import type { LoginInfoId } from './types';

export const MONITOR_LOGININFO_URLS = {
  CLEAN: '/monitor/logininfor/clean',
  DELETE: (infoIds: LoginInfoId[]) => `/monitor/logininfor/${infoIds.map(String).join(',')}`,
  EXPORT: '/monitor/logininfor/export',
  LIST: '/monitor/logininfor/list',
  UNLOCK: (identity: string) => `/auth/lockout/${encodeURIComponent(identity)}`
} as const;

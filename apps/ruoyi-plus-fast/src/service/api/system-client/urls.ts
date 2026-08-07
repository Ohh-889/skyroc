import type { ClientId } from './types';

export const SYSTEM_CLIENT_URLS = {
  CHANGE_STATUS: '/system/client/changeStatus',
  CREATE: '/system/client',
  DELETE: (ids: ClientId[]) => `/system/client/${ids.map(String).join(',')}`,
  DETAIL: (id: ClientId) => `/system/client/${id}`,
  EXPORT: '/system/client/export',
  LIST: '/system/client/list',
  UPDATE: '/system/client'
} as const;

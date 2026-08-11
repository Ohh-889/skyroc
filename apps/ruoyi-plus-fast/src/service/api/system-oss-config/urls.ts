import type { OssConfigId } from './types';

export const SYSTEM_OSS_CONFIG_URLS = {
  CHANGE_STATUS: '/resource/oss/config/changeStatus',
  CREATE: '/resource/oss/config',
  DELETE: (ids: OssConfigId[]) => `/resource/oss/config/${ids.map(String).join(',')}`,
  DETAIL: (id: OssConfigId) => `/resource/oss/config/${id}`,
  LIST: '/resource/oss/config/list',
  UPDATE: '/resource/oss/config'
} as const;

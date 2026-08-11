import type { OssId } from './types';

export const SYSTEM_OSS_URLS = {
  DELETE: (ids: OssId[]) => `/resource/oss/${ids.map(String).join(',')}`,
  DOWNLOAD: (id: OssId) => `/resource/oss/download/${id}`,
  LIST: '/resource/oss/list',
  LIST_BY_IDS: (ids: OssId[]) => `/resource/oss/listByIds/${ids.map(String).join(',')}`,
  UPLOAD: '/resource/oss/upload'
} as const;

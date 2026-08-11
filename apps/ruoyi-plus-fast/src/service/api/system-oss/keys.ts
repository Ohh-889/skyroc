import type { OssId, OssListParams } from './types';

export const SYSTEM_OSS_QUERY_KEYS = {
  ALL: ['system-oss'] as const,
  BY_IDS: (ids: OssId[]) => ['system-oss', 'by-ids', ids.map(String).join(',')] as const,
  LIST: (params: OssListParams) => ['system-oss', 'list', params] as const,
  LISTS: ['system-oss', 'list'] as const
} as const;

export const SYSTEM_OSS_MUTATION_KEYS = {
  DELETE: ['system-oss', 'delete'] as const,
  UPLOAD: ['system-oss', 'upload'] as const
} as const;

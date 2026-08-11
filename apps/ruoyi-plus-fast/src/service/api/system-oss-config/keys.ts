import type { OssConfigId, OssConfigListParams } from './types';

export const SYSTEM_OSS_CONFIG_QUERY_KEYS = {
  ALL: ['system-oss-config'] as const,
  DETAIL: (id: OssConfigId) => ['system-oss-config', 'detail', String(id)] as const,
  LIST: (params: OssConfigListParams) => ['system-oss-config', 'list', params] as const,
  LISTS: ['system-oss-config', 'list'] as const
} as const;

export const SYSTEM_OSS_CONFIG_MUTATION_KEYS = {
  CREATE: ['system-oss-config', 'create'] as const,
  DELETE: ['system-oss-config', 'delete'] as const,
  UPDATE: ['system-oss-config', 'update'] as const,
  UPDATE_STATUS: ['system-oss-config', 'update-status'] as const
} as const;

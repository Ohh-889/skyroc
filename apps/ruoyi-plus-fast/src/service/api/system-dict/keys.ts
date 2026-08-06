import type { DictDataListParams, DictId, DictTypeListParams } from './types';

export const SYSTEM_DICT_QUERY_KEYS = {
  ALL: ['system-dict'] as const,
  DATA: (params: DictDataListParams) => ['system-dict', 'data', params] as const,
  TYPES: (params: DictTypeListParams) => ['system-dict', 'types', params] as const,
  TYPE_OPTIONS: ['system-dict', 'type-options'] as const,
  DETAIL: (id: DictId) => ['system-dict', 'detail', String(id)] as const
};

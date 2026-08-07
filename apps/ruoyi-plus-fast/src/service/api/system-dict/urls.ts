import type { DictId } from './types';

export const SYSTEM_DICT_URLS = {
  DATA_CREATE: '/system/dict/data',
  DATA_DELETE: (ids: DictId[]) => `/system/dict/data/${ids.map(String).join(',')}`,
  DATA_DETAIL: (id: DictId) => `/system/dict/data/${id}`,
  DATA_LIST: '/system/dict/data/list',
  DATA_EXPORT: '/system/dict/data/export',
  DATA_UPDATE: '/system/dict/data',
  REFRESH_CACHE: '/system/dict/type/refreshCache',
  TYPE_CREATE: '/system/dict/type',
  TYPE_DELETE: (ids: DictId[]) => `/system/dict/type/${ids.map(String).join(',')}`,
  TYPE_DETAIL: (id: DictId) => `/system/dict/type/${id}`,
  TYPE_LIST: '/system/dict/type/list',
  TYPE_EXPORT: '/system/dict/type/export',
  TYPE_OPTIONS: '/system/dict/type/optionselect',
  TYPE_UPDATE: '/system/dict/type'
} as const;

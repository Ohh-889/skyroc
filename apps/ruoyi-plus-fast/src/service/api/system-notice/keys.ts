import type { NoticeId, NoticeListParams } from './types';

export const SYSTEM_NOTICE_QUERY_KEYS = {
  ALL: ['system-notice'] as const,
  DETAIL: (noticeId: NoticeId) => ['system-notice', 'detail', String(noticeId)] as const,
  LIST: (params: NoticeListParams) => ['system-notice', 'list', params] as const,
  LISTS: ['system-notice', 'list'] as const
} as const;

export const SYSTEM_NOTICE_MUTATION_KEYS = {
  CREATE: ['system-notice', 'create'] as const,
  DELETE: ['system-notice', 'delete'] as const,
  UPDATE: ['system-notice', 'update'] as const
} as const;

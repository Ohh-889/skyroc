import type { NoticeId } from './types';

export const SYSTEM_NOTICE_URLS = {
  CREATE: '/system/notice',
  DELETE: (noticeIds: NoticeId[]) => `/system/notice/${noticeIds.map(String).join(',')}`,
  DETAIL: (noticeId: NoticeId) => `/system/notice/${noticeId}`,
  LIST: '/system/notice/list',
  UPDATE: '/system/notice'
} as const;

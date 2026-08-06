import { request } from '../../request';

import type {
  NoticeId,
  NoticeItem,
  NoticeListPage,
  NoticeListParams,
  NoticeSavePayload,
  NoticeUpdatePayload
} from './types';
import { SYSTEM_NOTICE_URLS } from './urls';

export function fetchNoticeList(params: NoticeListParams) {
  return request<NoticeListPage>({ method: 'get', params, url: SYSTEM_NOTICE_URLS.LIST });
}

export function fetchNoticeDetail(noticeId: NoticeId) {
  return request<NoticeItem>({ method: 'get', url: SYSTEM_NOTICE_URLS.DETAIL(noticeId) });
}

export function createNotice(data: NoticeSavePayload) {
  return request<NoticeItem>({ data, method: 'post', url: SYSTEM_NOTICE_URLS.CREATE });
}

export function updateNotice(data: NoticeUpdatePayload) {
  return request<NoticeItem>({ data, method: 'put', url: SYSTEM_NOTICE_URLS.UPDATE });
}

export function deleteNotices(noticeIds: NoticeId[]) {
  return request<null>({ method: 'delete', url: SYSTEM_NOTICE_URLS.DELETE(noticeIds) });
}

import { request } from '../../request';

import type {
  AudiencePreview,
  NotificationId,
  NotificationItem,
  NotificationListPage,
  NotificationListParams,
  NotificationPublishPayload,
  NotificationSavePayload,
  NotificationStats,
  RevokeImpact
} from './types';
import { NOTIFICATION_URLS } from './urls';

export function fetchNotificationList(params: NotificationListParams) {
  return request<NotificationListPage>({ method: 'get', params, url: NOTIFICATION_URLS.LIST });
}

export function fetchNotificationDetail(id: NotificationId) {
  return request<NotificationItem>({ method: 'get', url: NOTIFICATION_URLS.DETAIL(id) });
}

export function saveNotification(data: NotificationSavePayload) {
  return request<NotificationItem>({ data, method: 'post', url: NOTIFICATION_URLS.CREATE });
}

export function updateNotification(id: NotificationId, data: NotificationSavePayload) {
  return request<NotificationItem>({ data, method: 'put', url: NOTIFICATION_URLS.UPDATE(id) });
}

export function publishNotification(id: NotificationId, data: NotificationPublishPayload = {}) {
  return request<NotificationItem>({ data, method: 'post', url: NOTIFICATION_URLS.PUBLISH(id) });
}

export function fetchAudiencePreview(id: NotificationId) {
  return request<AudiencePreview>({ method: 'get', url: NOTIFICATION_URLS.AUDIENCE_PREVIEW(id) });
}

export function fetchNotificationStats(id: NotificationId) {
  return request<NotificationStats>({ method: 'get', url: NOTIFICATION_URLS.STATS(id) });
}

export function fetchRevokeImpact(id: NotificationId) {
  return request<RevokeImpact>({ method: 'get', url: NOTIFICATION_URLS.REVOKE_IMPACT(id) });
}

export function revokeNotification(id: NotificationId, reason: string) {
  return request<NotificationItem>({ data: { reason }, method: 'post', url: NOTIFICATION_URLS.REVOKE(id) });
}

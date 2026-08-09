import { request } from '../../request';

import type {
  AudiencePreview,
  NotificationCatalogEntry,
  NotificationChannel,
  NotificationCounts,
  NotificationId,
  NotificationInboxDetail,
  NotificationInboxPage,
  NotificationInboxParams,
  NotificationIntent,
  NotificationItem,
  NotificationListPage,
  NotificationListParams,
  NotificationPreferenceResponse,
  NotificationPreferenceState,
  NotificationPublishPayload,
  NotificationRevisePayload,
  NotificationRevision,
  NotificationSavePayload,
  NotificationStats,
  NotificationWriteResult,
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

export function fetchNotificationInbox(params: NotificationInboxParams) {
  return request<NotificationInboxPage>({ method: 'get', params, url: NOTIFICATION_URLS.INBOX_LIST });
}

export function fetchNotificationInboxDetail(id: NotificationId) {
  return request<NotificationInboxDetail>({ method: 'get', url: NOTIFICATION_URLS.INBOX_DETAIL(id) });
}

export function fetchNotificationCounts() {
  return request<NotificationCounts>({ method: 'get', url: NOTIFICATION_URLS.COUNTS });
}

export function markNotificationsRead(msgIds: NotificationId[]) {
  return request<NotificationWriteResult>({ data: { msgIds }, method: 'post', url: NOTIFICATION_URLS.MARK_READ });
}

export function markNotificationsUnread(msgIds: NotificationId[]) {
  return request<NotificationWriteResult>({ data: { msgIds }, method: 'post', url: NOTIFICATION_URLS.MARK_UNREAD });
}

export function markAllNotificationsRead() {
  return request<NotificationWriteResult>({ method: 'post', url: NOTIFICATION_URLS.READ_ALL });
}

export function dismissNotifications(msgIds: NotificationId[]) {
  return request<NotificationWriteResult>({ data: { msgIds }, method: 'post', url: NOTIFICATION_URLS.DISMISS });
}

export function markBroadcastRead(id: NotificationId) {
  return request<null>({ method: 'post', url: NOTIFICATION_URLS.BROADCAST_READ(id) });
}

export function fetchNotificationPreference() {
  return request<NotificationPreferenceResponse>({ method: 'get', url: NOTIFICATION_URLS.PREFERENCE });
}

export function updateNotificationPreference(data: {
  channel: NotificationChannel;
  intent: NotificationIntent;
  state: NotificationPreferenceState;
}) {
  return request<NotificationPreferenceResponse>({ data, method: 'put', url: NOTIFICATION_URLS.PREFERENCE });
}

export function deleteNotificationDraft(id: NotificationId) {
  return request<null>({ method: 'delete', url: NOTIFICATION_URLS.DELETE(id) });
}

export function cancelNotificationSchedule(id: NotificationId) {
  return request<NotificationItem>({ method: 'post', url: NOTIFICATION_URLS.CANCEL_SCHEDULE(id) });
}

export function reviseNotification(id: NotificationId, data: NotificationRevisePayload) {
  return request<NotificationItem>({ data, method: 'put', url: NOTIFICATION_URLS.REVISE(id) });
}

export function fetchNotificationRevisions(id: NotificationId) {
  return request<NotificationRevision[]>({ method: 'get', url: NOTIFICATION_URLS.REVISIONS(id) });
}

export function fetchNotificationCatalog() {
  return request<NotificationCatalogEntry[]>({ method: 'get', url: NOTIFICATION_URLS.CATALOG });
}

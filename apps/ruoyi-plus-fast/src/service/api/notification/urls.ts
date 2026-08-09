import type { NotificationId } from './types';

export const NOTIFICATION_URLS = {
  AUDIENCE_PREVIEW: (id: NotificationId) => `/notification/msg/${id}/audience-preview`,
  BROADCAST_READ: (id: NotificationId) => `/notification/broadcast/${id}/read`,
  CANCEL_SCHEDULE: (id: NotificationId) => `/notification/msg/${id}/cancel-schedule`,
  CATALOG: '/notification/msg/catalog',
  COUNTS: '/notification/counts',
  CREATE: '/notification/msg',
  DELETE: (id: NotificationId) => `/notification/msg/${id}`,
  DETAIL: (id: NotificationId) => `/notification/msg/${id}`,
  DISMISS: '/notification/dismiss',
  INBOX_DETAIL: (id: NotificationId) => `/notification/${id}`,
  INBOX_LIST: '/notification/list',
  LIST: '/notification/msg/list',
  MARK_READ: '/notification/read',
  MARK_UNREAD: '/notification/unread',
  PREFERENCE: '/notification/preference',
  PUBLISH: (id: NotificationId) => `/notification/msg/${id}/publish`,
  READ_ALL: '/notification/read-all',
  REVISE: (id: NotificationId) => `/notification/msg/${id}/revise`,
  REVISIONS: (id: NotificationId) => `/notification/msg/${id}/revisions`,
  REVOKE: (id: NotificationId) => `/notification/msg/${id}/revoke`,
  REVOKE_IMPACT: (id: NotificationId) => `/notification/msg/${id}/revoke-impact`,
  STATS: (id: NotificationId) => `/notification/msg/${id}/stats`,
  UPDATE: (id: NotificationId) => `/notification/msg/${id}`
} as const;

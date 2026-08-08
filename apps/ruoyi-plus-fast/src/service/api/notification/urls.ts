import type { NotificationId } from './types';

export const NOTIFICATION_URLS = {
  AUDIENCE_PREVIEW: (id: NotificationId) => `/notification/msg/${id}/audience-preview`,
  CANCEL_SCHEDULE: (id: NotificationId) => `/notification/msg/${id}/cancel-schedule`,
  CREATE: '/notification/msg',
  DETAIL: (id: NotificationId) => `/notification/msg/${id}`,
  LIST: '/notification/msg/list',
  PUBLISH: (id: NotificationId) => `/notification/msg/${id}/publish`,
  REVOKE: (id: NotificationId) => `/notification/msg/${id}/revoke`,
  REVOKE_IMPACT: (id: NotificationId) => `/notification/msg/${id}/revoke-impact`,
  STATS: (id: NotificationId) => `/notification/msg/${id}/stats`,
  UPDATE: (id: NotificationId) => `/notification/msg/${id}`
} as const;

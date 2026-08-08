export type NotificationId = number | string;
export type NotificationCategory = 'alert' | 'announcement' | 'event' | 'message' | 'security' | 'task';
export type NotificationStatus = 'draft' | 'published' | 'revoked' | 'scheduled';

export interface NotificationAudience {
  kind: 'all' | 'depts' | 'roles' | 'users';
  deptIds?: number[];
  roleIds?: number[];
  userIds?: number[];
  includeChildren?: boolean;
}

export interface NotificationItem {
  audience: NotificationAudience;
  audienceSize: number | null;
  body: null | string;
  category: NotificationCategory;
  createBy: NotificationId | null;
  createTime: null | string;
  expireTime: null | string;
  fanoutState: string;
  intent: string;
  msgId: NotificationId;
  priority: string;
  publishTime: null | string;
  revokeReason: null | string;
  revision: number;
  status: NotificationStatus;
  summary: string;
  title: string;
}

export interface NotificationListPage {
  current: number;
  records: NotificationItem[];
  size: number;
  total: number;
}

export interface NotificationListParams {
  category?: NotificationCategory;
  current: number;
  size: number;
  status?: NotificationStatus;
  title?: string;
}

export interface NotificationSavePayload {
  audience: NotificationAudience;
  body?: null | string;
  category: NotificationCategory;
  collapseKey?: null | string;
  expireTime?: null | string;
  intent: string;
  priority: string;
  summary: string;
  title: string;
}

export interface NotificationPublishPayload {
  scheduledAt?: null | string;
}

export interface AudiencePreview {
  count: number;
  exceedsLimit: boolean;
  kind: string;
  limit: number;
  sample: string[];
}

export interface NotificationStats {
  actioned: number;
  channels: Record<string, number>;
  delivered: number;
  isBroadcast: boolean;
  read: number;
}

export interface RevokeImpact {
  alreadySent: Record<string, number>;
  cancelledDeliveries: number;
  inboxRecipients: number;
}

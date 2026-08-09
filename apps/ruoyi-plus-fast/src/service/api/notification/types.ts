export type NotificationId = string;
export type NotificationCategory = 'alert' | 'announcement' | 'event' | 'message' | 'security' | 'task';
export type NotificationStatus = 'draft' | 'published' | 'revoked' | 'scheduled';
export type NotificationActionState = 'cancelled' | 'done' | 'none' | 'pending';
export type NotificationChannel = 'email' | 'inapp' | 'sms';
export type NotificationIntent = 'actionable' | 'alerting' | 'informational' | 'transactional';
export type NotificationPreferenceState = 'digest' | 'off' | 'on';

export interface NotificationAudience {
  deptIds?: number[];
  includeChildren?: boolean;
  kind: 'all' | 'depts' | 'roles' | 'users';
  roleIds?: number[];
  userIds?: number[];
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
  intent: NotificationIntent;
  msgId: NotificationId;
  priority: string;
  publishTime: null | string;
  revision: number;
  revokeReason: null | string;
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

export interface NotificationInboxAction {
  label?: string;
  target?: string;
}

export interface NotificationInboxItem {
  action: NotificationInboxAction | null;
  actionState: NotificationActionState;
  category: NotificationCategory;
  changeSeq: number;
  collapseKey: null | string;
  entrySeq: number;
  expireTime: null | string;
  intent: NotificationIntent;
  msgId: NotificationId;
  priority: string;
  publishTime: string;
  readTime: null | string;
  refId: null | string;
  refType: null | string;
  retracted: boolean;
  revision: number;
  summary: string;
  title: string;
}

export interface NotificationInboxDetail extends NotificationInboxItem {
  body: null | string;
}

export interface NotificationCounts {
  byCategory: Partial<Record<NotificationCategory, number>>;
  pending: number;
  unread: number;
  unreadThreads: number;
}

export interface NotificationInboxPage {
  current: number;
  records: NotificationInboxItem[];
  size: number;
  total: number;
}

export interface NotificationInboxParams {
  actionState?: NotificationActionState;
  category?: NotificationCategory;
  current: number;
  includeDismissed?: boolean;
  size: number;
  unread?: boolean;
}

export interface NotificationWriteResult {
  affected: number;
  changeSeq: number;
  counts: NotificationCounts;
}

export interface NotificationPreferenceItem {
  channel: NotificationChannel;
  intent: NotificationIntent;
  locked: boolean;
  state: NotificationPreferenceState;
}

export interface NotificationPreferenceResponse {
  items: NotificationPreferenceItem[];
}

export interface NotificationRevision {
  changeNote: null | string;
  createBy: null | string;
  createTime: null | string;
  renotified: boolean;
  revision: number;
  summaryBefore: string;
  titleBefore: string;
}

export interface NotificationRevisePayload extends NotificationSavePayload {
  changeNote?: null | string;
  expectedRevision: number;
  renotify: boolean;
}

export interface NotificationCatalogEntry {
  category: NotificationCategory;
  channels: Record<string, NotificationChannel[]>;
  eventType: string;
  intent: NotificationIntent;
  lockedChannels: Record<string, NotificationChannel[]>;
  priority: string;
  template: string;
}

export interface NotificationSavePayload {
  audience: NotificationAudience;
  body?: null | string;
  category: NotificationCategory;
  collapseKey?: null | string;
  expireTime?: null | string;
  intent: NotificationIntent;
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

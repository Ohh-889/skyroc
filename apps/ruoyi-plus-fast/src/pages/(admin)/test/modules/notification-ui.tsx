import { SvgIcon } from '@skyroc/web-ui-compose';

import type {
  NotificationActionState,
  NotificationCategory,
  NotificationIntent,
  NotificationPreferenceState,
  NotificationStatus
} from '@/service/api/notification';

/** 通知分类的统一视觉映射。 */
export const CATEGORY_OPTIONS: Array<{ icon: string; label: string; value: NotificationCategory }> = [
  { icon: 'ph:check-square', label: '待办任务', value: 'task' },
  { icon: 'ph:megaphone', label: '系统公告', value: 'announcement' },
  { icon: 'ph:chat-circle-text', label: '业务消息', value: 'message' },
  { icon: 'ph:activity', label: '系统事件', value: 'event' },
  { icon: 'ph:warning-circle', label: '异常告警', value: 'alert' },
  { icon: 'ph:shield-warning', label: '安全通知', value: 'security' }
];

export const INTENT_OPTIONS: Array<{ label: string; value: NotificationIntent }> = [
  { label: '事务型', value: 'transactional' },
  { label: '可操作', value: 'actionable' },
  { label: '信息型', value: 'informational' },
  { label: '告警型', value: 'alerting' }
];

export const STATUS_OPTIONS: Array<{ label: string; value: NotificationStatus }> = [
  { label: '草稿', value: 'draft' },
  { label: '已排期', value: 'scheduled' },
  { label: '已发布', value: 'published' },
  { label: '已撤回', value: 'revoked' }
];

export function categoryLabel(value: NotificationCategory) {
  return CATEGORY_OPTIONS.find(item => item.value === value)?.label || value;
}

export function categoryColor(value: NotificationCategory) {
  return { alert: 'red', announcement: 'gold', event: 'blue', message: 'cyan', security: 'volcano', task: 'purple' }[
    value
  ];
}

export function categoryIcon(value: NotificationCategory) {
  const icon = CATEGORY_OPTIONS.find(item => item.value === value)?.icon || 'ph:bell';
  return <SvgIcon icon={icon} />;
}

export function categorySurfaceClass(value: NotificationCategory) {
  return {
    alert: 'bg-error-1 text-error',
    announcement: 'bg-warning-1 text-warning',
    event: 'bg-info-1 text-info',
    message: 'bg-primary-1 text-primary',
    security: 'bg-error-1 text-error',
    task: 'bg-primary-1 text-primary'
  }[value];
}

export function actionStateLabel(value: NotificationActionState) {
  return { cancelled: '已取消', done: '已处理', none: '无需处理', pending: '待处理' }[value];
}

export function intentLabel(value: NotificationIntent) {
  return INTENT_OPTIONS.find(item => item.value === value)?.label || value;
}

export function preferenceStateLabel(value: NotificationPreferenceState) {
  return { digest: '每日摘要', off: '关闭', on: '即时接收' }[value];
}

export function statusLabel(value: NotificationStatus) {
  return STATUS_OPTIONS.find(item => item.value === value)?.label || value;
}

export function formatNotificationTime(value: null | string | undefined) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('zh-CN', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(value));
}

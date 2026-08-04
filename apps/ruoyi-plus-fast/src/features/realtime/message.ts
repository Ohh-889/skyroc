import type { AddNotificationInput, NotificationPriority, NotificationType } from '@skyroc/web-admin-notification';
import { z } from 'zod';

/** 与后端 app/core/codes.py 的 Code 逐字一致，改任何一个都要两个仓库一起发版。 */
export const RealtimeCode = {
  /** 连接就绪：认证通过、连接已进注册表，从这一刻起推送到得了。 */
  CONNECTED: '0001',
  SUCCESS: '0000'
} as const;

const notificationTypes = [
  'error',
  'info',
  'message',
  'success',
  'warning'
] as const satisfies readonly NotificationType[];
const notificationPriorities = ['high', 'low', 'normal', 'urgent'] as const satisfies readonly NotificationPriority[];

const RealtimeNotificationSchema = z.object({
  content: z.string(),
  id: z.string().optional(),
  link: z.string().optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
  priority: z.enum(notificationPriorities).optional(),
  read: z.boolean().optional(),
  showBrowserNotification: z.boolean().optional(),
  silent: z.boolean().optional(),
  timestamp: z.number().optional(),
  title: z.string().default('系统通知'),
  type: z.enum(notificationTypes).default('info')
});

const RealtimeEnvelopeSchema = z.object({
  code: z.string(),
  data: z.unknown().nullable(),
  msg: z.string()
});

/** 后端发的连接就绪信息，connection_id 用于排查：报障时把它给后端能捞出整条连接的日志。 */
const ReadyPayloadSchema = z.object({
  connection_id: z.string(),
  transport: z.string(),
  user_id: z.number()
});

export type RealtimeReadyPayload = z.infer<typeof ReadyPayloadSchema>;

function fallbackNotification(content: string, type: NotificationType = 'info'): AddNotificationInput {
  return {
    content,
    title: type === 'error' ? '实时推送错误' : '系统通知',
    type
  };
}

/** 解出 ready 事件里的连接信息，形状不对时返回 null。 */
export function parseRealtimeReady(message: string): RealtimeReadyPayload | null {
  try {
    const envelope = RealtimeEnvelopeSchema.safeParse(JSON.parse(message));

    if (!envelope.success || envelope.data.code !== RealtimeCode.CONNECTED) {
      return null;
    }

    const payload = ReadyPayloadSchema.safeParse(envelope.data.data);
    return payload.success ? payload.data : null;
  } catch {
    return null;
  }
}

/**
 * 把一条统一信封转成通知中心能直接消费的输入。
 *
 * 返回 null 表示这条不需要提示用户（协议消息，不是业务推送）。
 */
export function parseRealtimeNotification(message: string): AddNotificationInput | null {
  try {
    const value: unknown = JSON.parse(message);
    const envelope = RealtimeEnvelopeSchema.safeParse(value);

    if (!envelope.success) {
      return fallbackNotification(message, 'error');
    }
    // 正常情况下 ready 已经被各传输的 client 拦掉了；漏过来也不该弹成一条报错
    if (envelope.data.code === RealtimeCode.CONNECTED) {
      return null;
    }
    if (envelope.data.code !== RealtimeCode.SUCCESS) {
      return fallbackNotification(envelope.data.msg, 'error');
    }
    if (typeof envelope.data.data === 'string') {
      return fallbackNotification(envelope.data.data);
    }

    const notification = RealtimeNotificationSchema.safeParse(envelope.data.data);
    if (notification.success) {
      return notification.data;
    }
    return fallbackNotification(JSON.stringify(envelope.data.data));
  } catch {
    return fallbackNotification(message, 'error');
  }
}

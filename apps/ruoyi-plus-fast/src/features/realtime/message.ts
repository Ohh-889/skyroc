import type { AddNotificationInput, NotificationPriority, NotificationType } from '@skyroc/web-admin-notification';
import { z } from 'zod';

/**
 * 与后端 app/core/codes.py 的 Code 逐字一致，改任何一个都要两个仓库一起发版。
 *
 * 值配在 .env 里和 HTTP 的那几个流程码放在一起，改契约时只用看一个文件。 这里的默认值是给漏配的部署兜底，不是第二份真相。
 */
export const RealtimeCode = {
  /** 连接就绪：认证通过、连接已进注册表，从这一刻起推送到得了。 */
  CONNECTED: import.meta.env.VITE_SERVICE_CONNECTED_CODE?.trim() || '0001',
  SUCCESS: import.meta.env.VITE_SERVICE_SUCCESS_CODE?.trim() || '0000'
};

/**
 * 协议自己的消息类型，与后端 app/infra/realtime/constants.py 一致。
 *
 * 业务类型不收进来：那是各业务模块自己的契约，攒成一张全局表之后谁都不敢删，也把各模块的 发版绑死。要用的地方自己声明。
 */
export const RealtimeMessageType = {
  /** 服务端主动结束连接，data 带关闭码和原因。只有 SSE 用得上。 */
  CONNECTION_CLOSED: 'system.connection.closed',
  CONNECTION_READY: 'system.connection.ready',
  /** 上行消息被拒，协议层面（形状不对）和业务层面（没权限）都用它，看 code 区分。 */
  MESSAGE_ERROR: 'system.message.error'
} as const;

/** 回执类型的后缀：上行 message.direct.send 的回执是 message.direct.send.result。 */
export const RESULT_SUFFIX = '.result';

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
  msg: z.string(),
  /** 同一次投递落到 WebSocket 和 SSE 两条连接上时是同一个值，前端靠它认出重复。 */
  msg_id: z.string().optional(),
  /** 这条是对哪一次上行命令的回执，值是发送时自己给的 id。服务端主动推的事件是 null。 */
  request_id: z.string().nullable().optional(),
  /** 这条消息是什么，前端按它分支。命名是 `模块.资源.动作`。 */
  type: z.string()
});

export type RealtimeEnvelope = z.infer<typeof RealtimeEnvelopeSchema>;

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

/** 这几种不弹给用户：连接就绪和关闭是协议自己的握手；`.result` 是对本端刚发出去那条命令的回执，发起方按 request_id 在自己的业务代码里处理，塞进通知中心只会多出一条谁都看不懂的投递元信息。 */
function isSilent(type: string): boolean {
  return (
    type === RealtimeMessageType.CONNECTION_READY ||
    type === RealtimeMessageType.CONNECTION_CLOSED ||
    type.endsWith(RESULT_SUFFIX)
  );
}

/**
 * 取出用户可见的那部分。
 *
 * 投递类消息（`message.direct.created` 一类）的 data 是 `{message_id, sender_id, body}`， 外面两个是投递元信息，要展示的东西在 body 里。
 */
function visiblePayload(data: unknown): unknown {
  if (data !== null && typeof data === 'object' && 'body' in data) {
    return (data as { body: unknown }).body;
  }

  return data;
}

/** 消息体没自带 id 时用服务端的 msg_id 兜底，让同一次投递在各条连接上拿到同一个 id。 */
function withMsgId(notification: AddNotificationInput, msgId?: string): AddNotificationInput {
  if (!msgId || notification.id) {
    return notification;
  }

  return { ...notification, id: msgId };
}

/** 解出统一信封，不是合法信封时返回 null。 */
export function parseRealtimeEnvelope(message: string): RealtimeEnvelope | null {
  try {
    const envelope = RealtimeEnvelopeSchema.safeParse(JSON.parse(message));

    return envelope.success ? envelope.data : null;
  } catch {
    return null;
  }
}

/** 解出 ready 事件里的连接信息，形状不对时返回 null。 */
export function parseRealtimeReady(message: string): RealtimeReadyPayload | null {
  const envelope = parseRealtimeEnvelope(message);

  if (envelope?.type !== RealtimeMessageType.CONNECTION_READY) {
    return null;
  }

  const payload = ReadyPayloadSchema.safeParse(envelope.data);

  return payload.success ? payload.data : null;
}

/**
 * 把一条统一信封转成通知中心能直接消费的输入。
 *
 * 返回 null 表示这条不需要提示用户（协议消息或回执，不是业务推送）。
 */
export function parseRealtimeNotification(message: string): AddNotificationInput | null {
  const envelope = parseRealtimeEnvelope(message);

  if (!envelope) {
    return fallbackNotification(message, 'error');
  }
  if (isSilent(envelope.type)) {
    return null;
  }
  if (envelope.code !== RealtimeCode.SUCCESS) {
    return fallbackNotification(envelope.msg, 'error');
  }

  const payload = visiblePayload(envelope.data);

  if (typeof payload === 'string') {
    return withMsgId(fallbackNotification(payload), envelope.msg_id);
  }

  const notification = RealtimeNotificationSchema.safeParse(payload);

  return withMsgId(
    notification.success ? notification.data : fallbackNotification(JSON.stringify(payload)),
    envelope.msg_id
  );
}

import type { RealtimeReadyPayload } from '@/features/realtime/message';
import type { ConnectionState } from '@/features/realtime/state';

export type { ConnectionState };

/** 服务端结束这条连接时带的信息，code 是 RFC 6455 关闭码，与 WebSocket 那套完全一致。 */
export interface SseCloseInfo {
  code: number;
  reason: string;
}

export interface SseClientOptions {
  /**
   * 取本次连接的完整地址，每次连接都会调，返回 null 表示现在还不能连。
   *
   * 做成函数是因为 EventSource 自带的重连只会重用构造时那个地址，令牌换过之后必须由我们 重建它，拿到的才是新的。
   */
  getUrl: () => string | null;
  /**
   * 收到「令牌过期」关闭码时怎么续签，返回是否换到了新令牌。
   *
   * 不配的话 4001 之后就停在断开状态：EventSource 自带的重连会拿着同一张过期令牌按 retry 间隔无限空转，比断掉更糟。
   */
  onTokenStale?: () => Promise<boolean>;
}

export interface SseEventMap {
  /** 收到 1008：这次登录结束了，不会再重连。 */
  authFailed: (info: SseCloseInfo) => void;
  /** 服务端主动结束了连接。诊断用，认证相关的两种另有专门事件。 */
  closed: (info: SseCloseInfo) => void;
  /** 连接中断或建立失败，willRetry 说明浏览器还会不会自己重连。 */
  error: (willRetry: boolean) => void;
  /** 收到业务消息（已排除 ready 和 close 这两个协议事件）。 */
  message: (raw: string) => void;
  /** 服务端确认连接就绪。 */
  ready: (payload: RealtimeReadyPayload) => void;
  /** 连接状态变化。 */
  stateChange: (state: ConnectionState) => void;
  /** 收到 4001：令牌该换了，续签成功会自动重连。 */
  tokenStale: () => void;
}

export type SseEventName = keyof SseEventMap;

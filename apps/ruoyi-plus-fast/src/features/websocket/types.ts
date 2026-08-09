import type { ConnectionState } from '@/features/realtime/state';

export type { ConnectionState };

export interface WebSocketClientOptions<TReady = unknown> {
  /** 首次重连延迟，之后按 2 的幂次增长，默认 1000。 */
  baseReconnectDelay?: number;
  /**
   * 取本次连接的完整地址，每次连接和重连都会调。
   *
   * 返回 null 表示现在还不能连（比如没有令牌）。做成函数而不是传字符串，是为了让重连 自动带上最新令牌 —— 令牌一变就重建整个客户端会白白断掉一条健康的连接。
   */
  getUrl: () => string | null;
  /** 心跳发送间隔，默认 25000。 */
  heartbeatInterval?: number;
  /** 发出心跳后等待响应的最长时间，默认 10000。 */
  heartbeatTimeout?: number;
  /** 认出心跳响应，默认把裸字符串 pong 当响应。 */
  isPong?: (raw: string) => boolean;
  /** 最大重连次数，默认不限。 */
  maxReconnectAttempts?: number;
  /** 重连延迟上限，默认 30000。 */
  maxReconnectDelay?: number;
  /**
   * 收到「令牌过期」关闭码时怎么续签，返回是否换到了新令牌。
   *
   * 不配的话 4001 退化成普通重连，会拿着同一张过期令牌反复被拒。配了就先等续签完再连， 省掉那一轮注定失败的重试。
   */
  onTokenStale?: () => Promise<boolean>;
  /**
   * 认出服务端的就绪消息并解出负载，返回 null 表示这条不是就绪消息。
   *
   * 就绪负载的形状由这个函数决定，整个客户端的 TReady 都由它推出来：协议知识只在这一处 注入，类本身仍然不认识任何业务字段。
   */
  parseReady?: (raw: string) => TReady | null;
  /** 心跳帧内容，默认裸字符串 ping。 */
  pingFrame?: string;
}

export interface WebSocketEventMap<TReady = unknown> {
  /** 收到 1008：这次登录结束了，不会再重连。 */
  authFailed: () => void;
  /** 底层 socket 报错。close 总会跟着来，这个事件只用于诊断。 */
  error: (event: Event) => void;
  /** 收到业务消息（已排除就绪消息和心跳响应）。 */
  message: (raw: string) => void;
  /**
   * 服务端确认连接就绪。
   *
   * 只在就绪帧到达的那一刻发一次，晚挂载的订阅方注定错过；要拿当前连接的就绪信息，先读 `getReady()` 补上快照，再订阅这个事件接后续的重连。
   */
  ready: (payload: TReady) => void;
  /** 消息已发出。 */
  sent: (raw: string) => void;
  /** 连接状态变化。 */
  stateChange: (state: ConnectionState) => void;
  /** 收到 4001：令牌该换了，会自动重连并在重连时取新令牌。 */
  tokenStale: () => void;
}

export type WebSocketEventName = keyof WebSocketEventMap;

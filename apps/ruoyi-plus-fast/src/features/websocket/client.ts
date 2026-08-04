import type { RealtimeReadyPayload } from '@/features/realtime/message';
import { parseRealtimeReady } from '@/features/realtime/message';

const DEFAULT_RECONNECT_DELAYS = [1000, 2000, 5000, 10_000, 30_000] as const;

interface WebSocketClientOptions {
  /** 登录时使用的客户端标识，必须与服务端会话一致。 */
  clientId: string;
  /** 心跳发送间隔。 */
  heartbeatInterval: number;
  /** 发出 ping 后等待 pong 的最长时间。 */
  heartbeatTimeout: number;
  /** 连接关闭时触发。 */
  onClose?: (event: CloseEvent) => void;
  /** 收到业务文本消息时触发。 */
  onMessage: (message: string) => void;
  /**
   * 服务端确认连接就绪时触发。
   *
   * 不用原生的 open 事件：握手失败时服务端也要先 accept 才发得出关闭码，那种情况下 open 照样触发，紧接着才是 close(1008)。挂在 open 上的话，一次认证失败就会把重连退避清零，
   * 心跳定时器也会往一条马上要关的 socket 上写。
   */
  onReady?: (payload: RealtimeReadyPayload) => void;
  /** 各次重连等待时间，超过数组后持续使用最后一项。 */
  reconnectDelays?: readonly number[];
  /** 当前访问令牌。 */
  token: string;
  /** 后端 WebSocket 地址。 */
  url: string;
}

export class WebSocketClient {
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private heartbeatTimeoutTimer: ReturnType<typeof setTimeout> | null = null;
  private manuallyClosed = true;
  private reconnectAttempt = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private socket: WebSocket | null = null;

  constructor(private readonly options: WebSocketClientOptions) {}

  connect() {
    this.manuallyClosed = false;
    window.addEventListener('online', this.handleOnline);
    this.open();
  }

  disconnect() {
    this.manuallyClosed = true;
    window.removeEventListener('online', this.handleOnline);
    this.clearReconnectTimer();
    this.clearHeartbeat();
    this.socket?.close(1000, '用户退出或组件卸载');
    this.socket = null;
  }

  send(message: string) {
    if (this.socket?.readyState !== WebSocket.OPEN) {
      return false;
    }

    this.socket.send(message);
    return true;
  }

  private buildUrl() {
    const url = new URL(this.options.url, window.location.origin);
    url.searchParams.set('Authorization', this.options.token);
    url.searchParams.set('clientid', this.options.clientId);
    return url.toString();
  }

  private clearHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    if (this.heartbeatTimeoutTimer) {
      clearTimeout(this.heartbeatTimeoutTimer);
      this.heartbeatTimeoutTimer = null;
    }
  }

  private clearReconnectTimer() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private handleOnline = () => {
    if (!this.manuallyClosed) {
      this.reconnectAttempt = 0;
      this.open();
    }
  };

  private open() {
    if (
      this.manuallyClosed ||
      this.socket?.readyState === WebSocket.CONNECTING ||
      this.socket?.readyState === WebSocket.OPEN
    ) {
      return;
    }

    this.clearReconnectTimer();
    const socket = new WebSocket(this.buildUrl());
    this.socket = socket;

    // 有意不监听 open：握手成功只说明服务端 accept 了，认证过没过要等 ready 那条消息。

    socket.addEventListener('message', event => {
      if (this.socket !== socket || typeof event.data !== 'string') return;

      if (event.data === 'pong') {
        if (this.heartbeatTimeoutTimer) {
          clearTimeout(this.heartbeatTimeoutTimer);
          this.heartbeatTimeoutTimer = null;
        }
        return;
      }

      const ready = parseRealtimeReady(event.data);
      if (ready) {
        this.reconnectAttempt = 0;
        this.startHeartbeat(socket);
        this.options.onReady?.(ready);
        return;
      }

      this.options.onMessage(event.data);
    });

    socket.addEventListener('close', event => {
      if (this.socket !== socket) return;

      this.socket = null;
      this.clearHeartbeat();
      this.options.onClose?.(event);

      // 1008 表示 token/clientid 无效或登录已过期，继续拿同一凭据重连没有意义。
      if (!this.manuallyClosed && event.code !== 1008) {
        this.scheduleReconnect();
      }
    });
  }

  private scheduleReconnect() {
    if (this.reconnectTimer || !navigator.onLine) return;

    const delays = this.options.reconnectDelays || DEFAULT_RECONNECT_DELAYS;
    const delay = delays[Math.min(this.reconnectAttempt, delays.length - 1)];
    this.reconnectAttempt += 1;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.open();
    }, delay);
  }

  private startHeartbeat(socket: WebSocket) {
    this.clearHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      if (socket.readyState !== WebSocket.OPEN) return;

      socket.send('ping');
      this.heartbeatTimeoutTimer = setTimeout(() => {
        socket.close(4000, '心跳响应超时');
      }, this.options.heartbeatTimeout);
    }, this.options.heartbeatInterval);
  }
}

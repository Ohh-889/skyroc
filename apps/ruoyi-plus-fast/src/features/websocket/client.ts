import { nanoid } from '@skyroc/utils';

import { ClientCloseCode, ServerCloseCode } from '@/features/realtime/close-codes';
import type { ConnectionState, WebSocketClientOptions, WebSocketEventMap, WebSocketEventName } from './types';

/** 第一次重连等多久，之后按 2 的幂次翻倍。 */
const DEFAULT_BASE_RECONNECT_DELAY = 1_000;

/**
 * 多久发一次心跳。
 *
 * 卡这个值的是中间层不是后端：nginx 的 proxy_read_timeout 和 ALB 的空闲超时默认都是 60 秒，空闲到点连接就被掐。取 25 而不是 30，是为了容忍一次延迟 —— 两个周期 50 秒，
 * 还留得下余量。后端自己不会因为空闲断连，它超时只是醒来复核令牌。
 */
const DEFAULT_HEARTBEAT_INTERVAL = 25_000;

/** 发出心跳后等多久还没响应就判定连接已死。 */
const DEFAULT_HEARTBEAT_TIMEOUT = 10_000;

/** 退避的上限。封顶而不是无限翻倍，否则断开久了要等几十分钟才恢复。 */
const DEFAULT_MAX_RECONNECT_DELAY = 30_000;

/** 心跳帧内容。后端目前收发的都是裸字符串，不走信封。 */
const DEFAULT_PING_FRAME = 'ping';

/**
 * WebSocket 连接管理：连接、心跳、重连、状态与事件分发。
 *
 * 不含业务逻辑。协议相关的两件事（怎么认出就绪消息、怎么认出心跳响应）由选项注入， 换后端协议不用改这个文件。
 *
 * 状态和监听器都收在实例里，React 侧用 subscribe / getSnapshot 直接订阅，不需要 另建一个模块转发状态 —— 那样会多出一份和这里同步不上的镜像。
 */
export class WebSocketClient {
  /** 心跳发送定时器，非 null 表示心跳正在跑。 */
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;

  /** 事件监听表。每种事件一个 Set，同一个事件可以有多个订阅方。 */
  private listeners: { [K in WebSocketEventName]: Set<WebSocketEventMap[K]> } = {
    authFailed: new Set(),
    error: new Set(),
    message: new Set(),
    ready: new Set(),
    sent: new Set(),
    stateChange: new Set(),
    tokenStale: new Set()
  };

  /**
   * 是否处于「主动断开」状态，为 true 时任何关闭都不重连。
   *
   * 初值是 true：构造了但还没 connect 的实例不该自己连上去。
   */
  private manuallyClosed = true;

  /** 心跳响应超时定时器，收到响应就清掉；烧完说明连接已经半开。 */
  private pongTimer: ReturnType<typeof setTimeout> | null = null;

  /** 已经排过几次重连，用来算退避时长；连接就绪后归零。 */
  private reconnectAttempt = 0;

  /** 待触发的重连定时器，非 null 表示已经排过队，不要重复排。 */
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  /**
   * 当前这条 socket，null 表示没有活着的连接。
   *
   * 各回调都要拿它和自己捕获的 socket 比一次身份：旧连接的迟到回调不能作用到新连接上。
   */
  private socket: WebSocket | null = null;

  /** 对外可见的连接状态，唯一真相，React 侧读的就是它。 */
  private state: ConnectionState = 'idle';

  constructor(private readonly options: WebSocketClientOptions) {}

  // ==================== 公开 API ====================

  /**
   * 开始连接，并从此接管断线重连。
   *
   * 可以重复调用：已经在连或已连上时会直接返回，不会建出第二条。
   */
  connect() {
    this.manuallyClosed = false;

    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleOnline);
    }

    this.open();
  }

  /** 主动断开，不会触发重连。组件卸载、用户登出时调。 */
  disconnect() {
    this.manuallyClosed = true;

    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.handleOnline);
    }

    this.cleanup();
    this.setState('disconnected');
  }

  /** 断开并清空所有监听器。实例不再复用时调，避免订阅方被一直持有。 */
  destroy() {
    this.disconnect();

    Object.values(this.listeners).forEach(set => set.clear());
  }

  /**
   * 读当前状态。
   *
   * 返回字符串而不是对象：useSyncExternalStore 按引用比较快照，返回对象会每次都判定成 变了，一直重渲染。
   */
  getSnapshot = (): ConnectionState => this.state;

  /** 退订。一般用不上，直接调 on 返回的那个函数更省事。 */
  off<K extends WebSocketEventName>(event: K, listener: WebSocketEventMap[K]) {
    (this.listeners[event] as Set<WebSocketEventMap[K]>).delete(listener);
  }

  /** 订阅事件，返回取消订阅函数，可以直接当 useEffect 的清理函数用。 */
  on<K extends WebSocketEventName>(event: K, listener: WebSocketEventMap[K]): () => void {
    (this.listeners[event] as Set<WebSocketEventMap[K]>).add(listener);

    return () => this.off(event, listener);
  }

  /**
   * 发送原始文本。
   *
   * 返回是否真的发出去了，而不是静默失败：调用方常常要据此提示「尚未连接」。
   */
  send(raw: string): boolean {
    if (this.socket?.readyState !== WebSocket.OPEN) {
      return false;
    }

    this.socket.send(raw);
    this.emit('sent', raw);

    return true;
  }

  /**
   * 发一条上行命令，返回这条命令的 id；没连上返回 null。
   *
   * 信封的三个字段在这里补全，调用方只关心「做什么」和「拿什么数据做」。id 自动生成而不是 让调用方给：它唯一的用途是和回执的 request_id 对上，手写迟早会撞。
   *
   * 这一层不认识任何业务概念 —— recipients、conversation_id 之类都在 data 里，由认领这个 type 的模块负责拼。
   */
  sendCommand(type: string, data: Record<string, unknown> = {}): string | null {
    const id = nanoid();

    return this.sendJson({ data, id, type }) ? id : null;
  }

  /** 发送 JSON，序列化后走 send。 */
  sendJson(payload: unknown): boolean {
    return this.send(JSON.stringify(payload));
  }

  /**
   * 订阅状态变化，配合 getSnapshot 交给 useSyncExternalStore。
   *
   * 写成箭头属性是因为 useSyncExternalStore 要求函数身份稳定，写成普通方法每次渲染 取到的都是同一个引用，但 this 会丢。
   */
  subscribe = (listener: () => void): (() => void) => this.on('stateChange', listener);

  // ==================== 内部：清理 ====================

  /** 取消尚未触发的重连。 */
  private cancelReconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  /** 清掉心跳响应超时计时，收到响应或停心跳时调。 */
  private clearPongTimer() {
    if (this.pongTimer) {
      clearTimeout(this.pongTimer);
      this.pongTimer = null;
    }
  }

  /** 停掉所有定时器并关掉当前连接，不改状态（状态由调用方决定）。 */
  private cleanup() {
    this.stopHeartbeat();
    this.cancelReconnect();

    if (this.socket) {
      const socket = this.socket;

      // 先摘掉引用再关：关闭事件到达时身份对不上，就不会走进 handleClose 排一次重连
      this.socket = null;
      socket.close(ClientCloseCode.NORMAL, '用户退出或组件卸载');
    }
  }

  // ==================== 内部：事件 ====================

  /** 把事件派发给所有订阅方。 */
  private emit<K extends WebSocketEventName>(event: K, ...args: Parameters<WebSocketEventMap[K]>) {
    const listeners = this.listeners[event] as Set<(...a: Parameters<WebSocketEventMap[K]>) => void>;

    listeners.forEach(listener => {
      try {
        listener(...args);
      } catch (error) {
        // 订阅方抛错不能把连接状态机带塌，咽掉但要留痕
        console.error('[WebSocket] 监听器执行失败', event, error);
      }
    });
  }

  /** 连接关闭后的分流：按关闭码决定是重连、还是停下来等重新登录。 */
  private handleClose(event: CloseEvent) {
    this.socket = null;
    this.stopHeartbeat();
    this.setState('disconnected');

    if (this.manuallyClosed) return;

    // 1008：这次登录已经结束，拿同一张凭据重连只会得到同样的结果
    if (event.code === ServerCloseCode.POLICY_VIOLATION) {
      this.emit('authFailed');
      return;
    }

    // 4001：登录还活着，只是这张令牌不能用了，续签完再连
    if (event.code === ServerCloseCode.TOKEN_STALE) {
      this.emit('tokenStale');
      this.recoverFromStaleToken();
      return;
    }

    this.scheduleReconnect();
  }

  /** 收到一帧文本后的分流：心跳响应、就绪消息、业务消息三选一。 */
  private handleMessage(raw: string) {
    if (this.isPong(raw)) {
      this.clearPongTimer();
      return;
    }

    const ready = this.options.parseReady?.(raw) ?? null;

    // 就绪消息到了才算真正连上：握手成功只说明服务端 accept 了，认证还没结论
    if (ready !== null) {
      this.reconnectAttempt = 0;
      this.setState('connected');
      this.startHeartbeat();
      this.emit('ready', ready);
      return;
    }

    this.emit('message', raw);
  }

  /**
   * 网络恢复时立刻重试一次。
   *
   * 箭头属性，因为要拿同一个引用去 removeEventListener。
   */
  private handleOnline = () => {
    if (this.manuallyClosed) return;

    // 断网期间烧掉的退避不算数，网一回来立刻试一次
    this.reconnectAttempt = 0;
    this.cancelReconnect();
    this.open();
  };

  /** 这一帧是不是心跳响应，判定规则由调用方注入。 */
  private isPong(raw: string) {
    const check = this.options.isPong ?? ((value: string) => value === 'pong');

    return check(raw);
  }

  // ==================== 内部：连接 ====================

  /** 真正建连接的地方。connect、重连、网络恢复都走这里。 */
  private open() {
    if (
      this.manuallyClosed ||
      this.socket?.readyState === WebSocket.CONNECTING ||
      this.socket?.readyState === WebSocket.OPEN
    ) {
      return;
    }

    const url = this.options.getUrl();

    // 没地址通常是还没登录，保持 idle 等 connect 再被调用
    if (!url) return;

    this.cancelReconnect();
    this.setState('connecting');

    const socket = new WebSocket(url);
    this.socket = socket;

    // 有意不监听 open：握手成功只说明服务端 accept 了，认证过没过要等就绪消息。
    // 握手失败时服务端也要先 accept 才发得出关闭码，open 照样会触发。

    socket.addEventListener('error', event => {
      if (this.socket !== socket) return;

      this.emit('error', event);
    });

    socket.addEventListener('message', event => {
      if (this.socket !== socket || typeof event.data !== 'string') return;

      this.handleMessage(event.data);
    });

    socket.addEventListener('close', event => {
      // 旧 socket 的迟到关闭事件会给新连接多排一次重连
      if (this.socket !== socket) return;

      this.handleClose(event);
    });
  }

  /**
   * 令牌过期后的恢复：先续签，成功了立刻重连。
   *
   * 续签失败不再重连，也不发 authFailed —— 续签那条链路自己会跳登录页，这里再报一次 只会让用户看见两条提示。没配 onTokenStale 时退化成普通重连。
   */
  private async recoverFromStaleToken() {
    if (!this.options.onTokenStale) {
      this.scheduleReconnect();
      return;
    }

    const refreshed = await this.options.onTokenStale();

    // 续签期间用户可能已经登出，这时不该再把连接拉起来
    if (this.manuallyClosed || !refreshed) return;

    // 换了新令牌，之前那次失败不算数，不用背着退避
    this.reconnectAttempt = 0;
    this.open();
  }

  // ==================== 内部：重连 ====================

  /** 按指数退避排下一次重连。已经排过、离线、次数用完这三种情况都不排。 */
  private scheduleReconnect() {
    if (this.reconnectTimer) return;

    // 离线时排重连只会白烧次数，等 online 事件接手
    if (typeof navigator !== 'undefined' && !navigator.onLine) return;

    const maxAttempts = this.options.maxReconnectAttempts ?? Number.POSITIVE_INFINITY;

    // 默认不限次数：退避已经封顶，永久放弃只会让用户以为推送坏了
    if (this.reconnectAttempt >= maxAttempts) return;

    const base = this.options.baseReconnectDelay ?? DEFAULT_BASE_RECONNECT_DELAY;
    const max = this.options.maxReconnectDelay ?? DEFAULT_MAX_RECONNECT_DELAY;
    const delay = Math.min(base * 2 ** this.reconnectAttempt, max);

    this.reconnectAttempt += 1;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.open();
    }, delay);
  }

  /** 改状态并通知订阅方。状态没变就不通知，免得 React 白渲染一轮。 */
  private setState(next: ConnectionState) {
    if (this.state === next) return;

    this.state = next;
    this.emit('stateChange', next);
  }

  // ==================== 内部：心跳 ====================

  /** 开始定时发心跳。连接就绪后调，重复调用会先停掉上一轮。 */
  private startHeartbeat() {
    this.stopHeartbeat();

    const interval = this.options.heartbeatInterval ?? DEFAULT_HEARTBEAT_INTERVAL;

    this.heartbeatTimer = setInterval(() => {
      // 没发出去说明连接已经不可用，等 close 事件走重连，不必再计超时
      if (!this.send(this.options.pingFrame ?? DEFAULT_PING_FRAME)) return;

      this.startPongTimer();
    }, interval);
  }

  /** 等一个心跳周期还没收到响应就主动关掉：半开连接（TCP 没断、对端已死）只能这么发现。 */
  private startPongTimer() {
    // 先清再设，否则上一轮的定时器引用会丢，stopHeartbeat 就关不掉它
    this.clearPongTimer();

    const timeout = this.options.heartbeatTimeout ?? DEFAULT_HEARTBEAT_TIMEOUT;

    this.pongTimer = setTimeout(() => {
      this.socket?.close(ClientCloseCode.HEARTBEAT_TIMEOUT, '心跳响应超时');
    }, timeout);
  }

  /** 停掉心跳和它的超时计时。 */
  private stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }

    this.clearPongTimer();
  }
}

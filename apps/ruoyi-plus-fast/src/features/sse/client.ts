import { ServerCloseCode } from '@/features/realtime/close-codes';
import type { RealtimeReadyPayload } from '@/features/realtime/message';
import { parseRealtimeReady } from '@/features/realtime/message';
import type { ConnectionState } from '@/features/realtime/state';

import type { SseClientOptions, SseCloseInfo, SseEventMap, SseEventName } from './types';

function readCloseInfo(raw: string): SseCloseInfo {
  try {
    const value = JSON.parse(raw) as Partial<SseCloseInfo>;

    return {
      code: typeof value.code === 'number' ? value.code : 0,
      reason: typeof value.reason === 'string' ? value.reason : ''
    };
  } catch {
    return { code: 0, reason: raw };
  }
}

/**
 * 基于原生 EventSource 的 SSE 连接管理：连接、状态与事件分发。
 *
 * 比 WebSocketClient 短很多，因为重连、退避、以及「网络恢复后重连」都是 EventSource 自带的 —— 这正是选 SSE 的主要理由之一。这里只需要补它没有的三件事：
 *
 * 1. 用服务端的 close 事件停掉那个自动重连。EventSource 只要连接断了就会一直重试，服务端 单方面断流是拦不住它的，只有客户端调 close() 才停得下来。
 * 2. 把「连上了」的判定推迟到 ready 事件，和 WebSocket 用同一套状态机。
 * 3. 令牌过期时先停掉自动重连再续签。自带的那套会拿着 URL 里那张过期令牌一直重试， 每次都被同样地拒掉。
 *
 * 状态和监听器都收在实例里，React 侧用 subscribe / getSnapshot 直接订阅，不需要另建一个模块 转发状态 —— 那样会多出一份和这里同步不上的镜像。
 */
export class SseClient {
  /** 事件监听表。每种事件一个 Set，同一个事件可以有多个订阅方。 */
  private listeners: { [K in SseEventName]: Set<SseEventMap[K]> } = {
    authFailed: new Set(),
    closed: new Set(),
    error: new Set(),
    message: new Set(),
    ready: new Set(),
    stateChange: new Set(),
    tokenStale: new Set()
  };

  /**
   * 是否处于「主动断开」状态，为 true 时续签完也不再连回来。
   *
   * 初值是 true：构造了但还没 connect 的实例不该自己连上去。
   */
  private manuallyClosed = true;

  /**
   * 最近一次就绪负载，null 表示当前没有就绪的连接。
   *
   * ready 是瞬时事件，但它带的连接信息在整条连接活着期间一直有效。留一份在这里，晚挂载 的订阅方（比如联调页）才答得上「当前连接是哪一条」—— 否则它只能等下一次重连。
   */
  private readyPayload: RealtimeReadyPayload | null = null;

  /**
   * 当前这条流，null 表示没有活着的连接。
   *
   * 各回调都要拿它和自己捕获的 source 比一次身份：旧连接的迟到回调不能作用到新连接上。
   */
  private source: EventSource | null = null;

  /** 对外可见的连接状态，唯一真相，React 侧读的就是它。 */
  private state: ConnectionState = 'idle';

  constructor(private readonly options: SseClientOptions) {}

  // ==================== 公开 API ====================

  /** 开始连接。可以重复调用，已经连着时会直接返回，不会建出第二条。 */
  connect() {
    this.manuallyClosed = false;

    this.open();
  }

  /** 主动断开，续签回来也不会再连。组件卸载、用户登出时调。 */
  disconnect() {
    this.manuallyClosed = true;

    this.stop();
    this.setState('disconnected');
  }

  /** 断开并清空所有监听器。实例不再复用时调，避免订阅方被一直持有。 */
  destroy() {
    this.disconnect();

    Object.values(this.listeners).forEach(set => set.clear());
  }

  /**
   * 读当前连接的就绪信息，没有就绪的连接时返回 null。
   *
   * 挂载晚于 ready 事件的订阅方用它补上错过的那次，之后再靠事件接重连。不并进 getSnapshot： 那个快照要按引用比较，返回对象会让每次订阅通知都判定成变了。
   */
  getReady(): RealtimeReadyPayload | null {
    return this.readyPayload;
  }

  /**
   * 读当前状态。
   *
   * 返回字符串而不是对象：useSyncExternalStore 按引用比较快照，返回对象会每次都判定成变了， 一直重渲染。
   */
  getSnapshot = (): ConnectionState => this.state;

  /** 退订。一般用不上，直接调 on 返回的那个函数更省事。 */
  off<K extends SseEventName>(event: K, listener: SseEventMap[K]) {
    (this.listeners[event] as Set<SseEventMap[K]>).delete(listener);
  }

  /** 订阅事件，返回取消订阅函数，可以直接当 useEffect 的清理函数用。 */
  on<K extends SseEventName>(event: K, listener: SseEventMap[K]): () => void {
    (this.listeners[event] as Set<SseEventMap[K]>).add(listener);

    return () => this.off(event, listener);
  }

  /**
   * 订阅状态变化，配合 getSnapshot 交给 useSyncExternalStore。
   *
   * 写成箭头属性是因为 useSyncExternalStore 要求函数身份稳定，写成普通方法每次渲染取到的 都是同一个引用，但 this 会丢。
   */
  subscribe = (listener: () => void): (() => void) => this.on('stateChange', listener);

  // ==================== 内部：事件 ====================

  /** 把事件派发给所有订阅方。 */
  private emit<K extends SseEventName>(event: K, ...args: Parameters<SseEventMap[K]>) {
    const listeners = this.listeners[event] as Set<(...a: Parameters<SseEventMap[K]>) => void>;

    listeners.forEach(listener => {
      try {
        listener(...args);
      } catch (error) {
        // 订阅方抛错不能把连接状态机带塌，咽掉但要留痕
        console.error('[SSE] 监听器执行失败', event, error);
      }
    });
  }

  /** 连接出错后的分流：浏览器还会重试就退回 connecting，放弃了才算断开。 */
  private handleError(source: EventSource) {
    // CONNECTING 说明浏览器已经排好了下一次重试；CLOSED 说明它放弃了，多半是握手拿到了
    // 401/403 —— 按规范非 2xx 响应会直接终止，不会重试
    const willRetry = source.readyState === EventSource.CONNECTING;

    if (willRetry) {
      this.readyPayload = null;
      this.setState('connecting');
    } else {
      this.stop();
      this.setState('disconnected');
    }

    this.emit('error', willRetry);
  }

  /** 服务端主动结束连接后的分流：按关闭码决定是停下来、续签重连、还是交给浏览器自己重试。 */
  private handleServerClose(info: SseCloseInfo) {
    this.emit('closed', info);

    // 1008：这次登录已经结束，再连也是同样的结果。不主动 close 的话 EventSource 会按 retry
    // 间隔无限重连，直到用户自己关掉页面
    if (info.code === ServerCloseCode.POLICY_VIOLATION) {
      this.disconnect();
      this.emit('authFailed', info);
      return;
    }

    // 4001：登录还活着，只是令牌该换了。同样要先停掉自动重连，否则它会带着旧令牌空转
    if (info.code === ServerCloseCode.TOKEN_STALE) {
      this.stop();
      this.setState('disconnected');
      this.emit('tokenStale');
      this.recoverFromStaleToken();
    }

    // 其余关闭码不插手，EventSource 会自己重连
  }

  // ==================== 内部：连接 ====================

  /** 真正建连接的地方。connect 和续签后的重连都走这里。 */
  private open() {
    if (this.manuallyClosed || this.source) return;

    const url = this.options.getUrl();

    // 没地址通常是还没登录，保持原状态等 connect 再被调用
    if (!url) return;

    this.setState('connecting');

    const source = new EventSource(url);
    this.source = source;

    source.addEventListener('ready', event => {
      if (this.source !== source) return;

      const payload = parseRealtimeReady(event.data);

      if (!payload) return;

      // 先落快照再改状态：订阅方在 stateChange 里读它，反过来会读到上一条连接的
      this.readyPayload = payload;
      this.setState('connected');
      this.emit('ready', payload);
    });

    source.addEventListener('message', event => {
      if (this.source !== source) return;

      this.emit('message', event.data);
    });

    source.addEventListener('close', event => {
      if (this.source !== source) return;

      this.handleServerClose(readCloseInfo(event.data));
    });

    source.addEventListener('error', () => {
      if (this.source !== source) return;

      this.handleError(source);
    });
  }

  /** 续签后重新连一条。没配续签钩子就停在断开状态，不拿旧令牌空转。 */
  private async recoverFromStaleToken() {
    if (!this.options.onTokenStale) return;

    const refreshed = await this.options.onTokenStale();

    // 续签期间用户可能已经登出
    if (this.manuallyClosed || !refreshed) return;

    this.open();
  }

  /** 改状态并通知订阅方。状态没变就不通知，免得 React 白渲染一轮。 */
  private setState(next: ConnectionState) {
    if (this.state === next) return;

    this.state = next;
    this.emit('stateChange', next);
  }

  /** 关掉当前连接但不改状态，也不进入「主动断开」—— 续签后还要再连回来。 */
  private stop() {
    this.readyPayload = null;

    // 先摘掉引用再关：close 触发的迟到回调身份对不上，就不会作用到下一条连接上
    const source = this.source;

    this.source = null;
    source?.close();
  }
}

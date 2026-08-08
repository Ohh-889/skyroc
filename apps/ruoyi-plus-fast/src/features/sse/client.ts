import { ServerCloseCode } from '@/features/realtime/close-codes';
import type { RealtimeReadyPayload } from '@/features/realtime/message';
import { parseRealtimeReady } from '@/features/realtime/message';

/** 服务端结束这条连接时带的信息，code 是 RFC 6455 关闭码，与 WebSocket 那套完全一致。 */
export interface SseCloseInfo {
  code: number;
  reason: string;
}

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

export interface SseClientOptions {
  /**
   * 取本次连接的完整地址，每次连接都会调，返回 null 表示现在还不能连。
   *
   * 和 WebSocketClient 一样做成函数：EventSource 自带的重连只会重用构造时那个地址，
   * 令牌换过之后必须由我们重建它，拿到的才是新的。
   */
  getUrl: () => string | null;
  /** 服务端主动结束连接时触发。 */
  onClose?: (info: SseCloseInfo) => void;
  /** 连接断开或建立失败时触发，willRetry 说明浏览器还会不会自己重连。 */
  onError?: (willRetry: boolean) => void;
  /** 收到业务消息时触发，参数是原始的信封文本。 */
  onMessage: (message: string) => void;
  /** 收到 ready 事件时触发，此时服务端已经推得到这条连接。 */
  onReady?: (payload: RealtimeReadyPayload) => void;
  /** 收到令牌过期码时怎么续签，返回是否换到了新令牌。 */
  onTokenStale?: () => Promise<boolean>;
}

/**
 * 基于原生 EventSource 的 SSE 客户端。
 *
 * 比 WebSocketClient 短很多，因为重连、退避、以及「网络恢复后重连」都是 EventSource 自带的
 * —— 这正是选 SSE 的主要理由之一。这里只需要补它没有的三件事：
 *
 * 1. 用服务端的 close 事件停掉那个自动重连。EventSource 只要连接断了就会一直重试，服务端
 *    单方面断流是拦不住它的，只有客户端调 close() 才停得下来。
 * 2. 把「连上了」的判定推迟到 ready 事件，和 WebSocket 用同一套状态机。
 * 3. 令牌过期时先停掉自动重连再续签。自带的那套会拿着 URL 里那张过期令牌一直重试，
 *    每次都被同样地拒掉。
 */
export class SseClient {
  private manuallyClosed = true;
  private source: EventSource | null = null;

  constructor(private readonly options: SseClientOptions) {}

  connect() {
    if (this.source) return;

    this.manuallyClosed = false;
    this.open();
  }

  disconnect() {
    this.manuallyClosed = true;
    this.stop();
  }

  private open() {
    const url = this.options.getUrl();

    // 没地址通常是还没登录
    if (!url) return;

    const source = new EventSource(url);
    this.source = source;

    source.addEventListener('ready', event => {
      if (this.source !== source) return;

      const payload = parseRealtimeReady(event.data);
      if (payload) {
        this.options.onReady?.(payload);
      }
    });

    source.addEventListener('message', event => {
      if (this.source !== source) return;

      this.options.onMessage(event.data);
    });

    source.addEventListener('close', event => {
      if (this.source !== source) return;

      const info = readCloseInfo(event.data);
      this.options.onClose?.(info);

      // 1008 表示这次登录已经结束，再连也是同样的结果。不主动 close 的话 EventSource
      // 会按 retry 间隔无限重连，直到用户自己关掉页面。
      if (info.code === ServerCloseCode.POLICY_VIOLATION) {
        this.disconnect();
        return;
      }

      // 4001 表示登录还活着，只是令牌该换了。同样要先停掉自动重连，否则它会带着旧令牌空转
      if (info.code === ServerCloseCode.TOKEN_STALE) {
        this.stop();
        this.recoverFromStaleToken();
      }
    });

    source.addEventListener('error', () => {
      if (this.source !== source) return;

      // CONNECTING 说明浏览器已经排好了下一次重试；CLOSED 说明它放弃了，多半是握手拿到了
      // 401/403 —— 按规范非 2xx 响应会直接终止，不会重试。
      const willRetry = source.readyState === EventSource.CONNECTING;
      if (!willRetry) {
        this.source = null;
        source.close();
      }
      if (!this.manuallyClosed) {
        this.options.onError?.(willRetry);
      }
    });
  }

  /**
   * 续签后重新连一条。
   *
   * 没配续签钩子时就停在这里不再连：拿着同一张过期令牌重试只会以 retry 间隔无限空转，
   * 比断掉更糟。
   */
  private async recoverFromStaleToken() {
    if (!this.options.onTokenStale) return;

    const refreshed = await this.options.onTokenStale();

    // 续签期间用户可能已经登出
    if (this.manuallyClosed || !refreshed) return;

    this.open();
  }

  /** 关掉当前连接但不进入「主动断开」状态，续签后还要再连回来。 */
  private stop() {
    this.source?.close();
    this.source = null;
  }
}

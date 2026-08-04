import type { RealtimeReadyPayload } from '@/features/realtime/message';
import { parseRealtimeReady } from '@/features/realtime/message';

/** 服务端结束这条连接时带的信息，code 是 RFC 6455 关闭码，与 WebSocket 那套完全一致。 */
export interface SseCloseInfo {
  code: number;
  reason: string;
}

/** 1008：这次登录已经结束，拿同一张凭据重连没有意义。 */
const POLICY_VIOLATION = 1008;

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

interface SseClientOptions {
  /** 登录时使用的客户端标识，必须与服务端会话一致。 */
  clientId: string;
  /** 服务端主动结束连接时触发。 */
  onClose?: (info: SseCloseInfo) => void;
  /** 连接断开或建立失败时触发，willRetry 说明浏览器还会不会自己重连。 */
  onError?: (willRetry: boolean) => void;
  /** 收到业务消息时触发，参数是原始的信封文本。 */
  onMessage: (message: string) => void;
  /** 收到 ready 事件时触发，此时服务端已经推得到这条连接。 */
  onReady?: (payload: RealtimeReadyPayload) => void;
  /** 当前访问令牌。 */
  token: string;
  /** 后端 SSE 地址。 */
  url: string;
}

/**
 * 基于原生 EventSource 的 SSE 客户端。
 *
 * 比 WebSocketClient 短很多，因为重连、退避、以及"网络恢复后重连"都是 EventSource 自带的 ——这正是选 SSE 的主要理由之一。这里只需要补它没有的两件事：
 *
 * 1. 用服务端的 close 事件停掉那个自动重连。EventSource 只要连接断了就会一直重试，服务端 单方面断流是拦不住它的，只有客户端调 close() 才停得下来。
 * 2. 把"连上了"的判定推迟到 ready 事件，和 WebSocket 用同一套状态机。
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
    this.source?.close();
    this.source = null;
  }

  private buildUrl() {
    const url = new URL(this.options.url, window.location.origin);
    // EventSource 设不了请求头，凭据只能走查询参数
    url.searchParams.set('Authorization', this.options.token);
    url.searchParams.set('clientid', this.options.clientId);
    return url.toString();
  }

  private open() {
    const source = new EventSource(this.buildUrl());
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
      if (info.code === POLICY_VIOLATION) {
        this.disconnect();
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
}

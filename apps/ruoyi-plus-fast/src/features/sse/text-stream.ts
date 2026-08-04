import { getServiceBaseURL } from '@/utils/service';
import { localStg } from '@/utils/storage';

/**
 * 逐字流式请求。
 *
 * 有意不用 EventSource：它只能发 GET、也设不了请求头，而这类请求要 POST 带 prompt、要带 Authorization。所以走 fetch + ReadableStream 自己读，帧格式还是同一套 SSE。
 *
 * 也不走 @/service/request：axios 拿不到流，它的 XHR 适配器要等整个响应体收完才 resolve， 那就一次性全出来了，逐字效果没了。
 */

const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'Y';
const { baseURL } = getServiceBaseURL(import.meta.env, isHttpProxy);

export interface TextStreamHandlers {
  /** 收到一段新产出的文本，追加到已有内容后面。 */
  onDelta: (text: string) => void;
  /** 正常结束。 */
  onDone?: (info: { chunks: number }) => void;
  /** 出错。流已经开始之后服务端改不了状态码，错误是从流里带回来的。 */
  onError?: (message: string) => void;
}

interface SseFrame {
  data: string;
  event: string;
}

const DEFAULT_ERROR = '内容生成失败，请重试';

function parseFrame(raw: string): SseFrame | null {
  let event = 'message';
  const data: string[] = [];

  // 以 : 开头的是注释行，服务端用它顶开反代的空闲超时，两个分支都不匹配就被忽略掉了
  for (const line of raw.split('\n')) {
    if (line.startsWith('event:')) {
      event = line.slice('event:'.length).trim();
    } else if (line.startsWith('data:')) {
      data.push(line.slice('data:'.length).replace(/^ /, ''));
    }
  }

  return data.length > 0 ? { data: data.join('\n'), event } : null;
}

function handleFrame(frame: SseFrame, handlers: TextStreamHandlers) {
  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(frame.data) as Record<string, unknown>;
  } catch {
    return;
  }

  if (frame.event === 'delta' && typeof payload.text === 'string') {
    handlers.onDelta(payload.text);
  } else if (frame.event === 'done') {
    handlers.onDone?.({ chunks: typeof payload.chunks === 'number' ? payload.chunks : 0 });
  } else if (frame.event === 'error') {
    handlers.onError?.(typeof payload.msg === 'string' ? payload.msg : DEFAULT_ERROR);
  }
}

export interface TextStreamRequest {
  /** 请求体。 */
  body: Record<string, unknown>;
  /** 事件回调。 */
  handlers: TextStreamHandlers;
  /** 相对于服务 baseURL 的路径。 */
  path: string;
  /** 用来中途停止，页面卸载时也要 abort，否则后端会继续产出到没人读的连接上。 */
  signal?: AbortSignal;
}

export async function streamText({ body, handlers, path, signal }: TextStreamRequest) {
  const token = localStg.get('token');

  const response = await fetch(`${baseURL}${path}`, {
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    method: 'POST',
    signal
  });

  // 还没开始流之前失败，状态码是真的，按普通接口处理
  if (!response.ok || !response.body) {
    handlers.onError?.(`请求失败（${response.status}）`);
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    for (;;) {
      // eslint-disable-next-line no-await-in-loop
      const { done, value } = await reader.read();
      if (done) break;

      // stream: true 很关键：一个多字节字符可能被切在两个 chunk 中间，逐块独立解码会出乱码
      buffer += decoder.decode(value, { stream: true });
      buffer = buffer.replace(/\r\n/g, '\n');

      let boundary = buffer.indexOf('\n\n');
      while (boundary !== -1) {
        const frame = parseFrame(buffer.slice(0, boundary));
        buffer = buffer.slice(boundary + 2);
        if (frame) handleFrame(frame, handlers);
        boundary = buffer.indexOf('\n\n');
      }
    }
  } finally {
    reader.releaseLock();
  }
}

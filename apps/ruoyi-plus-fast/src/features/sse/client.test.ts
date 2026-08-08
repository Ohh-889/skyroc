/** @vitest-environment happy-dom */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ServerCloseCode } from '@/features/realtime/close-codes';

import { SseClient } from './client';
import type { SseClientOptions } from './client';

/** 造一个能从外部决定何时完成的续签，用来观察「续签还没回来」这段时间里的行为。 */
function createDeferredRefresh() {
  let settle!: (value: boolean) => void;
  const start = () =>
    new Promise<boolean>(resolve => {
      settle = resolve;
    });

  return { finish: (value: boolean) => settle(value), start };
}

/** 受控的假 EventSource，测试里手动派发 ready / message / close / error。 */
class FakeEventSource {
  static CLOSED = 2;
  static CONNECTING = 0;
  static instances: FakeEventSource[] = [];
  static OPEN = 1;

  closed = false;
  readyState = 0;

  private listeners: Record<string, Set<(event: unknown) => void>> = {
    close: new Set(),
    error: new Set(),
    message: new Set(),
    ready: new Set()
  };

  constructor(readonly url: string) {
    FakeEventSource.instances.push(this);
  }

  static get last() {
    return FakeEventSource.instances.at(-1)!;
  }

  static reset() {
    FakeEventSource.instances = [];
  }

  addEventListener(type: string, listener: (event: never) => void) {
    this.listeners[type]?.add(listener as (event: unknown) => void);
  }

  close() {
    this.closed = true;
    this.readyState = 2;
  }

  dispatch(type: string, data: string) {
    this.listeners[type]?.forEach(listener => listener({ data }));
  }

  /** 模拟服务端下发 close 事件（SSE 没有关闭帧，用一条事件代替）。 */
  serverClose(code: number, reason = '') {
    this.dispatch('close', JSON.stringify({ code, reason }));
  }
}

const READY_FRAME = JSON.stringify({
  code: '0001',
  data: { connection_id: 'c1', transport: 'sse', user_id: 1 },
  msg: '',
  type: 'system.connection.ready'
});

const createdClients: SseClient[] = [];

function createClient(overrides: Partial<SseClientOptions> = {}) {
  const client = new SseClient({
    getUrl: () => 'http://localhost/sse?token=t1',
    onMessage: vi.fn(),
    ...overrides
  });

  createdClients.push(client);

  return client;
}

beforeEach(() => {
  vi.useFakeTimers();
  FakeEventSource.reset();
  vi.stubGlobal('EventSource', FakeEventSource);
});

afterEach(() => {
  createdClients.forEach(client => client.disconnect());
  createdClients.length = 0;
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('连接', () => {
  it('getUrl 返回 null 时不建连接', () => {
    const client = createClient({ getUrl: () => null });

    client.connect();

    expect(FakeEventSource.instances).toHaveLength(0);
  });

  it('重复 connect 不会再建一条', () => {
    const client = createClient();

    client.connect();
    client.connect();

    expect(FakeEventSource.instances).toHaveLength(1);
  });

  it('ready 事件解出连接信息', () => {
    const onReady = vi.fn();
    const client = createClient({ onReady });

    client.connect();
    FakeEventSource.last.dispatch('ready', READY_FRAME);

    expect(onReady).toHaveBeenCalledWith({ connection_id: 'c1', transport: 'sse', user_id: 1 });
  });

  it('业务消息原样交给 onMessage', () => {
    const onMessage = vi.fn();
    const client = createClient({ onMessage });

    client.connect();
    FakeEventSource.last.dispatch('message', '{"code":"0000"}');

    expect(onMessage).toHaveBeenCalledWith('{"code":"0000"}');
  });

  it('主动断开会关掉底层连接', () => {
    const client = createClient();

    client.connect();
    const source = FakeEventSource.last;
    client.disconnect();

    expect(source.closed).toBe(true);
  });
});

describe('服务端结束连接', () => {
  it('收到 1008 要关掉，否则 EventSource 会无限重试', () => {
    const client = createClient();

    client.connect();
    const source = FakeEventSource.last;
    source.serverClose(ServerCloseCode.POLICY_VIOLATION, '登录状态已失效');

    expect(source.closed).toBe(true);
    expect(FakeEventSource.instances).toHaveLength(1);
  });

  it('收到 4001 先停掉自动重连，再续签重连', async () => {
    const onTokenStale = vi.fn(async () => true);
    const client = createClient({ onTokenStale });

    client.connect();
    const stale = FakeEventSource.last;
    stale.serverClose(ServerCloseCode.TOKEN_STALE, '登录已过期');
    await vi.advanceTimersByTimeAsync(0);

    expect(stale.closed).toBe(true);
    expect(onTokenStale).toHaveBeenCalledOnce();
    expect(FakeEventSource.instances).toHaveLength(2);
  });

  it('续签后连的是带新令牌的地址', async () => {
    let token = 't1';
    const client = createClient({
      getUrl: () => `http://localhost/sse?token=${token}`,
      onTokenStale: async () => {
        token = 't2';
        return true;
      }
    });

    client.connect();
    FakeEventSource.last.serverClose(ServerCloseCode.TOKEN_STALE);
    await vi.advanceTimersByTimeAsync(0);

    expect(FakeEventSource.last.url).toContain('token=t2');
  });

  it('续签失败就停在断开状态，不拿旧令牌空转', async () => {
    const client = createClient({ onTokenStale: async () => false });

    client.connect();
    FakeEventSource.last.serverClose(ServerCloseCode.TOKEN_STALE);
    await vi.advanceTimersByTimeAsync(60_000);

    expect(FakeEventSource.instances).toHaveLength(1);
  });

  it('没配续签钩子时也要停下来，而不是带着过期令牌一直重试', async () => {
    const client = createClient();

    client.connect();
    const source = FakeEventSource.last;
    source.serverClose(ServerCloseCode.TOKEN_STALE);
    await vi.advanceTimersByTimeAsync(60_000);

    expect(source.closed).toBe(true);
    expect(FakeEventSource.instances).toHaveLength(1);
  });

  it('续签期间用户登出了就不要再连回来', async () => {
    const refresh = createDeferredRefresh();
    const client = createClient({ onTokenStale: refresh.start });

    client.connect();
    FakeEventSource.last.serverClose(ServerCloseCode.TOKEN_STALE);
    client.disconnect();
    refresh.finish(true);
    await vi.advanceTimersByTimeAsync(0);

    expect(FakeEventSource.instances).toHaveLength(1);
  });

  it('其他关闭码交给 EventSource 自己重连，不插手', () => {
    const onClose = vi.fn();
    const client = createClient({ onClose });

    client.connect();
    const source = FakeEventSource.last;
    source.serverClose(1011, '服务异常');

    expect(onClose).toHaveBeenCalledWith({ code: 1011, reason: '服务异常' });
    expect(source.closed).toBe(false);
  });
});

describe('连接错误', () => {
  it('浏览器还会重试时如实告知调用方', () => {
    const onError = vi.fn();
    const client = createClient({ onError });

    client.connect();
    const source = FakeEventSource.last;
    source.readyState = FakeEventSource.CONNECTING;
    source.dispatch('error', '');

    expect(onError).toHaveBeenCalledWith(true);
  });

  it('浏览器放弃时关掉连接并告知不会重试', () => {
    const onError = vi.fn();
    const client = createClient({ onError });

    client.connect();
    const source = FakeEventSource.last;
    source.readyState = FakeEventSource.CLOSED;
    source.dispatch('error', '');

    expect(onError).toHaveBeenCalledWith(false);
    expect(source.closed).toBe(true);
  });
});

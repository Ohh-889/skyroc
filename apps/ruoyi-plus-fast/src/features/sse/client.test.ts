/** @vitest-environment happy-dom */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ServerCloseCode } from '@/features/realtime/close-codes';

import { SseClient } from './client';
import type { ConnectionState, SseClientOptions } from './types';

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

  /** 模拟浏览器报错：readyState 决定它接下来还重不重试。 */
  fail(readyState: number) {
    this.readyState = readyState;
    this.dispatch('error', '');
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
    ...overrides
  });

  createdClients.push(client);

  return client;
}

/** 连上并收到就绪消息，多数用例的起点。 */
function connectReady(client: SseClient) {
  client.connect();
  FakeEventSource.last.dispatch('ready', READY_FRAME);
}

/** 记下状态变化的顺序，断言状态机时比逐次读快照清楚。 */
function trackStates(client: SseClient) {
  const states: ConnectionState[] = [];

  client.on('stateChange', next => states.push(next));

  return states;
}

beforeEach(() => {
  vi.useFakeTimers();
  FakeEventSource.reset();
  vi.stubGlobal('EventSource', FakeEventSource);
});

afterEach(() => {
  createdClients.forEach(client => client.destroy());
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
    expect(client.getSnapshot()).toBe('idle');
  });

  it('重复 connect 不会再建一条', () => {
    const client = createClient();

    client.connect();
    client.connect();

    expect(FakeEventSource.instances).toHaveLength(1);
  });

  it('建好流只算连接中，收到 ready 才算连上', () => {
    const client = createClient();
    const states = trackStates(client);

    client.connect();
    expect(client.getSnapshot()).toBe('connecting');

    FakeEventSource.last.dispatch('ready', READY_FRAME);

    expect(states).toEqual(['connecting', 'connected']);
  });

  it('ready 事件解出连接信息', () => {
    const onReady = vi.fn();
    const client = createClient();

    client.on('ready', onReady);
    connectReady(client);

    expect(onReady).toHaveBeenCalledWith({ connection_id: 'c1', transport: 'sse', user_id: 1 });
    expect(client.getReady()).toEqual({ connection_id: 'c1', transport: 'sse', user_id: 1 });
  });

  it('晚订阅的一方虽然错过 ready 事件，但读得到快照', () => {
    const client = createClient();

    connectReady(client);

    const late = vi.fn();
    client.on('ready', late);

    expect(late).not.toHaveBeenCalled();
    expect(client.getReady()).toEqual({ connection_id: 'c1', transport: 'sse', user_id: 1 });
  });

  it('状态变成 connected 时就绪信息已经能读到', () => {
    const client = createClient();
    const seen: (string | null)[] = [];

    client.on('stateChange', () => seen.push(client.getReady()?.connection_id ?? null));
    connectReady(client);

    expect(seen).toEqual([null, 'c1']);
  });

  it('业务消息原样派发给订阅方', () => {
    const onMessage = vi.fn();
    const client = createClient();

    client.on('message', onMessage);
    connectReady(client);
    FakeEventSource.last.dispatch('message', '{"code":"0000"}');

    expect(onMessage).toHaveBeenCalledWith('{"code":"0000"}');
  });

  it('一条消息可以有多个订阅方', () => {
    const first = vi.fn();
    const second = vi.fn();
    const client = createClient();

    client.on('message', first);
    const off = client.on('message', second);
    connectReady(client);
    FakeEventSource.last.dispatch('message', 'a');
    off();
    FakeEventSource.last.dispatch('message', 'b');

    expect(first.mock.calls).toEqual([['a'], ['b']]);
    expect(second.mock.calls).toEqual([['a']]);
  });

  it('主动断开会关掉底层连接并清掉就绪信息', () => {
    const client = createClient();

    connectReady(client);
    const source = FakeEventSource.last;
    client.disconnect();

    expect(source.closed).toBe(true);
    expect(client.getSnapshot()).toBe('disconnected');
    expect(client.getReady()).toBeNull();
  });
});

describe('服务端结束连接', () => {
  it('收到 1008 要关掉，否则 EventSource 会无限重试', () => {
    const onAuthFailed = vi.fn();
    const client = createClient();

    client.on('authFailed', onAuthFailed);
    connectReady(client);
    const source = FakeEventSource.last;
    source.serverClose(ServerCloseCode.POLICY_VIOLATION, '登录状态已失效');

    expect(source.closed).toBe(true);
    expect(FakeEventSource.instances).toHaveLength(1);
    expect(onAuthFailed).toHaveBeenCalledWith({ code: 1008, reason: '登录状态已失效' });
    expect(client.getSnapshot()).toBe('disconnected');
  });

  it('收到 4001 先停掉自动重连，再续签重连', async () => {
    const onTokenStale = vi.fn(async () => true);
    const client = createClient({ onTokenStale });

    connectReady(client);
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

    connectReady(client);
    FakeEventSource.last.serverClose(ServerCloseCode.TOKEN_STALE);
    await vi.advanceTimersByTimeAsync(0);

    expect(FakeEventSource.last.url).toContain('token=t2');
  });

  it('续签失败就停在断开状态，不拿旧令牌空转', async () => {
    const client = createClient({ onTokenStale: async () => false });

    connectReady(client);
    FakeEventSource.last.serverClose(ServerCloseCode.TOKEN_STALE);
    await vi.advanceTimersByTimeAsync(60_000);

    expect(FakeEventSource.instances).toHaveLength(1);
    expect(client.getSnapshot()).toBe('disconnected');
  });

  it('没配续签钩子时也要停下来，而不是带着过期令牌一直重试', async () => {
    const client = createClient();

    connectReady(client);
    const source = FakeEventSource.last;
    source.serverClose(ServerCloseCode.TOKEN_STALE);
    await vi.advanceTimersByTimeAsync(60_000);

    expect(source.closed).toBe(true);
    expect(FakeEventSource.instances).toHaveLength(1);
  });

  it('续签期间用户登出了就不要再连回来', async () => {
    const refresh = createDeferredRefresh();
    const client = createClient({ onTokenStale: refresh.start });

    connectReady(client);
    FakeEventSource.last.serverClose(ServerCloseCode.TOKEN_STALE);
    client.disconnect();
    refresh.finish(true);
    await vi.advanceTimersByTimeAsync(0);

    expect(FakeEventSource.instances).toHaveLength(1);
  });

  it('其他关闭码交给 EventSource 自己重连，不插手', () => {
    const onClosed = vi.fn();
    const client = createClient();

    client.on('closed', onClosed);
    connectReady(client);
    const source = FakeEventSource.last;
    source.serverClose(1011, '服务异常');

    expect(onClosed).toHaveBeenCalledWith({ code: 1011, reason: '服务异常' });
    expect(source.closed).toBe(false);
  });
});

describe('连接错误', () => {
  it('浏览器还会重试时退回连接中，等新的 ready', () => {
    const onError = vi.fn();
    const client = createClient();

    client.on('error', onError);
    connectReady(client);
    FakeEventSource.last.fail(FakeEventSource.CONNECTING);

    expect(onError).toHaveBeenCalledWith(true);
    expect(client.getSnapshot()).toBe('connecting');
    expect(client.getReady()).toBeNull();
  });

  it('浏览器放弃时关掉连接并转成断开', () => {
    const onError = vi.fn();
    const client = createClient();

    client.on('error', onError);
    client.connect();
    const source = FakeEventSource.last;
    source.fail(FakeEventSource.CLOSED);

    expect(onError).toHaveBeenCalledWith(false);
    expect(source.closed).toBe(true);
    expect(client.getSnapshot()).toBe('disconnected');
  });
});

describe('订阅', () => {
  it('订阅方抛错不影响别的订阅方', () => {
    const later = vi.fn();
    const client = createClient();

    vi.spyOn(console, 'error').mockImplementation(() => {});
    client.on('message', () => {
      throw new Error('订阅方炸了');
    });
    client.on('message', later);
    connectReady(client);
    FakeEventSource.last.dispatch('message', 'a');

    expect(later).toHaveBeenCalledWith('a');
  });

  it('destroy 之后不再收到任何事件', () => {
    const onMessage = vi.fn();
    const client = createClient();

    client.on('message', onMessage);
    connectReady(client);
    const source = FakeEventSource.last;
    client.destroy();
    source.dispatch('message', 'a');

    expect(onMessage).not.toHaveBeenCalled();
  });
});

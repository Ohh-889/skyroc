/** @vitest-environment happy-dom */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ClientCloseCode, ServerCloseCode } from '@/features/realtime/close-codes';
import { WebSocketClient } from './client';
import type { ConnectionState, WebSocketClientOptions } from './types';

/** 受控的假 socket，测试里手动驱动 open / message / close。 */
class FakeWebSocket {
  static CLOSED = 3;
  static CLOSING = 2;
  // 客户端要拿这几个常量比对 readyState，少一个就会把 undefined 当成相等
  static CONNECTING = 0;
  static instances: FakeWebSocket[] = [];
  static OPEN = 1;

  closeCode: number | null = null;
  closeReason = '';
  readyState = 0;
  sent: string[] = [];

  private listeners: Record<string, Set<(event: unknown) => void>> = {
    close: new Set(),
    error: new Set(),
    message: new Set()
  };

  constructor(readonly url: string) {
    FakeWebSocket.instances.push(this);
  }

  static get last() {
    return FakeWebSocket.instances.at(-1)!;
  }

  static reset() {
    FakeWebSocket.instances = [];
  }

  /** 模拟握手完成，此时还没通过认证。 */
  accept() {
    this.readyState = 1;
  }

  addEventListener(type: string, listener: (event: never) => void) {
    this.listeners[type]?.add(listener as (event: unknown) => void);
  }

  close(code?: number, reason?: string) {
    this.closeCode = code ?? null;
    this.closeReason = reason ?? '';
    this.readyState = 3;
    this.dispatch('close', { code: code ?? 1005, reason: reason ?? '' });
  }

  /** 直接派发一次关闭事件，用来模拟旧 socket 的迟到回调。 */
  dispatch(type: string, event: unknown) {
    this.listeners[type]?.forEach(listener => listener(event));
  }

  receive(data: string) {
    this.dispatch('message', { data });
  }

  removeEventListener(type: string, listener: (event: never) => void) {
    this.listeners[type]?.delete(listener as (event: unknown) => void);
  }

  send(data: string) {
    this.sent.push(data);
  }

  /** 模拟服务端关闭连接。 */
  serverClose(code: number) {
    this.readyState = 3;
    this.dispatch('close', { code, reason: '' });
  }
}

const READY_FRAME = JSON.stringify({ code: '0001' });

/** 造一个能从外部决定何时完成的续签，用来观察「续签还没回来」这段时间里的行为。 */
function createDeferredRefresh() {
  let settle!: (value: boolean) => void;
  const start = () =>
    new Promise<boolean>(resolve => {
      settle = resolve;
    });

  return { finish: (value: boolean) => settle(value), start };
}

/** 建过的客户端都记下来，afterEach 里统一销毁 —— 它们在 window 上挂着 online 监听， 不摘掉的话下一个用例派发 online 会把上一个用例的连接一起唤醒。 */
const createdClients: WebSocketClient[] = [];

function createClient(overrides: Partial<WebSocketClientOptions> = {}) {
  const client = new WebSocketClient({
    getUrl: () => 'ws://localhost/ws?token=t1',
    isPong: raw => raw === 'pong',
    parseReady: raw => (raw === READY_FRAME ? { connection_id: 'c1' } : null),
    ...overrides
  });

  createdClients.push(client);

  return client;
}

/** 走完「建连 → 服务端确认就绪」，返回当前那条假 socket。 */
function connectAndReady(client: WebSocketClient) {
  client.connect();
  const socket = FakeWebSocket.last;
  socket.accept();
  socket.receive(READY_FRAME);

  return socket;
}

beforeEach(() => {
  vi.useFakeTimers();
  FakeWebSocket.reset();
  vi.stubGlobal('WebSocket', FakeWebSocket);
  vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
});

afterEach(() => {
  createdClients.forEach(client => client.destroy());
  createdClients.length = 0;
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('连接与就绪', () => {
  it('握手成功还不算连上，收到就绪消息才算', () => {
    const client = createClient();

    client.connect();

    expect(client.getSnapshot()).toBe('connecting');

    FakeWebSocket.last.accept();

    expect(client.getSnapshot()).toBe('connecting');

    FakeWebSocket.last.receive(READY_FRAME);

    expect(client.getSnapshot()).toBe('connected');
  });

  it('getUrl 返回 null 时不建连接', () => {
    const client = createClient({ getUrl: () => null });

    client.connect();

    expect(FakeWebSocket.instances).toHaveLength(0);
    expect(client.getSnapshot()).toBe('idle');
  });

  it('每次重连都重新取地址，令牌换了就用新的', () => {
    let token = 't1';
    const client = createClient({ getUrl: () => `ws://localhost/ws?token=${token}` });

    connectAndReady(client);
    token = 't2';
    FakeWebSocket.last.serverClose(1006);
    vi.advanceTimersByTime(1_000);

    expect(FakeWebSocket.last.url).toContain('token=t2');
  });

  it('已连上时重复 connect 不会再建一条', () => {
    const client = createClient();

    connectAndReady(client);
    client.connect();

    expect(FakeWebSocket.instances).toHaveLength(1);
  });
});

describe('重连', () => {
  it('按 2 的幂次退避，并在上限处封顶', () => {
    const client = createClient({ baseReconnectDelay: 1_000, maxReconnectDelay: 4_000 });

    connectAndReady(client);

    const delays: number[] = [];
    for (let i = 0; i < 4; i += 1) {
      FakeWebSocket.last.serverClose(1006);
      const expected = Math.min(1_000 * 2 ** i, 4_000);
      vi.advanceTimersByTime(expected - 1);
      const before = FakeWebSocket.instances.length;
      vi.advanceTimersByTime(1);
      expect(FakeWebSocket.instances.length).toBe(before + 1);
      delays.push(expected);
    }

    expect(delays).toEqual([1_000, 2_000, 4_000, 4_000]);
  });

  it('就绪之后退避计数归零', () => {
    const client = createClient({ baseReconnectDelay: 1_000 });

    connectAndReady(client);
    FakeWebSocket.last.serverClose(1006);
    vi.advanceTimersByTime(1_000);
    FakeWebSocket.last.accept();
    FakeWebSocket.last.receive(READY_FRAME);
    FakeWebSocket.last.serverClose(1006);
    const before = FakeWebSocket.instances.length;
    vi.advanceTimersByTime(1_000);

    expect(FakeWebSocket.instances.length).toBe(before + 1);
  });

  it('收到 1008 不重连，并通知业务层', () => {
    const client = createClient();
    const authFailed = vi.fn();
    client.on('authFailed', authFailed);

    connectAndReady(client);
    FakeWebSocket.last.serverClose(ServerCloseCode.POLICY_VIOLATION);
    vi.advanceTimersByTime(60_000);

    expect(authFailed).toHaveBeenCalledOnce();
    expect(FakeWebSocket.instances).toHaveLength(1);
  });

  it('没配续签钩子时，4001 退化成普通重连', () => {
    const client = createClient();
    const tokenStale = vi.fn();
    client.on('tokenStale', tokenStale);

    connectAndReady(client);
    FakeWebSocket.last.serverClose(ServerCloseCode.TOKEN_STALE);
    vi.advanceTimersByTime(1_000);

    expect(tokenStale).toHaveBeenCalledOnce();
    expect(FakeWebSocket.instances).toHaveLength(2);
  });
});

describe('令牌过期后的续签', () => {
  it('收到 4001 先续签再重连，不等退避', async () => {
    const onTokenStale = vi.fn(async () => true);
    const client = createClient({ onTokenStale });

    connectAndReady(client);
    FakeWebSocket.last.serverClose(ServerCloseCode.TOKEN_STALE);
    await vi.advanceTimersByTimeAsync(0);

    expect(onTokenStale).toHaveBeenCalledOnce();
    expect(FakeWebSocket.instances).toHaveLength(2);
  });

  it('续签后拿到的是新令牌', async () => {
    let token = 't1';
    const client = createClient({
      getUrl: () => `ws://localhost/ws?token=${token}`,
      onTokenStale: async () => {
        token = 't2';
        return true;
      }
    });

    connectAndReady(client);
    FakeWebSocket.last.serverClose(ServerCloseCode.TOKEN_STALE);
    await vi.advanceTimersByTimeAsync(0);

    expect(FakeWebSocket.last.url).toContain('token=t2');
  });

  it('续签失败就不再重连，登录页由续签那条链路负责跳', async () => {
    const client = createClient({ onTokenStale: async () => false });
    const authFailed = vi.fn();
    client.on('authFailed', authFailed);

    connectAndReady(client);
    FakeWebSocket.last.serverClose(ServerCloseCode.TOKEN_STALE);
    await vi.advanceTimersByTimeAsync(60_000);

    expect(FakeWebSocket.instances).toHaveLength(1);
    expect(authFailed).not.toHaveBeenCalled();
  });

  it('续签期间用户登出了就不要再把连接拉起来', async () => {
    const refresh = createDeferredRefresh();
    const client = createClient({ onTokenStale: refresh.start });

    connectAndReady(client);
    FakeWebSocket.last.serverClose(ServerCloseCode.TOKEN_STALE);
    client.disconnect();
    refresh.finish(true);
    await vi.advanceTimersByTimeAsync(0);

    expect(FakeWebSocket.instances).toHaveLength(1);
  });

  it('续签后退避清零，下一次断线还是从最短间隔开始', async () => {
    const client = createClient({ baseReconnectDelay: 1_000, onTokenStale: async () => true });

    connectAndReady(client);
    FakeWebSocket.last.serverClose(ServerCloseCode.TOKEN_STALE);
    await vi.advanceTimersByTimeAsync(0);
    FakeWebSocket.last.serverClose(1006);
    const before = FakeWebSocket.instances.length;
    await vi.advanceTimersByTimeAsync(1_000);

    expect(FakeWebSocket.instances.length).toBe(before + 1);
  });

  it('主动断开不重连', () => {
    const client = createClient();

    connectAndReady(client);
    client.disconnect();
    vi.advanceTimersByTime(60_000);

    expect(FakeWebSocket.instances).toHaveLength(1);
    expect(client.getSnapshot()).toBe('disconnected');
  });

  it('主动断开用约定的关闭码', () => {
    const client = createClient();

    const socket = connectAndReady(client);
    client.disconnect();

    expect(socket.closeCode).toBe(ClientCloseCode.NORMAL);
  });

  it('离线时不排重连，网一回来立刻重试', () => {
    const client = createClient();

    connectAndReady(client);
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
    FakeWebSocket.last.serverClose(1006);
    vi.advanceTimersByTime(60_000);

    expect(FakeWebSocket.instances).toHaveLength(1);

    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
    window.dispatchEvent(new Event('online'));

    expect(FakeWebSocket.instances).toHaveLength(2);
  });

  it('重连次数用完就不再试', () => {
    const client = createClient({ baseReconnectDelay: 1_000, maxReconnectAttempts: 2 });

    connectAndReady(client);
    for (let i = 0; i < 4; i += 1) {
      FakeWebSocket.last.serverClose(1006);
      vi.advanceTimersByTime(60_000);
    }

    expect(FakeWebSocket.instances).toHaveLength(3);
  });

  it('旧 socket 的迟到关闭事件不会给新连接多排一次重连', () => {
    const client = createClient();

    const stale = connectAndReady(client);
    stale.serverClose(1006);
    vi.advanceTimersByTime(1_000);

    expect(FakeWebSocket.instances).toHaveLength(2);

    stale.dispatch('close', { code: 1006, reason: '' });
    vi.advanceTimersByTime(60_000);

    expect(FakeWebSocket.instances).toHaveLength(2);
  });
});

describe('心跳', () => {
  it('就绪后按间隔发心跳', () => {
    const client = createClient({ heartbeatInterval: 25_000 });

    const socket = connectAndReady(client);
    vi.advanceTimersByTime(25_000);

    expect(socket.sent).toEqual(['ping']);
  });

  it('收到响应就不再计超时', () => {
    const client = createClient({ heartbeatInterval: 25_000, heartbeatTimeout: 10_000 });

    const socket = connectAndReady(client);
    vi.advanceTimersByTime(25_000);
    socket.receive('pong');
    vi.advanceTimersByTime(10_000);

    expect(socket.closeCode).toBeNull();
  });

  it('等不到响应就主动关掉，用心跳超时的关闭码', () => {
    const client = createClient({ heartbeatInterval: 25_000, heartbeatTimeout: 10_000 });

    const socket = connectAndReady(client);
    vi.advanceTimersByTime(25_000);
    vi.advanceTimersByTime(10_000);

    expect(socket.closeCode).toBe(ClientCloseCode.HEARTBEAT_TIMEOUT);
  });

  it('心跳间隔小于超时时，上一轮的超时定时器不会漏掉', () => {
    const client = createClient({ heartbeatInterval: 1_000, heartbeatTimeout: 5_000 });

    const socket = connectAndReady(client);
    vi.advanceTimersByTime(3_000);
    client.disconnect();
    socket.closeCode = null;
    vi.advanceTimersByTime(60_000);

    expect(socket.closeCode).toBeNull();
  });

  it('断开后不再发心跳', () => {
    const client = createClient({ heartbeatInterval: 25_000 });

    const socket = connectAndReady(client);
    client.disconnect();
    vi.advanceTimersByTime(100_000);

    expect(socket.sent).toEqual([]);
  });
});

describe('收发与订阅', () => {
  it('就绪消息和心跳响应不当业务消息派发', () => {
    const client = createClient();
    const onMessage = vi.fn();
    client.on('message', onMessage);

    const socket = connectAndReady(client);
    socket.receive('pong');
    socket.receive('{"code":"0000"}');

    expect(onMessage).toHaveBeenCalledExactlyOnceWith('{"code":"0000"}');
  });

  it('未连接时 send 返回 false', () => {
    const client = createClient();

    expect(client.send('hi')).toBe(false);
  });

  it('连上后 sendJson 发出序列化结果并触发 sent', () => {
    const client = createClient();
    const onSent = vi.fn();
    client.on('sent', onSent);

    const socket = connectAndReady(client);
    const ok = client.sendJson({ title: 'x' });

    expect(ok).toBe(true);
    expect(socket.sent).toEqual(['{"title":"x"}']);
    expect(onSent).toHaveBeenCalledWith('{"title":"x"}');
  });

  it('sendCommand 补齐信封三件套并返回这条命令的 id', () => {
    const client = createClient();

    const socket = connectAndReady(client);
    const id = client.sendCommand('message.direct.send', { body: { content: 'hi' }, recipients: [42] });

    expect(id).toBeTruthy();
    expect(JSON.parse(socket.sent[0])).toEqual({
      data: { body: { content: 'hi' }, recipients: [42] },
      id,
      type: 'message.direct.send'
    });
  });

  it('两条命令的 id 不一样，否则回执对不上是哪一条', () => {
    const client = createClient();

    connectAndReady(client);
    const first = client.sendCommand('message.direct.send');
    const second = client.sendCommand('message.direct.send');

    expect(first).not.toBe(second);
  });

  it('未连接时 sendCommand 返回 null，调用方据此提示尚未连接', () => {
    const client = createClient();

    expect(client.sendCommand('message.direct.send')).toBeNull();
  });

  it('subscribe 在状态变化时通知，取消后不再通知', () => {
    const client = createClient();
    const listener = vi.fn();

    const unsubscribe = client.subscribe(listener);
    client.connect();

    expect(listener).toHaveBeenCalledOnce();

    unsubscribe();
    FakeWebSocket.last.accept();
    FakeWebSocket.last.receive(READY_FRAME);

    expect(listener).toHaveBeenCalledOnce();
  });

  it('状态没变就不通知，避免无谓重渲染', () => {
    const client = createClient();
    const listener = vi.fn();

    connectAndReady(client);
    client.subscribe(listener);
    client.disconnect();
    client.disconnect();

    expect(listener).toHaveBeenCalledOnce();
  });

  it('某个订阅方抛错不影响其他订阅方', () => {
    const client = createClient();
    const healthy = vi.fn();
    vi.spyOn(console, 'error').mockImplementation(() => {});

    client.on('stateChange', () => {
      throw new Error('订阅方炸了');
    });
    client.on('stateChange', healthy);
    client.connect();

    expect(healthy).toHaveBeenCalledOnce();
    expect(client.getSnapshot()).toBe('connecting');
  });

  it('destroy 之后不再有任何通知', () => {
    const client = createClient();
    const listener = vi.fn();

    connectAndReady(client);
    client.on('stateChange', listener);
    client.destroy();
    listener.mockClear();
    client.connect();

    expect(listener).not.toHaveBeenCalled();
  });
});

describe('状态快照', () => {
  it('走完一轮的状态序列', () => {
    const client = createClient();
    const states: ConnectionState[] = [];
    client.on('stateChange', next => states.push(next));

    connectAndReady(client);
    client.disconnect();

    expect(states).toEqual(['connecting', 'connected', 'disconnected']);
  });
});

import { describe, expect, it, vi } from 'vitest';
import { getAuthorization, isRefreshTokenRequest, normalizeCodes, showErrorMsg } from '../src/request/shared';
import type { RequestAdapter, RequestInstanceState } from '../src/request/types';

function createMockAdapter(overrides: Partial<RequestAdapter> = {}): RequestAdapter {
  return {
    getCurrentPath: vi.fn(() => '/current'),
    getRefreshToken: vi.fn(() => 'mock-refresh-token'),
    getToken: vi.fn(() => 'mock-token'),
    redirectToLogin: vi.fn(),
    refreshTokenUrl: '/auth/refreshToken',
    resetAuth: vi.fn(),
    setAuth: vi.fn(),
    showErrorMessage: vi.fn(),
    showErrorModal: vi.fn(),
    t: vi.fn((key: string) => key),
    fetchRefreshToken: vi.fn(async () => ({ token: 'new-token', refreshToken: 'new-refresh' })),
    ...overrides
  };
}

function createState(overrides: Partial<RequestInstanceState> = {}): RequestInstanceState {
  return {
    errMsgStack: [],
    ...overrides
  };
}

describe('normalizeCodes', () => {
  it('trims codes so a stray space in .env does not silently disable one', () => {
    const codes = normalizeCodes({
      success: ' 0000 ',
      logout: ['8888', ' 8889'],
      modalLogout: ['7777', '7778 '],
      expiredToken: [' 9999 ']
    });

    expect(codes).toEqual({
      success: '0000',
      logout: ['8888', '8889'],
      modalLogout: ['7777', '7778'],
      expiredToken: ['9999']
    });
  });

  it('falls back to 0000 when the success code is missing', () => {
    const codes = normalizeCodes({
      success: undefined as unknown as string,
      logout: [],
      modalLogout: [],
      expiredToken: []
    });

    expect(codes.success).toBe('0000');
  });

  it('drops empty entries left by a trailing comma', () => {
    const codes = normalizeCodes({
      success: '0000',
      logout: ['8888', '', '  '],
      modalLogout: [],
      expiredToken: []
    });

    expect(codes.logout).toEqual(['8888']);
  });

  it('tolerates undefined code lists', () => {
    const codes = normalizeCodes({
      success: '0000',
      logout: undefined as unknown as string[],
      modalLogout: undefined as unknown as string[],
      expiredToken: undefined as unknown as string[]
    });

    expect(codes.logout).toEqual([]);
    expect(codes.modalLogout).toEqual([]);
    expect(codes.expiredToken).toEqual([]);
  });
});

describe('getAuthorization', () => {
  it('returns Bearer token when token exists', () => {
    const adapter = createMockAdapter({ getToken: vi.fn(() => 'abc123') });
    expect(getAuthorization(adapter)).toBe('Bearer abc123');
  });

  it('returns null when token is null', () => {
    const adapter = createMockAdapter({ getToken: vi.fn(() => null) });
    expect(getAuthorization(adapter)).toBeNull();
  });
});

describe('isRefreshTokenRequest', () => {
  it('认出续签请求本身 —— 不认出来它会 await 自己那次刷新，永久挂起', () => {
    const adapter = createMockAdapter();
    expect(isRefreshTokenRequest({ url: '/auth/refreshToken' }, adapter)).toBe(true);
  });

  it('带 baseURL 前缀也算同一个接口', () => {
    const adapter = createMockAdapter();
    expect(isRefreshTokenRequest({ url: '/api/v2/auth/refreshToken' }, adapter)).toBe(true);
  });

  it('忽略 query 和尾部斜杠', () => {
    const adapter = createMockAdapter();
    expect(isRefreshTokenRequest({ url: '/auth/refreshToken/?from=sse' }, adapter)).toBe(true);
  });

  it('普通接口不算 —— 它们过期时该等刷新完再重试', () => {
    const adapter = createMockAdapter();
    expect(isRefreshTokenRequest({ url: '/auth/getUserInfo' }, adapter)).toBe(false);
    expect(isRefreshTokenRequest(undefined, adapter)).toBe(false);
  });

  it('显式标记可以在 url 对不上时兜底（网关重写、换域名）', () => {
    const adapter = createMockAdapter({ refreshTokenUrl: '/auth/refreshToken' });
    expect(isRefreshTokenRequest({ isRefreshToken: true, url: 'https://sso.example.com/renew' }, adapter)).toBe(true);
  });
});

describe('showErrorMsg', () => {
  it('shows message and adds to stack', () => {
    const adapter = createMockAdapter();
    const state = createState();

    showErrorMsg(adapter, state, 'Something went wrong');

    expect(adapter.showErrorMessage).toHaveBeenCalledWith('Something went wrong', expect.any(Function));
    expect(state.errMsgStack).toContain('Something went wrong');
  });

  it('initializes the stack when the request instance has none', () => {
    const adapter = createMockAdapter();
    const state = createState({ errMsgStack: undefined as any });

    showErrorMsg(adapter, state, 'Something went wrong');

    expect(state.errMsgStack).toEqual(['Something went wrong']);
  });

  it('does not show duplicate messages', () => {
    const adapter = createMockAdapter();
    const state = createState({ errMsgStack: ['Something went wrong'] });

    showErrorMsg(adapter, state, 'Something went wrong');

    expect(adapter.showErrorMessage).not.toHaveBeenCalled();
  });

  it('removes message from stack on close callback', () => {
    vi.useFakeTimers();
    let onCloseCallback: (() => void) | undefined;
    const adapter = createMockAdapter({
      showErrorMessage: vi.fn((_msg: string, onClose?: () => void) => {
        onCloseCallback = onClose;
      })
    });
    const state = createState();

    showErrorMsg(adapter, state, 'Error msg');
    expect(state.errMsgStack).toContain('Error msg');

    onCloseCallback!();
    expect(state.errMsgStack).toEqual([]);

    vi.useRealTimers();
  });

  it('关掉一条不动其他消息 —— 早先的 5 秒全量清空会让它们绕过去重再弹一次', () => {
    vi.useFakeTimers();
    const closers = new Map<string, () => void>();
    const adapter = createMockAdapter({
      showErrorMessage: vi.fn((msg: string, onClose?: () => void) => {
        closers.set(msg, onClose!);
      })
    });
    const state = createState();

    showErrorMsg(adapter, state, '第一条');
    showErrorMsg(adapter, state, '第二条');

    closers.get('第一条')!();
    // 停在第二条自己的看门狗到期之前：这段时间里它该一直占着去重位
    vi.advanceTimersByTime(4000);

    expect(state.errMsgStack).toEqual(['第二条']);

    // 还在展示的那条不能因为别人被关掉就重新弹出来
    showErrorMsg(adapter, state, '第二条');
    expect(adapter.showErrorMessage).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  });

  it('平台不回调 onClose 时也会到点释放去重位', () => {
    vi.useFakeTimers();
    // RN 的 Alert.alert 就是这样，没有关闭回调
    const adapter = createMockAdapter({ showErrorMessage: vi.fn() });
    const state = createState();

    showErrorMsg(adapter, state, '网络异常');
    expect(state.errMsgStack).toEqual(['网络异常']);

    vi.advanceTimersByTime(5000);
    expect(state.errMsgStack).toEqual([]);

    showErrorMsg(adapter, state, '网络异常');
    expect(adapter.showErrorMessage).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  });
});

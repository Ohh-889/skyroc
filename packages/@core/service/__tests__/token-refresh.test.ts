import { afterEach, describe, expect, it, vi } from 'vitest';
import { handleRefreshToken, refreshToken, resetTokenRefresh } from '../src/request/token-refresh';
import type { RequestAdapter } from '../src/request/types';

function createMockAdapter(overrides: Partial<RequestAdapter> = {}): RequestAdapter {
  return {
    getCurrentPath: vi.fn(() => '/current'),
    getRefreshToken: vi.fn(() => 'mock-refresh-token'),
    getToken: vi.fn(() => 'mock-token'),
    redirectToLogin: vi.fn(),
    resetAuth: vi.fn(),
    setAuth: vi.fn(),
    showErrorMessage: vi.fn(),
    showErrorModal: vi.fn(),
    t: vi.fn((key: string) => key),
    fetchRefreshToken: vi.fn(async () => ({ token: 'new-token', refreshToken: 'new-refresh' })),
    ...overrides
  };
}

/** 让在途刷新挂住，好在它完成之前发起第二个调用。 */
function createPendingAdapter() {
  let resolveRefresh!: (value: { refreshToken: string; token: string }) => void;
  const adapter = createMockAdapter({
    fetchRefreshToken: vi.fn(
      () =>
        new Promise<{ refreshToken: string; token: string }>(resolve => {
          resolveRefresh = resolve;
        })
    )
  });

  return { adapter, finish: () => resolveRefresh({ refreshToken: 'new-refresh', token: 'new-token' }) };
}

afterEach(() => {
  resetTokenRefresh();
  vi.useRealTimers();
});

describe('handleRefreshToken', () => {
  it('calls fetchRefreshToken and setAuth on success', async () => {
    const adapter = createMockAdapter();

    const result = await handleRefreshToken(adapter);

    expect(adapter.fetchRefreshToken).toHaveBeenCalledWith('mock-refresh-token');
    expect(adapter.setAuth).toHaveBeenCalledWith({ token: 'new-token', refreshToken: 'new-refresh' });
    expect(result).toBe(true);
  });

  it('uses empty string when getRefreshToken returns null', async () => {
    const adapter = createMockAdapter({ getRefreshToken: vi.fn(() => null) });

    await handleRefreshToken(adapter);

    expect(adapter.fetchRefreshToken).toHaveBeenCalledWith('');
  });

  it('redirects to login on failure', async () => {
    const adapter = createMockAdapter({
      fetchRefreshToken: vi.fn(async () => {
        throw new Error('fail');
      })
    });

    const result = await handleRefreshToken(adapter);

    // refresh token 也废了，凭据必须一起清掉，否则下次请求还会再走一遍必败的续签
    expect(adapter.resetAuth).toHaveBeenCalled();
    expect(adapter.redirectToLogin).toHaveBeenCalledWith('/current');
    expect(result).toBe(false);
  });
});

describe('refreshToken', () => {
  it('shares one request across concurrent callers', async () => {
    const { adapter, finish } = createPendingAdapter();

    const first = refreshToken(adapter);
    const second = refreshToken(adapter);
    finish();

    await expect(Promise.all([first, second])).resolves.toEqual([true, true]);
    expect(adapter.fetchRefreshToken).toHaveBeenCalledOnce();
  });

  it('shares one request no matter which transport asks — 各刷各的会用掉已轮换的 refresh token', async () => {
    const { adapter, finish } = createPendingAdapter();

    // 三个调用方分别代表 HTTP 401、WebSocket 4001、SSE 4001
    const callers = [refreshToken(adapter), refreshToken(adapter), refreshToken(adapter)];
    finish();

    await Promise.all(callers);

    expect(adapter.fetchRefreshToken).toHaveBeenCalledOnce();
    expect(adapter.setAuth).toHaveBeenCalledOnce();
  });

  it('reuses the result for a short window after settling', async () => {
    vi.useFakeTimers();
    const adapter = createMockAdapter();

    await refreshToken(adapter);
    await refreshToken(adapter);

    expect(adapter.fetchRefreshToken).toHaveBeenCalledOnce();
  });

  it('refreshes again once the reuse window has passed', async () => {
    vi.useFakeTimers();
    const adapter = createMockAdapter();

    await refreshToken(adapter);
    await vi.advanceTimersByTimeAsync(1_000);
    await refreshToken(adapter);

    expect(adapter.fetchRefreshToken).toHaveBeenCalledTimes(2);
  });

  it('reports failure to every caller', async () => {
    const adapter = createMockAdapter({
      fetchRefreshToken: vi.fn(async () => {
        throw new Error('fail');
      })
    });

    const results = await Promise.all([refreshToken(adapter), refreshToken(adapter)]);

    expect(results).toEqual([false, false]);
    expect(adapter.redirectToLogin).toHaveBeenCalledOnce();
  });
});

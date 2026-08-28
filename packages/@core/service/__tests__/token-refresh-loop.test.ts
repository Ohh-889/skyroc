/** @vitest-environment node */
import type { AxiosAdapter, AxiosResponse } from 'axios';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createAppRequest } from '../src/request/create-request';
import { resetTokenRefresh } from '../src/request/token-refresh';
import type { RequestAdapter, ServiceCodes } from '../src/request/types';

// 刷新是模块级单例，刷完还有一秒的结果复用窗口，不重置的话上个用例的结果会漏给下一个
afterEach(() => {
  resetTokenRefresh();
});

const TEST_CODES: ServiceCodes = {
  success: '0000',
  logout: ['8888'],
  modalLogout: ['7777'],
  expiredToken: ['9999']
};

/**
 * 重发失控时的熔断次数
 *
 * 守卫失效的表现是无限重发，撞上限直接抛错比干等测试超时更早、也更说明问题。
 */
const MAX_CALLS = 8;

function createMockAdapter(overrides: Partial<RequestAdapter> = {}): RequestAdapter {
  return {
    getCurrentPath: vi.fn(() => '/dashboard'),
    getRefreshToken: vi.fn(() => 'refresh-tok'),
    getToken: vi.fn(() => 'access-tok'),
    redirectToLogin: vi.fn(),
    refreshTokenUrl: '/auth/refreshToken',
    resetAuth: vi.fn(),
    setAuth: vi.fn(),
    showErrorMessage: vi.fn(),
    showErrorModal: vi.fn(),
    t: vi.fn((key: string) => key),
    fetchRefreshToken: vi.fn(async () => ({ token: 'new', refreshToken: 'new-r' })),
    ...overrides
  };
}

/**
 * 用自定义 axios adapter 替掉真实网络
 *
 * 走完整的 axios 请求链路（拦截器、mergeConfig 都照跑），只把最后发包那一步换掉——续签标记 能不能熬过 `instance.request()` 的 config 重新合并，正是这个用例要验的东西。
 */
function createCountingAdapter(codesInOrder: string[]) {
  const calls: string[] = [];

  const httpAdapter: AxiosAdapter = async config => {
    calls.push(String(config.headers?.Authorization ?? ''));

    if (calls.length > MAX_CALLS) {
      throw new Error(`重发失控：适配器被调用了 ${calls.length} 次`);
    }

    const code = codesInOrder[calls.length - 1] ?? codesInOrder.at(-1)!;

    return {
      config,
      data: { code, data: code === TEST_CODES.success ? 'payload' : null, msg: 'token expired' },
      headers: {},
      request: {},
      status: 200,
      statusText: 'OK'
    } as AxiosResponse;
  };

  return { calls, httpAdapter };
}

describe('续签重试的重入边界', () => {
  it('续签成功后仍回过期码时只重试一次，不进入无限重发', async () => {
    // 后端咬死过期码：多副本没同步、时钟偏移，或者这个码根本不该配进 expiredToken
    const { calls, httpAdapter } = createCountingAdapter(['9999']);
    const adapter = createMockAdapter();

    const request = createAppRequest({
      adapter,
      axiosConfig: { adapter: httpAdapter, baseURL: 'http://test.local' },
      codes: TEST_CODES
    });

    await expect(request({ url: '/api/profile' })).rejects.toThrow();

    expect(adapter.fetchRefreshToken).toHaveBeenCalledTimes(1);
    expect(calls).toHaveLength(2);
  });

  it('正常的「刷一次就好」路径不受守卫影响', async () => {
    const { calls, httpAdapter } = createCountingAdapter(['9999', '0000']);
    const adapter = createMockAdapter();

    const request = createAppRequest({
      adapter,
      axiosConfig: { adapter: httpAdapter, baseURL: 'http://test.local' },
      codes: TEST_CODES
    });

    const data = await request({ url: '/api/profile' });

    expect(data).toBe('payload');
    expect(adapter.fetchRefreshToken).toHaveBeenCalledTimes(1);
    // 重试必须带上刷新后的认证头，否则重试结果还是过期码
    expect(calls).toEqual(['Bearer access-tok', 'Bearer access-tok']);
  });
});

import { BACKEND_ERROR_CODE } from '@skyroc/axios';
import type { RequestInstance } from '@skyroc/axios';
import { AxiosHeaders } from 'axios';
import type { AxiosError, AxiosResponse } from 'axios';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { backEndFail, handleError } from '../src/request/error-handler';
import { resetTokenRefresh } from '../src/request/token-refresh';
import type { RequestAdapter, RequestInstanceState, ServiceCodes } from '../src/request/types';

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

function createMockRequest(stateOverrides: Partial<RequestInstanceState> = {}) {
  return {
    state: {
      errMsgStack: [],

      ...stateOverrides
    }
  } as unknown as RequestInstance<any, RequestInstanceState>;
}

function createMockResponse(code: string, msg = 'error', config: Record<string, unknown> = {}) {
  return {
    data: { code, data: null, msg },
    // 用真的 AxiosHeaders：重试分支走的是 headers.set()，普通对象会静默少掉认证头
    config: { headers: new AxiosHeaders(), ...config }
  } as unknown as AxiosResponse<{ code: string | number; data: any; msg: string }>;
}

describe('backEndFail', () => {
  it('handles logout codes — shows message and redirects', async () => {
    const adapter = createMockAdapter();
    const request = createMockRequest();
    const instance = { request: vi.fn() } as any;
    const response = createMockResponse('8888');

    const result = await backEndFail(response, instance, request, adapter, TEST_CODES);

    expect(result).toBeNull();
    expect(adapter.showErrorMessage).toHaveBeenCalledWith('request.logoutMsg');
    expect(adapter.resetAuth).toHaveBeenCalled();
    expect(adapter.redirectToLogin).toHaveBeenCalledWith('/dashboard');
  });

  it('handles modalLogout codes — shows modal', async () => {
    const adapter = createMockAdapter();
    const request = createMockRequest();
    const instance = { request: vi.fn() } as any;
    const response = createMockResponse('7777', 'Session expired');

    const result = await backEndFail(response, instance, request, adapter, TEST_CODES);

    expect(result).toBeNull();
    expect(adapter.showErrorModal).toHaveBeenCalledWith(
      expect.objectContaining({
        content: 'Session expired',
        title: 'common.error'
      })
    );
    expect(request.state.errMsgStack).toContain('Session expired');
  });

  it('modalLogout onConfirm triggers logoutAndCleanup', async () => {
    const removeListenerSpy = vi.spyOn(window, 'removeEventListener');
    const adapter = createMockAdapter();
    const request = createMockRequest();
    const instance = { request: vi.fn() } as any;
    const response = createMockResponse('7777', 'Session expired');

    await backEndFail(response, instance, request, adapter, TEST_CODES);

    const modalCall = vi.mocked(adapter.showErrorModal).mock.calls[0]![0];
    modalCall.onConfirm();

    expect(adapter.resetAuth).toHaveBeenCalled();
    expect(adapter.redirectToLogin).toHaveBeenCalledWith('/dashboard');
    expect(removeListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function));
    expect(request.state.errMsgStack).not.toContain('Session expired');
    removeListenerSpy.mockRestore();
  });

  it('modalLogout adds beforeunload listener in browser', async () => {
    const addListenerSpy = vi.spyOn(window, 'addEventListener');
    const adapter = createMockAdapter();
    const request = createMockRequest();
    const instance = { request: vi.fn() } as any;
    const response = createMockResponse('7777', 'modal msg');

    await backEndFail(response, instance, request, adapter, TEST_CODES);

    expect(addListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function));
    addListenerSpy.mockRestore();
  });

  it('skips modal if message already in stack', async () => {
    const adapter = createMockAdapter();
    const request = createMockRequest({ errMsgStack: ['Session expired'] });
    const instance = { request: vi.fn() } as any;
    const response = createMockResponse('7777', 'Session expired');

    await backEndFail(response, instance, request, adapter, TEST_CODES);

    expect(adapter.showErrorModal).not.toHaveBeenCalled();
  });

  it('handles expired token — refreshes and retries', async () => {
    const adapter = createMockAdapter();
    const request = createMockRequest();
    const retryResponse = { data: { code: '0000', data: 'ok', msg: '' } };
    const instance = { request: vi.fn().mockResolvedValue(retryResponse) } as any;
    const response = createMockResponse('9999');

    const result = await backEndFail(response, instance, request, adapter, TEST_CODES);

    expect(adapter.fetchRefreshToken).toHaveBeenCalled();
    expect(adapter.setAuth).toHaveBeenCalled();
    expect(instance.request).toHaveBeenCalledWith(response.config);
    // 重试必须带上刷新后的认证头，否则重试的结果还是过期码
    expect((response.config.headers as AxiosHeaders).get('Authorization')).toBe('Bearer access-tok');
    expect(result).toBe(retryResponse);
  });

  it('已经续签重发过一次的请求不再刷新', async () => {
    const adapter = createMockAdapter();
    const request = createMockRequest();
    const instance = { request: vi.fn() } as any;
    const response = createMockResponse('9999', 'expired', { isTokenRefreshRetry: true });

    const result = await backEndFail(response, instance, request, adapter, TEST_CODES);

    expect(result).toBeNull();
    expect(adapter.fetchRefreshToken).not.toHaveBeenCalled();
    expect(instance.request).not.toHaveBeenCalled();
  });

  it('重试前会在 config 上打标记，让下一轮认得出来', async () => {
    const adapter = createMockAdapter();
    const request = createMockRequest();
    const instance = { request: vi.fn().mockResolvedValue({ data: { code: '0000' } }) } as any;
    const response = createMockResponse('9999');

    await backEndFail(response, instance, request, adapter, TEST_CODES);

    expect(response.config.isTokenRefreshRetry).toBe(true);
  });

  it('returns null when expired token refresh fails', async () => {
    const adapter = createMockAdapter({
      fetchRefreshToken: vi.fn(async () => {
        throw new Error('refresh failed');
      })
    });
    const request = createMockRequest();
    const instance = { request: vi.fn() } as any;
    const response = createMockResponse('9999');

    const result = await backEndFail(response, instance, request, adapter, TEST_CODES);

    expect(result).toBeNull();
    expect(instance.request).not.toHaveBeenCalled();
  });

  it('initializes errMsgStack when undefined for modalLogout', async () => {
    const adapter = createMockAdapter();
    const request = createMockRequest({ errMsgStack: undefined as any });
    const instance = { request: vi.fn() } as any;
    const response = createMockResponse('7777', 'new msg');

    await backEndFail(response, instance, request, adapter, TEST_CODES);

    expect(adapter.showErrorModal).toHaveBeenCalled();
  });

  it('does not refresh when the expired code comes from the refresh request itself', async () => {
    const adapter = createMockAdapter();
    const request = createMockRequest();
    const instance = { request: vi.fn() } as any;
    const response = createMockResponse('9999', 'expired', { isRefreshToken: true });

    const result = await backEndFail(response, instance, request, adapter, TEST_CODES);

    expect(result).toBeNull();
    expect(adapter.fetchRefreshToken).not.toHaveBeenCalled();
    expect(instance.request).not.toHaveBeenCalled();
  });

  it('靠 adapter.refreshTokenUrl 认出续签请求，不必等 api 层记得打标记', async () => {
    const adapter = createMockAdapter();
    const request = createMockRequest();
    const instance = { request: vi.fn() } as any;
    // 没有 isRefreshToken —— 四个 app 里三个都是这么写的
    const response = createMockResponse('9999', 'expired', { url: '/auth/refreshToken' });

    const result = await backEndFail(response, instance, request, adapter, TEST_CODES);

    expect(result).toBeNull();
    expect(adapter.fetchRefreshToken).not.toHaveBeenCalled();
    expect(instance.request).not.toHaveBeenCalled();
  });

  it('returns null for unknown codes', async () => {
    const adapter = createMockAdapter();
    const request = createMockRequest();
    const instance = { request: vi.fn() } as any;
    const response = createMockResponse('1234');

    const result = await backEndFail(response, instance, request, adapter, TEST_CODES);

    expect(result).toBeNull();
  });
});

describe('handleError', () => {
  it('shows error message for regular errors', () => {
    const adapter = createMockAdapter();
    const request = createMockRequest();
    const error = { message: 'Network Error', code: 'ERR_NETWORK' } as AxiosError<any>;

    handleError(error, request, adapter, TEST_CODES);

    expect(adapter.showErrorMessage).toHaveBeenCalledWith('Network Error', expect.any(Function));
  });

  it('uses the backend message carried by a business failure', () => {
    const adapter = createMockAdapter();
    const request = createMockRequest();
    const error = {
      message: 'the backend request error',
      code: BACKEND_ERROR_CODE,
      response: { data: { code: '1234', msg: 'Custom backend error' } }
    } as AxiosError<any>;

    handleError(error, request, adapter, TEST_CODES);

    expect(adapter.showErrorMessage).toHaveBeenCalledWith('Custom backend error', expect.any(Function));
  });

  it('uses the backend message when the failure came back as a real http status', () => {
    const adapter = createMockAdapter();
    const request = createMockRequest();
    const error = {
      message: 'Request failed with status code 409',
      code: 'ERR_BAD_REQUEST',
      response: { status: 409, data: { code: '409', msg: '该账号已被占用' } }
    } as AxiosError<any>;

    handleError(error, request, adapter, TEST_CODES);

    expect(adapter.showErrorMessage).toHaveBeenCalledWith('该账号已被占用', expect.any(Function));
  });

  it('skips message for logout codes — backEndFail already showed one', () => {
    const adapter = createMockAdapter();
    const request = createMockRequest();
    const error = {
      message: 'Request failed with status code 401',
      code: 'ERR_BAD_REQUEST',
      response: { status: 401, data: { code: '8888', msg: '登录状态已失效，请重新登录' } }
    } as AxiosError<any>;

    handleError(error, request, adapter, TEST_CODES);

    expect(adapter.showErrorMessage).not.toHaveBeenCalled();
  });

  it('skips message for modalLogout codes', () => {
    const adapter = createMockAdapter();
    const request = createMockRequest();
    const error = {
      message: 'error',
      code: BACKEND_ERROR_CODE,
      response: { data: { code: '7777', msg: 'modal error' } }
    } as AxiosError<any>;

    handleError(error, request, adapter, TEST_CODES);

    expect(adapter.showErrorMessage).not.toHaveBeenCalled();
  });

  it('skips message for expiredToken codes', () => {
    const adapter = createMockAdapter();
    const request = createMockRequest();
    const error = {
      message: 'error',
      code: BACKEND_ERROR_CODE,
      response: { data: { code: '9999', msg: 'token expired' } }
    } as AxiosError<any>;

    handleError(error, request, adapter, TEST_CODES);

    expect(adapter.showErrorMessage).not.toHaveBeenCalled();
  });

  it('skips message for expiredToken codes delivered as http 401', () => {
    const adapter = createMockAdapter();
    const request = createMockRequest();
    const error = {
      message: 'Request failed with status code 401',
      code: 'ERR_BAD_REQUEST',
      response: { status: 401, data: { code: '9999', msg: '登录已过期' } }
    } as AxiosError<any>;

    handleError(error, request, adapter, TEST_CODES);

    expect(adapter.showErrorMessage).not.toHaveBeenCalled();
  });

  it('falls back to error.message when response.data.msg is missing', () => {
    const adapter = createMockAdapter();
    const request = createMockRequest();
    const error = {
      message: 'the backend request error',
      code: BACKEND_ERROR_CODE,
      response: { data: { code: '1234' } }
    } as AxiosError<any>;

    handleError(error, request, adapter, TEST_CODES);

    expect(adapter.showErrorMessage).toHaveBeenCalledWith('the backend request error', expect.any(Function));
  });

  it('falls back to error.message when there is no response at all', () => {
    const adapter = createMockAdapter();
    const request = createMockRequest();
    const error = {
      message: 'timeout of 10000ms exceeded',
      code: 'ECONNABORTED',
      response: undefined
    } as AxiosError<any>;

    handleError(error, request, adapter, TEST_CODES);

    expect(adapter.showErrorMessage).toHaveBeenCalledWith('timeout of 10000ms exceeded', expect.any(Function));
  });

  it('falls back to error.message when the body is not an envelope', () => {
    const adapter = createMockAdapter();
    const request = createMockRequest();
    const error = {
      message: 'Request failed with status code 502',
      code: 'ERR_BAD_RESPONSE',
      response: { status: 502, data: '<html>502 Bad Gateway</html>' }
    } as AxiosError<any>;

    handleError(error, request, adapter, TEST_CODES);

    expect(adapter.showErrorMessage).toHaveBeenCalledWith('Request failed with status code 502', expect.any(Function));
  });

  it('handles a business failure with no code in response', () => {
    const adapter = createMockAdapter();
    const request = createMockRequest();
    const error = {
      message: 'err',
      code: BACKEND_ERROR_CODE,
      response: { data: { msg: 'some msg' } }
    } as AxiosError<any>;

    handleError(error, request, adapter, TEST_CODES);

    expect(adapter.showErrorMessage).toHaveBeenCalledWith('some msg', expect.any(Function));
  });
});

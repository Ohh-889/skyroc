import type { RequestOption } from '@skyroc/axios';
import { createRequest } from '@skyroc/axios';
import { AxiosHeaders } from 'axios';
import type { AxiosResponse } from 'axios';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createAppRequest } from '../src/request/create-request';
import { resetTokenRefresh } from '../src/request/token-refresh';
import type { RequestAdapter, RequestInstanceState, ServiceCodes } from '../src/request/types';

vi.mock('@skyroc/axios', async importOriginal => {
  const actual = await importOriginal<typeof import('@skyroc/axios')>();
  return {
    ...actual,
    createRequest: vi.fn(actual.createRequest)
  };
});

function createMockAdapter(overrides: Partial<RequestAdapter> = {}): RequestAdapter {
  return {
    getCurrentPath: vi.fn(() => '/'),
    getRefreshToken: vi.fn(() => null),
    getToken: vi.fn(() => 'test-token'),
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

const TEST_CODES: ServiceCodes = {
  success: '0000',
  logout: ['8888'],
  modalLogout: ['7777'],
  expiredToken: ['9999']
};

let capturedOptions: Partial<RequestOption<any, any, RequestInstanceState>>;

beforeEach(() => {
  vi.mocked(createRequest).mockImplementation((_config, options) => {
    capturedOptions = options as typeof capturedOptions;
    const fn = Object.assign(async () => null, {
      cancelAllRequest: vi.fn(),
      // 和真的 createRequest 一样从 defaultState 起步，否则这里替上游兜底会掩盖它没兜的情况
      state: { ...options?.defaultState } as RequestInstanceState
    });
    return fn as any;
  });
});

// 刷新是模块级单例，刷完还有一秒的结果复用窗口，不重置的话上个用例的结果会漏给下一个
afterEach(() => {
  resetTokenRefresh();
});

describe('createAppRequest', () => {
  it('creates a request instance with state initialized', () => {
    const adapter = createMockAdapter();
    const request = createAppRequest({ adapter, codes: TEST_CODES });

    expect(request).toBeTypeOf('function');
    expect(request.state).toBeDefined();
    expect(request.state.errMsgStack).toEqual([]);
  });

  it('has cancelAllRequest method', () => {
    const adapter = createMockAdapter();
    const request = createAppRequest({ adapter, codes: TEST_CODES });
    expect(request.cancelAllRequest).toBeTypeOf('function');
  });

  it('accepts custom axiosConfig', () => {
    const adapter = createMockAdapter();
    const request = createAppRequest({
      adapter,
      codes: TEST_CODES,
      axiosConfig: { baseURL: 'https://api.example.com', headers: { 'X-Custom': 'value' } }
    });
    expect(request).toBeTypeOf('function');
  });

  describe('default isBackendSuccess', () => {
    it('returns true when response code matches success code', () => {
      const adapter = createMockAdapter();
      createAppRequest({ adapter, codes: TEST_CODES });

      const response = { data: { code: '0000' } } as AxiosResponse<{ code: string | number }>;
      expect(capturedOptions.isBackendSuccess!(response)).toBe(true);
    });

    it('returns false when response code does not match', () => {
      const adapter = createMockAdapter();
      createAppRequest({ adapter, codes: TEST_CODES });

      const response = { data: { code: '9999' } } as AxiosResponse<{ code: string | number }>;
      expect(capturedOptions.isBackendSuccess!(response)).toBe(false);
    });

    it('compares as string (numeric code)', () => {
      const adapter = createMockAdapter();
      createAppRequest({ adapter, codes: { ...TEST_CODES, success: '200' } });

      const response = { data: { code: 200 } } as AxiosResponse<{ code: string | number }>;
      expect(capturedOptions.isBackendSuccess!(response)).toBe(true);
    });
  });

  describe('default transform', () => {
    it('extracts response.data.data', () => {
      const adapter = createMockAdapter();
      createAppRequest({ adapter, codes: TEST_CODES });

      const response = { data: { data: { id: 1, name: 'test' } } } as AxiosResponse<{ data: any }>;
      expect(capturedOptions.transform!(response)).toEqual({ id: 1, name: 'test' });
    });
  });

  describe('custom isBackendSuccess and transform', () => {
    it('uses custom isBackendSuccess when provided', () => {
      const adapter = createMockAdapter();
      const customCheck = vi.fn(() => true);
      createAppRequest({ adapter, codes: TEST_CODES, isBackendSuccess: customCheck });

      expect(capturedOptions.isBackendSuccess).toBe(customCheck);
    });

    it('uses custom transform when provided', () => {
      const adapter = createMockAdapter();
      const customTransform = vi.fn((res: any) => res.data);
      createAppRequest({ adapter, codes: TEST_CODES, transform: customTransform });

      expect(capturedOptions.transform).toBe(customTransform);
    });
  });

  describe('onRequest', () => {
    it('attaches Authorization header', async () => {
      const adapter = createMockAdapter({ getToken: vi.fn(() => 'my-jwt') });
      createAppRequest({ adapter, codes: TEST_CODES });

      const config = { headers: new AxiosHeaders() } as any;
      const result = await capturedOptions.onRequest!(config);

      expect(result.headers.get('Authorization')).toBe('Bearer my-jwt');
    });

    it('clears a stale Authorization when there is no token', async () => {
      const adapter = createMockAdapter({ getToken: vi.fn(() => null) });
      createAppRequest({ adapter, codes: TEST_CODES });

      // 大小写不同的同名头：走 headers.set() 才会命中并覆盖，Object.assign 会留下两份
      const config = { headers: new AxiosHeaders({ authorization: 'Bearer stale' }) } as any;
      const result = await capturedOptions.onRequest!(config);

      expect(result.headers.get('Authorization')).toBeNull();
      expect(result.headers.toJSON()).not.toHaveProperty('authorization');
    });
  });

  describe('onBackendFail', () => {
    it('delegates to backEndFail', async () => {
      const adapter = createMockAdapter();
      createAppRequest({ adapter, codes: TEST_CODES });

      const response = {
        data: { code: '8888', data: null, msg: 'err' },
        config: { headers: new AxiosHeaders() }
      } as unknown as AxiosResponse;
      const instance = { request: vi.fn() } as any;

      await capturedOptions.onBackendFail!(response, instance);

      expect(adapter.showErrorMessage).toHaveBeenCalledWith('request.logoutMsg');
      expect(adapter.redirectToLogin).toHaveBeenCalled();
    });

    it('把续签后重试的响应交回上游 —— 吞掉它等于刷完 token 还让调用方拿到失败', async () => {
      const adapter = createMockAdapter();
      createAppRequest({ adapter, codes: TEST_CODES });

      const response = {
        data: { code: '9999', data: null, msg: 'expired' },
        config: { headers: new AxiosHeaders() }
      } as unknown as AxiosResponse;
      const retried = { data: { code: '0000', data: 'ok', msg: '' } };
      const instance = { request: vi.fn().mockResolvedValue(retried) } as any;

      const result = await capturedOptions.onBackendFail!(response, instance);

      expect(adapter.fetchRefreshToken).toHaveBeenCalled();
      expect(result).toBe(retried);
    });
  });

  describe('onError', () => {
    it('delegates to handleError', () => {
      const adapter = createMockAdapter();
      createAppRequest({ adapter, codes: TEST_CODES });

      const error = { message: 'Network Error', code: 'ERR_NETWORK' } as any;
      capturedOptions.onError!(error);

      expect(adapter.showErrorMessage).toHaveBeenCalledWith('Network Error', expect.any(Function));
    });
  });

  describe('state initialization', () => {
    it('merges defaultState onto request.state', () => {
      const adapter = createMockAdapter();
      const request = createAppRequest({ adapter, codes: TEST_CODES });

      expect(request.state.errMsgStack).toEqual([]);
    });
  });
});

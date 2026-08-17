/** @vitest-environment node */
import { AxiosError } from 'axios';
import { HttpResponse, delay, http } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { BACKEND_ERROR_CODE, REQUEST_ID_KEY, createFlatRequest, createRequest } from '../src';

// ==================== 类型定义 ====================

interface BackendResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

// ==================== MSW Server ====================

const BASE_URL = 'http://localhost:3000';

/**
 * 使用 fetch adapter 而非默认的 http adapter。
 *
 * 原因：msw v2 的 @mswjs/interceptors 与 axios 默认 http adapter（follow-redirects） 存在已知兼容性问题（Invalid URL），而 fetch adapter 与
 * msw 完全兼容。 集成测试验证的是包装器逻辑（拦截器、hooks、transform），这些行为与 adapter 无关。
 */
const TEST_AXIOS_CONFIG = { baseURL: BASE_URL, adapter: 'fetch' as const };

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// ==================== createRequest 集成测试 ====================

describe('createRequest', () => {
  it('正常 JSON 请求应通过 transform 返回转换后的数据', async () => {
    server.use(
      http.get(`${BASE_URL}/api/user`, () => {
        return HttpResponse.json({
          code: 200,
          data: { name: '张三', age: 25 },
          message: 'success'
        });
      })
    );

    const request = createRequest<BackendResponse, BackendResponse['data'], Record<string, unknown>>(
      TEST_AXIOS_CONFIG,
      {
        isBackendSuccess: response => response.data.code === 200,
        transform: async response => response.data.data
      }
    );

    const data = await request({ url: '/api/user' });

    expect(data).toEqual({ name: '张三', age: 25 });
  });

  it('请求 header 中应包含 X-Request-Id', async () => {
    let capturedRequestId: string | null = null;

    server.use(
      http.get(`${BASE_URL}/api/check-id`, ({ request }) => {
        capturedRequestId = request.headers.get(REQUEST_ID_KEY);
        return HttpResponse.json({ code: 200, data: null, message: 'ok' });
      })
    );

    const request = createRequest<BackendResponse, any, Record<string, unknown>>(TEST_AXIOS_CONFIG, {
      isBackendSuccess: response => response.data.code === 200
    });

    await request({ url: '/api/check-id' });

    expect(capturedRequestId).toBeTruthy();
    expect(typeof capturedRequestId).toBe('string');
  });

  it('每次请求应生成不同的 X-Request-Id', async () => {
    const capturedIds: string[] = [];

    server.use(
      http.get(`${BASE_URL}/api/multi-id`, ({ request }) => {
        const id = request.headers.get(REQUEST_ID_KEY);
        if (id) capturedIds.push(id);
        return HttpResponse.json({ code: 200, data: null, message: 'ok' });
      })
    );

    const request = createRequest<BackendResponse, any, Record<string, unknown>>(TEST_AXIOS_CONFIG, {
      isBackendSuccess: response => response.data.code === 200
    });

    await request({ url: '/api/multi-id' });
    await request({ url: '/api/multi-id' });

    expect(capturedIds).toHaveLength(2);
    expect(capturedIds[0]).not.toBe(capturedIds[1]);
  });

  it('onRequest hook 应正确修改请求配置（如添加 Authorization）', async () => {
    let capturedAuthHeader: string | null = null;

    server.use(
      http.get(`${BASE_URL}/api/protected`, ({ request }) => {
        capturedAuthHeader = request.headers.get('Authorization');
        return HttpResponse.json({ code: 200, data: { secret: true }, message: 'ok' });
      })
    );

    const request = createRequest<BackendResponse, any, Record<string, unknown>>(TEST_AXIOS_CONFIG, {
      isBackendSuccess: response => response.data.code === 200,
      onRequest: async config => {
        config.headers.set('Authorization', 'Bearer test-token-123');
        return config;
      }
    });

    await request({ url: '/api/protected' });

    expect(capturedAuthHeader).toBe('Bearer test-token-123');
  });

  it('后端业务失败时应触发 onBackendFail、onError 并抛出 BACKEND_ERROR_CODE', async () => {
    server.use(
      http.get(`${BASE_URL}/api/biz-fail`, () => {
        return HttpResponse.json({
          code: 401,
          data: null,
          message: 'token expired'
        });
      })
    );

    const onBackendFail = vi.fn().mockResolvedValue(null);
    const onError = vi.fn();

    const request = createRequest<BackendResponse, any, Record<string, unknown>>(TEST_AXIOS_CONFIG, {
      isBackendSuccess: response => response.data.code === 200,
      onBackendFail,
      onError
    });

    try {
      await request({ url: '/api/biz-fail' });
      expect.unreachable('应该抛出异常');
    } catch (error) {
      const axiosError = error as AxiosError;
      expect(axiosError.code).toBe(BACKEND_ERROR_CODE);
    }

    expect(onBackendFail).toHaveBeenCalledOnce();
    expect(onError).toHaveBeenCalledOnce();
  });

  it('onBackendFail 返回新响应时应使用该响应（token 刷新场景）', async () => {
    let callCount = 0;

    server.use(
      http.get(`${BASE_URL}/api/refresh-target`, () => {
        callCount += 1;

        if (callCount === 1) {
          return HttpResponse.json({ code: 401, data: null, message: 'token expired' });
        }

        return HttpResponse.json({ code: 200, data: { refreshed: true }, message: 'ok' });
      })
    );

    const request = createRequest<BackendResponse, BackendResponse['data'], Record<string, unknown>>(
      TEST_AXIOS_CONFIG,
      {
        isBackendSuccess: response => response.data.code === 200,
        transform: async response => response.data.data,
        onBackendFail: async (_response, instance) => {
          // 模拟 token 刷新后重新发送请求
          const retryResponse = await instance.get('/api/refresh-target');
          return retryResponse;
        }
      }
    );

    const data = await request({ url: '/api/refresh-target' });

    expect(data).toEqual({ refreshed: true });
    expect(callCount).toBe(2);
  });

  it('HTTP 错误（如 500）应触发 onError 并抛出异常', async () => {
    server.use(
      http.get(`${BASE_URL}/api/server-error`, () => {
        return new HttpResponse('Internal Server Error', { status: 500 });
      })
    );

    const onError = vi.fn();

    const request = createRequest<BackendResponse, any, Record<string, unknown>>(TEST_AXIOS_CONFIG, {
      isBackendSuccess: response => response.data.code === 200,
      onError
    });

    try {
      await request({ url: '/api/server-error' });
      expect.unreachable('应该抛出异常');
    } catch (error) {
      const axiosError = error as AxiosError;
      expect(axiosError.response?.status).toBe(500);
    }

    expect(onError).toHaveBeenCalledOnce();
  });

  it('带业务信封的 HTTP 错误（如 401）应同样触发 onBackendFail', async () => {
    server.use(
      http.get(`${BASE_URL}/api/expired`, () => {
        return HttpResponse.json({ code: 9999, data: null, message: '登录已过期' }, { status: 401 });
      })
    );

    const onBackendFail = vi.fn().mockResolvedValue(null);

    const request = createRequest<BackendResponse, any, Record<string, unknown>>(TEST_AXIOS_CONFIG, {
      isBackendSuccess: response => response.data.code === 200,
      onBackendFail
    });

    await expect(request({ url: '/api/expired' })).rejects.toThrow();

    expect(onBackendFail).toHaveBeenCalledOnce();
    expect(onBackendFail.mock.calls[0]![0].data.code).toBe(9999);
  });

  it('HTTP 错误上 onBackendFail 返回新响应时应使用该响应（401 续签场景）', async () => {
    let callCount = 0;

    server.use(
      http.get(`${BASE_URL}/api/protected`, () => {
        callCount += 1;

        if (callCount === 1) {
          return HttpResponse.json({ code: 9999, data: null, message: '登录已过期' }, { status: 401 });
        }

        return HttpResponse.json({ code: 200, data: { ok: true }, message: 'ok' });
      })
    );

    const request = createRequest<BackendResponse, BackendResponse['data'], Record<string, unknown>>(
      TEST_AXIOS_CONFIG,
      {
        isBackendSuccess: response => response.data.code === 200,
        transform: async response => response.data.data,
        onBackendFail: async (_response, instance) => {
          const retryResponse = await instance.get('/api/protected');
          return retryResponse;
        }
      }
    );

    const data = await request({ url: '/api/protected' });

    expect(data).toEqual({ ok: true });
    expect(callCount).toBe(2);
  });

  it('HTTP 错误的响应体不是信封时不应调用 onBackendFail', async () => {
    server.use(
      http.get(`${BASE_URL}/api/bad-gateway`, () => {
        return new HttpResponse('<html>502 Bad Gateway</html>', { status: 502 });
      })
    );

    const onBackendFail = vi.fn().mockResolvedValue(null);
    const onError = vi.fn();

    const request = createRequest<BackendResponse, any, Record<string, unknown>>(TEST_AXIOS_CONFIG, {
      isBackendSuccess: response => response.data.code === 200,
      onBackendFail,
      onError
    });

    await expect(request({ url: '/api/bad-gateway' })).rejects.toThrow();

    expect(onBackendFail).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledOnce();
  });

  it('网络错误没有 response 时不应调用 onBackendFail', async () => {
    server.use(
      http.get(`${BASE_URL}/api/offline`, () => {
        return HttpResponse.error();
      })
    );

    const onBackendFail = vi.fn().mockResolvedValue(null);
    const onError = vi.fn();

    const request = createRequest<BackendResponse, any, Record<string, unknown>>(TEST_AXIOS_CONFIG, {
      isBackendSuccess: response => response.data.code === 200,
      onBackendFail,
      onError
    });

    await expect(request({ url: '/api/offline' })).rejects.toThrow();

    expect(onBackendFail).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledOnce();
  });

  it('blob 下载失败时应把 JSON 错误体解出来交给 onBackendFail', async () => {
    server.use(
      http.get(`${BASE_URL}/api/export`, () => {
        return HttpResponse.json({ code: 403, data: null, message: '无导出权限' }, { status: 403 });
      })
    );

    const onBackendFail = vi.fn().mockResolvedValue(null);

    const request = createRequest<BackendResponse, any, Record<string, unknown>>(TEST_AXIOS_CONFIG, {
      isBackendSuccess: response => response.data.code === 200,
      onBackendFail
    });

    await expect(request({ url: '/api/export', responseType: 'blob' })).rejects.toThrow();

    expect(onBackendFail).toHaveBeenCalledOnce();
    expect(onBackendFail.mock.calls[0]![0].data.message).toBe('无导出权限');
  });

  it('HTTP 404 应触发 onError', async () => {
    server.use(
      http.get(`${BASE_URL}/api/not-found`, () => {
        return new HttpResponse('Not Found', { status: 404 });
      })
    );

    const onError = vi.fn();

    const request = createRequest<BackendResponse, any, Record<string, unknown>>(TEST_AXIOS_CONFIG, {
      isBackendSuccess: response => response.data.code === 200,
      onError
    });

    try {
      await request({ url: '/api/not-found' });
      expect.unreachable('应该抛出异常');
    } catch {
      // expected
    }

    expect(onError).toHaveBeenCalledOnce();
  });

  it('cancelAllRequest 应取消所有进行中的请求', async () => {
    server.use(
      http.get(`${BASE_URL}/api/slow`, async () => {
        await delay('infinite');
        return HttpResponse.json({ code: 200, data: null, message: 'ok' });
      })
    );

    const request = createRequest<BackendResponse, any, Record<string, unknown>>(TEST_AXIOS_CONFIG, {
      isBackendSuccess: response => response.data.code === 200
    });

    const promise = request({ url: '/api/slow' });

    // 等待一个微任务，确保请求已发出
    await Promise.resolve();

    request.cancelAllRequest();

    try {
      await promise;
      expect.unreachable('应该被取消');
    } catch (error) {
      const axiosError = error as AxiosError;
      expect(axiosError.code).toBe('ERR_CANCELED');
    }
  });

  it('POST 请求应正确发送 body 数据', async () => {
    let capturedBody: any = null;

    server.use(
      http.post(`${BASE_URL}/api/create`, async ({ request }) => {
        capturedBody = await request.json();
        return HttpResponse.json({ code: 200, data: { id: 1 }, message: 'created' });
      })
    );

    const request = createRequest<BackendResponse, BackendResponse['data'], Record<string, unknown>>(
      TEST_AXIOS_CONFIG,
      {
        isBackendSuccess: response => response.data.code === 200,
        transform: async response => response.data.data
      }
    );

    const data = await request({
      url: '/api/create',
      method: 'POST',
      data: { name: '新用户', email: 'test@example.com' }
    });

    expect(data).toEqual({ id: 1 });
    expect(capturedBody).toEqual({ name: '新用户', email: 'test@example.com' });
  });

  it('默认配置 timeout 应为 10 秒', async () => {
    let capturedTimeout: number | undefined;

    server.use(
      http.get(`${BASE_URL}/api/timeout-check`, () => {
        return HttpResponse.json({ code: 200, data: null, message: 'ok' });
      })
    );

    const request = createRequest<BackendResponse, any, Record<string, unknown>>(TEST_AXIOS_CONFIG, {
      isBackendSuccess: response => response.data.code === 200,
      onRequest: async config => {
        capturedTimeout = config.timeout;
        return config;
      }
    });

    await request({ url: '/api/timeout-check' });

    expect(capturedTimeout).toBe(10_000);
  });

  it('自定义 signal 时不应被 cancelAllRequest 管理', async () => {
    server.use(
      http.get(`${BASE_URL}/api/custom-signal`, async () => {
        await new Promise(resolve => {
          setTimeout(resolve, 100);
        });
        return HttpResponse.json({ code: 200, data: { ok: true }, message: 'ok' });
      })
    );

    const request = createRequest<BackendResponse, BackendResponse['data'], Record<string, unknown>>(
      TEST_AXIOS_CONFIG,
      {
        isBackendSuccess: response => response.data.code === 200,
        transform: async response => response.data.data
      }
    );

    const controller = new AbortController();
    const promise = request({ url: '/api/custom-signal', signal: controller.signal });

    // cancelAllRequest 不应影响自定义 signal 的请求
    request.cancelAllRequest();

    const data = await promise;
    expect(data).toEqual({ ok: true });
  });

  // 曾经是 `opts.onRequest?.(config) || config`：忘记 return 就变成一个能跑但少了认证头的请求，
  // 排查起来只能看到后端 401
  it('onRequest 未返回 config 时应立刻抛出而不是静默沿用旧配置', async () => {
    let hitServer = false;

    server.use(
      http.get(`${BASE_URL}/api/falsy-hook`, () => {
        hitServer = true;
        return HttpResponse.json({ code: 200, data: { ok: true }, message: 'ok' });
      })
    );

    const request = createRequest<BackendResponse, BackendResponse['data'], Record<string, unknown>>(
      TEST_AXIOS_CONFIG,
      {
        isBackendSuccess: response => response.data.code === 200,
        onRequest: (() => undefined) as any
      }
    );

    try {
      await request({ url: '/api/falsy-hook' });
      expect.unreachable('应该抛出异常');
    } catch (error) {
      const axiosError = error as AxiosError;
      expect(axiosError.code).toBe('ERR_BAD_OPTION');
    }

    expect(hitServer).toBe(false);
  });

  it('自定义 requestIdKey 应改用该 header 名', async () => {
    let capturedTraceId: string | null = null;
    let capturedDefaultId: string | null = null;

    server.use(
      http.get(`${BASE_URL}/api/custom-id-key`, ({ request }) => {
        capturedTraceId = request.headers.get('X-Trace-Id');
        capturedDefaultId = request.headers.get(REQUEST_ID_KEY);
        return HttpResponse.json({ code: 200, data: null, message: 'ok' });
      })
    );

    const request = createRequest<BackendResponse, any, Record<string, unknown>>(TEST_AXIOS_CONFIG, {
      isBackendSuccess: response => response.data.code === 200,
      requestIdKey: 'X-Trace-Id'
    });

    await request({ url: '/api/custom-id-key' });

    expect(capturedTraceId).toBeTruthy();
    expect(capturedDefaultId).toBeNull();
  });

  it('requestIdKey 为 false 时不应发送请求 id header', async () => {
    let capturedRequestId: string | null = null;

    server.use(
      http.get(`${BASE_URL}/api/no-id`, ({ request }) => {
        capturedRequestId = request.headers.get(REQUEST_ID_KEY);
        return HttpResponse.json({ code: 200, data: null, message: 'ok' });
      })
    );

    const request = createRequest<BackendResponse, any, Record<string, unknown>>(TEST_AXIOS_CONFIG, {
      isBackendSuccess: response => response.data.code === 200,
      requestIdKey: false
    });

    await request({ url: '/api/no-id' });

    expect(capturedRequestId).toBeNull();
  });

  // retry 曾经和 axiosConfig 混在一起传给 axios-retry，而 CreateAxiosDefaults 没有 retries 字段，
  // 只能靠 as any 才塞得进去
  it('retry 选项应把重试次数交给 axios-retry', async () => {
    let attempts = 0;

    server.use(
      http.get(`${BASE_URL}/api/flaky`, () => {
        attempts += 1;

        if (attempts < 3) {
          return new HttpResponse('Service Unavailable', { status: 503 });
        }

        return HttpResponse.json({ code: 200, data: { recovered: true }, message: 'ok' });
      })
    );

    const request = createRequest<BackendResponse, BackendResponse['data'], Record<string, unknown>>(
      TEST_AXIOS_CONFIG,
      {
        isBackendSuccess: response => response.data.code === 200,
        retry: { retries: 2, retryDelay: () => 0 },
        transform: async response => response.data.data
      }
    );

    const data = await request({ url: '/api/flaky' });

    expect(data).toEqual({ recovered: true });
    expect(attempts).toBe(3);
  });

  it('默认不重试', async () => {
    let attempts = 0;

    server.use(
      http.get(`${BASE_URL}/api/no-retry`, () => {
        attempts += 1;
        return new HttpResponse('Service Unavailable', { status: 503 });
      })
    );

    const request = createRequest<BackendResponse, any, Record<string, unknown>>(TEST_AXIOS_CONFIG, {
      isBackendSuccess: response => response.data.code === 200
    });

    await expect(request({ url: '/api/no-retry' })).rejects.toThrow();

    expect(attempts).toBe(1);
  });

  // cancelAllRequest 之后必须换一个新的 controller，否则后续请求挂上已 abort 的 signal，一发出就死
  it('cancelAllRequest 之后新发起的请求仍应正常完成', async () => {
    server.use(
      http.get(`${BASE_URL}/api/after-cancel`, () => {
        return HttpResponse.json({ code: 200, data: { ok: true }, message: 'ok' });
      })
    );

    const request = createRequest<BackendResponse, BackendResponse['data'], Record<string, unknown>>(
      TEST_AXIOS_CONFIG,
      {
        isBackendSuccess: response => response.data.code === 200,
        transform: async response => response.data.data
      }
    );

    request.cancelAllRequest();

    const data = await request({ url: '/api/after-cancel' });

    expect(data).toEqual({ ok: true });
  });

  it('非 JSON 响应类型应直接返回原始数据而不经过 transform', async () => {
    server.use(
      http.get(`${BASE_URL}/api/text`, () => {
        return new HttpResponse('plain text content', {
          headers: { 'Content-Type': 'text/plain' }
        });
      })
    );

    const transform = vi.fn();

    const request = createRequest<BackendResponse, any, Record<string, unknown>>(TEST_AXIOS_CONFIG, {
      isBackendSuccess: response => response.data.code === 200,
      transform
    });

    const data = await request({ url: '/api/text', responseType: 'text' });

    expect(data).toBe('plain text content');
    expect(transform).not.toHaveBeenCalled();
  });
});

// ==================== createFlatRequest 集成测试 ====================

describe('createFlatRequest', () => {
  it('正常请求应返回 { data, error: null, response }', async () => {
    server.use(
      http.get(`${BASE_URL}/api/flat-ok`, () => {
        return HttpResponse.json({
          code: 200,
          data: { items: [1, 2, 3] },
          message: 'success'
        });
      })
    );

    const request = createFlatRequest<BackendResponse, BackendResponse['data'], Record<string, unknown>>(
      TEST_AXIOS_CONFIG,
      {
        isBackendSuccess: response => response.data.code === 200,
        transform: async response => response.data.data
      }
    );

    const result = await request({ url: '/api/flat-ok' });

    expect(result.data).toEqual({ items: [1, 2, 3] });
    expect(result.error).toBeNull();
    expect(result.response).toBeDefined();
    expect(result.response?.status).toBe(200);
  });

  it('非 JSON 响应类型应直接返回原始数据', async () => {
    server.use(
      http.get(`${BASE_URL}/api/flat-text`, () => {
        return new HttpResponse('flat plain text', {
          headers: { 'Content-Type': 'text/plain' }
        });
      })
    );

    const request = createFlatRequest<BackendResponse, any, Record<string, unknown>>(TEST_AXIOS_CONFIG, {
      isBackendSuccess: response => response.data.code === 200
    });

    const result = await request({ url: '/api/flat-text', responseType: 'text' });

    expect(result.data).toBe('flat plain text');
    expect(result.error).toBeNull();
  });

  it('后端业务失败应返回 { data: null, error } 而不抛出异常', async () => {
    server.use(
      http.get(`${BASE_URL}/api/flat-biz-fail`, () => {
        return HttpResponse.json({
          code: 403,
          data: null,
          message: 'forbidden'
        });
      })
    );

    const request = createFlatRequest<BackendResponse, BackendResponse['data'], Record<string, unknown>>(
      TEST_AXIOS_CONFIG,
      {
        isBackendSuccess: response => response.data.code === 200
      }
    );

    const result = await request({ url: '/api/flat-biz-fail' });

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error!.code).toBe(BACKEND_ERROR_CODE);
  });

  it('HTTP 错误应返回 { data: null, error } 而不抛出异常', async () => {
    server.use(
      http.get(`${BASE_URL}/api/flat-http-error`, () => {
        return new HttpResponse('Service Unavailable', { status: 503 });
      })
    );

    const request = createFlatRequest<BackendResponse, any, Record<string, unknown>>(TEST_AXIOS_CONFIG, {
      isBackendSuccess: response => response.data.code === 200
    });

    const result = await request({ url: '/api/flat-http-error' });

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
  });

  it('state 应使用 defaultState 初始化', () => {
    const request = createFlatRequest<BackendResponse, any, { retryCount: number; token: string }>(TEST_AXIOS_CONFIG, {
      defaultState: { token: 'initial-token', retryCount: 0 },
      isBackendSuccess: response => response.data.code === 200
    });

    expect(request.state).toEqual({ token: 'initial-token', retryCount: 0 });
  });

  it('state 应可被外部修改', () => {
    const request = createFlatRequest<BackendResponse, any, { token: string }>(TEST_AXIOS_CONFIG, {
      defaultState: { token: '' },
      isBackendSuccess: response => response.data.code === 200
    });

    request.state.token = 'updated-token';

    expect(request.state.token).toBe('updated-token');
  });

  it('cancelAllRequest 应取消请求并以 error 返回', async () => {
    server.use(
      http.get(`${BASE_URL}/api/flat-slow`, async () => {
        await delay('infinite');
        return HttpResponse.json({ code: 200, data: null, message: 'ok' });
      })
    );

    const request = createFlatRequest<BackendResponse, any, Record<string, unknown>>(TEST_AXIOS_CONFIG, {
      isBackendSuccess: response => response.data.code === 200
    });

    const promise = request({ url: '/api/flat-slow' });

    await Promise.resolve();

    request.cancelAllRequest();

    const result = await promise;

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.error!.code).toBe('ERR_CANCELED');
  });

  // response 曾被声明成必选，网络错误时它其实是 undefined —— 调用方读 result.response.status
  // 会恰好在最需要它的那条路径上炸
  it('网络错误时 response 应为 undefined 而不是假装存在', async () => {
    server.use(
      http.get(`${BASE_URL}/api/flat-offline`, () => {
        return HttpResponse.error();
      })
    );

    const request = createFlatRequest<BackendResponse, any, Record<string, unknown>>(TEST_AXIOS_CONFIG, {
      isBackendSuccess: response => response.data.code === 200
    });

    const result = await request({ url: '/api/flat-offline' });

    expect(result.data).toBeNull();
    expect(result.error).not.toBeNull();
    expect(result.response).toBeUndefined();
  });

  // catch 会抓到一切，不只是 AxiosError：transform 里抛出的普通 Error 之前会被直接当成
  // AxiosError 返回，调用方读 error.code 拿到的是 undefined
  it('transform 抛出普通异常时应包装成 AxiosError', async () => {
    server.use(
      http.get(`${BASE_URL}/api/flat-bad-transform`, () => {
        return HttpResponse.json({ code: 200, data: { items: [] }, message: 'ok' });
      })
    );

    const request = createFlatRequest<BackendResponse, any, Record<string, unknown>>(TEST_AXIOS_CONFIG, {
      isBackendSuccess: response => response.data.code === 200,
      transform: () => {
        throw new TypeError('cannot read property of undefined');
      }
    });

    const result = await request({ url: '/api/flat-bad-transform' });

    expect(result.data).toBeNull();
    expect(result.error).toBeInstanceOf(AxiosError);
    expect(result.error!.isAxiosError).toBe(true);
    expect(result.error!.code).toBe(AxiosError.ERR_BAD_RESPONSE);
    expect(result.error!.message).toBe('cannot read property of undefined');
  });

  // transform 炸掉时请求本身是成功的，响应必须留在错误上：只给一句 TypeError 的话，
  // 调用方既看不到状态码也看不到后端到底回了什么，正好在最该排查的那条路径上瞎掉
  it('transform 抛错时应保留响应上下文', async () => {
    server.use(
      http.get(`${BASE_URL}/api/flat-transform-keeps-response`, () => {
        return HttpResponse.json({ code: 200, data: { items: [] }, message: 'ok' });
      })
    );

    const request = createFlatRequest<BackendResponse, any, Record<string, unknown>>(TEST_AXIOS_CONFIG, {
      isBackendSuccess: response => response.data.code === 200,
      transform: () => {
        throw new TypeError('boom');
      }
    });

    const result = await request({ url: '/api/flat-transform-keeps-response' });

    expect(result.response?.status).toBe(200);
    expect(result.response?.data).toEqual({ code: 200, data: { items: [] }, message: 'ok' });
    expect(result.error!.response?.status).toBe(200);
    expect(result.error!.config?.url).toBe('/api/flat-transform-keeps-response');
  });

  it('抛出的不是 Error 实例时也应包装成 AxiosError', async () => {
    server.use(
      http.get(`${BASE_URL}/api/flat-throw-string`, () => {
        return HttpResponse.json({ code: 200, data: null, message: 'ok' });
      })
    );

    const request = createFlatRequest<BackendResponse, any, Record<string, unknown>>(TEST_AXIOS_CONFIG, {
      isBackendSuccess: response => response.data.code === 200,
      // 第三方库抛字符串并不罕见，走到 catch 里同样得能收敛成 AxiosError
      // oxlint-disable-next-line prefer-promise-reject-errors
      transform: () => Promise.reject('boom')
    });

    const result = await request({ url: '/api/flat-throw-string' });

    expect(result.error).toBeInstanceOf(AxiosError);
    expect(result.error!.message).toBe('boom');
  });
});

/** @vitest-environment node */
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { describe, expect, it } from 'vitest';
import { isHttpSuccess, transformArrayBufferToJson, transformBlobToJson, transformResponse } from '../src/shared';

// ==================== 辅助工具 ====================

function createMockConfig(overrides?: Partial<InternalAxiosRequestConfig>) {
  return {
    headers: {
      'Content-Type': 'application/json',
      ...overrides?.headers
    },
    ...overrides
  } as InternalAxiosRequestConfig;
}

function createMockResponse(overrides?: Partial<AxiosResponse>) {
  return {
    config: createMockConfig(overrides?.config as any),
    data: overrides?.data ?? null,
    headers: overrides?.headers ?? {},
    status: overrides?.status ?? 200,
    statusText: overrides?.statusText ?? 'OK'
  } as AxiosResponse;
}

// ==================== isHttpSuccess ====================

describe('isHttpSuccess', () => {
  it.each([200, 201, 204, 299])('状态码 %d 应返回 true', status => {
    expect(isHttpSuccess(status)).toBe(true);
  });

  it('状态码 304（Not Modified）应返回 true', () => {
    expect(isHttpSuccess(304)).toBe(true);
  });

  it.each([199, 300, 301, 400, 401, 403, 404, 500, 502, 503])('状态码 %d 应返回 false', status => {
    expect(isHttpSuccess(status)).toBe(false);
  });
});

// ==================== transformResponse ====================

describe('transformResponse', () => {
  it('responseType 为 json 时不做任何转换', async () => {
    const response = createMockResponse({
      config: { responseType: 'json' } as any,
      data: { code: 200 }
    });
    const original = response.data;

    await transformResponse(response);

    expect(response.data).toBe(original);
  });

  it('responseType 缺省时不做任何转换', async () => {
    const response = createMockResponse({
      config: { responseType: undefined } as any,
      data: { code: 200 },
      headers: { 'content-type': 'application/json' }
    });
    const original = response.data;

    await transformResponse(response);

    expect(response.data).toBe(original);
  });

  it('responseType 非 json 且 content-type 不含 application/json 时不转换', async () => {
    const response = createMockResponse({
      config: { responseType: 'blob' } as any,
      data: new Blob(['binary']),
      headers: { 'content-type': 'application/octet-stream' }
    });
    const original = response.data;

    await transformResponse(response);

    expect(response.data).toBe(original);
  });

  it('responseType 为 blob 且 content-type 含 application/json 时应转换数据', async () => {
    const jsonData = { code: 200, message: 'ok' };
    const response = createMockResponse({
      config: { responseType: 'blob' } as any,
      data: JSON.stringify(jsonData),
      headers: { 'content-type': 'application/json; charset=utf-8' }
    });

    await transformResponse(response);

    expect(response.data).toEqual(jsonData);
  });

  // 大小写必须和 axios 的字面量一致：曾经写成 'arrayBuffer'，导致这个分支在真实请求里永远命中不了
  it('responseType 为 arraybuffer 且 content-type 含 application/json 时应转换数据', async () => {
    const jsonData = { code: 200, message: 'ok' };
    const response = createMockResponse({
      config: { responseType: 'arraybuffer' } as any,
      data: JSON.stringify(jsonData),
      headers: { 'content-type': 'application/json' }
    });

    await transformResponse(response);

    expect(response.data).toEqual(jsonData);
  });
});

// ==================== transformBlobToJson ====================

describe('transformBlobToJson', () => {
  it('字符串 JSON 应被解析', async () => {
    const response = createMockResponse({ data: '{"name":"test"}' });

    await transformBlobToJson(response);

    expect(response.data).toEqual({ name: 'test' });
  });

  it('Blob 包含 JSON 应被解析', async () => {
    const jsonStr = '{"items":[1,2,3]}';
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const response = createMockResponse({ data: blob });

    await transformBlobToJson(response);

    expect(response.data).toEqual({ items: [1, 2, 3] });
  });

  it('无效 JSON 字符串不应抛出异常，保持原始数据', async () => {
    const response = createMockResponse({ data: 'not json {' });

    await transformBlobToJson(response);

    // catch 块静默处理，data 不会被更新为解析后的值
    expect(response.data).toBe('not json {');
  });

  it('非字符串且非 Blob 的数据不应被修改', async () => {
    const original = { already: 'parsed' };
    const response = createMockResponse({ data: original });

    await transformBlobToJson(response);

    expect(response.data).toBe(original);
  });
});

// ==================== transformArrayBufferToJson ====================

describe('transformArrayBufferToJson', () => {
  it('字符串 JSON 应被解析', async () => {
    const response = createMockResponse({ data: '{"key":"value"}' });

    await transformArrayBufferToJson(response);

    expect(response.data).toEqual({ key: 'value' });
  });

  it('ArrayBuffer 包含 JSON 应被解析', async () => {
    const jsonStr = '{"count":42}';
    const buffer = new TextEncoder().encode(jsonStr).buffer;
    const response = createMockResponse({ data: buffer });

    await transformArrayBufferToJson(response);

    expect(response.data).toEqual({ count: 42 });
  });

  it('无效 JSON 的 ArrayBuffer 不应抛出异常', async () => {
    const buffer = new TextEncoder().encode('invalid json').buffer;
    const response = createMockResponse({ data: buffer });

    await transformArrayBufferToJson(response);

    // catch 块静默处理
    expect(response.data).toBe(buffer);
  });

  it('非字符串且非 ArrayBuffer 的数据不应被修改', async () => {
    const original = { already: 'parsed' };
    const response = createMockResponse({ data: original });

    await transformArrayBufferToJson(response);

    expect(response.data).toBe(original);
  });
});

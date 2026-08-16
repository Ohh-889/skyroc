/**
 * 类型级测试
 *
 * 使用 vitest 内置的 expectTypeOf（底层 expect-type）在编译时验证类型推导。 这些测试运行时无实际开销，但能防止类型定义的回归。
 */
import type { AxiosError, AxiosResponse, ResponseType as AxiosResponseType } from 'axios';
import { describe, expectTypeOf, it } from 'vitest';
import { createFlatRequest, createRequest } from '../src';
import type {
  ContentType,
  CustomAxiosRequestConfig,
  FlatRequestInstance,
  FlatResponseData,
  FlatResponseFailData,
  FlatResponseSuccessData,
  MappedType,
  RequestInstance,
  RequestInstanceCommon,
  ResponseType
} from '../src/type';

// ==================== MappedType ====================

describe('MappedType', () => {
  it('json 应映射到泛型 JsonType', () => {
    expectTypeOf<MappedType<'json', string>>().toEqualTypeOf<string>();
    expectTypeOf<MappedType<'json', { id: number }>>().toEqualTypeOf<{ id: number }>();
  });

  it('json 未指定 JsonType 时应为 any', () => {
    expectTypeOf<MappedType<'json'>>().toEqualTypeOf<any>();
  });

  it('blob 应映射到 Blob', () => {
    expectTypeOf<MappedType<'blob'>>().toEqualTypeOf<Blob>();
  });

  it('arraybuffer 应映射到 ArrayBuffer', () => {
    expectTypeOf<MappedType<'arraybuffer'>>().toEqualTypeOf<ArrayBuffer>();
  });

  it('formdata 应映射到 FormData', () => {
    expectTypeOf<MappedType<'formdata'>>().toEqualTypeOf<FormData>();
  });

  it('text 应映射到 string', () => {
    expectTypeOf<MappedType<'text'>>().toEqualTypeOf<string>();
  });

  it('document 应映射到 Document', () => {
    expectTypeOf<MappedType<'document'>>().toEqualTypeOf<Document>();
  });

  it('stream 应映射到 ReadableStream<Uint8Array>', () => {
    expectTypeOf<MappedType<'stream'>>().toEqualTypeOf<ReadableStream<Uint8Array>>();
  });

  it('非 json 类型应忽略 JsonType 参数', () => {
    // 即使传了 JsonType，blob 仍然映射到 Blob
    expectTypeOf<MappedType<'blob', string>>().toEqualTypeOf<Blob>();
    expectTypeOf<MappedType<'text', number>>().toEqualTypeOf<string>();
  });
});

// ==================== ResponseType ====================

describe('ResponseType', () => {
  /**
   * 这条是本文件里最重要的断言
   *
   * responseType 会被原样赋给 `XMLHttpRequest.responseType`，只要和 axios 的字面量差一个字符
   * （历史上是 'arrayBuffer' vs 'arraybuffer'），类型上看着没问题，运行时浏览器按非法枚举值忽略，
   * 拿回来的是文本。
   */
  it('应与 axios 的 ResponseType 完全一致', () => {
    expectTypeOf<ResponseType>().toEqualTypeOf<AxiosResponseType>();
  });

  it('应包含所有预期的响应类型', () => {
    expectTypeOf<'json'>().toExtend<ResponseType>();
    expectTypeOf<'blob'>().toExtend<ResponseType>();
    expectTypeOf<'arraybuffer'>().toExtend<ResponseType>();
    expectTypeOf<'formdata'>().toExtend<ResponseType>();
    expectTypeOf<'text'>().toExtend<ResponseType>();
    expectTypeOf<'document'>().toExtend<ResponseType>();
    expectTypeOf<'stream'>().toExtend<ResponseType>();
  });

  it('不应接受无效的类型', () => {
    expectTypeOf<'xml'>().not.toExtend<ResponseType>();
    expectTypeOf<'binary'>().not.toExtend<ResponseType>();
    expectTypeOf<'arrayBuffer'>().not.toExtend<ResponseType>();
  });
});

// ==================== ContentType ====================

describe('ContentType', () => {
  it('应包含标准 HTTP Content-Type', () => {
    expectTypeOf<'application/json'>().toExtend<ContentType>();
    expectTypeOf<'multipart/form-data'>().toExtend<ContentType>();
    expectTypeOf<'application/x-www-form-urlencoded'>().toExtend<ContentType>();
    expectTypeOf<'text/plain'>().toExtend<ContentType>();
    expectTypeOf<'text/html'>().toExtend<ContentType>();
    expectTypeOf<'application/octet-stream'>().toExtend<ContentType>();
  });

  it('不应接受非法值', () => {
    expectTypeOf<'text/xml'>().not.toExtend<ContentType>();
  });
});

// ==================== CustomAxiosRequestConfig ====================

describe('CustomAxiosRequestConfig', () => {
  it('默认泛型应将 responseType 限制为 json', () => {
    expectTypeOf<CustomAxiosRequestConfig>().toHaveProperty('responseType');
    expectTypeOf<CustomAxiosRequestConfig['responseType']>().toEqualTypeOf<'json' | undefined>();
  });

  it('指定泛型应限制 responseType', () => {
    expectTypeOf<CustomAxiosRequestConfig<'blob'>['responseType']>().toEqualTypeOf<'blob' | undefined>();
  });

  it('应保留 AxiosRequestConfig 的其他字段', () => {
    expectTypeOf<CustomAxiosRequestConfig>().toHaveProperty('url');
    expectTypeOf<CustomAxiosRequestConfig>().toHaveProperty('method');
    expectTypeOf<CustomAxiosRequestConfig>().toHaveProperty('headers');
    expectTypeOf<CustomAxiosRequestConfig>().toHaveProperty('data');
  });
});

// ==================== FlatResponseData ====================

describe('FlatResponseData', () => {
  type TestResponse = { code: number; data: string };
  type TestApiData = string;
  type TestFlat = FlatResponseData<TestResponse, TestApiData>;

  it('应是成功和失败类型的联合', () => {
    expectTypeOf<TestFlat>().toEqualTypeOf<
      FlatResponseSuccessData<TestResponse, TestApiData> | FlatResponseFailData<TestResponse>
    >();
  });

  it('成功类型的 data 不为 null，error 为 null', () => {
    expectTypeOf<FlatResponseSuccessData<TestResponse, TestApiData>>().toExtend<{
      data: TestApiData;
      error: null;
      response: AxiosResponse<TestResponse>;
    }>();
  });

  it('失败类型的 data 为 null，error 不为 null', () => {
    expectTypeOf<FlatResponseFailData<TestResponse>>().toExtend<{
      data: null;
      error: AxiosError<TestResponse>;
    }>();
  });

  // 网络错误 / 超时 / 取消都没有响应，声明成必选会让 result.response.status 恰好在最需要它的
  // 那条路径上炸
  it('失败类型的 response 可能不存在', () => {
    expectTypeOf<FlatResponseFailData<TestResponse>['response']>().toEqualTypeOf<
      AxiosResponse<TestResponse> | undefined
    >();
  });

  it('联合类型上读 response 必须先收窄', () => {
    expectTypeOf<TestFlat['response']>().toEqualTypeOf<AxiosResponse<TestResponse> | undefined>();
  });
});

// ==================== RequestInstanceCommon ====================

describe('RequestInstanceCommon', () => {
  it('应包含 cancelAllRequest 和 state', () => {
    type Instance = RequestInstanceCommon<{ token: string }>;

    expectTypeOf<Instance>().toHaveProperty('cancelAllRequest');
    expectTypeOf<Instance['cancelAllRequest']>().toEqualTypeOf<() => void>();
    expectTypeOf<Instance>().toHaveProperty('state');
    expectTypeOf<Instance['state']>().toEqualTypeOf<{ token: string }>();
  });
});

// ==================== RequestInstance ====================

describe('RequestInstance', () => {
  it('应可作为函数调用，返回 Promise', () => {
    type Instance = RequestInstance<{ id: number }, Record<string, unknown>>;

    expectTypeOf<Instance>().toBeCallableWith({ url: '/api/test' });
  });

  it('应继承 cancelAllRequest 和 state', () => {
    type Instance = RequestInstance<any, { count: number }>;

    expectTypeOf<Instance>().toHaveProperty('cancelAllRequest');
    expectTypeOf<Instance>().toHaveProperty('state');
    expectTypeOf<Instance['state']>().toEqualTypeOf<{ count: number }>();
  });
});

// ==================== 工厂函数的类型参数默认值 ====================

describe('createRequest / createFlatRequest 的类型参数', () => {
  interface BackendResponse<T = any> {
    code: number;
    data: T;
    msg: string;
  }

  // ApiData 和 State 都没有默认值时，README 里 `createRequest<BackendResponse>(...)` 这个入门
  // 写法直接报 TS2558
  it('只指定 ResponseData 应可用', () => {
    const request = createRequest<BackendResponse>();

    expectTypeOf(request).toBeCallableWith({ url: '/api/user' });
    expectTypeOf(request.state).toEqualTypeOf<Record<string, unknown>>();
  });

  /**
   * ApiData 默认值必须是 unknown 而不是 any
   *
   * `<T extends ApiData>` 这条约束让 ApiData 一旦是具体类型，`request<Api.UserInfo>()` 就过不去；
   * 用 unknown 解开约束的同时，不写 T 时拿到的是 unknown 而不是一路默默滑过去的 any。
   */
  it('未指定接口返回类型时应得到 unknown 而不是 any', () => {
    const request = createRequest<BackendResponse>();

    type Bare = Awaited<ReturnType<typeof request>>;

    expectTypeOf<Bare>().toEqualTypeOf<unknown>();
    expectTypeOf<Bare>().not.toBeAny();
  });

  it('指定接口返回类型时应原样透出，不受 ResponseData 约束', () => {
    const request = createRequest<BackendResponse>();

    type Typed = Awaited<ReturnType<typeof request<{ id: number }>>>;

    expectTypeOf<Typed>().toEqualTypeOf<{ id: number }>();
  });

  it('flat 版只指定 ResponseData 与 ApiData 应可用', () => {
    const request = createFlatRequest<BackendResponse, BackendResponse['data']>();

    expectTypeOf(request).toBeCallableWith({ url: '/api/user' });
  });

  it('显式指定 State 时应体现在实例上', () => {
    const request = createRequest<BackendResponse, any, { token: string }>();

    expectTypeOf(request.state).toEqualTypeOf<{ token: string }>();
  });
});

// ==================== FlatRequestInstance ====================

describe('FlatRequestInstance', () => {
  it('应可作为函数调用，返回 Promise<FlatResponseData>', () => {
    type Instance = FlatRequestInstance<{ code: number }, string, Record<string, unknown>>;

    expectTypeOf<Instance>().toBeCallableWith({ url: '/api/test' });
  });

  it('应继承 cancelAllRequest 和 state', () => {
    type Instance = FlatRequestInstance<any, any, { token: string }>;

    expectTypeOf<Instance>().toHaveProperty('cancelAllRequest');
    expectTypeOf<Instance['state']>().toEqualTypeOf<{ token: string }>();
  });
});

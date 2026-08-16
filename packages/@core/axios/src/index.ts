import { nanoid } from '@skyroc/utils';
import axios, { AxiosError, isAxiosError } from 'axios';
import type { AxiosResponse, CreateAxiosDefaults } from 'axios';
import axiosRetry from 'axios-retry';
import { BACKEND_ERROR_CODE, REQUEST_ID_KEY } from './constant';
import { createAxiosConfig, createDefaultOptions, createRetryOptions } from './options';
import { transformResponse } from './shared';
import type {
  CustomAxiosRequestConfig,
  FlatRequestInstance,
  MappedType,
  RequestInstance,
  RequestOption,
  ResponseType
} from './type';

/** 把非 axios 异常（transform、hook 里抛出的）包成 AxiosError，保住 flat 风格 `error` 字段的契约 */
function toAxiosError<ResponseData>(error: unknown): AxiosError<ResponseData> {
  if (isAxiosError<ResponseData>(error)) {
    return error;
  }

  const cause = error instanceof Error ? error : new Error(String(error));

  return AxiosError.from<ResponseData>(cause, AxiosError.ERR_BAD_RESPONSE);
}

function createCommonRequest<
  ResponseData,
  ApiData = unknown,
  State extends Record<string, unknown> = Record<string, unknown>
>(axiosConfig?: CreateAxiosDefaults, options?: Partial<RequestOption<ResponseData, ApiData, State>>) {
  const opts = createDefaultOptions<ResponseData, ApiData, State>(options);

  const axiosConf = createAxiosConfig(axiosConfig);
  const instance = axios.create(axiosConf);

  /**
   * 托管请求共用一个 controller，cancelAllRequest 把它 abort 掉再换一个新的
   *
   * 不按 requestId 存一张 Map：那样每个请求都会往 Map 里塞一条，而请求正常结束时没有任何地方
   * 删除它——长驻页面下这张表只增不减。共用一个 controller 则完全不需要回收，adapter 在请求结束时
   * 会自己把 abort 监听器摘掉。
   */
  let abortController = new AbortController();

  // config axios retry
  const retryOptions = createRetryOptions(opts.retry);
  axiosRetry(instance, retryOptions);

  instance.interceptors.request.use(async config => {
    if (opts.requestIdKey) {
      config.headers.set(opts.requestIdKey, nanoid());
    }

    // 调用方自带 signal 就由它自己管生命周期，不纳入 cancelAllRequest
    if (!config.signal) {
      config.signal = abortController.signal;
    }

    const handledConfig = await opts.onRequest(config);

    // 不给 `|| config` 兜底：静默沿用旧配置会把「忘记 return」变成一个能跑但少了认证头的请求，
    // 和 onBackendFail 拒绝可选返回值是同一个理由
    if (!handledConfig) {
      throw new AxiosError('the onRequest hook must return the request config', AxiosError.ERR_BAD_OPTION, config);
    }

    return handledConfig;
  });

  instance.interceptors.response.use(
    async response => {
      const responseType: ResponseType = response.config?.responseType || 'json';

      await transformResponse(response);

      if (responseType !== 'json' || opts.isBackendSuccess(response)) {
        return Promise.resolve(response);
      }

      const fail = await opts.onBackendFail(response, instance);
      if (fail) {
        return fail;
      }

      const backendError = new AxiosError<ResponseData>(
        'the backend request error',
        BACKEND_ERROR_CODE,
        response.config,
        response.request,
        response
      );

      await opts.onError(backendError);

      return Promise.reject(backendError);
    },
    async (error: AxiosError<ResponseData>) => {
      // 后端用真实 HTTP 状态码表达失败时，业务信封仍在 response.data 上。不在这里接一次
      // onBackendFail，续签和登出这些按业务码分岔的流程就只在 HTTP 200 的后端上生效。
      const { response } = error;

      if (response) {
        await transformResponse(response);

        // 网关的 HTML 502、空 body 的 500 都会走到这里，onBackendFail 读的是信封字段
        if (response.data && typeof response.data === 'object') {
          const fail = await opts.onBackendFail(response, instance);
          if (fail) {
            return fail;
          }
        }
      }

      await opts.onError(error);

      return Promise.reject(error);
    }
  );

  function cancelAllRequest() {
    abortController.abort();

    // 必须换新的：已 abort 的 signal 挂到后续请求上，会让它们一发出就立刻失败
    abortController = new AbortController();
  }

  return {
    cancelAllRequest,
    instance,
    opts
  };
}

export type * from './type';

/**
 * Create a request instance
 *
 * @param axiosConfig Axios config
 * @param options Request options
 */
export function createRequest<
  ResponseData,
  ApiData = unknown,
  State extends Record<string, unknown> = Record<string, unknown>
>(axiosConfig?: CreateAxiosDefaults, options?: Partial<RequestOption<ResponseData, ApiData, State>>) {
  const { cancelAllRequest, instance, opts } = createCommonRequest<ResponseData, ApiData, State>(axiosConfig, options);

  const request: RequestInstance<ApiData, State> = async function request<
    T extends ApiData = ApiData,
    R extends ResponseType = 'json'
  >(config: CustomAxiosRequestConfig) {
    const response: AxiosResponse<ResponseData> = await instance(config);

    const responseType = response.config?.responseType || 'json';

    if (responseType === 'json') {
      return opts.transform(response);
    }

    return response.data as MappedType<R, T>;
  } as RequestInstance<ApiData, State>;

  request.cancelAllRequest = cancelAllRequest;
  request.state = { ...opts.defaultState } as State;

  return request;
}
/**
 * Create a flat request instance
 *
 * The response data is a flat object: { data: any, error: AxiosError }
 *
 * @param axiosConfig Axios config
 * @param options Request options
 */
export function createFlatRequest<
  ResponseData,
  ApiData = unknown,
  State extends Record<string, unknown> = Record<string, unknown>
>(axiosConfig?: CreateAxiosDefaults, options?: Partial<RequestOption<ResponseData, ApiData, State>>) {
  const { cancelAllRequest, instance, opts } = createCommonRequest<ResponseData, ApiData, State>(axiosConfig, options);

  const flatRequest: FlatRequestInstance<ResponseData, ApiData, State> = async function flatRequest<
    T extends ApiData = ApiData,
    R extends ResponseType = 'json'
  >(config: CustomAxiosRequestConfig) {
    try {
      const response: AxiosResponse<ResponseData> = await instance(config);

      const responseType = response.config?.responseType || 'json';

      if (responseType === 'json') {
        const data = await opts.transform(response);

        return { data, error: null, response };
      }

      return { data: response.data as MappedType<R, T>, error: null, response };
    } catch (error) {
      // response 可能是 undefined：网络错误、超时、取消，或者请求拦截器里就抛了
      const axiosError = toAxiosError<ResponseData>(error);

      return { data: null, error: axiosError, response: axiosError.response };
    }
  } as FlatRequestInstance<ResponseData, ApiData, State>;

  flatRequest.cancelAllRequest = cancelAllRequest;
  flatRequest.state = {
    ...opts.defaultState
  } as State;

  return flatRequest;
}
export { BACKEND_ERROR_CODE, REQUEST_ID_KEY };
export type { AxiosError, CreateAxiosDefaults };

import { nanoid } from '@skyroc/utils';
import axios, { AxiosError } from 'axios';
import type { AxiosResponse, CreateAxiosDefaults, InternalAxiosRequestConfig } from 'axios';
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

function createCommonRequest<
  ResponseData,
  ApiData = ResponseData,
  State extends Record<string, unknown> = Record<string, unknown>
>(axiosConfig?: CreateAxiosDefaults, options?: Partial<RequestOption<ResponseData, ApiData, State>>) {
  const opts = createDefaultOptions<ResponseData, ApiData, State>(options);

  const axiosConf = createAxiosConfig(axiosConfig);
  const instance = axios.create(axiosConf);

  const abortControllerMap = new Map<string, AbortController>();

  // config axios retry
  const retryOptions = createRetryOptions(axiosConf);
  axiosRetry(instance, retryOptions);

  instance.interceptors.request.use(conf => {
    const config: InternalAxiosRequestConfig = { ...conf };

    // set request id
    const requestId = nanoid();
    config.headers.set(REQUEST_ID_KEY, requestId);

    // config abort controller
    if (!config.signal) {
      const abortController = new AbortController();
      config.signal = abortController.signal;
      abortControllerMap.set(requestId, abortController);
    }

    // handle config by hook
    const handledConfig = opts.onRequest?.(config) || config;

    return handledConfig;
  });

  instance.interceptors.response.use(
    async response => {
      const responseType: ResponseType = (response.config?.responseType as ResponseType) || 'json';

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
    abortControllerMap.forEach(abortController => {
      abortController.abort();
    });
    abortControllerMap.clear();
  }

  return {
    cancelAllRequest,
    instance,
    opts
  };
}

export type * from './type';

export * from './type';

/**
 * Create a request instance
 *
 * @param axiosConfig Axios config
 * @param options Request options
 */
export function createRequest<ResponseData, ApiData, State extends Record<string, unknown>>(
  axiosConfig?: CreateAxiosDefaults,
  options?: Partial<RequestOption<ResponseData, ApiData, State>>
) {
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
  request.state = {} as State;

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
export function createFlatRequest<ResponseData, ApiData, State extends Record<string, unknown>>(
  axiosConfig?: CreateAxiosDefaults,
  options?: Partial<RequestOption<ResponseData, ApiData, State>>
) {
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
      return { data: null, error, response: (error as AxiosError<ResponseData>).response };
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

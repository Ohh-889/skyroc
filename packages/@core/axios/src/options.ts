import type { CreateAxiosDefaults } from 'axios';
import type { IAxiosRetryConfig } from 'axios-retry';
import { stringify } from 'qs';
import { REQUEST_ID_KEY } from './constant';
import { isHttpSuccess } from './shared';
import type { RequestOption } from './type';

export function createDefaultOptions<
  ResponseData,
  ApiData = ResponseData,
  State extends Record<string, unknown> = Record<string, unknown>
>(options?: Partial<RequestOption<ResponseData, ApiData, State>>) {
  const opts: RequestOption<ResponseData, ApiData, State> = {
    defaultState: {} as State,
    isBackendSuccess: _response => true,
    onBackendFail: async () => {},
    onError: async () => {},
    onRequest: async config => config,
    requestIdKey: REQUEST_ID_KEY,
    transform: async response => response.data as unknown as ApiData,
    transformBackendResponse: async response => response.data as unknown as ApiData
  };

  // 逐项覆盖而不是 Object.assign：后者会把显式传入的 `undefined` 也写进去，
  // 把默认实现擦成 undefined，等到调用时才以 "opts.transform is not a function" 炸出来
  for (const [key, value] of Object.entries(options ?? {})) {
    if (value !== undefined) {
      Reflect.set(opts, key, value);
    }
  }

  // transform 优先，只有它缺席时才回退到已废弃的 transformBackendResponse
  if (!options?.transform && options?.transformBackendResponse) {
    opts.transform = options.transformBackendResponse;
  }

  return opts;
}

export function createRetryOptions(retryConfig?: IAxiosRetryConfig): IAxiosRetryConfig {
  // 默认不重试：重试对非幂等请求是有害的，必须由调用方显式打开
  return {
    retries: 0,
    ...retryConfig
  };
}

export function createAxiosConfig(config?: Partial<CreateAxiosDefaults>) {
  const TEN_SECONDS = 10 * 1000;

  const axiosConfig: CreateAxiosDefaults = {
    headers: {
      'Content-Type': 'application/json'
    },
    paramsSerializer: params => {
      return stringify(params);
    },
    timeout: TEN_SECONDS,
    validateStatus: isHttpSuccess
  };

  Object.assign(axiosConfig, config);

  return axiosConfig;
}

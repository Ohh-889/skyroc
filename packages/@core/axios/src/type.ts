import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { IAxiosRetryConfig } from 'axios-retry';

export type ContentType =
  | 'application/json'
  | 'application/octet-stream'
  | 'application/x-www-form-urlencoded'
  | 'multipart/form-data'
  | 'text/html'
  | 'text/plain';

export type ResponseTransform<Input = any, Output = any> = (input: Input) => Output | Promise<Output>;

export interface RequestOption<
  ResponseData,
  ApiData = ResponseData,
  State extends Record<string, unknown> = Record<string, unknown>
> {
  /** The default state */
  defaultState?: State;
  /**
   * The hook to check backend response is success or not
   *
   * @param response Axios response
   */
  isBackendSuccess: (response: AxiosResponse<ResponseData>) => boolean;
  /**
   * The hook after backend request fail
   *
   * For example: You can handle the expired token in this hook
   *
   * 返回一个响应表示这次失败已被就地补救（典型是续签后重试），调用方拿到的是它而不是错误； 返回空则继续走 onError 并 reject。
   *
   * 写成单个联合返回值而不是 `Promise<AxiosResponse | null> | Promise<void>`：后者让「忘记 return」变成合法实现，重试结果会被静默丢掉。
   *
   * 返回的响应**不再**经过 `isBackendSuccess` 复检，重进本钩子的次数也没有上限：用 `instance` 重发的请求会完整走一遍响应拦截器，失败了就再次落到这里。补救逻辑必须自己在 config 上打标记
   * 来终止循环，否则「补救完还是同一个失败码」就是一个没有退避的无限重发。
   *
   * @param response Axios response
   * @param instance Axios instance
   */
  onBackendFail: (
    response: AxiosResponse<ResponseData>,
    instance: AxiosInstance
  ) => Promise<AxiosResponse | null | void>;
  /**
   * The hook to handle error
   *
   * For example: You can show error message in this hook
   *
   * @param error
   */
  onError: (error: AxiosError<ResponseData>) => void | Promise<void>;
  /**
   * The hook before request
   *
   * For example: You can add header token in this hook
   *
   * 必须把 config 返回出去：拦截器不会替你兜底沿用旧配置，返回空会直接抛 ERR_BAD_OPTION。
   *
   * @param config Axios config
   */
  onRequest: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;
  /**
   * 请求 id 的 header 名，传 `false` 则不发送
   *
   * 自定义 header 会让跨域请求多一次 OPTIONS 预检，不需要链路追踪时可以关掉。
   *
   * @default 'X-Request-Id'
   */
  requestIdKey?: string | false;
  /**
   * Axios-retry 的配置
   *
   * 独立一项而不是混在 axiosConfig 里：`CreateAxiosDefaults` 没有 `retries` 字段，塞在那里只能靠 类型断言绕过检查，等于这个能力事实上不可用。
   *
   * @default { retries: 0 }
   */
  retry?: IAxiosRetryConfig;
  /**
   * Transform the response data to the api data
   *
   * @param response Axios response
   */
  transform: ResponseTransform<AxiosResponse<ResponseData>, ApiData>;
}

/**
 * 非 json 的响应类型到数据类型的映射
 *
 * Key 必须和 axios 的 `ResponseType` 字面量逐字对齐（全小写）：这些值会被原样赋给 `XMLHttpRequest.responseType`，写错大小写浏览器会按非法枚举值静默忽略，拿回来的是文本。
 */
interface ResponseMap {
  arraybuffer: ArrayBuffer;
  blob: Blob;
  document: Document;
  formdata: FormData;
  stream: ReadableStream<Uint8Array>;
  text: string;
}
export type ResponseType = keyof ResponseMap | 'json';

export type MappedType<R extends ResponseType, JsonType = any> = R extends keyof ResponseMap
  ? ResponseMap[R]
  : JsonType;

export type CustomAxiosRequestConfig<R extends ResponseType = 'json'> = Omit<AxiosRequestConfig, 'responseType'> & {
  responseType?: R;
};

export interface RequestInstanceCommon<State extends Record<string, unknown>> {
  /**
   * 取消所有由本实例托管的进行中请求
   *
   * 调用方在 config 里自带 `signal` 的请求不受影响——传了 signal 就意味着生命周期由调用方自己管。
   */
  cancelAllRequest: () => void;
  /** You can set custom state in the request instance */
  state: State;
}

/** The request instance */
export interface RequestInstance<ApiData, State extends Record<string, unknown>> extends RequestInstanceCommon<State> {
  <T extends ApiData = ApiData, R extends ResponseType = 'json'>(
    config: CustomAxiosRequestConfig<R>
  ): Promise<MappedType<R, T>>;
}

export type FlatResponseSuccessData<ResponseData, ApiData> = {
  data: ApiData;
  error: null;
  response: AxiosResponse<ResponseData>;
};

export type FlatResponseFailData<ResponseData> = {
  data: null;
  error: AxiosError<ResponseData>;
  /** 网络错误、超时、取消，以及请求根本没发出去的场景都没有响应 */
  response?: AxiosResponse<ResponseData>;
};

export type FlatResponseData<ResponseData, ApiData> =
  | FlatResponseSuccessData<ResponseData, ApiData>
  | FlatResponseFailData<ResponseData>;

export interface FlatRequestInstance<
  ResponseData,
  ApiData,
  State extends Record<string, unknown>
> extends RequestInstanceCommon<State> {
  <T extends ApiData = ApiData, R extends ResponseType = 'json'>(
    config: CustomAxiosRequestConfig<R>
  ): Promise<FlatResponseData<ResponseData, MappedType<R, T>>>;
}

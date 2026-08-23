import { createAppRequest } from '@skyroc/service';

import { nativeAdapter } from '../adapter';
import { API_BASE_URL, API_TIMEOUT, SERVICE_CODES } from '../config';

/** 重试的基础退避，第 n 次重试等 n 秒 */
const RETRY_DELAY = 1_000;

/**
 * 全局请求实例。
 *
 * 用法和 web 端完全一致：`request<T>({ url, method, data })` 返回的已经是拆过信封的业务数据，
 * 失败会 reject（并已弹过提示），所以 TanStack Query 能直接拿它当 queryFn。
 *
 * 接口定义不写在这里，按域放在 `src/service/api/<域>/`。
 */
export const request = createAppRequest({
  adapter: nativeAdapter,
  axiosConfig: {
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT
  },
  codes: SERVICE_CODES,
  // 请求 id 由 nanoid 生成，而 nanoid 要 `crypto.getRandomValues` —— Hermes 没有这个全局，
  // 开着会让每个请求在拦截器里就抛。需要链路追踪就先装 react-native-get-random-values 再打开。
  requestIdKey: false,
  // 移动网络断流、切基站是常态，值得重试；但只重试幂等请求：axios-retry 默认的
  // isNetworkOrIdempotentRequestError 只放行 GET/HEAD/OPTIONS/PUT/DELETE 和 5xx，
  // POST 不会被重复提交出去
  retry: {
    retries: 2,
    retryDelay: retryCount => retryCount * RETRY_DELAY
  }
});

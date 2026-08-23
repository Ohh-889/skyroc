import type { CreateAxiosDefaults } from '@skyroc/axios';
import type { InternalAxiosRequestConfig } from 'axios';
import type { IAxiosRetryConfig } from 'axios-retry';

declare module 'axios' {
  interface AxiosRequestConfig {
    /**
     * 显式标记这个请求是续签请求本身
     *
     * 常规情况不用写：适配器的 `refreshTokenUrl` 已经够识别了。只有续签走的 url 跟它对不上
     * （网关重写、多租户前缀、续签换了个域名）才需要在这里补一刀。
     */
    isRefreshToken?: boolean;
    /**
     * 内部字段，业务代码不要设置：标记这个请求已经因为续签重发过一次
     *
     * 必须是字符串键。axios 的 `mergeConfig` 用 `Object.keys` 遍历配置，Symbol 键在
     * `instance.request()` 重新 merge 时会被丢掉，标记等于没打。
     */
    isTokenRefreshRetry?: boolean;
  }
}

/**
 * 平台适配器接口
 *
 * 不同平台（antd / RN / Next.js）实现此接口， 使请求基础设施的错误处理、token 刷新、导航等逻辑可跨端复用。
 */
export interface RequestAdapter {
  /** 使用 refresh token 换取新 token */
  fetchRefreshToken(refreshToken: string): Promise<{ refreshToken: string; token: string }>;

  /** 获取当前路由路径 */
  getCurrentPath(): string;

  /** 获取 refresh token */
  getRefreshToken(): string | null;

  /** 获取 access token */
  getToken(): string | null;

  /** 重定向到登录页 */
  redirectToLogin(redirectPath?: string): void;

  /**
   * 续签接口的 url，必须和 `fetchRefreshToken` 里实际请求的那个是同一个
   *
   * 用来识别「拿到过期码的是续签请求自己」。这种请求绝不能再去续签：它会 await 自己那次还没
   * 完成的刷新，把自己和所有等着刷新的请求一起永久挂起——不是报错，是转圈不动。
   *
   * 做成必填而不是靠 `isRefreshToken` 标记：标记要靠写 api 的人记得加，漏了要到 refresh token
   * 也过期那天才发作；这个字段漏了是编译错误。
   */
  refreshTokenUrl: string;

  /** 清除认证信息 */
  resetAuth(): void;

  /** 保存认证信息 */
  setAuth(tokens: { refreshToken: string; token: string }): void;

  /** 展示错误消息（toast / message） */
  showErrorMessage(msg: string, onClose?: () => void): void;

  /** 展示错误弹窗（modal / dialog） */
  showErrorModal(options: { content: string; maskClosable?: boolean; onConfirm: () => void; title: string }): void;

  /** 国际化翻译 */
  t(key: string): string;
}

/**
 * 后端业务状态码配置
 *
 * 不同环境 / 后端可能使用不同的 code 体系
 */
export interface ServiceCodes {
  /** Token 过期需要刷新的状态码 */
  expiredToken: string[];
  /** 需要登出的状态码 */
  logout: string[];
  /** 需要弹窗确认后登出的状态码 */
  modalLogout: string[];
  /** 请求成功的状态码 */
  success: string;
}

/** 请求实例的内部状态 */
export interface RequestInstanceState {
  /** 当前正在展示的错误消息栈（防止重复展示） */
  errMsgStack: string[];
  [key: string]: unknown;
}

/**
 * 请求体加密器，由 `@skyroc/service/crypto` 的 `createRequestSealer` 造。
 *
 * 做成注入而不是在这里 import：加密实现依赖 node-forge，它会 `require('crypto')`。
 * 打包器是静态分析的，只要主入口引到它，没有 node 内置模块的运行时（React Native / Metro）
 * 连包都打不出来——而这些端根本不需要加密。不传就不参与，请求体原样发出。
 */
export type RequestSealer = (config: InternalAxiosRequestConfig) => Promise<InternalAxiosRequestConfig>;

/** CreateAppRequest 工厂函数的配置项 */
export interface CreateRequestOptions {
  /** 平台适配器 */
  adapter: RequestAdapter;
  /** Axios 基础配置 */
  axiosConfig?: CreateAxiosDefaults;
  /** 后端业务状态码 */
  codes: ServiceCodes;
  /** 自定义后端成功判断（默认：response.data.code === codes.success） */
  isBackendSuccess?: (response: { data: { code: string | number } }) => boolean;
  /**
   * 请求 id 的 header 名，传 `false` 则不发送
   *
   * @default 'X-Request-Id'
   */
  requestIdKey?: string | false;
  /**
   * axios-retry 配置，默认不重试
   *
   * 打开时务必带上 `axios-retry` 的幂等判断（默认的 `isNetworkOrIdempotentRequestError` 就够），
   * 无差别重试会把下单、支付这类请求重复提交出去。
   */
  retry?: IAxiosRetryConfig;
  /** 请求体加密器。不传则不加密；标了 `encrypt: true` 的请求会原样发出 */
  sealRequest?: RequestSealer;
  /** 自定义响应数据转换（默认：response.data.data） */
  transform?: (response: any) => any;
}

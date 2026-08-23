import axios from 'axios';

import { API_BASE_URL, API_TIMEOUT, SERVICE_CODES } from '../../config';

import { AUTH_URLS } from './urls';

/**
 * 续签专用通道，刻意不复用 `service/request` 的实例。
 *
 * 两个理由，任一个都够：
 *
 * 1. 打断循环依赖。`request` 创建时要拿到 adapter，adapter 又要拿到续签函数——续签函数一旦
 *    建立在 `request` 上，`api → request → adapter → api` 就成环了（Metro 会直接报
 *    Require cycle，且加载顺序稍有变化就会拿到半初始化的模块）。
 * 2. 续签请求本来就不该走那套拦截器。它带的是已经过期的 token，一旦被判成「令牌过期」，
 *    就会去 await 自己那次还没完成的刷新，把自己和所有排队等刷新的请求一起挂死——不是报错，
 *    是永远转圈。`@skyroc/service` 里那一整套 `isRefreshTokenRequest` 判断防的就是这件事，
 *    走独立通道则从根上不可能发生。
 *
 * 代价是拆信封要自己来一遍，就是下面那三行。
 */
const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT
});

/**
 * 用 refreshToken 换一对新凭据。
 *
 * 只给 `service/adapter` 用。业务代码需要刷新令牌时走 `refreshToken(adapter)`——那里有并发去重，
 * 各刷各的会让后发的那次拿着已经轮换掉的 refreshToken 去换，换回来一次失败和一次莫名其妙的登出。
 *
 * 失败必须抛：调用方靠异常判断「续签失败，去登录页」，返回个空对象会让它带着空 token 继续跑。
 */
export async function fetchRefreshToken(refreshToken: string): Promise<Api.Auth.LoginToken> {
  const { data } = await refreshClient.post<Api.Service.Response<Api.Auth.LoginToken>>(AUTH_URLS.REFRESH_TOKEN, {
    refreshToken
  });

  if (String(data.code) !== SERVICE_CODES.success) {
    throw new Error(data.msg || '续签失败');
  }

  return data.data;
}

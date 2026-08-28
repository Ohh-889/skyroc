import { getToken } from '@/feature/auth/auth-store';

import { request } from '../../request';

import { AUTH_URLS } from './urls';

export function fetchLogin(params: Api.Auth.LoginParams) {
  return request<Api.Auth.LoginResponse>({
    data: params,
    method: 'post',
    url: AUTH_URLS.LOGIN
  });
}

/**
 * 当前登录用户信息。
 *
 * `signal` 由 TanStack Query 传进来，页面卸载 / 查询被取消时请求会跟着中断。 注意：一旦自己传了 signal，这个请求就不再受 `request.cancelAllRequest()` 管辖。
 */
export function fetchGetUserInfo(signal?: AbortSignal) {
  // 没登录就别发这一枪：它必定 401，还会白白触发一次续签
  if (!getToken()) {
    return Promise.resolve(null);
  }

  return request<Api.Auth.UserInfo>({ signal, url: AUTH_URLS.GET_USER_INFO });
}

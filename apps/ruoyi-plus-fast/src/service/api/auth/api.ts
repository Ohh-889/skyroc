import { getToken } from '@/features/auth/use-auth';

import { request } from '../../request';

import { AUTH_URLS } from './urls';

export function fetchCaptcha() {
  return request<Api.Auth.CaptchaInfo>({
    url: AUTH_URLS.CAPTCHA
  });
}

// 登录请求里除了账号密码，后端还要三个描述"这次登录是从哪来的"的字段，它们都不是用户填的
// 表单项，所以在这里补齐：放到页面或 use-login 里，每多一个登录入口就要记得抄一遍。
const LOGIN_CONTEXT = {
  /** 后端 sys_client.client_id，一行是一个端。换个端（App、小程序）就换个值，所以走 .env */
  clientId: import.meta.env.VITE_AUTH_CLIENT_ID,
  /** 后端 /auth/login 只实现了账号密码登录，客户端开通了 sms 也走不了这条路 */
  grantType: 'password',
  /** 未开多租户的部署固定 000000 */
  tenantId: '000000'
} satisfies Partial<Api.Auth.LoginParams>;

// encrypt 对应后端 /auth/login 上的 @api_encrypt()，两边必须同时开或同时关
export function fetchLogin(params: Api.Auth.LoginParams) {
  return request<Api.Auth.LoginResponse>({
    // params 放后面：调用方显式传了就用它的，没传才落到上面这套默认值
    data: { ...LOGIN_CONTEXT, ...params },
    encrypt: true,
    method: 'post',
    url: AUTH_URLS.LOGIN
  });
}

export function fetchGetUserInfo() {
  if (!getToken()) {
    return Promise.resolve(null);
  }

  return request<Api.Auth.UserInfo>({ url: AUTH_URLS.GET_USER_INFO });
}

export function fetchRefreshToken(refreshToken: string) {
  return request<Api.Auth.LoginToken>({
    data: {
      refreshToken
    },
    method: 'post',
    url: AUTH_URLS.REFRESH_TOKEN
  });
}

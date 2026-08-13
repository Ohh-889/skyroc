import { getToken } from '@/features/auth/use-auth';

import { request } from '../../request';

import { AUTH_URLS } from './urls';

export function fetchCaptcha() {
  return request<Api.Auth.CaptchaInfo>({
    url: AUTH_URLS.CAPTCHA
  });
}

// 登录请求里除了用户填的那几项，后端还要几个描述"这次登录是从哪来的"的字段，它们都不是
// 表单项，所以在这里补齐：放到页面或 use-login 里，每多一个登录入口就要记得抄一遍。
const LOGIN_CONTEXT = {
  /** 后端 sys_client.client_id，一行是一个端。换个端（App、小程序）就换个值，所以走 .env */
  clientId: import.meta.env.VITE_AUTH_CLIENT_ID
} satisfies Api.Auth.LoginContext;

/** 未开多租户的部署固定用它，对齐后端的默认租户 */
export const DEFAULT_TENANT_ID = '000000';

// 开了多租户之后 tenantId 由登录页的租户下拉框决定，但下拉框在 /auth/tenant/list 回来之前
// 是空的，关掉多租户时它压根不存在——两种情况都落回默认租户，而不是把 undefined 发出去。
function withDefaultTenant<T extends { tenantId?: string }>(params: T) {
  return { ...params, tenantId: params.tenantId || DEFAULT_TENANT_ID };
}

// 不需要令牌：登录页得先知道能选哪几家租户，才谈得上登录。带了令牌且是超管的话拿到的是全部。
export function fetchLoginTenants() {
  return request<Api.Auth.LoginTenantInfo>({
    url: AUTH_URLS.TENANT_LIST
  });
}

// encrypt 对应后端 /auth/login 上的 @api_encrypt()，两边必须同时开或同时关
export function fetchLogin(params: Api.Auth.LoginParams) {
  return request<Api.Auth.LoginResponse>({
    // params 放后面：调用方显式传了就用它的，没传才落到上面这套默认值。
    // grantType 不传按密码登录算，验证码那两条路自己带 sms / email。
    data: { grantType: 'password', ...LOGIN_CONTEXT, ...withDefaultTenant(params) },
    encrypt: true,
    method: 'post',
    url: AUTH_URLS.LOGIN
  });
}

// 两个接口在号码/地址没注册时也回成功，不告诉调用方存不存在——那样它们就成了不要凭据的用户
// 枚举接口。所以"发送成功"只表示请求被受理了，不代表真发出去了。
export function fetchSmsCode(params: Api.Auth.SmsCodeParams) {
  return request<null>({
    data: withDefaultTenant(params),
    method: 'post',
    url: AUTH_URLS.SMS_CODE
  });
}

export function fetchEmailCode(params: Api.Auth.EmailCodeParams) {
  return request<null>({
    data: withDefaultTenant(params),
    method: 'post',
    url: AUTH_URLS.EMAIL_CODE
  });
}

// 后端认的是 Authorization 里的那张令牌，所以必须赶在清本地存储之前调用：请求拦截器要到下
// 一个微任务才去读 token，先清了本地，发出去的就是一条没带令牌的请求，后端当成"没带"直接回
// 成功，而服务端的刷新令牌和在线设备记录会一直留到自己过期。
//
// 自带 timeout：登出是个用户已经决定了的动作，不能因为后端不响应就卡在原地退不出去。默认
// 配置没设 timeout，不给这一条单独设的话最坏情况是一直等下去。
export function fetchLogout() {
  // 本来就没令牌（会话已经被强制登出过）就不发了，后端一样回成功，但那是一次白跑的往返
  if (!getToken()) {
    return Promise.resolve(null);
  }

  return request<null>({
    method: 'post',
    timeout: 3000,
    url: AUTH_URLS.LOGOUT
  });
}

export function fetchRefreshToken(refreshToken: string) {
  return request<Api.Auth.LoginToken>({
    data: {
      refreshToken
    },
    isRefreshToken: true,
    method: 'post',
    url: AUTH_URLS.REFRESH_TOKEN
  });
}

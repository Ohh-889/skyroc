/** Auth 模块的接口地址 */
export const AUTH_URLS = {
  GET_USER_INFO: '/auth/getUserInfo',
  LOGIN: '/auth/login',
  /** 必须和 `service/adapter` 的 refreshTokenUrl 保持同一个值，请求层靠它认出「续签请求自己」 */
  REFRESH_TOKEN: '/auth/refreshToken'
} as const;

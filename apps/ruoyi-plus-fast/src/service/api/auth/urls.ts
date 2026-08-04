/** Auth module URLs */

export const AUTH_URLS = {
  CAPTCHA: '/auth/code',
  GET_USER_INFO: '/auth/getUserInfo',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refreshToken'
} as const;

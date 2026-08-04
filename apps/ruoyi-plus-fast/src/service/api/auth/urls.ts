/** Auth module URLs */

export const AUTH_URLS = {
  CAPTCHA: '/auth/code',
  EMAIL_CODE: '/auth/email/code',
  GET_USER_INFO: '/auth/getUserInfo',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refreshToken',
  SMS_CODE: '/auth/sms/code'
} as const;

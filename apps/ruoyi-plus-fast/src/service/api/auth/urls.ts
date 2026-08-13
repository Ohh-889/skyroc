/** Auth module URLs */

export const AUTH_URLS = {
  CAPTCHA: '/auth/code',
  EMAIL_CODE: '/auth/email/code',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refreshToken',
  SMS_CODE: '/auth/sms/code',
  TENANT_LIST: '/auth/tenant/list'
} as const;

export const AUTH_QUERY_KEYS = {
  CAPTCHA: ['auth', 'captcha'] as const,
  TENANT_LIST: ['auth', 'tenantList'] as const
} as const;

export const AUTH_MUTATION_KEYS = {
  EMAIL_CODE: ['auth', 'emailCode'] as const,
  LOGIN: ['auth', 'login'] as const,
  SMS_CODE: ['auth', 'smsCode'] as const
} as const;

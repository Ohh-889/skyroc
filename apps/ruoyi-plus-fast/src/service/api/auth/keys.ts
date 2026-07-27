export const AUTH_QUERY_KEYS = {
  CAPTCHA: ['auth', 'captcha'] as const,
  USER_INFO: ['auth', 'userInfo'] as const
} as const;

export const AUTH_MUTATION_KEYS = {
  LOGIN: ['auth', 'login'] as const
} as const;

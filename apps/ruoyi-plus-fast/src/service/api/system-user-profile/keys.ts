export const SYSTEM_USER_PROFILE_QUERY_KEYS = {
  ALL: ['system-user-profile'] as const,
  DETAIL: ['system-user-profile', 'detail'] as const
} as const;

export const SYSTEM_USER_PROFILE_MUTATION_KEYS = {
  UPDATE: ['system-user-profile', 'update'] as const,
  UPDATE_PASSWORD: ['system-user-profile', 'update-password'] as const
} as const;

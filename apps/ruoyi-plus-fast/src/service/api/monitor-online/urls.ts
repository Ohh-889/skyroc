export const MONITOR_ONLINE_URLS = {
  FORCE_LOGOUT: (tokenId: string) => `/auth/online/all/${encodeURIComponent(tokenId)}`,
  LIST: '/auth/online/all'
} as const;

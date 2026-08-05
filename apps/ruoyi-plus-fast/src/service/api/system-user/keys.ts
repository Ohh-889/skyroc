import type { UserListParams } from './types';

export const SYSTEM_USER_QUERY_KEYS = {
  DEPT_TREE: ['system-user', 'dept-tree'] as const,
  USER_LIST: (params: UserListParams) => ['system-user', 'list', params] as const
} as const;

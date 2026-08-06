import type { UserId, UserListParams } from './types';

export const SYSTEM_USER_QUERY_KEYS = {
  DEPT_TREE: ['system-user', 'dept-tree'] as const,
  LIST_BY_DEPT: (deptId: UserId | 'none') => ['system-user', 'list-by-dept', deptId] as const,
  USER_LIST: (params: UserListParams) => ['system-user', 'list', params] as const
} as const;

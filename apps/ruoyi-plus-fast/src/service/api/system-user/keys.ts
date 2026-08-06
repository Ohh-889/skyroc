import type { UserId, UserListParams, UserOptionParams } from './types';

export const SYSTEM_USER_QUERY_KEYS = {
  ALL: ['system-user'] as const,
  AUTH_ROLE: (userId: UserId | 'none') => ['system-user', 'auth-role', userId] as const,
  DETAIL: (userId: UserId | 'create') => ['system-user', 'detail', userId] as const,
  DEPT_TREE: ['system-user', 'dept-tree'] as const,
  LIST_BY_DEPT: (deptId: UserId | 'none') => ['system-user', 'list-by-dept', deptId] as const,
  POST_OPTIONS: (deptId: UserId | 'none') => ['system-user', 'post-options', deptId] as const,
  USER_OPTIONS: (params: UserOptionParams) => ['system-user', 'options', params] as const,
  USER_INFO: ['system-user', 'user-info'] as const,
  USER_LIST: (params: UserListParams) => ['system-user', 'list', params] as const
} as const;

export const SYSTEM_USER_MUTATION_KEYS = {
  AUTH_ROLE: ['system-user', 'auth-role'] as const,
  CHANGE_STATUS: ['system-user', 'change-status'] as const,
  CREATE: ['system-user', 'create'] as const,
  DELETE: ['system-user', 'delete'] as const,
  IMPORT: ['system-user', 'import'] as const,
  RESET_PASSWORD: ['system-user', 'reset-password'] as const,
  UPDATE: ['system-user', 'update'] as const
} as const;

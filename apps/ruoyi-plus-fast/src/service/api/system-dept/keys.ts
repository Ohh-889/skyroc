import type { DeptId, DeptListParams, DeptOptionParams } from './types';

export const SYSTEM_DEPT_QUERY_KEYS = {
  ALL: ['system-dept'] as const,
  DETAIL: (deptId: DeptId) => ['system-dept', 'detail', String(deptId)] as const,
  EXCLUDE_SUBTREE: (deptId: DeptId) => ['system-dept', 'exclude-subtree', String(deptId)] as const,
  LIST: (params: DeptListParams = {}) => ['system-dept', 'list', params] as const,
  LISTS: ['system-dept', 'list'] as const,
  OPTIONS: (params: DeptOptionParams = {}) => ['system-dept', 'options', params] as const
} as const;

export const SYSTEM_DEPT_MUTATION_KEYS = {
  CREATE: ['system-dept', 'create'] as const,
  DELETE: ['system-dept', 'delete'] as const,
  UPDATE: ['system-dept', 'update'] as const
} as const;

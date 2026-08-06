import type { DeptId } from './types';

export const SYSTEM_DEPT_URLS = {
  CREATE: '/system/dept',
  DELETE: (deptId: DeptId) => `/system/dept/${deptId}`,
  DETAIL: (deptId: DeptId) => `/system/dept/${deptId}`,
  EXCLUDE_SUBTREE: (deptId: DeptId) => `/system/dept/list/exclude/${deptId}`,
  LIST: '/system/dept/list',
  UPDATE: '/system/dept'
} as const;

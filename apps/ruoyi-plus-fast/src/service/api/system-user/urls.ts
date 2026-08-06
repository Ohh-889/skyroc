export const SYSTEM_USER_URLS = {
  DEPT_TREE: '/system/dept/deptTree',
  LIST_BY_DEPT: (deptId: number | string) => `/system/user/list/dept/${deptId}`,
  USER_LIST: '/system/user/list'
} as const;

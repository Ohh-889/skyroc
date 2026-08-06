import type { RoleId } from './types';

export const SYSTEM_ROLE_URLS = {
  ALLOCATED_MEMBERS: '/system/role/authUser/allocatedList',
  ASSIGN_MEMBERS: '/system/role/authUser/selectAll',
  CANCEL_MEMBER: '/system/role/authUser/cancel',
  CANCEL_MEMBERS: '/system/role/authUser/cancelAll',
  CHANGE_STATUS: '/system/role/changeStatus',
  CREATE: '/system/role',
  DATA_SCOPE: '/system/role/dataScope',
  DELETE: (roleIds: RoleId[]) => `/system/role/${roleIds.map(String).join(',')}`,
  DEPT_TREE: (roleId: RoleId) => `/system/role/deptTree/${roleId}`,
  DETAIL: (roleId: RoleId) => `/system/role/${roleId}`,
  LIST: '/system/role/list',
  MENU_TREE: (roleId: RoleId) => `/system/menu/roleMenuTreeselect/${roleId}`,
  MENU_TREE_CREATE: '/system/menu/treeselect',
  OPTIONS: '/system/role/optionselect',
  UNALLOCATED_MEMBERS: '/system/role/authUser/unallocatedList',
  UPDATE: '/system/role'
} as const;

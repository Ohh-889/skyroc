import type { RoleId, RoleListParams, RoleMemberListParams } from './types';

export const SYSTEM_ROLE_QUERY_KEYS = {
  ALLOCATED_MEMBERS: (params: RoleMemberListParams) => ['system-role', 'allocated-members', params] as const,
  ALL: ['system-role'] as const,
  DEPT_TREE: (roleId: RoleId) => ['system-role', 'dept-tree', roleId] as const,
  DETAIL: (roleId: RoleId | 'none') => ['system-role', 'detail', roleId] as const,
  LIST: (params: RoleListParams) => ['system-role', 'list', params] as const,
  MENU_TREE: (roleId: RoleId | 'create') => ['system-role', 'menu-tree', roleId] as const,
  OVERVIEW: ['system-role', 'overview'] as const,
  UNALLOCATED_MEMBERS: (params: RoleMemberListParams) => ['system-role', 'unallocated-members', params] as const
} as const;

export const SYSTEM_ROLE_MUTATION_KEYS = {
  ASSIGN_MEMBERS: ['system-role', 'assign-members'] as const,
  CANCEL_MEMBER: ['system-role', 'cancel-member'] as const,
  CANCEL_MEMBERS: ['system-role', 'cancel-members'] as const,
  CREATE: ['system-role', 'create'] as const,
  DELETE: ['system-role', 'delete'] as const,
  UPDATE: ['system-role', 'update'] as const,
  UPDATE_DATA_SCOPE: ['system-role', 'update-data-scope'] as const,
  UPDATE_STATUS: ['system-role', 'update-status'] as const
} as const;

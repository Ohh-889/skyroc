import { request } from '../../request';

import type {
  RoleDataScopePayload,
  RoleDeptTreeResponse,
  RoleId,
  RoleItem,
  RoleListPage,
  RoleListParams,
  RoleMemberBatchParams,
  RoleMemberCancelPayload,
  RoleMemberListParams,
  RoleMemberPage,
  RoleMenuTreeResponse,
  RoleSavePayload,
  RoleStatusPayload,
  RoleTreeNode,
  RoleUpdatePayload
} from './types';
import { SYSTEM_ROLE_URLS } from './urls';

export function fetchRoleList(params: RoleListParams) {
  return request<RoleListPage>({ method: 'get', params, url: SYSTEM_ROLE_URLS.LIST });
}

export async function fetchAllRoles() {
  const firstPage = await fetchRoleList({ current: 1, size: 100 });
  const pageCount = Math.ceil(firstPage.total / firstPage.size);
  if (pageCount <= 1) return firstPage.records;

  const remainingPages = await Promise.all(
    Array.from({ length: pageCount - 1 }, (_, index) => fetchRoleList({ current: index + 2, size: 100 }))
  );
  return [firstPage, ...remainingPages].flatMap(page => page.records);
}

export function fetchRoleDetail(roleId: RoleId) {
  return request<RoleItem>({ method: 'get', url: SYSTEM_ROLE_URLS.DETAIL(roleId) });
}

export async function fetchRoleMenuTree(roleId?: RoleId): Promise<RoleMenuTreeResponse> {
  if (roleId === undefined) {
    const menus = await request<RoleTreeNode[]>({ method: 'get', url: SYSTEM_ROLE_URLS.MENU_TREE_CREATE });
    return { checkedKeys: [], menus };
  }
  return request<RoleMenuTreeResponse>({ method: 'get', url: SYSTEM_ROLE_URLS.MENU_TREE(roleId) });
}

export function fetchRoleDeptTree(roleId: RoleId) {
  return request<RoleDeptTreeResponse>({ method: 'get', url: SYSTEM_ROLE_URLS.DEPT_TREE(roleId) });
}

export function createRole(data: RoleSavePayload) {
  return request<null>({ data, method: 'post', url: SYSTEM_ROLE_URLS.CREATE });
}

export function updateRole(data: RoleUpdatePayload) {
  return request<null>({ data, method: 'put', url: SYSTEM_ROLE_URLS.UPDATE });
}

export function updateRoleStatus(data: RoleStatusPayload) {
  return request<null>({ data, method: 'put', url: SYSTEM_ROLE_URLS.CHANGE_STATUS });
}

export function updateRoleDataScope(data: RoleDataScopePayload) {
  return request<null>({ data, method: 'put', url: SYSTEM_ROLE_URLS.DATA_SCOPE });
}

export function deleteRoles(roleIds: RoleId[]) {
  return request<null>({ method: 'delete', url: SYSTEM_ROLE_URLS.DELETE(roleIds) });
}

export function fetchAllocatedRoleMembers(params: RoleMemberListParams) {
  return request<RoleMemberPage>({ method: 'get', params, url: SYSTEM_ROLE_URLS.ALLOCATED_MEMBERS });
}

export function fetchUnallocatedRoleMembers(params: RoleMemberListParams) {
  return request<RoleMemberPage>({ method: 'get', params, url: SYSTEM_ROLE_URLS.UNALLOCATED_MEMBERS });
}

export function cancelRoleMember(data: RoleMemberCancelPayload) {
  return request<null>({ data, method: 'put', url: SYSTEM_ROLE_URLS.CANCEL_MEMBER });
}

export function assignRoleMembers(params: RoleMemberBatchParams) {
  return request<null>({
    method: 'put',
    params: { roleId: params.roleId, userIds: params.userIds.map(String).join(',') },
    url: SYSTEM_ROLE_URLS.ASSIGN_MEMBERS
  });
}

export function cancelRoleMembers(params: RoleMemberBatchParams) {
  return request<null>({
    method: 'put',
    params: { roleId: params.roleId, userIds: params.userIds.map(String).join(',') },
    url: SYSTEM_ROLE_URLS.CANCEL_MEMBERS
  });
}

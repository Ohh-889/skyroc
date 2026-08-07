import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import type { QueryKey, UseQueryOptions } from '@tanstack/react-query';

import {
  assignRoleMembers,
  cancelRoleMember,
  cancelRoleMembers,
  createRole,
  deleteRoles,
  fetchAllRoles,
  fetchAllocatedRoleMembers,
  fetchRoleDeptTree,
  fetchRoleDetail,
  fetchRoleList,
  fetchRoleMenuTree,
  fetchUnallocatedRoleMembers,
  updateRole,
  updateRoleDataScope,
  updateRoleStatus
} from './api';
import { SYSTEM_ROLE_MUTATION_KEYS, SYSTEM_ROLE_QUERY_KEYS } from './keys';
import type {
  RoleDataScopePayload,
  RoleId,
  RoleListParams,
  RoleMemberBatchParams,
  RoleMemberCancelPayload,
  RoleMemberListParams,
  RoleSavePayload,
  RoleStatusPayload,
  RoleUpdatePayload
} from './types';

type RoleListQueryOptions<Data = Awaited<ReturnType<typeof fetchRoleList>>> = Omit<
  UseQueryOptions<Awaited<ReturnType<typeof fetchRoleList>>, Error, Data, QueryKey>,
  'queryFn' | 'queryKey'
>;

export function useRoleListQuery<Data = Awaited<ReturnType<typeof fetchRoleList>>>(
  params: RoleListParams,
  options?: RoleListQueryOptions<Data>
) {
  return useQuery({
    ...options,
    placeholderData: keepPreviousData,
    queryFn: () => fetchRoleList(params),
    queryKey: SYSTEM_ROLE_QUERY_KEYS.LIST(params)
  });
}

export function useRoleOverviewQuery() {
  return useQuery({
    queryFn: fetchAllRoles,
    queryKey: SYSTEM_ROLE_QUERY_KEYS.OVERVIEW,
    staleTime: 1000 * 30
  });
}

export function useRoleDetailQuery(roleId: RoleId | undefined, enabled = true) {
  return useQuery({
    enabled: enabled && Boolean(roleId),
    queryFn: () => fetchRoleDetail(roleId as RoleId),
    queryKey: SYSTEM_ROLE_QUERY_KEYS.DETAIL(roleId ?? 'none')
  });
}

export function useRoleMenuTreeQuery(roleId: RoleId | undefined, enabled = true) {
  return useQuery({
    enabled,
    queryFn: () => fetchRoleMenuTree(roleId),
    queryKey: SYSTEM_ROLE_QUERY_KEYS.MENU_TREE(roleId ?? 'create'),
    staleTime: roleId === undefined ? 1000 * 60 * 5 : 0
  });
}

export function useRoleDeptTreeQuery(roleId: RoleId | undefined, enabled = true) {
  return useQuery({
    enabled: enabled && Boolean(roleId),
    queryFn: () => fetchRoleDeptTree(roleId as RoleId),
    queryKey: SYSTEM_ROLE_QUERY_KEYS.DEPT_TREE(roleId ?? 'none')
  });
}

export function useAllocatedRoleMembersQuery(params: RoleMemberListParams, enabled = true) {
  return useQuery({
    enabled,
    placeholderData: keepPreviousData,
    queryFn: () => fetchAllocatedRoleMembers(params),
    queryKey: SYSTEM_ROLE_QUERY_KEYS.ALLOCATED_MEMBERS(params)
  });
}

export function useUnallocatedRoleMembersQuery(params: RoleMemberListParams, enabled = true) {
  return useQuery({
    enabled,
    placeholderData: keepPreviousData,
    queryFn: () => fetchUnallocatedRoleMembers(params),
    queryKey: SYSTEM_ROLE_QUERY_KEYS.UNALLOCATED_MEMBERS(params)
  });
}

export function useCreateRoleMutation() {
  return useMutation({
    mutationFn: (data: RoleSavePayload) => createRole(data),
    mutationKey: SYSTEM_ROLE_MUTATION_KEYS.CREATE
  });
}

export function useUpdateRoleMutation() {
  return useMutation({
    mutationFn: (data: RoleUpdatePayload) => updateRole(data),
    mutationKey: SYSTEM_ROLE_MUTATION_KEYS.UPDATE
  });
}

export function useUpdateRoleStatusMutation() {
  return useMutation({
    mutationFn: (data: RoleStatusPayload) => updateRoleStatus(data),
    mutationKey: SYSTEM_ROLE_MUTATION_KEYS.UPDATE_STATUS
  });
}

export function useUpdateRoleDataScopeMutation() {
  return useMutation({
    mutationFn: (data: RoleDataScopePayload) => updateRoleDataScope(data),
    mutationKey: SYSTEM_ROLE_MUTATION_KEYS.UPDATE_DATA_SCOPE
  });
}

export function useDeleteRolesMutation() {
  return useMutation({
    mutationFn: (roleIds: RoleId[]) => deleteRoles(roleIds),
    mutationKey: SYSTEM_ROLE_MUTATION_KEYS.DELETE
  });
}

export function useCancelRoleMemberMutation() {
  return useMutation({
    mutationFn: (data: RoleMemberCancelPayload) => cancelRoleMember(data),
    mutationKey: SYSTEM_ROLE_MUTATION_KEYS.CANCEL_MEMBER
  });
}

export function useAssignRoleMembersMutation() {
  return useMutation({
    mutationFn: (params: RoleMemberBatchParams) => assignRoleMembers(params),
    mutationKey: SYSTEM_ROLE_MUTATION_KEYS.ASSIGN_MEMBERS
  });
}

export function useCancelRoleMembersMutation() {
  return useMutation({
    mutationFn: (params: RoleMemberBatchParams) => cancelRoleMembers(params),
    mutationKey: SYSTEM_ROLE_MUTATION_KEYS.CANCEL_MEMBERS
  });
}

import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import type { QueryKey, UseQueryOptions } from '@tanstack/react-query';

import {
  createUser,
  deleteUsers,
  fetchDeptTree,
  fetchUserAuthRole,
  fetchUserDetail,
  fetchUserList,
  fetchUserPostOptions,
  fetchUsersByDept,
  resetUserPassword,
  updateUser,
  updateUserRoles,
  updateUserStatus
} from './api';
import { SYSTEM_USER_MUTATION_KEYS, SYSTEM_USER_QUERY_KEYS } from './keys';
import type {
  UserId,
  UserListParams,
  UserPasswordPayload,
  UserRolePayload,
  UserSavePayload,
  UserStatusPayload,
  UserUpdatePayload
} from './types';

type UserListQueryOptions<Data = Awaited<ReturnType<typeof fetchUserList>>> = Omit<
  UseQueryOptions<Awaited<ReturnType<typeof fetchUserList>>, Error, Data, QueryKey>,
  'queryFn' | 'queryKey'
>;

export function useUserListQuery<Data = Awaited<ReturnType<typeof fetchUserList>>>(
  params: UserListParams,
  options?: UserListQueryOptions<Data>
) {
  return useQuery({
    ...options,
    placeholderData: keepPreviousData,
    queryFn: () => fetchUserList(params),
    queryKey: SYSTEM_USER_QUERY_KEYS.USER_LIST(params)
  });
}

export function useUserDetailQuery(userId: UserId | undefined, enabled = true) {
  return useQuery({
    enabled,
    queryFn: () => fetchUserDetail(userId),
    queryKey: SYSTEM_USER_QUERY_KEYS.DETAIL(userId ?? 'create')
  });
}

export function useUserAuthRoleQuery(userId: UserId | undefined, enabled = true) {
  return useQuery({
    enabled: enabled && userId !== undefined,
    queryFn: () => fetchUserAuthRole(userId as UserId),
    queryKey: SYSTEM_USER_QUERY_KEYS.AUTH_ROLE(userId ?? 'none')
  });
}

export function useUserPostOptionsQuery(deptId: UserId | undefined, enabled = true) {
  return useQuery({
    enabled: enabled && deptId !== undefined,
    queryFn: () => fetchUserPostOptions(deptId as UserId),
    queryKey: SYSTEM_USER_QUERY_KEYS.POST_OPTIONS(deptId ?? 'none')
  });
}

export function useDeptTreeQuery() {
  return useQuery({
    queryFn: fetchDeptTree,
    queryKey: SYSTEM_USER_QUERY_KEYS.DEPT_TREE,
    staleTime: 1000 * 60 * 5
  });
}

export function useUsersByDeptQuery(deptId: UserId | undefined, enabled = true) {
  return useQuery({
    enabled: enabled && deptId !== undefined,
    queryFn: () => fetchUsersByDept(deptId as UserId),
    queryKey: SYSTEM_USER_QUERY_KEYS.LIST_BY_DEPT(deptId ?? 'none')
  });
}

export function useCreateUserMutation() {
  return useMutation({
    mutationFn: (data: UserSavePayload) => createUser(data),
    mutationKey: SYSTEM_USER_MUTATION_KEYS.CREATE
  });
}

export function useUpdateUserMutation() {
  return useMutation({
    mutationFn: (data: UserUpdatePayload) => updateUser(data),
    mutationKey: SYSTEM_USER_MUTATION_KEYS.UPDATE
  });
}

export function useDeleteUsersMutation() {
  return useMutation({
    mutationFn: (ids: UserId[]) => deleteUsers(ids),
    mutationKey: SYSTEM_USER_MUTATION_KEYS.DELETE
  });
}

export function useUpdateUserStatusMutation() {
  return useMutation({
    mutationFn: (data: UserStatusPayload) => updateUserStatus(data),
    mutationKey: SYSTEM_USER_MUTATION_KEYS.CHANGE_STATUS
  });
}

export function useResetUserPasswordMutation() {
  return useMutation({
    mutationFn: (data: UserPasswordPayload) => resetUserPassword(data),
    mutationKey: SYSTEM_USER_MUTATION_KEYS.RESET_PASSWORD
  });
}

export function useUpdateUserRolesMutation() {
  return useMutation({
    mutationFn: (data: UserRolePayload) => updateUserRoles(data),
    mutationKey: SYSTEM_USER_MUTATION_KEYS.AUTH_ROLE
  });
}

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { fetchDeptTree, fetchUserList, fetchUsersByDept } from './api';
import { SYSTEM_USER_QUERY_KEYS } from './keys';
import type { UserId, UserListParams } from './types';

export function useUserListQuery(params: UserListParams) {
  return useQuery({
    placeholderData: keepPreviousData,
    queryFn: () => fetchUserList(params),
    queryKey: SYSTEM_USER_QUERY_KEYS.USER_LIST(params)
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

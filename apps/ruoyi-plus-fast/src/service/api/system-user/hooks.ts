import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { fetchDeptTree, fetchUserList } from './api';
import { SYSTEM_USER_QUERY_KEYS } from './keys';
import type { UserListParams } from './types';

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

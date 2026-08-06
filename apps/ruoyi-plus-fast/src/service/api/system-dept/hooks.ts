import { useMutation, useQuery } from '@tanstack/react-query';
import type { QueryKey, UseQueryOptions } from '@tanstack/react-query';

import {
  createDept,
  deleteDept,
  fetchDeptDetail,
  fetchDeptList,
  fetchDeptListExcludingSubtree,
  updateDept
} from './api';
import { SYSTEM_DEPT_MUTATION_KEYS, SYSTEM_DEPT_QUERY_KEYS } from './keys';
import type { DeptId, DeptListParams, DeptSavePayload, DeptUpdatePayload } from './types';

type DeptListQueryOptions<Data = Awaited<ReturnType<typeof fetchDeptList>>> = Omit<
  UseQueryOptions<Awaited<ReturnType<typeof fetchDeptList>>, Error, Data, QueryKey>,
  'queryFn' | 'queryKey'
>;

export function useDeptListQuery<Data = Awaited<ReturnType<typeof fetchDeptList>>>(
  params: DeptListParams = {},
  options?: DeptListQueryOptions<Data>
) {
  return useQuery({
    ...options,
    queryFn: () => fetchDeptList(params),
    queryKey: SYSTEM_DEPT_QUERY_KEYS.LIST(params)
  });
}

export function useDeptDetailQuery(deptId: DeptId | undefined, enabled = true) {
  return useQuery({
    enabled: enabled && deptId !== undefined,
    queryFn: () => fetchDeptDetail(deptId as DeptId),
    queryKey: SYSTEM_DEPT_QUERY_KEYS.DETAIL(deptId ?? 'none')
  });
}

export function useDeptListExcludingSubtreeQuery(deptId: DeptId | undefined, enabled = true) {
  return useQuery({
    enabled: enabled && deptId !== undefined,
    queryFn: () => fetchDeptListExcludingSubtree(deptId as DeptId),
    queryKey: SYSTEM_DEPT_QUERY_KEYS.EXCLUDE_SUBTREE(deptId ?? 'none')
  });
}

export function useCreateDeptMutation() {
  return useMutation({
    mutationFn: (data: DeptSavePayload) => createDept(data),
    mutationKey: SYSTEM_DEPT_MUTATION_KEYS.CREATE
  });
}

export function useUpdateDeptMutation() {
  return useMutation({
    mutationFn: (data: DeptUpdatePayload) => updateDept(data),
    mutationKey: SYSTEM_DEPT_MUTATION_KEYS.UPDATE
  });
}

export function useDeleteDeptMutation() {
  return useMutation({
    mutationFn: (deptId: DeptId) => deleteDept(deptId),
    mutationKey: SYSTEM_DEPT_MUTATION_KEYS.DELETE
  });
}

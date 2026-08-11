import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import type { QueryKey, UseQueryOptions } from '@tanstack/react-query';

import {
  createTenantPackage,
  deleteTenantPackages,
  exportTenantPackages,
  fetchTenantPackageDetail,
  fetchTenantPackageList,
  fetchTenantPackageMenuTree,
  fetchTenantPackageOptions,
  updateTenantPackage,
  updateTenantPackageStatus
} from './api';
import { SYSTEM_TENANT_PACKAGE_MUTATION_KEYS, SYSTEM_TENANT_PACKAGE_QUERY_KEYS } from './keys';
import type {
  TenantPackageId,
  TenantPackageListParams,
  TenantPackageSavePayload,
  TenantPackageStatusPayload,
  TenantPackageUpdatePayload
} from './types';

type TenantPackageListOptions<Data = Awaited<ReturnType<typeof fetchTenantPackageList>>> = Omit<
  UseQueryOptions<Awaited<ReturnType<typeof fetchTenantPackageList>>, Error, Data, QueryKey>,
  'queryFn' | 'queryKey'
>;

export function useTenantPackageListQuery<Data = Awaited<ReturnType<typeof fetchTenantPackageList>>>(
  params: TenantPackageListParams,
  options?: TenantPackageListOptions<Data>
) {
  return useQuery({
    ...options,
    placeholderData: keepPreviousData,
    queryFn: () => fetchTenantPackageList(params),
    queryKey: SYSTEM_TENANT_PACKAGE_QUERY_KEYS.LIST(params)
  });
}

export function useTenantPackageOptionsQuery(enabled = true) {
  return useQuery({
    enabled,
    queryFn: fetchTenantPackageOptions,
    queryKey: SYSTEM_TENANT_PACKAGE_QUERY_KEYS.SELECT_LIST
  });
}

/** 新增时不传 packageId，退回 0：后端用它区分"只要树"和"树加已勾选项"。 */
export function useTenantPackageMenuTreeQuery(packageId: TenantPackageId | undefined, enabled = true) {
  const treeId = packageId ?? 0;

  return useQuery({
    enabled,
    queryFn: () => fetchTenantPackageMenuTree(treeId),
    queryKey: SYSTEM_TENANT_PACKAGE_QUERY_KEYS.MENU_TREE(treeId)
  });
}

export function useTenantPackageDetailQuery(id: TenantPackageId | undefined, enabled = true) {
  return useQuery({
    enabled: enabled && Boolean(id),
    queryFn: () => fetchTenantPackageDetail(id as TenantPackageId),
    queryKey: SYSTEM_TENANT_PACKAGE_QUERY_KEYS.DETAIL(id ?? 'none')
  });
}

export function useCreateTenantPackageMutation() {
  return useMutation({
    mutationFn: (data: TenantPackageSavePayload) => createTenantPackage(data),
    mutationKey: SYSTEM_TENANT_PACKAGE_MUTATION_KEYS.CREATE
  });
}

export function useUpdateTenantPackageMutation() {
  return useMutation({
    mutationFn: (data: TenantPackageUpdatePayload) => updateTenantPackage(data),
    mutationKey: SYSTEM_TENANT_PACKAGE_MUTATION_KEYS.UPDATE
  });
}

export function useUpdateTenantPackageStatusMutation() {
  return useMutation({
    mutationFn: (data: TenantPackageStatusPayload) => updateTenantPackageStatus(data),
    mutationKey: SYSTEM_TENANT_PACKAGE_MUTATION_KEYS.UPDATE_STATUS
  });
}

export function useDeleteTenantPackagesMutation() {
  return useMutation({
    mutationFn: (ids: TenantPackageId[]) => deleteTenantPackages(ids),
    mutationKey: SYSTEM_TENANT_PACKAGE_MUTATION_KEYS.DELETE
  });
}

export { exportTenantPackages };

import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import type { QueryKey, UseQueryOptions } from '@tanstack/react-query';

import {
  clearDynamicTenant,
  createTenant,
  deleteTenants,
  exportTenants,
  fetchTenantDetail,
  fetchTenantList,
  switchDynamicTenant,
  syncTenantConfig,
  syncTenantDict,
  syncTenantPackage,
  updateTenant,
  updateTenantStatus
} from './api';
import { SYSTEM_TENANT_MUTATION_KEYS, SYSTEM_TENANT_QUERY_KEYS } from './keys';
import type {
  SyncTenantPackageParams,
  TenantId,
  TenantListParams,
  TenantSavePayload,
  TenantStatusPayload,
  TenantUpdatePayload
} from './types';

type TenantListOptions<Data = Awaited<ReturnType<typeof fetchTenantList>>> = Omit<
  UseQueryOptions<Awaited<ReturnType<typeof fetchTenantList>>, Error, Data, QueryKey>,
  'queryFn' | 'queryKey'
>;

export function useTenantListQuery<Data = Awaited<ReturnType<typeof fetchTenantList>>>(
  params: TenantListParams,
  options?: TenantListOptions<Data>
) {
  return useQuery({
    ...options,
    placeholderData: keepPreviousData,
    queryFn: () => fetchTenantList(params),
    queryKey: SYSTEM_TENANT_QUERY_KEYS.LIST(params)
  });
}

export function useTenantDetailQuery(id: TenantId | undefined, enabled = true) {
  return useQuery({
    enabled: enabled && Boolean(id),
    queryFn: () => fetchTenantDetail(id as TenantId),
    queryKey: SYSTEM_TENANT_QUERY_KEYS.DETAIL(id ?? 'none')
  });
}

export function useCreateTenantMutation() {
  return useMutation({
    mutationFn: (data: TenantSavePayload) => createTenant(data),
    mutationKey: SYSTEM_TENANT_MUTATION_KEYS.CREATE
  });
}

export function useUpdateTenantMutation() {
  return useMutation({
    mutationFn: (data: TenantUpdatePayload) => updateTenant(data),
    mutationKey: SYSTEM_TENANT_MUTATION_KEYS.UPDATE
  });
}

export function useUpdateTenantStatusMutation() {
  return useMutation({
    mutationFn: (data: TenantStatusPayload) => updateTenantStatus(data),
    mutationKey: SYSTEM_TENANT_MUTATION_KEYS.UPDATE_STATUS
  });
}

export function useDeleteTenantsMutation() {
  return useMutation({
    mutationFn: (ids: TenantId[]) => deleteTenants(ids),
    mutationKey: SYSTEM_TENANT_MUTATION_KEYS.DELETE
  });
}

export function useSwitchDynamicTenantMutation() {
  return useMutation({
    mutationFn: (tenantId: string) => switchDynamicTenant(tenantId),
    mutationKey: SYSTEM_TENANT_MUTATION_KEYS.SWITCH_DYNAMIC
  });
}

export function useClearDynamicTenantMutation() {
  return useMutation({ mutationFn: clearDynamicTenant, mutationKey: SYSTEM_TENANT_MUTATION_KEYS.CLEAR_DYNAMIC });
}

export function useSyncTenantPackageMutation() {
  return useMutation({
    mutationFn: (params: SyncTenantPackageParams) => syncTenantPackage(params),
    mutationKey: SYSTEM_TENANT_MUTATION_KEYS.SYNC_PACKAGE
  });
}

export function useSyncTenantDictMutation() {
  return useMutation({ mutationFn: syncTenantDict, mutationKey: SYSTEM_TENANT_MUTATION_KEYS.SYNC_DICT });
}

export function useSyncTenantConfigMutation() {
  return useMutation({ mutationFn: syncTenantConfig, mutationKey: SYSTEM_TENANT_MUTATION_KEYS.SYNC_CONFIG });
}

export { exportTenants };

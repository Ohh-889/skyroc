import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import type { QueryKey, UseQueryOptions } from '@tanstack/react-query';
import {
  createConfig,
  deleteConfigs,
  exportConfigs,
  fetchConfigDetail,
  fetchConfigList,
  refreshConfigCache,
  updateConfig
} from './api';
import { SYSTEM_CONFIG_MUTATION_KEYS, SYSTEM_CONFIG_QUERY_KEYS } from './keys';
import type { ConfigId, ConfigListParams, ConfigSavePayload, ConfigUpdatePayload } from './types';
type ConfigListOptions<Data = Awaited<ReturnType<typeof fetchConfigList>>> = Omit<
  UseQueryOptions<Awaited<ReturnType<typeof fetchConfigList>>, Error, Data, QueryKey>,
  'queryFn' | 'queryKey'
>;
export function useConfigListQuery<Data = Awaited<ReturnType<typeof fetchConfigList>>>(
  params: ConfigListParams,
  options?: ConfigListOptions<Data>
) {
  return useQuery({
    ...options,
    placeholderData: keepPreviousData,
    queryFn: () => fetchConfigList(params),
    queryKey: SYSTEM_CONFIG_QUERY_KEYS.LIST(params)
  });
}
export function useConfigDetailQuery(id: ConfigId | undefined, enabled = true) {
  return useQuery({
    enabled: enabled && Boolean(id),
    queryFn: () => fetchConfigDetail(id as ConfigId),
    queryKey: SYSTEM_CONFIG_QUERY_KEYS.DETAIL(id ?? 'none')
  });
}
export function useCreateConfigMutation() {
  return useMutation({
    mutationFn: (data: ConfigSavePayload) => createConfig(data),
    mutationKey: SYSTEM_CONFIG_MUTATION_KEYS.CREATE
  });
}
export function useUpdateConfigMutation() {
  return useMutation({
    mutationFn: (data: ConfigUpdatePayload) => updateConfig(data),
    mutationKey: SYSTEM_CONFIG_MUTATION_KEYS.UPDATE
  });
}
export function useDeleteConfigsMutation() {
  return useMutation({
    mutationFn: (ids: ConfigId[]) => deleteConfigs(ids),
    mutationKey: SYSTEM_CONFIG_MUTATION_KEYS.DELETE
  });
}
export function useRefreshConfigCacheMutation() {
  return useMutation({ mutationFn: refreshConfigCache, mutationKey: SYSTEM_CONFIG_MUTATION_KEYS.REFRESH_CACHE });
}
export { exportConfigs };

import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import type { QueryKey, UseQueryOptions } from '@tanstack/react-query';

import {
  createOssConfig,
  deleteOssConfigs,
  fetchOssConfigDetail,
  fetchOssConfigList,
  updateOssConfig,
  updateOssConfigStatus
} from './api';
import { SYSTEM_OSS_CONFIG_MUTATION_KEYS, SYSTEM_OSS_CONFIG_QUERY_KEYS } from './keys';
import type {
  OssConfigId,
  OssConfigListParams,
  OssConfigSavePayload,
  OssConfigStatusPayload,
  OssConfigUpdatePayload
} from './types';

type OssConfigListOptions<Data = Awaited<ReturnType<typeof fetchOssConfigList>>> = Omit<
  UseQueryOptions<Awaited<ReturnType<typeof fetchOssConfigList>>, Error, Data, QueryKey>,
  'queryFn' | 'queryKey'
>;

export function useOssConfigListQuery<Data = Awaited<ReturnType<typeof fetchOssConfigList>>>(
  params: OssConfigListParams,
  options?: OssConfigListOptions<Data>
) {
  return useQuery({
    ...options,
    placeholderData: keepPreviousData,
    queryFn: () => fetchOssConfigList(params),
    queryKey: SYSTEM_OSS_CONFIG_QUERY_KEYS.LIST(params)
  });
}

export function useOssConfigDetailQuery(id: OssConfigId | undefined, enabled = true) {
  return useQuery({
    enabled: enabled && Boolean(id),
    queryFn: () => fetchOssConfigDetail(id as OssConfigId),
    queryKey: SYSTEM_OSS_CONFIG_QUERY_KEYS.DETAIL(id ?? 'none')
  });
}

export function useCreateOssConfigMutation() {
  return useMutation({
    mutationFn: (data: OssConfigSavePayload) => createOssConfig(data),
    mutationKey: SYSTEM_OSS_CONFIG_MUTATION_KEYS.CREATE
  });
}

export function useUpdateOssConfigMutation() {
  return useMutation({
    mutationFn: (data: OssConfigUpdatePayload) => updateOssConfig(data),
    mutationKey: SYSTEM_OSS_CONFIG_MUTATION_KEYS.UPDATE
  });
}

export function useUpdateOssConfigStatusMutation() {
  return useMutation({
    mutationFn: (data: OssConfigStatusPayload) => updateOssConfigStatus(data),
    mutationKey: SYSTEM_OSS_CONFIG_MUTATION_KEYS.UPDATE_STATUS
  });
}

export function useDeleteOssConfigsMutation() {
  return useMutation({
    mutationFn: (ids: OssConfigId[]) => deleteOssConfigs(ids),
    mutationKey: SYSTEM_OSS_CONFIG_MUTATION_KEYS.DELETE
  });
}

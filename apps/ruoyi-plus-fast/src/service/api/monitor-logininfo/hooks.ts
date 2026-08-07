import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import type { QueryKey, UseQueryOptions } from '@tanstack/react-query';

import { cleanLoginInfos, deleteLoginInfos, fetchLoginInfoList, unlockLoginInfo } from './api';
import { MONITOR_LOGININFO_MUTATION_KEYS, MONITOR_LOGININFO_QUERY_KEYS } from './keys';
import type { LoginInfoId, LoginInfoListParams } from './types';

type LoginInfoListQueryOptions<Data = Awaited<ReturnType<typeof fetchLoginInfoList>>> = Omit<
  UseQueryOptions<Awaited<ReturnType<typeof fetchLoginInfoList>>, Error, Data, QueryKey>,
  'queryFn' | 'queryKey'
>;

export function useLoginInfoListQuery<Data = Awaited<ReturnType<typeof fetchLoginInfoList>>>(
  params: LoginInfoListParams,
  options?: LoginInfoListQueryOptions<Data>
) {
  return useQuery({
    ...options,
    placeholderData: keepPreviousData,
    queryFn: () => fetchLoginInfoList(params),
    queryKey: MONITOR_LOGININFO_QUERY_KEYS.LIST(params)
  });
}

export function useDeleteLoginInfosMutation() {
  return useMutation({
    mutationFn: (infoIds: LoginInfoId[]) => deleteLoginInfos(infoIds),
    mutationKey: MONITOR_LOGININFO_MUTATION_KEYS.DELETE
  });
}

export function useCleanLoginInfosMutation() {
  return useMutation({ mutationFn: cleanLoginInfos, mutationKey: MONITOR_LOGININFO_MUTATION_KEYS.CLEAN });
}

export function useUnlockLoginInfoMutation() {
  return useMutation({ mutationFn: unlockLoginInfo, mutationKey: MONITOR_LOGININFO_MUTATION_KEYS.UNLOCK });
}

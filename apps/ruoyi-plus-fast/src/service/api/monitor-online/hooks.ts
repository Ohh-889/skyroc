import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import type { QueryKey, UseQueryOptions } from '@tanstack/react-query';

import { fetchOnlineSessionList, forceLogoutSession } from './api';
import { MONITOR_ONLINE_MUTATION_KEYS, MONITOR_ONLINE_QUERY_KEYS } from './keys';
import type { OnlineSessionListParams } from './types';

type OnlineSessionListQueryOptions<Data = Awaited<ReturnType<typeof fetchOnlineSessionList>>> = Omit<
  UseQueryOptions<Awaited<ReturnType<typeof fetchOnlineSessionList>>, Error, Data, QueryKey>,
  'queryFn' | 'queryKey'
>;

export function useOnlineSessionListQuery<Data = Awaited<ReturnType<typeof fetchOnlineSessionList>>>(
  params: OnlineSessionListParams,
  options?: OnlineSessionListQueryOptions<Data>
) {
  return useQuery({
    ...options,
    placeholderData: keepPreviousData,
    queryFn: () => fetchOnlineSessionList(params),
    queryKey: MONITOR_ONLINE_QUERY_KEYS.LIST(params)
  });
}

export function useForceLogoutSessionMutation() {
  return useMutation({
    mutationFn: (tokenId: string) => forceLogoutSession(tokenId),
    mutationKey: MONITOR_ONLINE_MUTATION_KEYS.FORCE_LOGOUT
  });
}

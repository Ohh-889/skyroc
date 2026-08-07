import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import type { QueryKey, UseQueryOptions } from '@tanstack/react-query';
import {
  createClient,
  deleteClients,
  fetchClientDetail,
  fetchClientList,
  updateClient,
  updateClientStatus
} from './api';
import { SYSTEM_CLIENT_MUTATION_KEYS, SYSTEM_CLIENT_QUERY_KEYS } from './keys';
import type {
  ClientId,
  ClientListParams,
  ClientSavePayload,
  ClientStatusPayload,
  ClientUpdatePayload
} from './types';

type ClientListOptions<Data = Awaited<ReturnType<typeof fetchClientList>>> = Omit<
  UseQueryOptions<Awaited<ReturnType<typeof fetchClientList>>, Error, Data, QueryKey>,
  'queryFn' | 'queryKey'
>;

export function useClientListQuery<Data = Awaited<ReturnType<typeof fetchClientList>>>(
  params: ClientListParams,
  options?: ClientListOptions<Data>
) {
  return useQuery({
    ...options,
    placeholderData: keepPreviousData,
    queryFn: () => fetchClientList(params),
    queryKey: SYSTEM_CLIENT_QUERY_KEYS.LIST(params)
  });
}

export function useClientDetailQuery(id: ClientId | undefined, enabled = true) {
  return useQuery({
    enabled: enabled && Boolean(id),
    queryFn: () => fetchClientDetail(id as ClientId),
    queryKey: SYSTEM_CLIENT_QUERY_KEYS.DETAIL(id ?? 'none')
  });
}

export function useCreateClientMutation() {
  return useMutation({
    mutationFn: (data: ClientSavePayload) => createClient(data),
    mutationKey: SYSTEM_CLIENT_MUTATION_KEYS.CREATE
  });
}

export function useUpdateClientMutation() {
  return useMutation({
    mutationFn: (data: ClientUpdatePayload) => updateClient(data),
    mutationKey: SYSTEM_CLIENT_MUTATION_KEYS.UPDATE
  });
}

export function useUpdateClientStatusMutation() {
  return useMutation({
    mutationFn: (data: ClientStatusPayload) => updateClientStatus(data),
    mutationKey: SYSTEM_CLIENT_MUTATION_KEYS.UPDATE_STATUS
  });
}

export function useDeleteClientsMutation() {
  return useMutation({
    mutationFn: (ids: ClientId[]) => deleteClients(ids),
    mutationKey: SYSTEM_CLIENT_MUTATION_KEYS.DELETE
  });
}

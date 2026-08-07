import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import type { QueryKey, UseQueryOptions } from '@tanstack/react-query';

import { cleanOperLogs, deleteOperLogs, fetchOperLogList } from './api';
import { MONITOR_OPERLOG_MUTATION_KEYS, MONITOR_OPERLOG_QUERY_KEYS } from './keys';
import type { OperLogId, OperLogListParams } from './types';

type OperLogListQueryOptions<Data = Awaited<ReturnType<typeof fetchOperLogList>>> = Omit<
  UseQueryOptions<Awaited<ReturnType<typeof fetchOperLogList>>, Error, Data, QueryKey>,
  'queryFn' | 'queryKey'
>;

export function useOperLogListQuery<Data = Awaited<ReturnType<typeof fetchOperLogList>>>(
  params: OperLogListParams,
  options?: OperLogListQueryOptions<Data>
) {
  return useQuery({
    ...options,
    placeholderData: keepPreviousData,
    queryFn: () => fetchOperLogList(params),
    queryKey: MONITOR_OPERLOG_QUERY_KEYS.LIST(params)
  });
}

export function useDeleteOperLogsMutation() {
  return useMutation({
    mutationFn: (operIds: OperLogId[]) => deleteOperLogs(operIds),
    mutationKey: MONITOR_OPERLOG_MUTATION_KEYS.DELETE
  });
}

export function useCleanOperLogsMutation() {
  return useMutation({
    mutationFn: cleanOperLogs,
    mutationKey: MONITOR_OPERLOG_MUTATION_KEYS.CLEAN
  });
}

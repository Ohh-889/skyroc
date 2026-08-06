import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import type { QueryKey, UseQueryOptions } from '@tanstack/react-query';
import {
  createDictData,
  createDictType,
  deleteDictData,
  deleteDictTypes,
  fetchDictData,
  fetchDictDataDetail,
  fetchDictType,
  fetchDictTypeOptions,
  fetchDictTypes,
  refreshDictCache,
  updateDictData,
  updateDictType
} from './api';
import { SYSTEM_DICT_QUERY_KEYS } from './keys';
import type {
  DictDataItem,
  DictDataListParams,
  DictDataSavePayload,
  DictDataUpdatePayload,
  DictId,
  DictListPage,
  DictTypeItem,
  DictTypeListParams,
  DictTypeSavePayload,
  DictTypeUpdatePayload
} from './types';

type DictTypeQueryOptions<Data> = Omit<
  UseQueryOptions<DictListPage<DictTypeItem>, Error, Data, QueryKey>,
  'queryFn' | 'queryKey'
>;
type DictDataQueryOptions<Data> = Omit<
  UseQueryOptions<DictListPage<DictDataItem>, Error, Data, QueryKey>,
  'queryFn' | 'queryKey'
>;

export function useDictTypesQuery<Data = Awaited<ReturnType<typeof fetchDictTypes>>>(
  params: DictTypeListParams,
  options?: DictTypeQueryOptions<Data>
) {
  return useQuery({
    ...options,
    placeholderData: keepPreviousData,
    queryFn: () => fetchDictTypes(params),
    queryKey: SYSTEM_DICT_QUERY_KEYS.TYPES(params)
  });
}

export function useDictTypeOptionsQuery() {
  return useQuery({
    queryFn: fetchDictTypeOptions,
    queryKey: SYSTEM_DICT_QUERY_KEYS.TYPE_OPTIONS,
    staleTime: 300000
  });
}

export function useDictTypeQuery(id: DictId | undefined, enabled = true) {
  return useQuery({
    enabled: enabled && id !== undefined,
    queryFn: () => fetchDictType(id as DictId),
    queryKey: SYSTEM_DICT_QUERY_KEYS.DETAIL(id ?? 'none')
  });
}

export function useDictDataQuery<Data = Awaited<ReturnType<typeof fetchDictData>>>(
  params: DictDataListParams,
  options?: DictDataQueryOptions<Data>
) {
  return useQuery({
    ...options,
    placeholderData: keepPreviousData,
    queryFn: () => fetchDictData(params),
    queryKey: SYSTEM_DICT_QUERY_KEYS.DATA(params)
  });
}

export function useDictDataDetailQuery(id: DictId | undefined, enabled = true) {
  return useQuery({
    enabled: enabled && id !== undefined,
    queryFn: () => fetchDictDataDetail(id as DictId),
    queryKey: SYSTEM_DICT_QUERY_KEYS.DETAIL(id ?? 'none')
  });
}

export function useCreateDictTypeMutation() {
  return useMutation({
    mutationFn: (data: DictTypeSavePayload) => createDictType(data)
  });
}

export function useUpdateDictTypeMutation() {
  return useMutation({
    mutationFn: (data: DictTypeUpdatePayload) => updateDictType(data)
  });
}

export function useDeleteDictTypesMutation() {
  return useMutation({
    mutationFn: (ids: DictId[]) => deleteDictTypes(ids)
  });
}

export function useCreateDictDataMutation() {
  return useMutation({
    mutationFn: (data: DictDataSavePayload) => createDictData(data)
  });
}

export function useUpdateDictDataMutation() {
  return useMutation({
    mutationFn: (data: DictDataUpdatePayload) => updateDictData(data)
  });
}

export function useDeleteDictDataMutation() {
  return useMutation({
    mutationFn: (ids: DictId[]) => deleteDictData(ids)
  });
}

export function useRefreshDictCacheMutation() {
  return useMutation({
    mutationFn: refreshDictCache
  });
}

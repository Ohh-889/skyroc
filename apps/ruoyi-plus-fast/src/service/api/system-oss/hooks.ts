import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import type { QueryKey, UseQueryOptions } from '@tanstack/react-query';

import { deleteOssFiles, downloadOssFile, fetchOssList, fetchOssListByIds, uploadOssFile } from './api';
import { SYSTEM_OSS_MUTATION_KEYS, SYSTEM_OSS_QUERY_KEYS } from './keys';
import type { OssId, OssListParams } from './types';

type OssListOptions<Data = Awaited<ReturnType<typeof fetchOssList>>> = Omit<
  UseQueryOptions<Awaited<ReturnType<typeof fetchOssList>>, Error, Data, QueryKey>,
  'queryFn' | 'queryKey'
>;

export function useOssListQuery<Data = Awaited<ReturnType<typeof fetchOssList>>>(
  params: OssListParams,
  options?: OssListOptions<Data>
) {
  return useQuery({
    ...options,
    placeholderData: keepPreviousData,
    queryFn: () => fetchOssList(params),
    queryKey: SYSTEM_OSS_QUERY_KEYS.LIST(params)
  });
}

export function useOssListByIdsQuery(ids: OssId[], enabled = true) {
  return useQuery({
    enabled: enabled && ids.length > 0,
    queryFn: () => fetchOssListByIds(ids),
    queryKey: SYSTEM_OSS_QUERY_KEYS.BY_IDS(ids)
  });
}

export function useUploadOssFileMutation() {
  return useMutation({
    mutationFn: (file: File) => uploadOssFile(file),
    mutationKey: SYSTEM_OSS_MUTATION_KEYS.UPLOAD
  });
}

export function useDeleteOssFilesMutation() {
  return useMutation({
    mutationFn: (ids: OssId[]) => deleteOssFiles(ids),
    mutationKey: SYSTEM_OSS_MUTATION_KEYS.DELETE
  });
}

export { downloadOssFile };

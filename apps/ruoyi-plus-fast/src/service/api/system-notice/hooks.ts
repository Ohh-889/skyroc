import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import type { QueryKey, UseQueryOptions } from '@tanstack/react-query';

import { createNotice, deleteNotices, fetchNoticeDetail, fetchNoticeList, updateNotice } from './api';
import { SYSTEM_NOTICE_MUTATION_KEYS, SYSTEM_NOTICE_QUERY_KEYS } from './keys';
import type { NoticeId, NoticeListParams, NoticeSavePayload, NoticeUpdatePayload } from './types';

type NoticeListQueryOptions<Data = Awaited<ReturnType<typeof fetchNoticeList>>> = Omit<
  UseQueryOptions<Awaited<ReturnType<typeof fetchNoticeList>>, Error, Data, QueryKey>,
  'queryFn' | 'queryKey'
>;

export function useNoticeListQuery<Data = Awaited<ReturnType<typeof fetchNoticeList>>>(
  params: NoticeListParams,
  options?: NoticeListQueryOptions<Data>
) {
  return useQuery({
    ...options,
    placeholderData: keepPreviousData,
    queryFn: () => fetchNoticeList(params),
    queryKey: SYSTEM_NOTICE_QUERY_KEYS.LIST(params)
  });
}

export function useNoticeDetailQuery(noticeId: NoticeId | undefined, enabled = true) {
  return useQuery({
    enabled: enabled && Boolean(noticeId),
    queryFn: () => fetchNoticeDetail(noticeId as NoticeId),
    queryKey: SYSTEM_NOTICE_QUERY_KEYS.DETAIL(noticeId ?? 'none')
  });
}

export function useCreateNoticeMutation() {
  return useMutation({
    mutationFn: (data: NoticeSavePayload) => createNotice(data),
    mutationKey: SYSTEM_NOTICE_MUTATION_KEYS.CREATE
  });
}

export function useUpdateNoticeMutation() {
  return useMutation({
    mutationFn: (data: NoticeUpdatePayload) => updateNotice(data),
    mutationKey: SYSTEM_NOTICE_MUTATION_KEYS.UPDATE
  });
}

export function useDeleteNoticesMutation() {
  return useMutation({
    mutationFn: (noticeIds: NoticeId[]) => deleteNotices(noticeIds),
    mutationKey: SYSTEM_NOTICE_MUTATION_KEYS.DELETE
  });
}

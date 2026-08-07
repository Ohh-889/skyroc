import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import type { QueryKey, UseQueryOptions } from '@tanstack/react-query';

import { createPost, deletePosts, fetchPostDeptTree, fetchPostDetail, fetchPostList, updatePost } from './api';
import { SYSTEM_POST_MUTATION_KEYS, SYSTEM_POST_QUERY_KEYS } from './keys';
import type { PostId, PostListParams, PostSavePayload, PostUpdatePayload } from './types';

type PostListQueryOptions<Data = Awaited<ReturnType<typeof fetchPostList>>> = Omit<
  UseQueryOptions<Awaited<ReturnType<typeof fetchPostList>>, Error, Data, QueryKey>,
  'queryFn' | 'queryKey'
>;

export function usePostListQuery<Data = Awaited<ReturnType<typeof fetchPostList>>>(
  params: PostListParams,
  options?: PostListQueryOptions<Data>
) {
  return useQuery({
    ...options,
    placeholderData: keepPreviousData,
    queryFn: () => fetchPostList(params),
    queryKey: SYSTEM_POST_QUERY_KEYS.LIST(params)
  });
}

export function usePostDeptTreeQuery() {
  return useQuery({
    queryFn: fetchPostDeptTree,
    queryKey: SYSTEM_POST_QUERY_KEYS.DEPT_TREE,
    staleTime: 1000 * 60 * 5
  });
}

export function usePostDetailQuery(postId: PostId | undefined, enabled = true) {
  return useQuery({
    enabled: enabled && Boolean(postId),
    queryFn: () => fetchPostDetail(postId as PostId),
    queryKey: SYSTEM_POST_QUERY_KEYS.DETAIL(postId ?? 'none')
  });
}

export function useCreatePostMutation() {
  return useMutation({
    mutationFn: (data: PostSavePayload) => createPost(data),
    mutationKey: SYSTEM_POST_MUTATION_KEYS.CREATE
  });
}

export function useUpdatePostMutation() {
  return useMutation({
    mutationFn: (data: PostUpdatePayload) => updatePost(data),
    mutationKey: SYSTEM_POST_MUTATION_KEYS.UPDATE
  });
}

export function useDeletePostsMutation() {
  return useMutation({
    mutationFn: (postIds: PostId[]) => deletePosts(postIds),
    mutationKey: SYSTEM_POST_MUTATION_KEYS.DELETE
  });
}

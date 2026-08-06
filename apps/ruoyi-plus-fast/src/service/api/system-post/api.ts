import { request } from '../../request';

import type {
  PostDeptTreeNode,
  PostId,
  PostItem,
  PostListPage,
  PostListParams,
  PostSavePayload,
  PostUpdatePayload
} from './types';
import { SYSTEM_POST_URLS } from './urls';

export function fetchPostList(params: PostListParams) {
  return request<PostListPage>({
    method: 'get',
    params,
    url: SYSTEM_POST_URLS.LIST
  });
}

export function fetchPostDeptTree() {
  return request<PostDeptTreeNode[]>({
    method: 'get',
    url: SYSTEM_POST_URLS.DEPT_TREE
  });
}

export function fetchPostDetail(postId: PostId) {
  return request<PostItem>({
    method: 'get',
    url: SYSTEM_POST_URLS.DETAIL(postId)
  });
}

export function createPost(data: PostSavePayload) {
  return request<PostItem>({
    data,
    method: 'post',
    url: SYSTEM_POST_URLS.CREATE
  });
}

export function updatePost(data: PostUpdatePayload) {
  return request<PostItem>({
    data,
    method: 'put',
    url: SYSTEM_POST_URLS.UPDATE
  });
}

export function deletePosts(postIds: PostId[]) {
  return request<null>({
    method: 'delete',
    url: SYSTEM_POST_URLS.DELETE(postIds)
  });
}

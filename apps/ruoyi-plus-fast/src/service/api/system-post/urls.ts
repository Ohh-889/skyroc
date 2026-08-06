import type { PostId } from './types';

export const SYSTEM_POST_URLS = {
  CREATE: '/system/post',
  DELETE: (postIds: PostId[]) => `/system/post/${postIds.map(String).join(',')}`,
  DEPT_TREE: '/system/post/deptTree',
  DETAIL: (postId: PostId) => `/system/post/${postId}`,
  LIST: '/system/post/list',
  UPDATE: '/system/post'
} as const;

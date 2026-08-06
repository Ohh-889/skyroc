import type { PostId, PostListParams } from './types';

export const SYSTEM_POST_QUERY_KEYS = {
  ALL: ['system-post'] as const,
  DEPT_TREE: ['system-post', 'dept-tree'] as const,
  DETAIL: (postId: PostId) => ['system-post', 'detail', String(postId)] as const,
  LIST: (params: PostListParams) => ['system-post', 'list', params] as const,
  LISTS: ['system-post', 'list'] as const
} as const;

export const SYSTEM_POST_MUTATION_KEYS = {
  CREATE: ['system-post', 'create'] as const,
  DELETE: ['system-post', 'delete'] as const,
  UPDATE: ['system-post', 'update'] as const
} as const;

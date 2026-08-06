export type PostId = number | string;

export type PostStatus = '0' | '1';

export interface PostItem {
  createTime: null | string;
  deptId: PostId;
  deptName: string;
  postCategory: null | string;
  postCode: string;
  postId: PostId;
  postName: string;
  postSort: number;
  remark: null | string;
  status: PostStatus;
}

export interface PostListPage {
  current: number;
  records: PostItem[];
  size: number;
  total: number;
}

export interface PostListParams {
  beginTime?: string;
  belongDeptId?: PostId;
  current: number;
  deptId?: PostId;
  endTime?: string;
  isAsc?: 'asc' | 'desc';
  orderByColumn?: 'createTime' | 'postSort';
  postCategory?: string;
  postCode?: string;
  postName?: string;
  size: number;
  status?: PostStatus;
}

export interface PostSavePayload {
  deptId: PostId;
  postCategory?: null | string;
  postCode: string;
  postName: string;
  postSort: number;
  remark?: null | string;
  status: PostStatus;
}

export interface PostUpdatePayload extends PostSavePayload {
  postId: PostId;
}

export interface PostDeptTreeNode {
  children?: PostDeptTreeNode[];
  disabled: boolean;
  id: PostId;
  label: string;
  parentId: PostId;
  weight: number;
}

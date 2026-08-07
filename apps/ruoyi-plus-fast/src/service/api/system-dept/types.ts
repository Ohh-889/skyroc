export type DeptId = number | string;

export type DeptStatus = '0' | '1';

export interface DeptListParams {
  deptCategory?: string;
  deptName?: string;
  status?: DeptStatus;
}

export interface DeptOptionParams {
  deptIds?: DeptId[];
}

export interface DeptItem {
  ancestors: string;
  children: DeptItem[];
  createTime: null | string;
  deptCategory: null | string;
  deptId: DeptId;
  deptName: string;
  email: null | string;
  leader: DeptId | null;
  leaderName: null | string;
  orderNum: number;
  parentId: DeptId;
  parentName: null | string;
  phone: null | string;
  status: DeptStatus;
}

export interface DeptSavePayload {
  deptCategory?: null | string;
  deptName: string;
  email?: null | string;
  leader?: DeptId | null;
  orderNum: number;
  parentId: DeptId;
  phone?: null | string;
  status: DeptStatus;
}

export interface DeptUpdatePayload extends DeptSavePayload {
  deptId: DeptId;
}

export type RoleId = number | string;

export type RoleStatus = '0' | '1';

export type RoleDataScope = '1' | '2' | '3' | '4' | '5' | '6';

export type RoleTreeKey = number | string;

export interface RoleItem {
  createTime: null | string;
  dataScope: RoleDataScope;
  deptCheckStrictly: boolean;
  flag: boolean;
  menuCheckStrictly: boolean;
  remark: null | string;
  roleId: RoleId;
  roleKey: string;
  roleName: string;
  roleSort: number;
  status: RoleStatus;
  superAdmin: boolean;
}

export interface RoleListPage {
  current: number;
  records: RoleItem[];
  size: number;
  total: number;
}

export interface RoleListParams {
  beginTime?: string;
  current: number;
  endTime?: string;
  isAsc?: 'asc' | 'desc';
  orderByColumn?: 'createTime' | 'roleSort';
  roleKey?: string;
  roleName?: string;
  size: number;
  status?: RoleStatus;
}

export interface RoleSavePayload {
  dataScope: RoleDataScope;
  deptCheckStrictly: boolean;
  menuCheckStrictly: boolean;
  menuIds: RoleTreeKey[];
  remark?: null | string;
  roleKey: string;
  roleName: string;
  roleSort: number;
  status: RoleStatus;
}

export interface RoleUpdatePayload extends RoleSavePayload {
  roleId: RoleId;
}

export interface RoleStatusPayload {
  roleId: RoleId;
  status: RoleStatus;
}

export interface RoleDataScopePayload {
  dataScope: RoleDataScope;
  deptCheckStrictly: boolean;
  deptIds: RoleTreeKey[];
  roleId: RoleId;
}

export interface RoleTreeNode {
  children?: RoleTreeNode[];
  disabled?: boolean;
  icon?: string;
  id: RoleTreeKey;
  label: string;
  menuType?: 'C' | 'F' | 'M';
  parentId: RoleTreeKey;
  status?: RoleStatus;
  visible?: RoleStatus;
  weight: number;
}

export interface RoleMenuTreeResponse {
  checkedKeys: RoleTreeKey[];
  menus: RoleTreeNode[];
}

export interface RoleDeptTreeResponse {
  checkedKeys: RoleTreeKey[];
  depts: RoleTreeNode[];
}

export interface RoleMember {
  avatar: null | RoleId;
  createTime: string;
  deptId: null | RoleId;
  deptName: string;
  email: string;
  loginDate: null | string;
  loginIp: null | string;
  nickName: string;
  phonenumber: string;
  remark: null | string;
  roleId: null | RoleId;
  roleIds: null | RoleId[];
  sex: string;
  status: RoleStatus;
  tenantId: string;
  userId: RoleId;
  userName: string;
  userType: string;
}

export interface RoleMemberPage {
  current: number;
  records: RoleMember[];
  size: number;
  total: number;
}

export interface RoleMemberListParams {
  current: number;
  phonenumber?: string;
  roleId: RoleId;
  size: number;
  status?: RoleStatus;
  userName?: string;
}

export interface RoleMemberBatchParams {
  roleId: RoleId;
  userIds: RoleId[];
}

export interface RoleMemberCancelPayload {
  roleId: RoleId;
  userId: RoleId;
}

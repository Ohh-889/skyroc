export type UserId = number | string;

export type UserStatus = '0' | '1';

export interface UserListParams {
  current: number;
  deptId?: UserId;
  nickName?: string;
  phonenumber?: string;
  size: number;
  status?: UserStatus;
  userName?: string;
}

export interface UserRoleSummary {
  admin?: boolean;
  roleId?: UserId;
  roleKey?: string;
  roleName?: string;
  status?: string | null;
}

export interface UserListItem {
  avatar: UserId | null;
  createTime: string;
  deptId: UserId | null;
  deptName: string;
  email: string;
  loginDate: string | null;
  loginIp: string | null;
  nickName: string;
  phonenumber: string;
  postIds: UserId[] | null;
  remark: string | null;
  roleId: UserId | null;
  roleIds: UserId[] | null;
  roles: UserRoleSummary[] | null;
  sex: string;
  status: UserStatus;
  tenantId: string;
  userId: UserId;
  userName: string;
  userType: string;
}

export interface UserListPage {
  current: number;
  records: UserListItem[];
  size: number;
  total: number;
}

export interface DeptTreeNode {
  children?: DeptTreeNode[];
  disabled: boolean;
  id: UserId;
  label: string;
  parentId: UserId;
  weight: number;
}

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

export type UserExportParams = Omit<UserListParams, 'current' | 'size'>;

export interface UserOptionParams {
  deptId?: UserId;
  userIds?: UserId[];
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

export interface UserRoleOption {
  dataScope: string;
  flag: boolean;
  roleId: UserId;
  roleKey: string;
  roleName: string;
  status: string;
  superAdmin: boolean;
}

export interface UserPostOption {
  deptId: UserId;
  deptName: string;
  postCode: string;
  postId: UserId;
  postName: string;
  status: string;
}

export interface UserDetailResponse {
  postIds: UserId[] | null;
  posts: UserPostOption[] | null;
  roleIds: UserId[] | null;
  roles: UserRoleOption[];
  user: UserListItem | null;
}

export interface CurrentUserInfoResponse {
  permissions: string[];
  roles: string[];
  user: UserListItem;
}

export interface UserSavePayload {
  deptId?: null | UserId;
  email?: null | string;
  nickName: string;
  password?: null | string;
  phonenumber?: null | string;
  postIds: UserId[];
  remark?: null | string;
  roleIds: UserId[];
  sex: string;
  status: UserStatus;
  userName: string;
}

export interface UserUpdatePayload extends UserSavePayload {
  userId: UserId;
}

export interface UserStatusPayload {
  status: UserStatus;
  userId: UserId;
}

export interface UserPasswordPayload {
  password: string;
  userId: UserId;
}

export interface UserRolePayload {
  roleIds: UserId[];
  userId: UserId;
}

export interface UserImportFailure {
  message: string;
  row: number;
}

export interface UserImportResponse {
  created: number;
  failed: number;
  failures: UserImportFailure[];
  total: number;
  updated: number;
}

export interface UserImportPayload {
  file: File;
  updateSupport: boolean;
}

import type { UserListItem } from '../system-user/types';

/** 0 男 1 女 2 未知 */
export type UserSex = '0' | '1' | '2';

export interface UserProfileResponse {
  /** 岗位名用逗号拼起来的串，直接显示用 */
  postGroup: string;
  /** 角色名用逗号拼起来的串。要按角色做判断读 user.roles，别 split 它 */
  roleGroup: string;
  /** 和用户列表、详情里是同一份契约 */
  user: UserListItem;
}

/** 只有这四项。userId 从会话取，收下它等于开一条改任何人资料的路 */
export interface UserProfilePayload {
  email?: null | string;
  nickName: string;
  phonenumber?: null | string;
  sex: UserSex;
}

/** 和管理端 resetPwd 的区别是要旧密码 */
export interface UserPasswordChangePayload {
  newPassword: string;
  oldPassword: string;
}

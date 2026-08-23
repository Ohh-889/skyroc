/**
 * Namespace Api.Auth
 *
 * Backend API module: 认证模块
 */
declare namespace Api {
  namespace Auth {
    /** 账号密码登录参数 */
    interface LoginParams {
      /** 密码 */
      password: string;
      /** 用户名 / 手机号 */
      userName: string;
    }

    /**
     * 登录令牌
     *
     * `token` 用来请求，`refreshToken` 用来在 token 过期时换新的一对。
     */
    interface LoginToken {
      /** 刷新令牌 */
      refreshToken: string;
      /** 访问令牌 */
      token: string;
    }

    /** 登录响应数据 */
    type LoginResponse = LoginToken;

    /** 用户信息。字段按自己后端的返回改，模板只留最小一组 */
    interface UserInfo {
      /** 头像地址 */
      avatar?: string;
      /** 昵称，给界面显示用 */
      nickname: string;
      /** 用户角色列表 */
      roles: string[];
      /** 用户 ID */
      userId: string;
      /** 用户名 */
      userName: string;
    }
  }
}

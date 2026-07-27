// oxlint-disable unicorn/require-module-specifiers
/**
 * 命名空间 Api.Auth
 *
 * 后端 API 模块：认证模块
 */
declare global {
  namespace Api.Auth {
    /** 登录请求参数 */
    type LoginParams = {
      /** 图形验证码内容 */
      code?: string;
      /** 密码 */
      password: string;
      /** 是否保持登录，具体会话时长由后端决定 */
      remember?: boolean;
      /** 用户名 */
      userName: string;
      /** 图形验证码唯一标识 */
      uuid?: string;
    };

    /** 登录响应数据 */
    type LoginResponse = LoginToken;

    /** 图形验证码 */
    interface CaptchaInfo {
      /** 当前是否启用图形验证码 */
      captcha_enabled: boolean;
      /** Base64 编码的 PNG 图片，不包含 data URL 前缀 */
      img: null | string;
      /** 验证码唯一标识 */
      uuid: null | string;
    }

    /** 登录令牌 */
    interface LoginToken {
      /** 刷新令牌 */
      refreshToken: string;
      /** 访问令牌 */
      token: string;
    }

    /** 用户信息 */
    interface UserInfo {
      /** 用户按钮权限列表 */
      buttons: string[];
      /** 用户角色列表 */
      roles: string[];
      /** 用户 ID */
      userId: string;
      /** 用户名 */
      userName: string;
    }

    /** 用户认证信息 */
    type Info = {
      /** 访问令牌 */
      token: LoginToken['token'];
      /** 用户信息 */
      userInfo: UserInfo;
    };
  }
}

export {};

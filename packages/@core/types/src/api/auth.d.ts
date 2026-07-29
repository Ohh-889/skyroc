// oxlint-disable unicorn/require-module-specifiers
/**
 * 命名空间 Api.Auth
 *
 * 后端 API 模块：认证模块
 */
declare global {
  namespace Api.Auth {
    /**
     * 登录请求参数
     *
     * 可选的那几个后端其实必填，但它们不是用户填的表单项，由 fetchLogin 统一补上
     */
    type LoginParams = {
      /** 客户端 id，对应后端 sys_client.client_id，一行是一个端（PC 后台 / App / 小程序） */
      clientId?: string;
      /** 图形验证码内容 */
      code?: string;
      /** 授权类型，账号密码登录固定 password，后端 /auth/login 只认这一种 */
      grantType?: string;
      /** 密码 */
      password: string;
      /** 是否保持登录，具体会话时长由后端决定 */
      remember?: boolean;
      /** 租户id */
      tenantId?: string;
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

    /**
     * 登录令牌
     *
     * 后端 /auth/login 和 /auth/refreshToken 四个字段都给，续签流程内部只传两个，所以那两个是可选的
     */
    interface LoginToken {
      /** 访问令牌还有多少秒过期，据此提前续签，不用等一次 401 */
      expiresIn?: number;
      /** 刷新令牌还有多少秒过期，到期前没续过签就要重新登录 */
      refreshExpiresIn?: number;
      /** 刷新令牌，只能用一次，用过即作废 */
      refreshToken: string;
      /** 访问令牌 */
      token: string;
    }

    /** 用户信息 */
    interface UserInfo {
      /** 用户按钮权限列表 */
      buttons: string[];
      /** 昵称，给界面显示用 */
      nickname: string;
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

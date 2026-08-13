// oxlint-disable unicorn/require-module-specifiers
/**
 * 命名空间 Api.Auth
 *
 * 后端 API 模块：认证模块
 */
declare global {
  namespace Api.Auth {
    /**
     * 每种登录方式都要带的字段
     *
     * 它们不是用户填的表单项，由 fetchLogin 统一补上，所以在类型上是可选的
     */
    type LoginContext = {
      /** 客户端 id，对应后端 sys_client.client_id，一行是一个端（PC 后台 / App / 小程序） */
      clientId?: string;
      /** 是否保持登录，具体会话时长由后端决定 */
      remember?: boolean;
      /** 租户id */
      tenantId?: string;
    };

    /** 账号密码登录 */
    type PwdLoginParams = LoginContext & {
      /** 图形验证码内容 */
      code?: string;
      grantType?: 'password';
      /** 密码 */
      password: string;
      /** 用户名 */
      userName: string;
      /** 图形验证码唯一标识 */
      uuid?: string;
    };

    /** 手机验证码登录 */
    type SmsLoginParams = LoginContext & {
      grantType: 'sms';
      /** 账号绑定的手机号 */
      phone: string;
      /** POST /auth/sms/code 发到手机上的验证码 */
      smsCode: string;
    };

    /** 邮箱验证码登录 */
    type EmailLoginParams = LoginContext & {
      /** 账号绑定的邮箱 */
      email: string;
      /** POST /auth/email/code 发到邮箱里的验证码 */
      emailCode: string;
      grantType: 'email';
    };

    /**
     * 登录请求参数，按 grantType 分派
     *
     * 和后端那个可辨识联合一一对应：每种方式各要哪些字段是分开声明的，混着传会被后端 422。 加一种登录方式在这里加一个成员，别往某一种上挂可选字段。
     */
    type LoginParams = EmailLoginParams | PwdLoginParams | SmsLoginParams;

    /** 发手机登录验证码的参数 */
    type SmsCodeParams = {
      /** 收验证码的手机号，必须是某个账号绑定的号码 */
      phone: string;
      /** 租户id */
      tenantId?: string;
    };

    /** 发邮箱登录验证码的参数 */
    type EmailCodeParams = {
      /** 收验证码的邮箱，必须是某个账号绑定的地址 */
      email: string;
      /** 租户id */
      tenantId?: string;
    };

    /** 登录响应数据 */
    type LoginResponse = LoginToken;

    /** 登录页租户下拉框里的一项 */
    interface LoginTenantOption {
      /** 企业名称，下拉框显示的就是它 */
      companyName: string;
      /** 绑定的域名，没配就是空串 */
      domain: string;
      /** 租户编号，登录和发码时原样带回后端 */
      tenantId: string;
    }

    /** GET /auth/tenant/list 的响应，不需要登录就能拿 */
    interface LoginTenantInfo {
      /** 这个部署是不是多租户，false 时登录页不显示下拉框 */
      tenantEnabled: boolean;
      /** 字段名跟着后端（RuoYi 的 LoginTenantVo）叫 voList，关闭多租户时是空数组 */
      voList: LoginTenantOption[];
    }

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

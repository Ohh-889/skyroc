/**
 * 网络层的环境配置。
 *
 * 全部走 `EXPO_PUBLIC_*`：这类变量会被 babel 在编译期原样替换进包里，任何人解包都能看到，
 * **绝不能放密钥**。需要保密的值只能留在后端，或走构建期变量 + 原生侧注入。
 *
 * 读取必须写成 `process.env.EXPO_PUBLIC_X` 这样的字面形式——解构或动态取键名不会被替换，
 * 运行时拿到的是 undefined。
 */

/** 接口根地址，例如 `https://api.example.com`。空串表示还没接后端 */
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';

console.log('API_BASE_URL', API_BASE_URL);

/**
 * 是否已经接上后端。
 *
 * 模板自带的登录演示靠它决定走真实接口还是本地假凭据，接上后端后相关分支可以整段删掉。
 */
export const HAS_API_BASE_URL = Boolean(API_BASE_URL);

/** 默认超时。移动网络比桌面慢，10 秒是丢包时用户还愿意等的上限 */
const DEFAULT_TIMEOUT = 10_000;

export const API_TIMEOUT = Number(process.env.EXPO_PUBLIC_API_TIMEOUT) || DEFAULT_TIMEOUT;

/** `'8888, 8889'` 这样的配置项拆成数组并去掉空白，没配就是空数组 */
function splitCodes(value?: string) {
  return value ? value.split(',').map(code => code.trim()).filter(Boolean) : [];
}

/**
 * 后端业务码。
 *
 * `@skyroc/service` 内部还会再规整一次，但 `api/auth/refresh.ts` 是直接读这里的，所以在源头就清干净。
 */
export const SERVICE_CODES = {
  /** 令牌过期，请求层会自动续签后重发一次 */
  expiredToken: splitCodes(process.env.EXPO_PUBLIC_SERVICE_EXPIRED_TOKEN_CODES),
  /** 直接登出 */
  logout: splitCodes(process.env.EXPO_PUBLIC_SERVICE_LOGOUT_CODES),
  /** 弹窗确认后登出 */
  modalLogout: splitCodes(process.env.EXPO_PUBLIC_SERVICE_MODAL_LOGOUT_CODES),
  /** 请求成功 */
  success: process.env.EXPO_PUBLIC_SERVICE_SUCCESS_CODE?.trim() || '0000'
};

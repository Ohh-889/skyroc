import type { RequestAdapter, RequestInstanceState, ServiceCodes } from './types';

/** 与后端约定的成功码，各 app 的 .env 漏配时兜底 */
const DEFAULT_SUCCESS_CODE = '0000';

function cleanCodeList(list: string[] | undefined) {
  return (list || []).map(code => code.trim()).filter(Boolean);
}

/**
 * 规整调用方传进来的业务码
 *
 * 各 app 都是 `import.meta.env.X?.split(',')` 直接传进来的，两种配法会静默失效：
 * 值里带空格（`8888, 8889`）永远匹配不上，成功码缺失会让每个请求都被判成失败。
 */
export function normalizeCodes(codes: ServiceCodes): ServiceCodes {
  return {
    expiredToken: cleanCodeList(codes.expiredToken),
    logout: cleanCodeList(codes.logout),
    modalLogout: cleanCodeList(codes.modalLogout),
    success: codes.success?.trim() || DEFAULT_SUCCESS_CODE
  };
}

/** 构造 Authorization header 值 */
export function getAuthorization(adapter: RequestAdapter) {
  const token = adapter.getToken();
  return token ? `Bearer ${token}` : null;
}

/**
 * 展示错误消息（去重）
 *
 * 同一消息在展示期间不会重复弹出
 */
export function showErrorMsg(adapter: RequestAdapter, state: RequestInstanceState, message: string) {
  if (!state.errMsgStack?.length) {
    state.errMsgStack = [];
  }

  const isExist = state.errMsgStack.includes(message);

  if (!isExist) {
    state.errMsgStack.push(message);



    adapter.showErrorMessage(message, () => {
      state.errMsgStack = state.errMsgStack.filter(msg => msg !== message);

      setTimeout(() => {
        state.errMsgStack = [];
      }, 5000);
    });
  }
}

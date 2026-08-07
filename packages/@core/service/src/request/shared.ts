import type { RequestAdapter, RequestInstanceState } from './types';

/** 构造 Authorization header 值 */
export function getAuthorization(adapter: RequestAdapter) {
  const token = adapter.getToken();
  return token ? `Bearer ${token}` : null;
}

/** 刷新 token 并更新认证信息，失败则重定向到登录页 */
export async function handleRefreshToken(adapter: RequestAdapter) {
  const refreshToken = adapter.getRefreshToken() || '';
  try {
    const data = await adapter.fetchRefreshToken(refreshToken);
    adapter.setAuth(data);
    return true;
  } catch {
    const fullPath = adapter.getCurrentPath();
    adapter.redirectToLogin(fullPath);
    return false;
  }
}

/**
 * 处理 token 过期的请求
 *
 * 通过共享 promise 防止并发刷新
 */
export async function handleExpiredRequest(adapter: RequestAdapter, state: RequestInstanceState) {
  if (!state.refreshTokenPromise) {
    state.refreshTokenPromise = handleRefreshToken(adapter);
  }

  const success = await state.refreshTokenPromise;

  setTimeout(() => {
    state.refreshTokenPromise = null;
  }, 1000);

  return success;
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

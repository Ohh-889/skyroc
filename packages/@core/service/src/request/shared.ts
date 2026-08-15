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
 * 单条消息占着去重位的上限。
 *
 * `onClose` 是可选的，平台大可以不回调（RN 的 `Alert.alert` 就没这个回调）。没有兜底的话
 * 那条消息会永远留在栈里，此后它再也弹不出来——一条错误提示被静默吞掉比重复弹一次糟得多。
 */
const MSG_MAX_LIFETIME = 5_000;

/**
 * 展示错误消息（去重）
 *
 * 同一消息在展示期间不会重复弹出
 */
export function showErrorMsg(adapter: RequestAdapter, state: RequestInstanceState, message: string) {
  if (!state.errMsgStack) {
    state.errMsgStack = [];
  }

  if (state.errMsgStack.includes(message)) {
    return;
  }

  state.errMsgStack.push(message);

  // 只摘掉自己这一条。早先这里还会在 5 秒后把整个栈清空，那会连带抹掉这期间进来的其他消息，
  // 让它们绕过去重再弹一次——去重的语义正是被那行破坏的。
  function dismiss() {
    state.errMsgStack = state.errMsgStack.filter(msg => msg !== message);
  }

  const timer = setTimeout(dismiss, MSG_MAX_LIFETIME);

  adapter.showErrorMessage(message, () => {
    clearTimeout(timer);
    dismiss();
  });
}

import { useAtomValue } from 'jotai';

import { authAtom, resetAuth, setAuth } from './auth-store';

/**
 * 登录状态。
 *
 * 刻意不套 Context：凭据的事实来源是 `authAtom`，`<JotaiProvider>` 已经把全局 store 接进了 React，再包一层 Provider 只会多出一份随时可能和它不同步的状态。
 *
 * 没有 loading 态：SecureStore 是同步读的，第一帧就知道登没登录。
 */
export function useSession() {
  const tokens = useAtomValue(authAtom);

  return {
    /** 是否已登录 */
    isLoggedIn: Boolean(tokens),
    /** 保存凭据，登录成功后调 */
    signIn: setAuth,
    /** 清凭据并清空 Query 缓存 */
    signOut: resetAuth,
    /** 当前凭据；`null` 表示未登录 */
    tokens
  };
}

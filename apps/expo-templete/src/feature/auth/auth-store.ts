import { RESET, createAtomWithStorage, getAtomValue, setAtomValue } from '@skyroc/core-state';

import { queryClient } from '@/service/queryClient';
import { SECURE_STORAGE } from '@/store/secure-storage';

/** SecureStore 的 key 只允许字母、数字和 `.`、`-`、`_` */
const AUTH_STORAGE_KEY = 'auth.tokens';

function isLoginToken(raw: unknown): raw is Api.Auth.LoginToken {
  return typeof raw === 'object' && raw !== null && typeof (raw as Api.Auth.LoginToken).token === 'string';
}

/**
 * 登录凭据。`null` 表示未登录。
 *
 * 用 atom 而不是自己写一套订阅：请求拦截器要在 React 之外同步读 token（`getAtomValue`），
 * 页面又要跟着它重渲染（`useAtomValue`），jotai 的 store 本来就同时提供这两条路。
 *
 * 落盘走 SecureStore，且读是同步的：冷启动时第一帧就知道登没登录，不存在「先闪一下登录页」。
 */
export const authAtom = createAtomWithStorage<Api.Auth.LoginToken | null>(AUTH_STORAGE_KEY, null, {
  storageName: SECURE_STORAGE,
  // 存过的东西可能是上一个版本的结构，认不出来就当没登录，别让脏数据带着半个 token 往下跑
  validate: raw => (isLoginToken(raw) ? raw : undefined)
});

export function getToken() {
  return getAtomValue(authAtom)?.token ?? null;
}

export function getRefreshToken() {
  return getAtomValue(authAtom)?.refreshToken ?? null;
}

/** 保存凭据。登录成功、续签成功都走这里 */
export function setAuth(tokens: Api.Auth.LoginToken) {
  setAtomValue(authAtom, tokens);
}

/**
 * 清除凭据。主动登出和续签失败都走这里。
 *
 * 用 RESET 而不是写个 null：它会把 Keychain 里那条也删掉，凭据不该以任何形式留在设备上。
 *
 * 清 Query 缓存必须和清凭据绑在一起：漏了的话，下一个账号登录后任何一个还没过期的 query
 * 都会把上一个账号的数据直接渲染出来。
 */
export function resetAuth() {
  setAtomValue(authAtom, RESET);

  queryClient.clear();
}

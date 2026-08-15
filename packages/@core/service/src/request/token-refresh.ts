import type { RequestAdapter } from './types';

/**
 * 刷完之后复用同一个结果的窗口。
 *
 * 一批请求几乎同时拿到过期码是常态，窗口内直接复用结果，它们不会一人再发一次刷新。
 */
const REUSE_WINDOW = 1_000;

/**
 * 全局唯一的在途刷新。
 *
 * 放模块级而不是挂在某个请求实例上：HTTP、WebSocket、SSE 用的是同一次登录的凭据，各刷各的
 * 会让后发的那次拿着已经轮换掉的 refresh token 去换，换回来一次失败和一次莫名其妙的登出。
 */
let inFlight: Promise<boolean> | null = null;
let reuseTimer: ReturnType<typeof setTimeout> | null = null;

/** 刷新令牌并写回认证信息，失败则重定向到登录页。 */
export async function handleRefreshToken(adapter: RequestAdapter): Promise<boolean> {
  try {
    // 取不到就传空串，让后端去拒：这里提前返回的话，调用方分不清「没登录」和「续签失败」
    const data = await adapter.fetchRefreshToken(adapter.getRefreshToken() || '');
    adapter.setAuth(data);

    return true;
  } catch {
    // 换不回来说明 refresh token 也废了，留着只会让下一次请求再走一遍失败的续签
    adapter.resetAuth();

    const fullPath = adapter.getCurrentPath();
    adapter.redirectToLogin(fullPath);

    return false;
  }
}

/**
 * 刷新令牌，并发调用共用同一次请求。
 *
 * 任何传输拿到「令牌过期」都该走这里，不要自己调 adapter.fetchRefreshToken —— 那样
 * 各传输之间没有去重，第二个刷新必定失败。
 */
export async function refreshToken(adapter: RequestAdapter): Promise<boolean> {
  inFlight ??= handleRefreshToken(adapter);

  const success = await inFlight;

  reuseTimer ??= setTimeout(() => {
    inFlight = null;
    reuseTimer = null;
  }, REUSE_WINDOW);

  return success;
}

/** 测试用：清掉在途状态，避免用例之间互相影响。 */
export function resetTokenRefresh() {
  if (reuseTimer) {
    clearTimeout(reuseTimer);
  }

  inFlight = null;
  reuseTimer = null;
}

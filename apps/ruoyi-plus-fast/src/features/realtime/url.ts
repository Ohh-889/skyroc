import { getToken } from '@/features/auth/use-auth';

export interface RealtimeUrlOptions {
  /** 这条连接的开关，来自 VITE_*_ENABLED。 */
  enabled: boolean;
  /** 连接地址，来自 VITE_*_URL，允许是相对路径。 */
  url: string | undefined;
}

/**
 * 拼一条实时连接的完整地址，没开开关、没配地址或还没登录时返回 null。
 *
 * 令牌现取不缓存：重连要用的是这一刻的令牌，不是建连接那一刻的。凭据走查询参数而不是请求头， 因为 WebSocket 和 EventSource 都设不了头。
 */
export function buildRealtimeUrl(options: RealtimeUrlOptions): string | null {
  const { enabled, url } = options;

  const token = getToken();

  if (!enabled || !url || !token) {
    return null;
  }

  const target = new URL(url, window.location.origin);
  target.searchParams.set('Authorization', token);
  target.searchParams.set('clientid', import.meta.env.VITE_AUTH_CLIENT_ID);

  return target.toString();
}

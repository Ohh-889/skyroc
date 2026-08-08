import { useSyncExternalStore } from 'react';

import { getToken } from '@/features/auth/use-auth';
import { parseRealtimeReady } from '@/features/realtime/message';
import { refreshAppToken } from '@/service/adapter';

import { WebSocketClient } from './client';

const websocketEnabled = import.meta.env.VITE_WEBSOCKET_ENABLED === 'Y';
const websocketUrl = import.meta.env.VITE_WEBSOCKET_URL;

/** 令牌现取，不缓存：重连要用的是这一刻的令牌，不是建连接那一刻的。 */
function buildAppWebSocketUrl(): string | null {
  const token = getToken();

  if (!websocketEnabled || !websocketUrl || !token) {
    return null;
  }

  const url = new URL(websocketUrl, window.location.origin);
  url.searchParams.set('Authorization', token);
  url.searchParams.set('clientid', import.meta.env.VITE_AUTH_CLIENT_ID);

  return url.toString();
}

let appClient: WebSocketClient | null = null;

/**
 * 全应用共用的那一条连接。
 *
 * 惰性建单例而不是交给某个组件持有：挂载它的 WebSocketEffect 和用它的联调页在两棵子树上，
 * 组件持有的话后者拿不到。
 */
export function getAppWebSocketClient(): WebSocketClient {
  appClient ??= new WebSocketClient({
    getUrl: buildAppWebSocketUrl,
    isPong: raw => raw === 'pong',
    onTokenStale: refreshAppToken,
    parseReady: parseRealtimeReady
  });

  return appClient;
}

/** 订阅应用连接。状态变了才重渲染，收发消息请自行 client.on(...)。 */
export function useAppWebSocket() {
  const client = getAppWebSocketClient();
  const state = useSyncExternalStore(client.subscribe, client.getSnapshot, client.getSnapshot);

  return { client, state };
}

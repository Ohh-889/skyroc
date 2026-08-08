import { useSyncExternalStore } from 'react';

import { parseRealtimeReady } from '@/features/realtime/message';
import { buildRealtimeUrl } from '@/features/realtime/url';
import { refreshAppToken } from '@/service/adapter';

import { WebSocketClient } from './client';

const websocketEnabled = import.meta.env.VITE_WEBSOCKET_ENABLED === 'Y';
const websocketUrl = import.meta.env.VITE_WEBSOCKET_URL;

function buildAppWebSocketUrl(): string | null {
  return buildRealtimeUrl({ enabled: websocketEnabled, url: websocketUrl });
}

let appClient: WebSocketClient | null = null;

/**
 * 全应用共用的那一条连接。
 *
 * 惰性建单例而不是交给某个组件持有：挂载它的 WebSocketEffect 和用它的联调页在两棵子树上， 组件持有的话后者拿不到。
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

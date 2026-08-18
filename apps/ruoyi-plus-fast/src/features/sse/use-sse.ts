import { useStore } from '@skyroc/hooks';

import { buildRealtimeUrl } from '@/features/realtime/url';
import { refreshAppToken } from '@/service/adapter';

import { SseClient } from './client';

const sseEnabled = import.meta.env.VITE_SSE_ENABLED === 'Y';
const sseUrl = import.meta.env.VITE_SSE_URL;

function buildAppSseUrl(): string | null {
  return buildRealtimeUrl({ enabled: sseEnabled, url: sseUrl });
}

let appClient: SseClient | null = null;

/**
 * 全应用共用的那一条连接。
 *
 * 惰性建单例而不是交给某个组件持有：挂载它的 SseEffect 和用它的联调页在两棵子树上， 组件持有的话后者拿不到。
 */
export function getAppSseClient(): SseClient {
  appClient ??= new SseClient({
    getUrl: buildAppSseUrl,
    onTokenStale: refreshAppToken
  });

  return appClient;
}

/** 订阅应用连接。状态变了才重渲染，收消息请自行 client.on(...)。 */
export function useAppSse() {
  const client = getAppSseClient();
  const state = useStore(client);

  return { client, state };
}

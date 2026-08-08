import { useNotificationContext } from '@skyroc/web-admin-notification';
import { useEffect, useRef } from 'react';

import { getToken, useAuthToken } from '@/features/auth/use-auth';
import { parseRealtimeNotification } from '@/features/realtime/message';
import { refreshAppToken } from '@/service/adapter';

import { SseClient } from './client';
import { reportSseMessage, reportSseSystemEvent, setSseConnected, setSseDisconnected } from './runtime';

const sseEnabled = import.meta.env.VITE_SSE_ENABLED === 'Y';
const sseUrl = import.meta.env.VITE_SSE_URL;

/** 令牌现取，不缓存：续签之后重连要用的是新的那张。 */
function buildSseUrl(): string | null {
  const token = getToken();

  if (!sseEnabled || !sseUrl || !token) {
    return null;
  }

  const url = new URL(sseUrl, window.location.origin);
  // EventSource 设不了请求头，凭据只能走查询参数
  url.searchParams.set('Authorization', token);
  url.searchParams.set('clientid', import.meta.env.VITE_AUTH_CLIENT_ID);

  return url.toString();
}

const SseEffect = () => {
  const token = useAuthToken();
  const { addNotification } = useNotificationContext();
  const addNotificationRef = useRef(addNotification);
  addNotificationRef.current = addNotification;

  const isLoggedIn = Boolean(token);

  // 依赖登录与否而不是令牌本身：续签换了令牌不该断掉一条正常的连接，
  // 真需要换的时候后端会发 4001，客户端自己会续签重连。
  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    const client = new SseClient({
      getUrl: buildSseUrl,
      onClose(info) {
        setSseDisconnected(`${info.reason}（${info.code}）`);
      },
      onError(willRetry) {
        setSseDisconnected(willRetry ? '连接中断，浏览器将自动重连' : '连接失败，不会重连');
      },
      onMessage(message) {
        reportSseMessage(message);
        const notification = parseRealtimeNotification(message);

        if (notification) {
          addNotificationRef.current(notification);
        }
      },
      onReady(payload) {
        setSseConnected(payload.connection_id);
      },
      onTokenStale: refreshAppToken
    });

    client.connect();
    reportSseSystemEvent('正在建立 SSE 连接');

    return () => {
      client.disconnect();
      setSseDisconnected('页面已切换或退出登录');
    };
  }, [isLoggedIn]);

  return null;
};

export default SseEffect;

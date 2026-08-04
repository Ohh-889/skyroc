import { useNotificationContext } from '@skyroc/web-admin-notification';
import { useEffect, useRef } from 'react';

import { useAuthToken } from '@/features/auth/use-auth';
import { parseRealtimeNotification } from '@/features/realtime/message';

import { SseClient } from './client';
import { reportSseMessage, reportSseSystemEvent, setSseConnected, setSseDisconnected } from './runtime';

const sseEnabled = import.meta.env.VITE_SSE_ENABLED === 'Y';
const sseUrl = import.meta.env.VITE_SSE_URL;

const SseEffect = () => {
  const token = useAuthToken();
  const { addNotification } = useNotificationContext();
  const addNotificationRef = useRef(addNotification);
  addNotificationRef.current = addNotification;

  useEffect(() => {
    if (!sseEnabled || !sseUrl || !token) {
      return;
    }

    const client = new SseClient({
      clientId: import.meta.env.VITE_AUTH_CLIENT_ID,
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
      token,
      url: sseUrl
    });

    client.connect();
    reportSseSystemEvent('正在建立 SSE 连接');

    return () => {
      client.disconnect();
      setSseDisconnected('页面已切换或退出登录');
    };
  }, [token]);

  return null;
};

export default SseEffect;

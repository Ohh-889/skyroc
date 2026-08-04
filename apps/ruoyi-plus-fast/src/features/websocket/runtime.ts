import type { WebSocketClient } from './client';

export type WebSocketConnectionStatus = 'connected' | 'disconnected';

export interface WebSocketRuntimeEvent {
  /** 消息方向，system 表示连接状态变化。 */
  direction: 'in' | 'out' | 'system';
  /** 用于测试页展示的文本。 */
  message: string;
  /** 事件发生时间。 */
  timestamp: number;
}

type WebSocketRuntimeListener = (event: WebSocketRuntimeEvent) => void;

let activeClient: WebSocketClient | null = null;
let connectionStatus: WebSocketConnectionStatus = 'disconnected';
const listeners = new Set<WebSocketRuntimeListener>();

function emit(event: WebSocketRuntimeEvent) {
  listeners.forEach(listener => listener(event));
}

export function bindWebSocketClient(client: WebSocketClient) {
  activeClient = client;
}

export function releaseWebSocketClient(client: WebSocketClient) {
  if (activeClient === client) {
    activeClient = null;
    setWebSocketConnectionStatus('disconnected');
  }
}

export function getWebSocketConnectionStatus() {
  return connectionStatus;
}

export function reportWebSocketMessage(message: string) {
  emit({ direction: 'in', message, timestamp: Date.now() });
}

export function sendWebSocketMessage(data: Record<string, unknown>) {
  const message = JSON.stringify(data);
  const sent = activeClient?.send(message) ?? false;
  if (sent) {
    emit({ direction: 'out', message, timestamp: Date.now() });
  }
  return sent;
}

export function setWebSocketConnectionStatus(status: WebSocketConnectionStatus) {
  if (connectionStatus === status) return;

  connectionStatus = status;
  emit({
    direction: 'system',
    message: status === 'connected' ? 'WebSocket 已连接' : 'WebSocket 已断开',
    timestamp: Date.now()
  });
}

export function subscribeWebSocketRuntime(listener: WebSocketRuntimeListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

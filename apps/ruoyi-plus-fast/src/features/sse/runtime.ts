export type SseConnectionStatus = 'connected' | 'disconnected';

export interface SseRuntimeEvent {
  /** 消息方向。SSE 是单向的，没有 out。 */
  direction: 'in' | 'system';
  /** 用于测试页展示的文本。 */
  message: string;
  /** 事件发生时间。 */
  timestamp: number;
}

type SseRuntimeListener = (event: SseRuntimeEvent) => void;

let connectionId: string | null = null;
let connectionStatus: SseConnectionStatus = 'disconnected';
const listeners = new Set<SseRuntimeListener>();

function emit(event: SseRuntimeEvent) {
  listeners.forEach(listener => listener(event));
}

export function getSseConnectionId() {
  return connectionId;
}

export function getSseConnectionStatus() {
  return connectionStatus;
}

export function reportSseMessage(message: string) {
  emit({ direction: 'in', message, timestamp: Date.now() });
}

export function reportSseSystemEvent(message: string) {
  emit({ direction: 'system', message, timestamp: Date.now() });
}

export function setSseConnected(id: string) {
  connectionId = id;
  if (connectionStatus === 'connected') return;

  connectionStatus = 'connected';
  emit({ direction: 'system', message: `SSE 已连接（${id}）`, timestamp: Date.now() });
}

export function setSseDisconnected(reason: string) {
  connectionId = null;
  if (connectionStatus === 'disconnected') return;

  connectionStatus = 'disconnected';
  emit({ direction: 'system', message: `SSE 已断开：${reason}`, timestamp: Date.now() });
}

export function subscribeSseRuntime(listener: SseRuntimeListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { pushWebSocketMessage } from '@/features/websocket/api';
import {
  getWebSocketConnectionStatus,
  sendWebSocketMessage,
  subscribeWebSocketRuntime
} from '@/features/websocket/runtime';
import type { WebSocketConnectionStatus, WebSocketRuntimeEvent } from '@/features/websocket/runtime';

const MAX_LOGS = 50;
const JsonObjectSchema = z.record(z.string(), z.unknown());
const directionColors = {
  in: 'green',
  out: 'blue',
  system: 'default'
} as const;
const directionLabels = {
  in: '接收',
  out: '发送',
  system: '状态'
} as const;

const WebSocketTest = () => {
  const [clientMessage, setClientMessage] = useState(
    JSON.stringify(
      {
        content: '前端主动发送的测试消息',
        title: '前端消息',
        type: 'info'
      },
      null,
      2
    )
  );
  const [logs, setLogs] = useState<WebSocketRuntimeEvent[]>([]);
  const [pushing, setPushing] = useState(false);
  const [serverMessage, setServerMessage] = useState('后端主动推送的测试消息');
  const [status, setStatus] = useState<WebSocketConnectionStatus>(getWebSocketConnectionStatus());

  useEffect(() => {
    return subscribeWebSocketRuntime(event => {
      if (event.direction === 'system') {
        setStatus(getWebSocketConnectionStatus());
      }
      setLogs(current => [event, ...current].slice(0, MAX_LOGS));
    });
  }, []);

  function handleClientSend() {
    const message = clientMessage.trim();
    if (!message) {
      showWarningMessage('请输入发送内容');
      return;
    }
    let value: unknown;
    try {
      value = JSON.parse(message);
    } catch {
      showWarningMessage('请输入合法的 JSON 对象');
      return;
    }
    const parsed = JsonObjectSchema.safeParse(value);
    if (!parsed.success) {
      showWarningMessage('WebSocket 业务消息必须是 JSON 对象');
      return;
    }
    if (!sendWebSocketMessage(parsed.data)) {
      showWarningMessage('WebSocket 尚未连接');
    }
  }

  async function handleServerPush() {
    const content = serverMessage.trim();
    if (!content) {
      showWarningMessage('请输入推送内容');
      return;
    }

    setPushing(true);
    try {
      const result = await pushWebSocketMessage({
        content,
        title: '后端主动推送',
        type: 'success'
      });
      showSuccessMessage(`消息已发布，本实例投递 ${result.local_connections} 个连接`);
    } finally {
      setPushing(false);
    }
  }

  return (
    <ASpace className="w-full" orientation="vertical" size={16}>
      <ACard title="WebSocket 联调">
        <ASpace className="w-full" orientation="vertical" size={12}>
          <div>
            当前状态：
            <ABadge
              status={status === 'connected' ? 'success' : 'error'}
              text={status === 'connected' ? '已连接' : '未连接'}
            />
          </div>
          <div className="text-text-2">
            前端发送 JSON 对象；后端统一用 code、msg、data 信封回发。HTTP 推送用于测试后端主动发消息。
          </div>
        </ASpace>
      </ACard>

      <ARow gutter={[16, 16]}>
        <ACol lg={12} span={24}>
          <ACard title="前端 → 后端">
            <ASpace className="w-full" orientation="vertical" size={12}>
              <AInput.TextArea
                autoSize={{ maxRows: 6, minRows: 4 }}
                value={clientMessage}
                onChange={event => setClientMessage(event.target.value)}
              />
              <AButton disabled={status !== 'connected'} type="primary" onClick={handleClientSend}>
                通过 WebSocket 发送
              </AButton>
            </ASpace>
          </ACard>
        </ACol>

        <ACol lg={12} span={24}>
          <ACard title="后端 → 前端">
            <ASpace className="w-full" orientation="vertical" size={12}>
              <AInput.TextArea
                autoSize={{ maxRows: 6, minRows: 4 }}
                value={serverMessage}
                onChange={event => setServerMessage(event.target.value)}
              />
              <AButton loading={pushing} type="primary" onClick={handleServerPush}>
                调用后端推送接口
              </AButton>
            </ASpace>
          </ACard>
        </ACol>
      </ARow>

      <ACard
        extra={
          <AButton disabled={logs.length === 0} size="small" onClick={() => setLogs([])}>
            清空
          </AButton>
        }
        title="收发记录"
      >
        {logs.length === 0 ? (
          <AEmpty description="暂无 WebSocket 事件" />
        ) : (
          <AList
            dataSource={logs}
            renderItem={item => (
              <AList.Item>
                <ASpace>
                  <ATag color={directionColors[item.direction]}>{directionLabels[item.direction]}</ATag>
                  <span className="text-tertiary">{new Date(item.timestamp).toLocaleTimeString()}</span>
                  <span className="break-all">{item.message}</span>
                </ASpace>
              </AList.Item>
            )}
          />
        )}
      </ACard>
    </ASpace>
  );
};

export const Route = createFileRoute('/(admin)/websocket-test/')({
  component: WebSocketTest,
  staticData: {
    menu: {
      icon: 'mdi:connection',
      order: 20
    },
    title: 'WebSocket 测试',
    requiresAuth: false
  }
});

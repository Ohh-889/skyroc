import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { sendBroadcast, sendDirectMessage } from '@/features/message/api';
import { BROADCAST_SEND, DIRECT_SEND } from '@/features/message/constants';
import { parseRealtimeEnvelope } from '@/features/realtime/message';
import { pushWebSocketMessage } from '@/features/websocket/api';
import type { ConnectionState } from '@/features/websocket/types';
import { useAppWebSocket } from '@/features/websocket/use-websocket';
import { useUserInfoQuery } from '@/service/api/system-user';

interface WebSocketLogEntry {
  /** 消息方向，system 表示连接状态变化。 */
  direction: 'in' | 'out' | 'system';
  message: string;
  timestamp: number;
  /** 信封里的 type，裸文本（心跳）和状态变化没有。 */
  type?: string;
}

const stateLabels: Record<ConnectionState, string> = {
  connected: 'WebSocket 已连接',
  connecting: 'WebSocket 连接中',
  disconnected: 'WebSocket 已断开',
  idle: 'WebSocket 未启动'
};

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

/** 消息体的默认内容。字段形状由收发双方自己约定，服务端不校验它。 */
const DEFAULT_BODY = JSON.stringify(
  {
    content: '前端主动发送的测试消息',
    title: '前端消息',
    type: 'info'
  },
  null,
  2
);

/** 收件人输入框解析成 userId 列表，有一个填得不对就整体返回 null。 */
function parseRecipients(raw: string): number[] | null {
  const ids = raw
    .split(/[,，\s]+/)
    .filter(Boolean)
    .map(Number);

  if (!ids.length || ids.some(id => !Number.isInteger(id))) {
    return null;
  }

  return ids;
}

const WebSocketTest = () => {
  const [logs, setLogs] = useState<WebSocketLogEntry[]>([]);
  const [messageBody, setMessageBody] = useState(DEFAULT_BODY);
  const [pushing, setPushing] = useState(false);
  const [recipients, setRecipients] = useState('');
  const [serverMessage, setServerMessage] = useState('后端主动推送的测试消息');
  const { client, state } = useAppWebSocket();
  const { data: userInfo } = useUserInfoQuery();

  // 默认发给自己，userId 要等接口回来才有。只在输入框还是空的时候填，否则会把正在编辑的
  // 内容冲掉。
  const selfUserId = userInfo ? Number(userInfo.userId) : null;

  useEffect(() => {
    if (selfUserId === null) return;

    setRecipients(current => current || String(selfUserId));
  }, [selfUserId]);

  useEffect(() => {
    function append(direction: WebSocketLogEntry['direction'], message: string) {
      const type = direction === 'system' ? undefined : parseRealtimeEnvelope(message)?.type;

      setLogs(current => [{ direction, message, timestamp: Date.now(), type }, ...current].slice(0, MAX_LOGS));
    }

    const offs = [
      client.on('message', raw => append('in', raw)),
      client.on('sent', raw => append('out', raw)),
      client.on('stateChange', next => append('system', stateLabels[next]))
    ];

    return () => offs.forEach(off => off());
  }, [client]);

  /** 解出消息体，形状不对时提示并返回 null。两个发送按钮共用。 */
  function readBody(): Record<string, unknown> | null {
    let value: unknown;
    try {
      value = JSON.parse(messageBody.trim());
    } catch {
      showWarningMessage('消息体必须是合法的 JSON');
      return null;
    }

    const parsed = JsonObjectSchema.safeParse(value);
    if (!parsed.success) {
      showWarningMessage('消息体必须是 JSON 对象');
      return null;
    }

    return parsed.data;
  }

  function handleDirectSend() {
    const body = readBody();
    if (!body) return;

    const ids = parseRecipients(recipients);
    if (!ids) {
      showWarningMessage('收件人要填 userId，多个用逗号隔开');
      return;
    }

    // 返回的是这条命令的 id，服务端会原样写进回执的 request_id —— 在收发记录里能把两条对上
    const commandId = sendDirectMessage(ids, body);
    if (commandId === null) {
      showWarningMessage('WebSocket 尚未连接');
    }
  }

  function handleBroadcast() {
    const body = readBody();
    if (!body) return;

    if (sendBroadcast(body) === null) {
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
    <ASpace
      className="w-full"
      orientation="vertical"
      size={16}
    >
      <ACard title="WebSocket 联调">
        <ASpace
          className="w-full"
          orientation="vertical"
          size={12}
        >
          <div>
            当前状态：
            <ABadge
              status={state === 'connected' ? 'success' : 'error'}
              text={stateLabels[state]}
            />
          </div>
          <div className="text-text-2">
            两个按钮走的是 <code>features/message/api</code> 的 <code>sendDirectMessage</code> /
            <code>sendBroadcast</code>，和真实业务代码同一条路径。信封的
            <code>id</code> 由客户端自动生成，服务端原样写进回执的 <code>request_id</code>。
          </div>
          <div className="text-text-2">
            <code>{DIRECT_SEND}</code> 的收件人填自己的 userId
            {selfUserId === null ? '' : `（${selfUserId}）`}会原路发回来，填别人被拒（403）；
            <code>{BROADCAST_SEND}</code> 群发给本租户，只有超管放行。谁能发给谁是后端 message 模块的规则。
          </div>
          <div className="text-text-2">
            发一条定向消息会收到两条：回执 <code>{`${DIRECT_SEND}.result`}</code>（带 request_id，不进通知中心）和投递
            <code>message.direct.created</code>（内容在 data.body 里）。
          </div>
        </ASpace>
      </ACard>

      <ARow gutter={[16, 16]}>
        <ACol
          lg={12}
          span={24}
        >
          <ACard title="前端 → 后端">
            <ASpace
              className="w-full"
              orientation="vertical"
              size={12}
            >
              <AInput
                addonBefore="收件人"
                placeholder="userId，多个用逗号隔开；群发时忽略"
                value={recipients}
                onChange={event => setRecipients(event.target.value)}
              />
              <AInput.TextArea
                autoSize={{ maxRows: 10, minRows: 6 }}
                value={messageBody}
                onChange={event => setMessageBody(event.target.value)}
              />
              <ASpace size={8}>
                <AButton
                  disabled={state !== 'connected'}
                  type="primary"
                  onClick={handleDirectSend}
                >
                  定向发送
                </AButton>
                <AButton
                  disabled={state !== 'connected'}
                  onClick={handleBroadcast}
                >
                  群发（仅超管）
                </AButton>
              </ASpace>
            </ASpace>
          </ACard>
        </ACol>

        <ACol
          lg={12}
          span={24}
        >
          <ACard title="后端 → 前端">
            <ASpace
              className="w-full"
              orientation="vertical"
              size={12}
            >
              <AInput.TextArea
                autoSize={{ maxRows: 6, minRows: 4 }}
                value={serverMessage}
                onChange={event => setServerMessage(event.target.value)}
              />
              <AButton
                loading={pushing}
                type="primary"
                onClick={handleServerPush}
              >
                调用后端推送接口
              </AButton>
            </ASpace>
          </ACard>
        </ACol>
      </ARow>

      <ACard
        extra={
          <AButton
            disabled={logs.length === 0}
            size="small"
            onClick={() => setLogs([])}
          >
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
                  {item.type ? <ATag>{item.type}</ATag> : null}
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

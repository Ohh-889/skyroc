import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { showConfirmModal } from '@skyroc/web-admin-theme';
import { ButtonIcon } from '@skyroc/web-ui-antd';
import { SvgIcon } from '@skyroc/web-ui-compose';
import { Flex, Select, Space } from 'antd';
import { getToken } from '@/features/auth/use-auth';
import { sendBroadcast, sendDirectMessage } from '@/features/message/api';
import { BROADCAST_SEND, DIRECT_SEND } from '@/features/message/constants';
import type { RealtimeReadyPayload } from '@/features/realtime/message';
import { parseRealtimeEnvelope } from '@/features/realtime/message';
import { pushWebSocketMessage } from '@/features/websocket/api';
import type { ConnectionState } from '@/features/websocket/types';
import { useAppWebSocket } from '@/features/websocket/use-websocket';
import { useUserInfoQuery } from '@/service/api/system-user';

interface WebSocketLogEntry {
  /** 消息方向，system 表示连接状态变化。 */
  direction: 'in' | 'out' | 'system';
  /** 原始帧或状态文本。 */
  message: string;
  /** 记录产生时间。 */
  timestamp: number;
  /** 信封里的 type，裸文本和状态变化没有。 */
  type?: string;
}

const MAX_LOGS = 50;
const JsonObjectSchema = z.record(z.string(), z.unknown());
const stateLabels: Record<ConnectionState, string> = {
  connected: '已连接',
  connecting: '连接中',
  disconnected: '已断开',
  idle: '未启动'
};
const directionColors = { in: 'green', out: 'blue', system: 'default' } as const;
const directionLabels = { in: '接收', out: '发送', system: '状态' } as const;
const DEFAULT_BODY = JSON.stringify({ content: '前端主动发送的测试消息', title: '前端消息', type: 'info' }, null, 2);
const BODY_TEMPLATES = {
  notification: DEFAULT_BODY,
  text: JSON.stringify('一段纯文本，会走 fallback 转成通知', null, 2),
  invalid: '{ title: 前端消息, }'
} as const;
const PUSH_TYPES = ['success', 'info', 'warning', 'error', 'message'] as const;
type DirectionFilter = 'all' | WebSocketLogEntry['direction'];
const PANEL_CLASS =
  'h-full w-full overflow-hidden rounded-10px border-border-secondary bg-container shadow-sm [&_.ant-card-head]:border-b-border-secondary [&_.ant-card-head]:bg-layout [&_.ant-card-head]:px-16px [&_.ant-card-head]:py-12px [&_.ant-card-head-title]:text-14px [&_.ant-card-head-title]:font-600 [&_.ant-card-body]:p-16px';
const EVENT_PANEL_CLASS =
  'w-full rounded-10px border-border-secondary bg-container shadow-sm [&_.ant-card-head]:border-b-border-secondary [&_.ant-card-head]:bg-layout [&_.ant-card-head]:px-16px [&_.ant-card-head]:py-12px [&_.ant-card-head-title]:text-14px [&_.ant-card-head-title]:font-600 [&_.ant-card-body]:p-16px';
const CONTROL_CLASS = 'rounded-6px';
const ACTION_CLASS = 'rounded-6px font-500';

function parseRecipients(raw: string): number[] | null {
  const ids = raw
    .split(/[,，\s]+/)
    .filter(Boolean)
    .map(Number);

  return ids.length > 0 && ids.every(id => Number.isInteger(id)) ? ids : null;
}

function maskValue(value: string | null | undefined) {
  if (!value) return '缺失';
  if (value.length <= 10) return `${value.slice(0, 4)}…`;

  return `${value.slice(0, 7)}…${value.slice(-3)}`;
}

function getConnectionBadgeStatus(state: ConnectionState) {
  if (state === 'connected') return 'success';
  if (state === 'connecting') return 'processing';

  return 'default';
}

async function copyLog(message: string) {
  await navigator.clipboard.writeText(message);
  showSuccessMessage('原始帧已复制');
}

async function copyText(value: string, message = '内容已复制') {
  await navigator.clipboard.writeText(value);
  showSuccessMessage(message);
}

const WebSocketTest = () => {
  const [logs, setLogs] = useState<WebSocketLogEntry[]>([]);
  const [messageBody, setMessageBody] = useState(DEFAULT_BODY);
  const [messageTemplate, setMessageTemplate] = useState<keyof typeof BODY_TEMPLATES>('notification');
  const [pushing, setPushing] = useState(false);
  const [recipients, setRecipients] = useState('');
  const [pushTitle, setPushTitle] = useState('后端主动推送');
  const [pushType, setPushType] = useState<(typeof PUSH_TYPES)[number]>('success');
  const [serverMessage, setServerMessage] = useState('后端主动推送的测试消息');
  const [readyInfo, setReadyInfo] = useState<RealtimeReadyPayload | null>(null);
  const [expandedLog, setExpandedLog] = useState<number | null>(null);
  const [directionFilter, setDirectionFilter] = useState<DirectionFilter>('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [paused, setPaused] = useState(false);
  const [pausedLogs, setPausedLogs] = useState<WebSocketLogEntry[]>([]);
  // 暂停只决定新事件落哪个桶，不影响订阅关系，放 ref 才不会每次切换都退订重订一轮
  const pausedRef = useRef(false);
  const { client, state } = useAppWebSocket();

  const { data: userInfo } = useUserInfoQuery();
  const selfUserId = userInfo ? Number(userInfo.userId) : null;

  useEffect(() => {
    if (selfUserId !== null) setRecipients(current => current || String(selfUserId));
  }, [selfUserId]);

  // 就绪信息的真相在客户端上，这里只做镜像。ready 是瞬时事件，连接早在本页挂载前就就绪
  // 了，那一帧不会重放，所以先读一次快照补上；之后重连（ready）和断开（stateChange 时
  // 客户端已把它清空）都各自触发一次同步。
  useEffect(() => {
    function syncReady() {
      setReadyInfo(client.getReady());
    }

    syncReady();

    const offs = [client.on('ready', syncReady), client.on('stateChange', syncReady)];

    return () => offs.forEach(off => off());
  }, [client]);

  useEffect(() => {
    function append(direction: WebSocketLogEntry['direction'], message: string) {
      const type = direction === 'system' ? undefined : parseRealtimeEnvelope(message)?.type;

      const entry = { direction, message, timestamp: Date.now(), type };
      if (pausedRef.current) {
        setPausedLogs(current => [...current, entry]);
        return;
      }
      setLogs(current => [entry, ...current].slice(0, MAX_LOGS));
    }

    const offs = [
      client.on('message', raw => append('in', raw)),
      client.on('sent', raw => append('out', raw)),
      client.on('stateChange', next => append('system', `WebSocket ${stateLabels[next]}`))
    ];

    return () => offs.forEach(off => off());
  }, [client]);

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
    const ids = parseRecipients(recipients);
    if (!body || !ids) {
      if (!ids) showWarningMessage('收件人要填 userId，多个用逗号隔开');
      return;
    }

    if (sendDirectMessage(ids, body) === null) showWarningMessage('WebSocket 尚未连接');
  }

  function handleBroadcast() {
    const body = readBody();
    if (!body) return;
    if (sendBroadcast(body) === null) showWarningMessage('WebSocket 尚未连接');
  }

  async function handleServerPush() {
    const content = serverMessage.trim();
    if (!content) {
      showWarningMessage('请输入推送内容');
      return;
    }

    setPushing(true);
    try {
      const result = await pushWebSocketMessage({ content, title: pushTitle.trim() || '后端主动推送', type: pushType });
      showSuccessMessage(`消息已发布，本实例投递 ${result.local_connections} 个连接`);
    } finally {
      setPushing(false);
    }
  }

  function handlePauseChange() {
    const next = !pausedRef.current;

    pausedRef.current = next;
    setPaused(next);

    // 恢复接收时把暂停期间攒下的补回事件流，顺序保持「新的在上」
    if (!next) {
      setLogs(current => pausedLogs.toReversed().concat(current).slice(0, MAX_LOGS));
      setPausedLogs([]);
    }
  }

  function handleDisconnect() {
    showConfirmModal({
      content: '这条连接由全应用共用。断开后通知中心也将收不到实时消息，直到手动重连或刷新页面。',
      okButtonProps: { danger: true },
      okText: '仍要断开',
      title: '确认断开 WebSocket 连接？',
      onOk: () => client.disconnect()
    });
  }

  const checks = [
    {
      label: 'VITE_WEBSOCKET_ENABLED',
      note: '传输开关',
      ok: import.meta.env.VITE_WEBSOCKET_ENABLED === 'Y',
      value: import.meta.env.VITE_WEBSOCKET_ENABLED || '未配置',
      fail: '当前环境未开启该传输'
    },
    {
      label: 'VITE_WEBSOCKET_URL',
      note: '连接地址',
      ok: Boolean(import.meta.env.VITE_WEBSOCKET_URL),
      value: import.meta.env.VITE_WEBSOCKET_URL || '未配置',
      fail: '未配置连接地址'
    },
    {
      label: '登录令牌',
      note: 'getToken()',
      ok: Boolean(getToken()),
      value: maskValue(getToken()),
      fail: '未登录，连接需要令牌'
    },
    {
      label: 'clientid',
      note: 'VITE_AUTH_CLIENT_ID',
      ok: Boolean(import.meta.env.VITE_AUTH_CLIENT_ID),
      value: maskValue(import.meta.env.VITE_AUTH_CLIENT_ID),
      fail: '未配置客户端标识'
    }
  ];
  const envReady = checks.every(item => item.ok);
  const canOperate = state === 'connected';
  const availableTypes = Array.from(new Set(logs.map(item => item.type).filter(Boolean))) as string[];
  const filteredLogs = logs.filter(item => {
    const matchesDirection = directionFilter === 'all' || item.direction === directionFilter;
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesDirection && matchesType;
  });

  function renderEventContent() {
    if (logs.length === 0) return <AEmpty description="暂无 WebSocket 事件" />;
    if (filteredLogs.length === 0) return <AEmpty description="没有匹配的事件" />;

    return (
      <ASpace
        className="w-full"
        orientation="vertical"
        size={0}
      >
        {filteredLogs.map((item, index) => {
          const open = expandedLog === index;
          return (
            <div
              className="border-b border-border-secondary py-10px transition-colors hover:bg-layout last:border-b-0"
              key={`${item.timestamp}-${index}`}
            >
              <Flex
                align="center"
                gap={8}
                wrap="wrap"
              >
                <ATag color={directionColors[item.direction]}>{directionLabels[item.direction]}</ATag>
                <ATypography.Text
                  type="secondary"
                  className="font-mono text-12px"
                >
                  {new Date(item.timestamp).toLocaleTimeString()}
                </ATypography.Text>
                {item.type ? <ATag className="m-0 font-mono text-11px">{item.type}</ATag> : null}
                <ATypography.Text className="min-w-0 flex-1 break-all">
                  {item.direction === 'system'
                    ? item.message
                    : parseRealtimeEnvelope(item.message)?.msg || '原始实时帧'}
                </ATypography.Text>
                <Flex gap={2}>
                  <ButtonIcon
                    aria-label={open ? '收起原始帧' : '展开原始帧'}
                    className="h-28px w-28px rounded-6px text-13px"
                    icon={open ? 'ph:caret-up' : 'ph:caret-down'}
                    tooltipContent={open ? '收起原始帧' : '展开原始帧'}
                    onClick={() => setExpandedLog(open ? null : index)}
                  />
                  <ButtonIcon
                    aria-label="复制原始帧"
                    className="h-28px w-28px rounded-6px text-13px"
                    icon="ph:copy"
                    tooltipContent="复制原始帧"
                    onClick={() => copyLog(item.message)}
                  />
                </Flex>
              </Flex>
              {open ? (
                <pre className="m-0 mt-8px max-h-280px overflow-auto whitespace-pre-wrap break-all rounded-6px border border-border-secondary bg-layout p-12px font-mono text-12px leading-1.6">
                  {item.message}
                </pre>
              ) : null}
            </div>
          );
        })}
      </ASpace>
    );
  }

  return (
    <div className="h-full min-h-500px min-w-0 flex flex-col gap-16px overflow-x-hidden overflow-y-auto">
      <ARow
        className="min-w-0"
        gutter={[16, 16]}
        align="stretch"
      >
        <ACol
          lg={12}
          span={24}
          className="min-w-0 flex"
        >
          <ACard
            className={`${PANEL_CLASS} card-wrapper`}
            title="连接概览"
            extra={<ATag color={canOperate ? 'success' : 'default'}>{stateLabels[state]}</ATag>}
          >
            <ASpace
              className="w-full"
              orientation="vertical"
              size={14}
            >
              <Flex
                align="center"
                gap={8}
              >
                <ABadge status={getConnectionBadgeStatus(state)} />
                <ATypography.Text className="text-20px font-700 tracking-tight">{stateLabels[state]}</ATypography.Text>
              </Flex>
              <ADescriptions
                column={1}
                size="small"
                items={[
                  {
                    key: 'connection',
                    label: '连接 ID',
                    children: readyInfo ? (
                      <Flex
                        align="center"
                        gap={4}
                      >
                        <ATypography.Text className="font-mono">{readyInfo.connection_id}</ATypography.Text>
                        <ButtonIcon
                          aria-label="复制连接 ID"
                          className="h-26px w-26px rounded-6px text-13px"
                          icon="ph:copy"
                          tooltipContent="复制连接 ID"
                          onClick={() => copyText(readyInfo.connection_id, '连接 ID 已复制')}
                        />
                      </Flex>
                    ) : (
                      '未就绪，等待 ready 事件'
                    )
                  },
                  { key: 'user', label: '用户', children: readyInfo ? `uid ${readyInfo.user_id}` : '未就绪' },
                  { key: 'transport', label: '传输', children: readyInfo?.transport || 'websocket' },
                  {
                    key: 'heartbeat',
                    label: '心跳',
                    children: (
                      <Flex gap={8}>
                        <ATypography.Text>25s / 10s</ATypography.Text>
                        <ATag>配置值</ATag>
                      </Flex>
                    )
                  },
                  { key: 'close', label: '最近关闭', children: '—' }
                ]}
              />
              <AAlert
                description="这条连接由全应用共用，断开会同时影响通知中心。"
                showIcon
                type="warning"
              />
              <Space>
                <AButton
                  className={ACTION_CLASS}
                  icon={<SvgIcon icon="ph:arrow-clockwise" />}
                  onClick={() => {
                    client.disconnect();
                    client.connect();
                  }}
                  disabled={!envReady}
                >
                  重新连接
                </AButton>
                <AButton
                  className={ACTION_CLASS}
                  icon={<SvgIcon icon="ph:plugs" />}
                  danger
                  onClick={handleDisconnect}
                  disabled={state === 'idle'}
                >
                  断开
                </AButton>
              </Space>
            </ASpace>
          </ACard>
        </ACol>
        <ACol
          lg={12}
          span={24}
          className="min-w-0 flex"
        >
          <ACard
            className={`${PANEL_CLASS} card-wrapper`}
            title="环境自检"
            extra={<ATag color={envReady ? 'success' : 'warning'}>{envReady ? '全部就绪' : '存在缺项'}</ATag>}
          >
            <ASpace
              className="w-full"
              orientation="vertical"
              size={0}
            >
              {checks.map(item => (
                <Flex
                  align="start"
                  className="border-b border-border-secondary py-10px last:border-b-0"
                  gap={8}
                  key={item.label}
                >
                  <ATypography.Text className={item.ok ? 'text-success' : 'text-error'}>
                    {item.ok ? '✓' : '×'}
                  </ATypography.Text>
                  <div className="min-w-0 flex-1">
                    <ATypography.Text className="block">{item.label}</ATypography.Text>
                    <ATypography.Text
                      type="secondary"
                      className="text-12px"
                    >
                      {item.ok ? item.note : item.fail}
                    </ATypography.Text>
                  </div>
                  <ATypography.Text
                    className="max-w-140px truncate font-mono text-12px"
                    type="secondary"
                  >
                    {item.value}
                  </ATypography.Text>
                </Flex>
              ))}
              <AAlert
                className="mt-12px"
                description={
                  envReady
                    ? '全部就绪，连接地址可以安全拼装。完整地址不会展示。'
                    : `缺少 ${checks.filter(item => !item.ok).length} 项，连接不会发起。`
                }
                showIcon
                type={envReady ? 'info' : 'warning'}
              />
            </ASpace>
          </ACard>
        </ACol>
      </ARow>

      <ARow
        className="min-w-0"
        gutter={[16, 16]}
        align="stretch"
      >
        <ACol
          lg={12}
          span={24}
          className="min-w-0 flex"
        >
          <ACard
            className={`${PANEL_CLASS} card-wrapper`}
            title="上行命令"
            extra={<ATypography.Text type="secondary">{DIRECT_SEND}</ATypography.Text>}
          >
            <ASpace
              className="w-full"
              orientation="vertical"
              size={12}
            >
              <AInput
                className={CONTROL_CLASS}
                value={recipients}
                placeholder="收件人 userId，多个用逗号隔开"
                addonBefore="收件人"
                onChange={event => setRecipients(event.target.value)}
              />
              <Select
                className="w-full"
                value={messageTemplate}
                options={[
                  { label: '通知消息', value: 'notification' },
                  { label: '纯文本', value: 'text' },
                  { label: '非法 JSON', value: 'invalid' }
                ]}
                onChange={value => {
                  setMessageTemplate(value);
                  setMessageBody(BODY_TEMPLATES[value]);
                }}
              />
              <AInput.TextArea
                className={CONTROL_CLASS}
                autoSize={{ maxRows: 10, minRows: 7 }}
                value={messageBody}
                onChange={event => setMessageBody(event.target.value)}
              />
              <Space>
                <AButton
                  className={ACTION_CLASS}
                  icon={<SvgIcon icon="ph:paper-plane-tilt" />}
                  disabled={!canOperate}
                  type="primary"
                  onClick={handleDirectSend}
                >
                  定向发送
                </AButton>
                <AButton
                  className={ACTION_CLASS}
                  icon={<SvgIcon icon="ph:megaphone" />}
                  disabled={!canOperate}
                  onClick={handleBroadcast}
                >
                  群发（仅超管）
                </AButton>
              </Space>
              <AAlert
                description={`发给自己会原路发回；填别人可能被 403。${BROADCAST_SEND} 的范围由服务端决定。`}
                type="info"
              />
            </ASpace>
          </ACard>
        </ACol>
        <ACol
          lg={12}
          span={24}
          className="min-w-0 flex"
        >
          <ACard
            className={`${PANEL_CLASS} card-wrapper`}
            title="后端推送"
            extra={<ATypography.Text type="secondary">POST /websocket/push</ATypography.Text>}
          >
            <ASpace
              className="w-full"
              orientation="vertical"
              size={12}
            >
              <AInput
                className={CONTROL_CLASS}
                value={pushTitle}
                addonBefore="标题"
                onChange={event => setPushTitle(event.target.value)}
              />
              <Select
                className="w-full"
                value={pushType}
                options={PUSH_TYPES.map(type => ({ label: type, value: type }))}
                onChange={value => setPushType(value)}
              />
              <AInput.TextArea
                className={CONTROL_CLASS}
                autoSize={{ maxRows: 6, minRows: 5 }}
                value={serverMessage}
                onChange={event => setServerMessage(event.target.value)}
              />
              <AButton
                className={ACTION_CLASS}
                icon={<SvgIcon icon="ph:paper-plane-tilt" />}
                loading={pushing}
                type="primary"
                onClick={handleServerPush}
              >
                调用推送接口
              </AButton>
              <AAlert
                description="同一账号挂着的另一条传输也会收到消息；local_connections 只统计当前实例。"
                type="info"
              />
            </ASpace>
          </ACard>
        </ACol>
      </ARow>

      <ACard
        className={`${EVENT_PANEL_CLASS} card-wrapper`}
        title={
          <Flex
            align="center"
            gap={8}
          >
            <span>事件流</span>
            <ATypography.Text type="secondary">最近 {logs.length} 条</ATypography.Text>
          </Flex>
        }
        extra={
          <Flex
            align="center"
            gap={4}
          >
            <ButtonIcon
              aria-label={paused ? '继续接收事件' : '暂停接收事件'}
              className="h-30px w-30px rounded-6px text-15px"
              icon={paused ? 'ph:play' : 'ph:pause'}
              tooltipContent={paused ? '继续接收事件' : '暂停接收事件'}
              onClick={handlePauseChange}
            />
            <ButtonIcon
              aria-label="复制筛选结果"
              className="h-30px w-30px rounded-6px text-15px"
              icon="ph:copy"
              tooltipContent="复制筛选结果"
              disabled={filteredLogs.length === 0}
              onClick={() => copyText(filteredLogs.map(item => item.message).join('\n\n'), '筛选结果已复制')}
            />
            <ButtonIcon
              aria-label="清空事件流"
              className="h-30px w-30px rounded-6px text-15px"
              icon="ph:trash"
              tooltipContent="清空事件流"
              disabled={logs.length === 0}
              onClick={() => setLogs([])}
            />
          </Flex>
        }
      >
        <Flex
          align="center"
          className="mb-12px rounded-6px bg-layout px-10px py-8px"
          gap={8}
          wrap="wrap"
        >
          <Select
            className="min-w-120px"
            value={directionFilter}
            options={[
              { label: '全部方向', value: 'all' },
              { label: '发送', value: 'out' },
              { label: '接收', value: 'in' },
              { label: '状态', value: 'system' }
            ]}
            onChange={value => setDirectionFilter(value)}
          />
          <Select
            className="min-w-150px"
            value={typeFilter}
            options={[
              { label: '全部类型', value: 'all' },
              ...availableTypes.map(type => ({ label: type, value: type }))
            ]}
            onChange={value => setTypeFilter(value)}
          />
          <ATypography.Text type="secondary">
            {paused
              ? `已暂停${pausedLogs.length ? `，待处理 ${pausedLogs.length} 条` : ''}`
              : `显示 ${filteredLogs.length} 条`}
          </ATypography.Text>
        </Flex>
        {renderEventContent()}
        {logs.length >= MAX_LOGS ? (
          <AAlert
            className="mt-12px"
            description={`已达上限，仅保留最近 ${MAX_LOGS} 条，更早记录已淘汰。`}
            type="warning"
          />
        ) : null}
      </ACard>
    </div>
  );
};

export const Route = createFileRoute('/(admin)/websocket-test/')({
  component: WebSocketTest,
  staticData: { menu: { icon: 'mdi:connection', order: 20 }, title: 'WebSocket 测试', requiresAuth: false }
});

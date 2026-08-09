import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { showConfirmModal } from '@skyroc/web-admin-theme';
import { ButtonIcon } from '@skyroc/web-ui-antd';
import { SvgIcon } from '@skyroc/web-ui-compose';
import { Flex, Select, Space } from 'antd';
import { getToken } from '@/features/auth/use-auth';
import type { RealtimeReadyPayload } from '@/features/realtime/message';
import { parseRealtimeEnvelope } from '@/features/realtime/message';
import { pushSseMessage } from '@/features/sse/api';
import type { ConnectionState } from '@/features/sse/types';
import { useAppSse } from '@/features/sse/use-sse';

interface SseLogEntry {
  /** 消息方向，SSE 没有 out。 */
  direction: 'in' | 'system';
  /** 原始帧或状态文本。 */
  message: string;
  /** 记录产生时间。 */
  timestamp: number;
  /** 信封里的 type，状态变化没有。 */
  type?: string;
}

const MAX_LOGS = 50;
const stateLabels: Record<ConnectionState, string> = {
  connected: '已连接',
  connecting: '连接中',
  disconnected: '已断开',
  idle: '未启动'
};
const directionColors = { in: 'green', system: 'default' } as const;
const directionLabels = { in: '接收', system: '状态' } as const;
const PUSH_TYPES = ['success', 'info', 'warning', 'error', 'message'] as const;
type DirectionFilter = 'all' | SseLogEntry['direction'];
const PANEL_CLASS =
  'h-full w-full overflow-hidden rounded-10px border-border-secondary bg-container shadow-sm [&_.ant-card-head]:border-b-border-secondary [&_.ant-card-head]:bg-layout [&_.ant-card-head]:px-16px [&_.ant-card-head]:py-12px [&_.ant-card-head-title]:text-14px [&_.ant-card-head-title]:font-600 [&_.ant-card-body]:p-16px';
const EVENT_PANEL_CLASS =
  'w-full rounded-10px border-border-secondary bg-container shadow-sm [&_.ant-card-head]:border-b-border-secondary [&_.ant-card-head]:bg-layout [&_.ant-card-head]:px-16px [&_.ant-card-head]:py-12px [&_.ant-card-head-title]:text-14px [&_.ant-card-head-title]:font-600 [&_.ant-card-body]:p-16px';
const CONTROL_CLASS = 'rounded-6px';
const ACTION_CLASS = 'rounded-6px font-500';

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

const SseTest = () => {
  const navigate = useNavigate();
  const { client, state } = useAppSse();
  const [logs, setLogs] = useState<SseLogEntry[]>([]);
  const [pushing, setPushing] = useState(false);
  const [pushTitle, setPushTitle] = useState('后端主动推送');
  const [pushType, setPushType] = useState<(typeof PUSH_TYPES)[number]>('success');
  const [serverMessage, setServerMessage] = useState('后端主动推送的测试消息');
  const [readyInfo, setReadyInfo] = useState<RealtimeReadyPayload | null>(null);
  const [expandedLog, setExpandedLog] = useState<number | null>(null);
  const [directionFilter, setDirectionFilter] = useState<DirectionFilter>('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [paused, setPaused] = useState(false);
  const [pausedLogs, setPausedLogs] = useState<SseLogEntry[]>([]);
  // 暂停只决定新事件落哪个桶，不影响订阅关系，放 ref 才不会每次切换都退订重订一轮
  const pausedRef = useRef(false);

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
    function append(direction: SseLogEntry['direction'], message: string, type?: string) {
      const entry = { direction, message, timestamp: Date.now(), type };
      if (pausedRef.current) {
        setPausedLogs(current => [...current, entry]);
        return;
      }
      setLogs(current => [entry, ...current].slice(0, MAX_LOGS));
    }

    const offs = [
      client.on('message', raw => append('in', raw, parseRealtimeEnvelope(raw)?.type)),
      client.on('closed', info => append('system', `服务端结束连接：${info.reason || '未说明'}（${info.code}）`)),
      client.on('error', willRetry =>
        append('system', willRetry ? '连接中断，浏览器将自动重连' : '连接失败，不会重连')
      ),
      client.on('stateChange', next => append('system', `SSE ${stateLabels[next]}`))
    ];

    return () => offs.forEach(off => off());
  }, [client]);

  async function handleServerPush() {
    const content = serverMessage.trim();
    if (!content) {
      showWarningMessage('请输入推送内容');
      return;
    }

    setPushing(true);
    try {
      const result = await pushSseMessage({ content, title: pushTitle.trim() || '后端主动推送', type: pushType });
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
      title: '确认断开 SSE 连接？',
      onOk: () => client.disconnect()
    });
  }

  const checks = [
    {
      label: 'VITE_SSE_ENABLED',
      note: '传输开关',
      ok: import.meta.env.VITE_SSE_ENABLED === 'Y',
      value: import.meta.env.VITE_SSE_ENABLED || '未配置',
      fail: '当前环境未开启该传输'
    },
    {
      label: 'VITE_SSE_URL',
      note: '连接地址',
      ok: Boolean(import.meta.env.VITE_SSE_URL),
      value: import.meta.env.VITE_SSE_URL || '未配置',
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
    if (logs.length === 0) return <AEmpty description="暂无 SSE 事件" />;
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
                <pre className="m-0 mt-8px max-h-280px overflow-auto whitespace-pre-wrap break-all rounded-6px border border-border-secondary bg-fill-2 p-12px font-mono text-12px leading-1.6">
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
      <Flex
        align="center"
        className="border-b border-border-secondary pb-12px"
        justify="between"
        wrap="wrap"
        gap={12}
      >
        <div>
          <div className="flex items-center gap-10px">
            <span className="h-10px w-10px rounded-full bg-primary shadow-[0_0_0_4px_var(--primary-1)]" />
            <h1 className="m-0 text-24px font-700 tracking-tight">SSE 联调</h1>
          </div>
          <div className="mt-6px text-13px text-text-2">单向连接，只收不发。要给后端发东西请走普通 HTTP 接口。</div>
        </div>
        <AButton
          className={ACTION_CLASS}
          icon={<SvgIcon icon="ph:arrow-right" />}
          onClick={() => navigate({ to: '/websocket-test' })}
        >
          切换到 WebSocket
        </AButton>
      </Flex>

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
                  { key: 'transport', label: '传输', children: readyInfo?.transport || 'sse' },
                  {
                    key: 'reconnect',
                    label: '重连',
                    children: (
                      <Flex gap={8}>
                        <ATypography.Text>EventSource 负责</ATypography.Text>
                        <ATag>前端不退避</ATag>
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
                  <ATypography.Text className={item.ok ? 'text-success' : 'text-danger'}>
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
            title="后端推送"
            extra={<ATypography.Text type="secondary">POST /sse/push</ATypography.Text>}
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
                autoSize={{ maxRows: 6, minRows: 6 }}
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
                description="SSE 只负责接收；同一账号挂着的 WebSocket 连接也会收到同一条消息。"
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
            title="传输说明"
          >
            <ASpace
              className="w-full"
              orientation="vertical"
              size={12}
            >
              <AAlert
                description="SSE 使用浏览器原生 EventSource 管理重连，前端不实现指数退避。"
                showIcon
                type="info"
              />
              <AAlert
                description="连接就绪前不会展示连接 ID；服务端主动关闭会记录关闭码和原因。"
                showIcon
                type="warning"
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

export const Route = createFileRoute('/(admin)/sse-test/')({
  component: SseTest,
  staticData: { menu: { icon: 'mdi:broadcast', order: 21 }, requiresAuth: false, title: 'SSE 测试' }
});

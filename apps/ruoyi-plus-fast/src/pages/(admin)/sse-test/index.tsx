import { createFileRoute } from '@tanstack/react-router';

import { pushSseMessage } from '@/features/sse/api';
import { getSseConnectionId, getSseConnectionStatus, subscribeSseRuntime } from '@/features/sse/runtime';
import type { SseConnectionStatus, SseRuntimeEvent } from '@/features/sse/runtime';

const MAX_LOGS = 50;
const directionColors = {
  in: 'green',
  system: 'default'
} as const;
const directionLabels = {
  in: '接收',
  system: '状态'
} as const;

const SseTest = () => {
  const [connectionId, setConnectionId] = useState(getSseConnectionId());
  const [logs, setLogs] = useState<SseRuntimeEvent[]>([]);
  const [pushing, setPushing] = useState(false);
  const [serverMessage, setServerMessage] = useState('后端主动推送的测试消息');
  const [status, setStatus] = useState<SseConnectionStatus>(getSseConnectionStatus());

  useEffect(() => {
    return subscribeSseRuntime(event => {
      if (event.direction === 'system') {
        setStatus(getSseConnectionStatus());
        setConnectionId(getSseConnectionId());
      }
      setLogs(current => [event, ...current].slice(0, MAX_LOGS));
    });
  }, []);

  async function handleServerPush() {
    const content = serverMessage.trim();
    if (!content) {
      showWarningMessage('请输入推送内容');
      return;
    }

    setPushing(true);
    try {
      const result = await pushSseMessage({
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
      <ACard title="SSE 联调">
        <ASpace className="w-full" orientation="vertical" size={12}>
          <div>
            当前状态：
            <ABadge
              status={status === 'connected' ? 'success' : 'error'}
              text={status === 'connected' ? '已连接' : '未连接'}
            />
            {connectionId ? <span className="ml-8px text-tertiary">连接 ID：{connectionId}</span> : null}
          </div>
          <div className="text-text-2">
            SSE 是单向的，前端只能收不能发，要给后端发东西请走普通 HTTP 接口。断线重连由浏览器的 EventSource
            自己负责，前端不用写退避逻辑。
          </div>
          <div className="text-text-2">
            投递不区分传输：后端的连接注册表是同一张，这里推的消息同一个账号挂着的 WebSocket 连接也会收到。
          </div>
        </ASpace>
      </ACard>

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

      <ACard
        extra={
          <AButton disabled={logs.length === 0} size="small" onClick={() => setLogs([])}>
            清空
          </AButton>
        }
        title="接收记录"
      >
        {logs.length === 0 ? (
          <AEmpty description="暂无 SSE 事件" />
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

export const Route = createFileRoute('/(admin)/sse-test/')({
  component: SseTest,
  staticData: {
    menu: {
      icon: 'mdi:broadcast',
      order: 21
    },
    requiresAuth: false,
    title: 'SSE 测试'
  }
});

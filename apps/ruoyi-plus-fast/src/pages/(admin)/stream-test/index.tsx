import { createFileRoute } from '@tanstack/react-router';

import { streamText } from '@/features/sse/text-stream';

const SAMPLE =
  '流式输出的关键不在前端，而在整条链路上没有任何一层把内容攒起来。' +
  '后端产出一段就发一段，反代不缓冲，前端读到一段就渲染一段，用户才会看到字在往外冒。';

const StreamTest = () => {
  const [prompt, setPrompt] = useState(SAMPLE);
  const [output, setOutput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [firstByteMs, setFirstByteMs] = useState<null | number>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // 组件卸载时把还开着的流掐掉，否则后端会继续产出到一个没人读的连接上
    return () => abortRef.current?.abort();
  }, []);

  function handleStop() {
    abortRef.current?.abort();
  }

  async function handleStart() {
    const text = prompt.trim();
    if (!text) {
      showWarningMessage('请输入内容');
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    const startedAt = performance.now();

    setOutput('');
    setFirstByteMs(null);
    setStreaming(true);

    try {
      await streamText({
        body: { delay_ms: 30, text },
        handlers: {
          onDelta(delta) {
            setFirstByteMs(current => current ?? Math.round(performance.now() - startedAt));
            setOutput(current => current + delta);
          },
          onDone() {
            showSuccessMessage('生成完毕');
          },
          onError(message) {
            showErrorMessage(message);
          }
        },
        path: '/sse/stream',
        signal: controller.signal
      });
    } catch (error) {
      // 用户点停止属于正常路径，不是错误
      if (!controller.signal.aborted) {
        showErrorMessage(error instanceof Error ? error.message : '连接失败');
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }

  return (
    <ASpace
      className="w-full"
      orientation="vertical"
      size={16}
    >
      <ACard title="流式输出联调">
        <ASpace
          className="w-full"
          orientation="vertical"
          size={12}
        >
          <div className="text-secondary">
            这条流和 SSE 测试页那条常驻连接不是一回事：它是<b>请求作用域</b>的，一次请求一条流，只发给发起它的这个
            标签页，产出完就结束。通知推送才走连接注册表，会发给你所有在线的设备。
          </div>
          <div className="text-secondary">
            后端逐字产出（`/api/v1/sse/stream`），接真实模型时把产出那个异步生成器换掉即可，编码和传输层不用动。
          </div>
        </ASpace>
      </ACard>

      <ACard title="输入">
        <ASpace
          className="w-full"
          orientation="vertical"
          size={12}
        >
          <AInput.TextArea
            autoSize={{ maxRows: 8, minRows: 4 }}
            disabled={streaming}
            value={prompt}
            onChange={event => setPrompt(event.target.value)}
          />
          <ASpace>
            <AButton
              loading={streaming}
              type="primary"
              onClick={handleStart}
            >
              开始生成
            </AButton>
            <AButton
              danger
              disabled={!streaming}
              onClick={handleStop}
            >
              停止
            </AButton>
          </ASpace>
        </ASpace>
      </ACard>

      <ACard
        extra={
          <ASpace size={12}>
            {firstByteMs === null ? null : <span className="text-tertiary">首字 {firstByteMs}ms</span>}
            <span className="text-tertiary">{output.length} 字</span>
          </ASpace>
        }
        title="输出"
      >
        {output ? (
          <div className="whitespace-pre-wrap break-all leading-7">
            {output}
            {streaming ? <span className="ml-1 animate-pulse">▌</span> : null}
          </div>
        ) : (
          <AEmpty description={streaming ? '等待首字…' : '还没有内容'} />
        )}
      </ACard>
    </ASpace>
  );
};

export const Route = createFileRoute('/(admin)/stream-test/')({
  component: StreamTest,
  staticData: {
    menu: {
      icon: 'mdi:text-box-search-outline',
      order: 22
    },
    requiresAuth: false,
    title: '流式输出测试'
  }
});

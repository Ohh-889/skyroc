import { TaskHub } from '@skyroc/utils/scheduler';

const DEFAULT_UPDATE_CHECK_INTERVAL = 3 * 60 * 1000;

/** 心跳粒度的上下限，见 resolveTickInterval */
const MIN_TICK_INTERVAL = 1_000;
const MAX_TICK_INTERVAL = 30_000;

const CHECK_TASK = 'check-update';
const VISIBILITY_TASK = 'visibility';

interface GetHtmlBuildTimeOptions {
  /** HTML entry base URL, usually Vite's base URL. */
  baseUrl?: string;

  /** Fetch implementation used to read the current index.html. */
  fetcher?: typeof fetch;

  /** Aborts the in-flight request when the caller tears down. */
  signal?: AbortSignal;
}

export interface AppUpdateAvailableContext {
  /** Build time bundled in the running application. */
  currentBuildTime: string;

  /** Build time read from the latest index.html. */
  latestBuildTime: string;

  /** Allows the next update check after the host notification closes. */
  markPromptClosed: () => void;
}

export interface SetupAppVersionNotificationOptions {
  /** HTML entry base URL, usually Vite's base URL. */
  baseUrl?: string;

  /** Build time bundled in the running application. */
  currentBuildTime: string;

  /** Whether update checks should be started. */
  enabled: boolean;

  /** Check interval in milliseconds. */
  interval?: number;

  /** Receives fetch errors from update checking. */
  onError?: (error: unknown) => void;

  /** Called when a newer build is detected. */
  onUpdateAvailable: (context: AppUpdateAvailableContext) => void;
}

export async function getHtmlBuildTime(options: GetHtmlBuildTimeOptions = {}): Promise<string | null> {
  const { baseUrl = '/', fetcher = globalThis.fetch?.bind(globalThis), signal } = options;

  if (!fetcher) return null;

  const res = await fetcher(`${baseUrl}index.html?time=${Date.now()}`, { signal });

  if (!res.ok) {
    return null;
  }

  const html = await res.text();
  const match = html.match(/<meta name="buildTime" content="([^"]*)">/);

  return match?.[1] || null;
}

/**
 * 由检查间隔推导心跳粒度
 *
 * 周期任务的实际触发时刻落在 `[interval, interval + tickInterval)` 内。取 interval 的一半 是为了让抖动不超过 50%（3 分钟的检查不会拖成 6 分钟），封顶 30s
 * 是为了不给一个低频任务 每秒空转的心跳。
 */
function resolveTickInterval(interval: number): number {
  return Math.max(MIN_TICK_INTERVAL, Math.min(Math.floor(interval / 2), MAX_TICK_INTERVAL));
}

export function setupAppVersionNotification(options: SetupAppVersionNotificationOptions) {
  const {
    baseUrl = '/',
    currentBuildTime,
    enabled,
    interval = DEFAULT_UPDATE_CHECK_INTERVAL,
    onError,
    onUpdateAvailable
  } = options;

  if (!enabled || typeof document === 'undefined') return;

  /** 更新提示还开着的时候不再重复检查，等用户处理完再说 */
  let isPromptOpen = false;

  const hub = new TaskHub({
    onTaskError: (_taskName, error) => onError?.(error),
    tickInterval: resolveTickInterval(interval)
  });

  async function checkForUpdates(ctx: { signal: AbortSignal }) {
    if (isPromptOpen) return;

    const latestBuildTime = await getHtmlBuildTime({ baseUrl, signal: ctx.signal });

    if (!latestBuildTime || latestBuildTime === currentBuildTime) {
      return;
    }

    isPromptOpen = true;

    onUpdateAvailable({
      currentBuildTime,
      latestBuildTime,
      markPromptClosed() {
        isPromptOpen = false;
      }
    });
  }

  function handleVisibilityChange() {
    if (document.visibilityState !== 'visible') {
      hub.pause();
      return;
    }

    hub.resume();
    // 回到前台立刻查一次，并把周期计时从此刻重新起算
    hub.trigger(CHECK_TASK);
  }

  hub.register({
    // 启动那一刻检查没有意义：比对的正是刚加载进来的这份构建
    immediate: false,
    interval,
    name: CHECK_TASK,
    run: checkForUpdates,
    type: 'periodic'
  });

  hub.register({
    cleanup: () => document.removeEventListener('visibilitychange', handleVisibilityChange),
    name: VISIBILITY_TASK,
    // 监听器的注册与「此刻是否可见」无关：在后台加载的页面切到前台时同样要能恢复轮询
    run: () => document.addEventListener('visibilitychange', handleVisibilityChange),
    type: 'listener'
  });

  hub.start();

  if (document.visibilityState !== 'visible') {
    hub.pause();
  }

  return () => hub.dispose();
}

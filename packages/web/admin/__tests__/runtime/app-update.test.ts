// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { setupAppVersionNotification } from '@shell/runtime/app-update';

const CURRENT_BUILD_TIME = '2026-01-01 00:00:00';
const NEWER_BUILD_TIME = '2026-02-02 00:00:00';

/** 覆写 document.visibilityState —— 原生属性是只读的 */
function setVisibility(state: 'hidden' | 'visible') {
  Object.defineProperty(document, 'visibilityState', {
    configurable: true,
    get: () => state
  });
}

function htmlWith(buildTime: string) {
  return `<html><head><meta name="buildTime" content="${buildTime}"></head><body></body></html>`;
}

/** 每次 fetch 都返回指定构建时间的 index.html */
function mockFetch(buildTime: string) {
  return vi.fn(async () => ({
    ok: true,
    text: async () => htmlWith(buildTime)
  })) as unknown as typeof fetch;
}

function setup(overrides: Partial<Parameters<typeof setupAppVersionNotification>[0]> = {}) {
  const onUpdateAvailable = vi.fn();
  const onError = vi.fn();

  const cleanup = setupAppVersionNotification({
    currentBuildTime: CURRENT_BUILD_TIME,
    enabled: true,
    interval: 60_000,
    onError,
    onUpdateAvailable,
    ...overrides
  });

  return { cleanup, onError, onUpdateAvailable };
}

beforeEach(() => {
  vi.useFakeTimers();
  setVisibility('visible');
  vi.stubGlobal('fetch', mockFetch(CURRENT_BUILD_TIME));
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('setupAppVersionNotification - 开关', () => {
  it('enabled 为 false 时不做任何事', async () => {
    const { cleanup, onUpdateAvailable } = setup({ enabled: false });

    expect(cleanup).toBeUndefined();

    await vi.advanceTimersByTimeAsync(300_000);
    expect(fetch).not.toHaveBeenCalled();
    expect(onUpdateAvailable).not.toHaveBeenCalled();
  });
});

describe('setupAppVersionNotification - 轮询', () => {
  it('启动时不检查，第一次检查发生在一个完整间隔之后', async () => {
    const { cleanup } = setup();

    // 刚加载的就是当前构建，此刻比对没有意义
    expect(fetch).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(59_000);
    expect(fetch).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(31_000);
    expect(fetch).toHaveBeenCalledTimes(1);

    cleanup?.();
  });

  it('检测到新构建时通知，且在提示关闭前不再重复检查', async () => {
    vi.stubGlobal('fetch', mockFetch(NEWER_BUILD_TIME));
    const { cleanup, onUpdateAvailable } = setup();

    await vi.advanceTimersByTimeAsync(90_000);
    expect(onUpdateAvailable).toHaveBeenCalledTimes(1);

    const calls = (fetch as unknown as ReturnType<typeof vi.fn>).mock.calls.length;

    // 提示还开着，后续周期不应再打请求
    await vi.advanceTimersByTimeAsync(300_000);
    expect((fetch as unknown as ReturnType<typeof vi.fn>).mock.calls.length).toBe(calls);
    expect(onUpdateAvailable).toHaveBeenCalledTimes(1);

    // 用户关掉提示后恢复检查
    onUpdateAvailable.mock.calls[0][0].markPromptClosed();
    await vi.advanceTimersByTimeAsync(120_000);
    expect(onUpdateAvailable).toHaveBeenCalledTimes(2);

    cleanup?.();
  });

  it('构建时间一致时不通知', async () => {
    const { cleanup, onUpdateAvailable } = setup();

    await vi.advanceTimersByTimeAsync(300_000);

    expect(fetch).toHaveBeenCalled();
    expect(onUpdateAvailable).not.toHaveBeenCalled();

    cleanup?.();
  });

  it('请求失败走 onError，且不影响后续周期', async () => {
    const failing = vi.fn(async () => {
      throw new Error('network down');
    }) as unknown as typeof fetch;
    vi.stubGlobal('fetch', failing);

    const { cleanup, onError } = setup();

    await vi.advanceTimersByTimeAsync(90_000);
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0][0]).toBeInstanceOf(Error);

    await vi.advanceTimersByTimeAsync(90_000);
    expect(onError.mock.calls.length).toBeGreaterThanOrEqual(2);

    cleanup?.();
  });
});

describe('setupAppVersionNotification - 可见性', () => {
  it('切到后台暂停轮询，回到前台立即检查一次', async () => {
    const { cleanup } = setup();

    await vi.advanceTimersByTimeAsync(90_000);
    const afterFirst = (fetch as unknown as ReturnType<typeof vi.fn>).mock.calls.length;
    expect(afterFirst).toBe(1);

    setVisibility('hidden');
    document.dispatchEvent(new Event('visibilitychange'));

    // 后台期间不再打请求
    await vi.advanceTimersByTimeAsync(600_000);
    expect((fetch as unknown as ReturnType<typeof vi.fn>).mock.calls.length).toBe(afterFirst);

    setVisibility('visible');
    document.dispatchEvent(new Event('visibilitychange'));
    await vi.advanceTimersByTimeAsync(0);

    // 回到前台立刻查一次，且只查一次
    expect((fetch as unknown as ReturnType<typeof vi.fn>).mock.calls.length).toBe(afterFirst + 1);

    cleanup?.();
  });

  it('回到前台后周期计时从该时刻重新起算', async () => {
    const { cleanup } = setup();

    setVisibility('hidden');
    document.dispatchEvent(new Event('visibilitychange'));
    await vi.advanceTimersByTimeAsync(200_000);

    setVisibility('visible');
    document.dispatchEvent(new Event('visibilitychange'));
    await vi.advanceTimersByTimeAsync(0);

    const afterFocus = (fetch as unknown as ReturnType<typeof vi.fn>).mock.calls.length;
    expect(afterFocus).toBe(1);

    // 距 trigger 不足一个 interval，不应再查
    await vi.advanceTimersByTimeAsync(50_000);
    expect((fetch as unknown as ReturnType<typeof vi.fn>).mock.calls.length).toBe(afterFocus);

    await vi.advanceTimersByTimeAsync(40_000);
    expect((fetch as unknown as ReturnType<typeof vi.fn>).mock.calls.length).toBe(afterFocus + 1);

    cleanup?.();
  });

  it('在后台加载的页面，切到前台后依然能开始轮询', async () => {
    setVisibility('hidden');

    const { cleanup } = setup();

    await vi.advanceTimersByTimeAsync(600_000);
    expect(fetch).not.toHaveBeenCalled();

    setVisibility('visible');
    document.dispatchEvent(new Event('visibilitychange'));
    await vi.advanceTimersByTimeAsync(0);

    expect(fetch).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(90_000);
    expect((fetch as unknown as ReturnType<typeof vi.fn>).mock.calls.length).toBe(2);

    cleanup?.();
  });
});

describe('setupAppVersionNotification - 清理', () => {
  it('cleanup 后停止轮询并注销 visibilitychange 监听', async () => {
    const removeSpy = vi.spyOn(document, 'removeEventListener');
    const { cleanup } = setup();

    await vi.advanceTimersByTimeAsync(90_000);
    const beforeCleanup = (fetch as unknown as ReturnType<typeof vi.fn>).mock.calls.length;

    cleanup?.();

    expect(removeSpy).toHaveBeenCalledWith('visibilitychange', expect.any(Function));

    await vi.advanceTimersByTimeAsync(600_000);
    expect((fetch as unknown as ReturnType<typeof vi.fn>).mock.calls.length).toBe(beforeCleanup);

    // cleanup 之后的可见性变化不应再触发任何请求
    setVisibility('hidden');
    document.dispatchEvent(new Event('visibilitychange'));
    setVisibility('visible');
    document.dispatchEvent(new Event('visibilitychange'));
    await vi.advanceTimersByTimeAsync(120_000);

    expect((fetch as unknown as ReturnType<typeof vi.fn>).mock.calls.length).toBe(beforeCleanup);

    removeSpy.mockRestore();
  });

  it('cleanup 会中断在途的检查请求', async () => {
    let capturedSignal: AbortSignal | undefined;

    const hangingFetch = vi.fn(
      (_url: string, init?: { signal?: AbortSignal }) =>
        new Promise((_resolve, reject) => {
          capturedSignal = init?.signal;
          init?.signal?.addEventListener('abort', () => reject(new Error('aborted')));
        })
    ) as unknown as typeof fetch;
    vi.stubGlobal('fetch', hangingFetch);

    const { cleanup, onError } = setup();

    await vi.advanceTimersByTimeAsync(90_000);
    expect(capturedSignal?.aborted).toBe(false);

    cleanup?.();

    expect(capturedSignal?.aborted).toBe(true);

    // 中断属于主动拆卸，不该当成检查失败上报给宿主
    await vi.advanceTimersByTimeAsync(1000);
    expect(onError).not.toHaveBeenCalled();
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { TaskHub } from '../src/scheduler';
import type { InitSettleResult } from '../src/scheduler';

/** 只推进微任务队列，不推进时钟 —— 用于验证 init 调度不依赖定时器 */
async function flush(times = 20) {
  for (let i = 0; i < times; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await Promise.resolve();
  }
}

/** 返回一个在指定时长后 resolve 的 run */
function delayed(ms: number, onDone?: () => void) {
  return () =>
    new Promise<void>(resolve => {
      setTimeout(() => {
        onDone?.();
        resolve();
      }, ms);
    });
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('TaskHub - 注册与校验', () => {
  it('链式注册与批量注册', () => {
    const hub = new TaskHub();

    hub.register({ name: 'a', run: vi.fn(), type: 'init' }).register({ name: 'b', run: vi.fn(), type: 'init' });
    hub.registerAll([
      { name: 'c', run: vi.fn(), type: 'init' },
      { name: 'd', run: vi.fn(), type: 'init' }
    ]);

    expect(hub.snapshot()).toHaveLength(4);
  });

  it('重复注册同名任务抛错，而不是静默跳过', () => {
    const hub = new TaskHub();

    hub.register({ name: 'a', run: vi.fn(), type: 'init' });

    expect(() => hub.register({ name: 'a', run: vi.fn(), type: 'init' })).toThrow('already registered');
  });

  it('缺少 name / run 抛错', () => {
    const hub = new TaskHub();

    expect(() => hub.register({ name: '', run: vi.fn(), type: 'init' })).toThrow('name is required');
    expect(() => hub.register({ name: 'a', run: undefined as any, type: 'init' })).toThrow('must have a run function');
  });

  it('periodic interval <= 0 抛错', () => {
    const hub = new TaskHub();

    expect(() => hub.register({ interval: 0, name: 'a', run: vi.fn(), type: 'periodic' })).toThrow(
      'interval must be positive'
    );
  });

  it('自引用抛错', () => {
    const hub = new TaskHub();

    expect(() => hub.register({ deps: ['a'], name: 'a', run: vi.fn(), type: 'init' })).toThrow(
      'cannot depend on itself'
    );
  });

  it('菱形依赖合法，不误判为环', async () => {
    const order: string[] = [];
    const hub = new TaskHub();

    hub.register({
      name: 'a',
      run: () => {
        order.push('a');
      },
      type: 'init'
    });
    hub.register({
      deps: ['a'],
      name: 'b',
      run: () => {
        order.push('b');
      },
      type: 'init'
    });
    hub.register({
      deps: ['a'],
      name: 'c',
      run: () => {
        order.push('c');
      },
      type: 'init'
    });

    expect(() =>
      hub.register({
        deps: ['b', 'c'],
        name: 'd',
        run: () => {
          order.push('d');
        },
        type: 'init'
      })
    ).not.toThrow();

    hub.start();
    await flush();

    expect(order).toEqual(['a', 'b', 'c', 'd']);

    hub.stop();
  });

  it('新任务引入回边时抛出循环依赖', () => {
    const hub = new TaskHub();

    hub.register({ deps: ['b'], name: 'a', run: vi.fn(), type: 'init' });
    hub.register({ deps: ['c'], name: 'b', run: vi.fn(), type: 'init' });

    // c 依赖 a，而 a 已传递依赖 c → a → b → c → a 成环
    expect(() => hub.register({ deps: ['a'], name: 'c', run: vi.fn(), type: 'init' })).toThrow('circular dependency');
  });

  it('注册顺序可任意，依赖在后注册也合法', () => {
    const hub = new TaskHub();

    expect(() => {
      hub.register({ deps: ['auth'], name: 'perm', run: vi.fn(), type: 'init' });
      hub.register({ name: 'auth', run: vi.fn(), type: 'init' });
    }).not.toThrow();
  });

  it('start 时依赖名拼错立即抛错，不再静默永久挂起', () => {
    const hub = new TaskHub();

    hub.register({ name: 'auth', run: vi.fn(), type: 'init' });
    hub.register({ deps: ['authh'], name: 'perm', run: vi.fn(), type: 'init' });

    expect(() => hub.start()).toThrow(/Unregistered dependencies.*"perm" -> authh/s);
  });

  it('运行时 add 的任务依赖缺失同样抛错', () => {
    const hub = new TaskHub();

    hub.start();

    expect(() => hub.add({ deps: ['nope'], name: 'late', run: vi.fn(), type: 'init' })).toThrow(
      'depends on unregistered task(s): nope'
    );
  });
});

describe('TaskHub - init 调度（事件驱动）', () => {
  it('依赖链推进不依赖 tickInterval —— 不推进时钟即可全部完成', async () => {
    const order: string[] = [];
    // tickInterval 故意设成 1 小时，若调度仍靠轮询，这个用例必然失败
    const hub = new TaskHub({ tickInterval: 3_600_000 });

    hub.register({
      name: 'auth',
      run: () => {
        order.push('auth');
      },
      type: 'init'
    });
    hub.register({
      deps: ['auth'],
      name: 'perm',
      run: () => {
        order.push('perm');
      },
      type: 'init'
    });
    hub.register({
      deps: ['perm'],
      name: 'routes',
      run: () => {
        order.push('routes');
      },
      type: 'init'
    });

    hub.start();
    await flush();

    expect(order).toEqual(['auth', 'perm', 'routes']);
    expect(hub.snapshot().every(task => task.status === 'done')).toBe(true);

    hub.stop();
  });

  it('onReady 在同一时刻触发，不额外等待一个心跳', async () => {
    const onReady = vi.fn();
    const hub = new TaskHub({ onReady, tickInterval: 3_600_000 });

    hub.register({ name: 'a', run: vi.fn(), type: 'init' });
    hub.register({ deps: ['a'], name: 'b', run: vi.fn(), type: 'init' });

    hub.start();
    await flush();

    expect(onReady).toHaveBeenCalledOnce();

    hub.stop();
  });

  it('init 任务只执行一次', async () => {
    const run = vi.fn();
    const hub = new TaskHub({ tickInterval: 50 });

    hub.register({ name: 'a', run, type: 'init' });
    hub.start();

    await vi.advanceTimersByTimeAsync(1000);

    expect(run).toHaveBeenCalledOnce();

    hub.stop();
  });

  it('同批次按 priority 升序启动', async () => {
    const order: string[] = [];
    const hub = new TaskHub();

    hub.register({
      name: 'low',
      priority: 20,
      run: () => {
        order.push('low');
      },
      type: 'init'
    });
    hub.register({
      name: 'high',
      priority: 1,
      run: () => {
        order.push('high');
      },
      type: 'init'
    });

    hub.start();
    await flush();

    expect(order).toEqual(['high', 'low']);

    hub.stop();
  });

  it('依赖未满足时保持 pending', async () => {
    const runB = vi.fn();
    const hub = new TaskHub();

    hub.register({ name: 'a', run: delayed(2000), type: 'init' });
    hub.register({ deps: ['a'], name: 'b', run: runB, type: 'init' });

    hub.start();
    await vi.advanceTimersByTimeAsync(500);

    expect(runB).not.toHaveBeenCalled();
    expect(hub.getTask('b')?.status).toBe('pending');
    expect(hub.getTask('a')?.status).toBe('running');

    hub.stop();
  });
});

describe('TaskHub - periodic 任务', () => {
  it('按间隔重复执行', async () => {
    const run = vi.fn();
    const hub = new TaskHub({ tickInterval: 100 });

    hub.register({ interval: 300, name: 'poll', run, type: 'periodic' });
    hub.start();

    await vi.advanceTimersByTimeAsync(700);

    expect(run.mock.calls.length).toBeGreaterThanOrEqual(3);

    hub.stop();
  });

  it('未指定 interval 时使用默认 5000ms', async () => {
    const run = vi.fn();
    const hub = new TaskHub({ tickInterval: 100 });

    hub.register({ name: 'poll', run, type: 'periodic' });
    hub.start();

    await vi.advanceTimersByTimeAsync(100);
    expect(run).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(100);
    expect(run).toHaveBeenCalledTimes(1);

    hub.stop();
  });

  it('上一轮仍在执行时跳过本次心跳，永不并发', async () => {
    let inFlight = 0;
    let maxInFlight = 0;
    const hub = new TaskHub({ tickInterval: 50 });

    hub.register({
      interval: 50,
      name: 'slow',
      run: () =>
        new Promise<void>(resolve => {
          inFlight += 1;
          maxInFlight = Math.max(maxInFlight, inFlight);
          setTimeout(() => {
            inFlight -= 1;
            resolve();
          }, 150);
        }),
      type: 'periodic'
    });

    hub.start();
    await vi.advanceTimersByTimeAsync(80);
    expect(hub.getTask('slow')?.status).toBe('running');

    await vi.advanceTimersByTimeAsync(1000);
    expect(maxInFlight).toBe(1);

    hub.stop();
  });

  it('依赖满足前不执行', async () => {
    const run = vi.fn();
    const hub = new TaskHub({ tickInterval: 100 });

    hub.register({ name: 'auth', run: delayed(500), type: 'init' });
    hub.register({ deps: ['auth'], interval: 100, name: 'heartbeat', run, type: 'periodic' });

    hub.start();
    await vi.advanceTimersByTimeAsync(300);
    expect(run).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(400);
    expect(run).toHaveBeenCalled();

    hub.stop();
  });

  it('immediate: false 时首次执行推迟一个完整 interval', async () => {
    const run = vi.fn();
    const hub = new TaskHub({ tickInterval: 100 });

    hub.register({ immediate: false, interval: 1000, name: 'check', run, type: 'periodic' });
    hub.start();

    await vi.advanceTimersByTimeAsync(900);
    expect(run).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(200);
    expect(run).toHaveBeenCalledTimes(1);

    hub.stop();
  });

  it('immediate: false 的任务在 stop → start 后重新推迟，而不是立刻补跑', async () => {
    const run = vi.fn();
    const hub = new TaskHub({ tickInterval: 100 });

    hub.register({ immediate: false, interval: 1000, name: 'check', run, type: 'periodic' });

    hub.start();
    await vi.advanceTimersByTimeAsync(1200);
    expect(run).toHaveBeenCalledTimes(1);

    hub.stop();
    hub.start();

    await vi.advanceTimersByTimeAsync(900);
    expect(run).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(200);
    expect(run).toHaveBeenCalledTimes(2);

    hub.stop();
  });

  it('运行时 add 的 immediate: false 任务同样推迟首次执行', async () => {
    const run = vi.fn();
    const hub = new TaskHub({ tickInterval: 100 });

    hub.start();
    hub.add({ immediate: false, interval: 1000, name: 'check', run, type: 'periodic' });

    await vi.advanceTimersByTimeAsync(900);
    expect(run).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(200);
    expect(run).toHaveBeenCalledTimes(1);

    hub.stop();
  });

  it('默认 immediate 为 true，保持启动即执行', async () => {
    const run = vi.fn();
    const hub = new TaskHub({ tickInterval: 100 });

    hub.register({ interval: 1000, name: 'poll', run, type: 'periodic' });
    hub.start();

    expect(run).toHaveBeenCalledTimes(1);

    hub.stop();
  });

  it('没有周期任务时不创建任何 interval 定时器', async () => {
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval');
    const hub = new TaskHub();

    hub.register({ name: 'a', run: vi.fn(), type: 'init' });
    hub.register({ name: 'l', run: vi.fn(), type: 'listener' });
    hub.start();
    await flush();

    expect(setIntervalSpy).not.toHaveBeenCalled();
    expect(hub.getTask('a')?.status).toBe('done');

    hub.stop();
    setIntervalSpy.mockRestore();
  });

  it('周期任务失败不阻塞下游，下个周期自愈', async () => {
    let calls = 0;
    const onTaskBlocked = vi.fn();
    const hub = new TaskHub({ maxRetries: 0, onTaskBlocked, tickInterval: 50 });

    hub.register({
      interval: 50,
      name: 'poll',
      run: () => {
        calls += 1;
        if (calls === 1) throw new Error('transient');
      },
      type: 'periodic'
    });
    hub.register({ deps: ['poll'], name: 'after', run: vi.fn(), type: 'init' });

    hub.start();
    await vi.advanceTimersByTimeAsync(200);

    expect(onTaskBlocked).not.toHaveBeenCalled();
    expect(hub.getTask('after')?.status).toBe('done');

    hub.stop();
  });
});

describe('TaskHub - listener 任务', () => {
  it('依赖满足后注册一次，stop 时 cleanup', async () => {
    const run = vi.fn();
    const cleanup = vi.fn();
    const hub = new TaskHub();

    hub.register({ cleanup, name: 'resize', run, type: 'listener' });
    hub.start();
    await flush();

    expect(run).toHaveBeenCalledOnce();
    expect(cleanup).not.toHaveBeenCalled();

    hub.stop();
    expect(cleanup).toHaveBeenCalledOnce();
  });

  it('从未执行过的任务不会被 cleanup', async () => {
    const cleanup = vi.fn();
    const hub = new TaskHub();

    hub.register({ name: 'auth', run: delayed(5000), type: 'init' });
    hub.register({ cleanup, deps: ['auth'], name: 'ws', run: vi.fn(), type: 'listener' });

    hub.start();
    await vi.advanceTimersByTimeAsync(100);
    hub.stop();

    expect(cleanup).not.toHaveBeenCalled();
  });
});

describe('TaskHub - 重试与退避', () => {
  it('退避时刻精确为 base * 2^(n-1)', async () => {
    const run = vi.fn().mockImplementation(() => {
      throw new Error('fail');
    });
    const hub = new TaskHub({ baseRetryDelay: 1000, maxRetries: 3, tickInterval: 3_600_000 });

    hub.register({ name: 'flaky', run, type: 'init' });
    hub.start();

    expect(run).toHaveBeenCalledTimes(1);

    // 第 1 次重试：1000ms
    await vi.advanceTimersByTimeAsync(999);
    expect(run).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1);
    expect(run).toHaveBeenCalledTimes(2);

    // 第 2 次重试：2000ms
    await vi.advanceTimersByTimeAsync(1999);
    expect(run).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(1);
    expect(run).toHaveBeenCalledTimes(3);

    // 第 3 次重试：4000ms
    await vi.advanceTimersByTimeAsync(3999);
    expect(run).toHaveBeenCalledTimes(3);
    await vi.advanceTimersByTimeAsync(1);
    expect(run).toHaveBeenCalledTimes(4);

    // 重试次数耗尽
    await vi.advanceTimersByTimeAsync(60_000);
    expect(run).toHaveBeenCalledTimes(4);
    expect(hub.getTask('flaky')?.status).toBe('failed');
    // maxRetries: 3 → 1 次初始执行 + 3 次重试
    expect(hub.getTask('flaky')?.retryCount).toBe(3);

    hub.stop();
  });

  it('重试成功后状态回到 done 且 retryCount 归零', async () => {
    let calls = 0;
    const hub = new TaskHub({ baseRetryDelay: 100, maxRetries: 3 });

    hub.register({
      name: 'flaky',
      run: () => {
        calls += 1;
        if (calls < 3) throw new Error('fail');
      },
      type: 'init'
    });

    hub.start();
    await vi.advanceTimersByTimeAsync(1000);

    expect(calls).toBe(3);
    expect(hub.getTask('flaky')?.status).toBe('done');
    expect(hub.getTask('flaky')?.retryCount).toBe(0);

    hub.stop();
  });

  it('maxRetries=0 禁用重试', async () => {
    const run = vi.fn().mockImplementation(() => {
      throw new Error('fail');
    });
    const onTaskError = vi.fn();
    const hub = new TaskHub({ maxRetries: 0, onTaskError });

    hub.register({ name: 'once', run, type: 'init' });
    hub.start();
    await vi.advanceTimersByTimeAsync(60_000);

    expect(run).toHaveBeenCalledTimes(1);
    expect(onTaskError).toHaveBeenCalledOnce();
    expect(hub.getTask('once')?.status).toBe('failed');

    hub.stop();
  });

  it('退避期间不占用心跳，无周期任务时依然重试', async () => {
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval');
    let calls = 0;
    const hub = new TaskHub({ baseRetryDelay: 100, maxRetries: 2 });

    hub.register({
      name: 'flaky',
      run: () => {
        calls += 1;
        if (calls < 2) throw new Error('fail');
      },
      type: 'init'
    });

    hub.start();
    await vi.advanceTimersByTimeAsync(500);

    expect(calls).toBe(2);
    expect(setIntervalSpy).not.toHaveBeenCalled();

    hub.stop();
    setIntervalSpy.mockRestore();
  });
});

describe('TaskHub - blocked 传播与恢复', () => {
  it('上游永久失败后下游标记 blocked 并携带 blockedBy', async () => {
    const onTaskBlocked = vi.fn();
    const runB = vi.fn();
    const hub = new TaskHub({ maxRetries: 0, onTaskBlocked });

    hub.register({
      name: 'auth',
      run: () => {
        throw new Error('down');
      },
      type: 'init'
    });
    hub.register({ deps: ['auth'], name: 'perm', run: runB, type: 'init' });
    hub.register({ deps: ['perm'], name: 'routes', run: vi.fn(), type: 'init' });

    hub.start();
    await flush();

    expect(runB).not.toHaveBeenCalled();
    expect(hub.getTask('perm')?.status).toBe('blocked');
    expect(hub.getTask('perm')?.blockedBy).toBe('auth');
    expect(hub.getTask('routes')?.status).toBe('blocked');
    expect(hub.getTask('routes')?.blockedBy).toBe('perm');
    expect(onTaskBlocked).toHaveBeenCalledTimes(2);

    hub.stop();
  });

  it('blocked 可恢复：替换掉失败的上游后下游自动继续', async () => {
    const runB = vi.fn();
    const hub = new TaskHub({ maxRetries: 0 });

    hub.register({
      name: 'auth',
      run: () => {
        throw new Error('down');
      },
      type: 'init'
    });
    hub.register({ deps: ['auth'], name: 'perm', run: runB, type: 'init' });

    hub.start();
    await flush();
    expect(hub.getTask('perm')?.status).toBe('blocked');

    hub.remove('auth');
    hub.add({ name: 'auth', run: vi.fn(), type: 'init' });
    await flush();

    expect(runB).toHaveBeenCalledOnce();
    expect(hub.getTask('perm')?.status).toBe('done');

    hub.stop();
  });

  it('移除仍被依赖的任务会让下游 blocked，而不是静默挂起', async () => {
    const onTaskBlocked = vi.fn();
    const hub = new TaskHub({ onTaskBlocked });

    hub.register({ name: 'auth', run: delayed(5000), type: 'init' });
    hub.register({ deps: ['auth'], name: 'perm', run: vi.fn(), type: 'init' });

    hub.start();
    await vi.advanceTimersByTimeAsync(10);
    hub.remove('auth');

    expect(hub.getTask('perm')?.status).toBe('blocked');
    expect(onTaskBlocked).toHaveBeenCalledWith('perm', 'auth');

    hub.stop();
  });

  it('blocked 的周期任务不会被心跳执行', async () => {
    const run = vi.fn();
    const hub = new TaskHub({ maxRetries: 0, tickInterval: 50 });

    hub.register({
      name: 'auth',
      run: () => {
        throw new Error('down');
      },
      type: 'init'
    });
    hub.register({ deps: ['auth'], interval: 50, name: 'heartbeat', run, type: 'periodic' });

    hub.start();
    await vi.advanceTimersByTimeAsync(500);

    expect(run).not.toHaveBeenCalled();
    expect(hub.getTask('heartbeat')?.status).toBe('blocked');

    hub.stop();
  });
});

describe('TaskHub - onReady / onSettled', () => {
  it('全部 init 成功时 onReady 与 onSettled 均触发', async () => {
    const onReady = vi.fn();
    const onSettled = vi.fn();
    const hub = new TaskHub({ onReady, onSettled });

    hub.register({ name: 'a', run: vi.fn(), type: 'init' });
    hub.register({ deps: ['a'], name: 'b', run: vi.fn(), type: 'init' });
    hub.register({ interval: 1000, name: 'poll', run: vi.fn(), type: 'periodic' });

    hub.start();
    await flush();

    expect(onReady).toHaveBeenCalledOnce();
    expect(onSettled).toHaveBeenCalledWith<[InitSettleResult]>({
      blocked: [],
      done: ['a', 'b'],
      failed: [],
      ok: true
    });

    hub.stop();
  });

  it('init 永久失败时 onSettled 汇报失败，onReady 不触发', async () => {
    const onReady = vi.fn();
    const onSettled = vi.fn();
    const hub = new TaskHub({ maxRetries: 0, onReady, onSettled });

    hub.register({
      name: 'auth',
      run: () => {
        throw new Error('network down');
      },
      type: 'init'
    });
    hub.register({ deps: ['auth'], name: 'perm', run: vi.fn(), type: 'init' });
    hub.register({ name: 'theme', run: vi.fn(), type: 'init' });

    hub.start();
    await flush();

    expect(onReady).not.toHaveBeenCalled();
    expect(onSettled).toHaveBeenCalledOnce();
    expect(onSettled.mock.calls[0][0]).toEqual<InitSettleResult>({
      blocked: ['perm'],
      done: ['theme'],
      failed: ['auth'],
      ok: false
    });

    hub.stop();
  });

  it('onSettled 等待重试全部耗尽后才触发', async () => {
    const onSettled = vi.fn();
    const hub = new TaskHub({ baseRetryDelay: 100, maxRetries: 2, onSettled });

    hub.register({
      name: 'auth',
      run: () => {
        throw new Error('fail');
      },
      type: 'init'
    });

    hub.start();
    await vi.advanceTimersByTimeAsync(50);
    expect(onSettled).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1000);
    expect(onSettled).toHaveBeenCalledOnce();

    hub.stop();
  });

  it('没有 init 任务时 start 后立即 ready', async () => {
    const onReady = vi.fn();
    const onSettled = vi.fn();
    const hub = new TaskHub({ onReady, onSettled, tickInterval: 100 });

    hub.register({ interval: 100, name: 'poll', run: vi.fn(), type: 'periodic' });
    hub.start();

    expect(onReady).toHaveBeenCalledOnce();
    expect(onSettled).toHaveBeenCalledWith<[InitSettleResult]>({ blocked: [], done: [], failed: [], ok: true });

    hub.stop();
  });

  it('未设置回调时不报错', async () => {
    const hub = new TaskHub();

    hub.register({ name: 'a', run: vi.fn(), type: 'init' });
    hub.start();

    await expect(flush()).resolves.not.toThrow();

    hub.stop();
  });
});

describe('TaskHub - 生命周期', () => {
  it('running 反映 start / pause / stop', () => {
    const hub = new TaskHub();

    expect(hub.running).toBe(false);
    hub.start();
    expect(hub.running).toBe(true);
    hub.pause();
    expect(hub.running).toBe(false);
    hub.resume();
    expect(hub.running).toBe(true);
    hub.stop();
    expect(hub.running).toBe(false);
  });

  it('重复 start / 未启动时 stop、pause、resume 均无副作用', () => {
    const hub = new TaskHub();

    expect(() => hub.stop()).not.toThrow();
    expect(() => hub.pause()).not.toThrow();
    expect(() => hub.resume()).not.toThrow();

    hub.start();
    hub.start();
    expect(hub.running).toBe(true);

    hub.stop();
  });

  it('stop 保留注册表，再次 start 可完整重跑（StrictMode 双挂载）', async () => {
    const init = vi.fn();
    const listen = vi.fn();
    const cleanup = vi.fn();
    const hub = new TaskHub();

    hub.register({ name: 'auth', run: init, type: 'init' });
    hub.register({ cleanup, deps: ['auth'], name: 'ws', run: listen, type: 'listener' });

    hub.start();
    await flush();
    expect(init).toHaveBeenCalledTimes(1);
    expect(listen).toHaveBeenCalledTimes(1);

    hub.stop();
    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(hub.snapshot()).toHaveLength(2);
    expect(hub.snapshot().every(task => task.status === 'pending')).toBe(true);

    hub.start();
    await flush();

    expect(init).toHaveBeenCalledTimes(2);
    expect(listen).toHaveBeenCalledTimes(2);
    expect(hub.getTask('ws')?.status).toBe('done');

    hub.stop();
  });

  it('stop 后 onReady 可以再次触发', async () => {
    const onReady = vi.fn();
    const hub = new TaskHub({ onReady });

    hub.register({ name: 'a', run: vi.fn(), type: 'init' });

    hub.start();
    await flush();
    hub.stop();

    hub.start();
    await flush();

    expect(onReady).toHaveBeenCalledTimes(2);

    hub.stop();
  });

  it('dispose 清空注册表', async () => {
    const cleanup = vi.fn();
    const hub = new TaskHub();

    hub.register({ cleanup, name: 'x', run: vi.fn(), type: 'listener' });
    hub.start();
    await flush();

    hub.dispose();

    expect(cleanup).toHaveBeenCalledOnce();
    expect(hub.snapshot()).toHaveLength(0);
    expect(hub.running).toBe(false);
  });

  it('pause 冻结周期任务与退避计时，resume 后按剩余时间继续', async () => {
    const poll = vi.fn();
    const flaky = vi.fn().mockImplementation(() => {
      throw new Error('fail');
    });
    const hub = new TaskHub({ baseRetryDelay: 1000, maxRetries: 3, tickInterval: 100 });

    hub.register({ interval: 100, name: 'poll', run: poll, type: 'periodic' });
    hub.register({ name: 'flaky', run: flaky, type: 'init' });

    hub.start();
    await vi.advanceTimersByTimeAsync(400);

    const pollCalls = poll.mock.calls.length;
    expect(flaky).toHaveBeenCalledTimes(1);

    hub.pause();
    await vi.advanceTimersByTimeAsync(10_000);

    expect(poll.mock.calls.length).toBe(pollCalls);
    expect(flaky).toHaveBeenCalledTimes(1);

    hub.resume();
    // 暂停前已过 400ms，剩余退避约 600ms
    await vi.advanceTimersByTimeAsync(599);
    expect(flaky).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1);
    expect(flaky).toHaveBeenCalledTimes(2);
    expect(poll.mock.calls.length).toBeGreaterThan(pollCalls);

    hub.stop();
  });

  it('stop 会中断在途任务的 AbortSignal', async () => {
    const aborted = vi.fn();
    const hub = new TaskHub();

    hub.register({
      name: 'long',
      run: ctx =>
        new Promise<void>(resolve => {
          ctx.signal.addEventListener('abort', () => {
            aborted();
            resolve();
          });
        }),
      type: 'init'
    });

    hub.start();
    await flush();
    expect(hub.getTask('long')?.status).toBe('running');

    hub.stop();
    expect(aborted).toHaveBeenCalledOnce();
  });

  it('stop 期间完成的在途任务不会写回状态', async () => {
    const onReady = vi.fn();
    const hub = new TaskHub({ onReady });

    hub.register({ name: 'slow', run: delayed(500), type: 'init' });

    hub.start();
    await vi.advanceTimersByTimeAsync(100);
    hub.stop();

    await vi.advanceTimersByTimeAsync(1000);

    expect(onReady).not.toHaveBeenCalled();
    expect(hub.getTask('slow')?.status).toBe('pending');
  });
});

describe('TaskHub - 动态增删', () => {
  it('运行时 add 的任务立即被调度', async () => {
    const run = vi.fn();
    const hub = new TaskHub({ tickInterval: 3_600_000 });

    hub.start();
    hub.add({ name: 'late', run, type: 'init' });
    await flush();

    expect(run).toHaveBeenCalledOnce();

    hub.stop();
  });

  it('运行时 add 周期任务会按需启动心跳', async () => {
    const run = vi.fn();
    const hub = new TaskHub({ tickInterval: 100 });

    hub.start();
    hub.add({ interval: 100, name: 'poll', run, type: 'periodic' });

    await vi.advanceTimersByTimeAsync(250);
    expect(run.mock.calls.length).toBeGreaterThanOrEqual(2);

    hub.stop();
  });

  it('remove 执行过的任务会 cleanup，不存在的返回 false', async () => {
    const cleanup = vi.fn();
    const hub = new TaskHub();

    hub.register({ cleanup, name: 'x', run: vi.fn(), type: 'listener' });
    hub.start();
    await flush();

    expect(hub.remove('x')).toBe(true);
    expect(cleanup).toHaveBeenCalledOnce();
    expect(hub.snapshot()).toHaveLength(0);
    expect(hub.remove('nope')).toBe(false);

    hub.stop();
  });

  it('移除 running 中的 init 任务不会让 onReady 提前触发', async () => {
    let bDone = false;
    const readyWhileBPending = vi.fn();
    const onReady = vi.fn(() => {
      if (!bDone) readyWhileBPending();
    });
    const hub = new TaskHub({ onReady });

    hub.register({ name: 'A', run: delayed(50), type: 'init' });
    hub.register({
      name: 'B',
      run: delayed(200, () => {
        bDone = true;
      }),
      type: 'init'
    });
    hub.register({ name: 'C', run: vi.fn(), type: 'init' });

    hub.start();
    await vi.advanceTimersByTimeAsync(10);
    hub.remove('A');

    await vi.advanceTimersByTimeAsync(1000);

    expect(onReady).toHaveBeenCalledOnce();
    expect(readyWhileBPending).not.toHaveBeenCalled();

    hub.stop();
  });

  it('在回调里同步追加任务不会被漏调度（pump 重入）', async () => {
    const late = vi.fn();
    const hub: TaskHub = new TaskHub({
      maxRetries: 0,
      onTaskError: () => {
        hub.add({ name: 'late', run: late, type: 'init' });
      }
    });

    // run 同步抛错 → onTaskError 在 pump 的扫描过程中被同步调用
    hub.register({
      name: 'boom',
      priority: 1,
      run: () => {
        throw new Error('sync fail');
      },
      type: 'init'
    });

    hub.start();
    await flush();

    expect(late).toHaveBeenCalledOnce();
    expect(hub.getTask('late')?.status).toBe('done');

    hub.stop();
  });

  it('移除 running 中的任务后其完成不会污染 onSettled', async () => {
    const onSettled = vi.fn();
    const hub = new TaskHub({ onSettled });

    hub.register({ name: 'A', run: delayed(50), type: 'init' });
    hub.register({ name: 'B', run: delayed(200), type: 'init' });

    hub.start();
    await vi.advanceTimersByTimeAsync(10);
    hub.remove('A');
    await vi.advanceTimersByTimeAsync(1000);

    expect(onSettled).toHaveBeenCalledOnce();
    expect(onSettled.mock.calls[0][0]).toEqual<InitSettleResult>({
      blocked: [],
      done: ['B'],
      failed: [],
      ok: true
    });

    hub.stop();
  });
});

describe('TaskHub - trigger', () => {
  it('立即执行并重置周期计时', async () => {
    const run = vi.fn();
    const hub = new TaskHub({ tickInterval: 100 });

    hub.register({ immediate: false, interval: 1000, name: 'check', run, type: 'periodic' });
    hub.start();

    await vi.advanceTimersByTimeAsync(600);
    expect(run).not.toHaveBeenCalled();

    expect(hub.trigger('check')).toBe(true);
    await flush();
    expect(run).toHaveBeenCalledTimes(1);

    // 计时已重置：距 trigger 不足 1000ms 不会再跑
    await vi.advanceTimersByTimeAsync(900);
    expect(run).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(200);
    expect(run).toHaveBeenCalledTimes(2);

    hub.stop();
  });

  it('任务不存在、hub 未运行或已暂停时返回 false', async () => {
    const run = vi.fn();
    const hub = new TaskHub({ tickInterval: 100 });

    hub.register({ immediate: false, interval: 1000, name: 'check', run, type: 'periodic' });

    expect(hub.trigger('check')).toBe(false); // 未 start
    expect(hub.trigger('nope')).toBe(false);

    hub.start();
    hub.pause();
    expect(hub.trigger('check')).toBe(false); // 已暂停

    hub.resume();
    expect(hub.trigger('check')).toBe(true);

    await flush();
    expect(run).toHaveBeenCalledTimes(1);

    hub.stop();
  });

  it('任务正在执行时不重复触发', async () => {
    const hub = new TaskHub({ tickInterval: 100 });

    hub.register({ immediate: false, interval: 1000, name: 'slow', run: delayed(500), type: 'periodic' });
    hub.start();

    expect(hub.trigger('slow')).toBe(true);
    await flush();
    expect(hub.getTask('slow')?.status).toBe('running');

    expect(hub.trigger('slow')).toBe(false);

    hub.stop();
  });

  it('依赖未满足或被阻塞时返回 false', async () => {
    const run = vi.fn();
    const hub = new TaskHub({ maxRetries: 0, tickInterval: 100 });

    hub.register({ name: 'auth', run: delayed(5000), type: 'init' });
    hub.register({ deps: ['auth'], immediate: false, interval: 1000, name: 'poll', run, type: 'periodic' });

    hub.start();
    await flush();

    expect(hub.trigger('poll')).toBe(false);
    expect(run).not.toHaveBeenCalled();

    hub.stop();
  });
});

describe('TaskHub - snapshot', () => {
  it('按优先级升序返回，并包含依赖与错误信息', async () => {
    const hub = new TaskHub({ maxRetries: 0 });

    hub.register({ name: 'low', priority: 99, run: vi.fn(), type: 'init' });
    hub.register({
      name: 'high',
      priority: 1,
      run: () => {
        throw new Error('test error msg');
      },
      type: 'init'
    });

    expect(hub.snapshot().map(task => task.name)).toEqual(['high', 'low']);

    hub.start();
    await flush();

    const snap = hub.snapshot();
    expect(snap[0].error).toContain('test error msg');
    expect(hub.getTask('high')?.error).toContain('test error msg');

    hub.stop();
  });

  it('getTask 不存在返回 undefined，无依赖时 deps 为空数组', () => {
    const hub = new TaskHub();

    hub.register({ name: 'a', run: vi.fn(), type: 'init' });

    expect(hub.getTask('nope')).toBeUndefined();
    expect(hub.getTask('a')?.deps).toEqual([]);
    expect(hub.getTask('a')?.blockedBy).toBeUndefined();
  });
});

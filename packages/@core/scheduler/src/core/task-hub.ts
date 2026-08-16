// oxlint-disable no-bitwise
// oxlint-disable no-continue
import type { InitSettleResult, TaskDef, TaskHubOptions, TaskSnapshot, TaskStatus } from '../types';

const DEFAULT_TICK_INTERVAL = 1000;
const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_BASE_RETRY_DELAY = 1000;
const DEFAULT_PERIODIC_INTERVAL = 5000;
const DEFAULT_PRIORITY = 10;

/** 内部任务状态，不对外暴露 */
interface TaskState {
  /** 在途执行的取消控制器 */
  abort?: AbortController;
  /** 任务定义，保持注册时原样不被改写 */
  def: TaskDef;
  /** 归一化后的依赖列表 */
  deps: string[];
  /** 最近一次失败的错误 */
  error?: unknown;
  /** 是否至少进入过一次 run，决定 cleanup 该不该调用 */
  hasRun: boolean;
  /** 周期任务的执行间隔（ms） */
  interval: number;
  /** 上次执行时间戳 */
  lastRun: number;
  /** 归一化后的优先级 */
  priority: number;
  /** 退避到期时间戳 */
  retryAt?: number;
  /** 已重试次数 */
  retryCount: number;
  /** Pause 时记录的退避剩余时间（ms） */
  retryRemaining?: number;
  /** 退避定时器 */
  retryTimer?: ReturnType<typeof setTimeout>;
  /** 当前状态 */
  status: TaskStatus;
}

/**
 * 失败且没有任何后续重试 —— 不可恢复的终态
 *
 * 失败时若还有机会，重试会被立即 arm，因此「没有待命的重试」等价于「重试已耗尽」
 */
function isFailedTerminal(task: TaskState): boolean {
  return task.status === 'failed' && task.retryTimer === undefined && task.retryRemaining === undefined;
}

/** 清除任务上待命的退避重试 */
function clearRetry(task: TaskState): void {
  if (task.retryTimer !== undefined) clearTimeout(task.retryTimer);
  task.retryTimer = undefined;
  task.retryAt = undefined;
  task.retryRemaining = undefined;
}

/** 中断在途执行并调用 cleanup（仅当任务真正执行过） */
function teardownTask(task: TaskState): void {
  clearRetry(task);
  task.abort?.abort();
  task.abort = undefined;
  if (task.hasRun) task.def.cleanup?.();
}

/**
 * 为 `immediate: false` 的周期任务把计时起点挪到当下
 *
 * LastRun 初值 0 意味着「从未执行」，会在第一个心跳就触发。这里在 start 的时刻盖一个 时间戳，把首次执行推迟一个完整的 interval
 */
function primePeriodic(task: TaskState): void {
  if (task.def.type !== 'periodic') return;
  if (task.def.immediate !== false) return;
  if (task.lastRun !== 0) return;

  task.lastRun = Date.now();
}

/** 任务状态归零，使 hub 可以重新 start */
function resetTask(task: TaskState): void {
  task.status = 'pending';
  task.retryCount = 0;
  task.lastRun = 0;
  task.error = undefined;
  task.hasRun = false;
}

/**
 * 协作式任务调度中枢
 *
 * 两条互不干扰的调度通路： - init / listener：事件驱动，上游一完成立即推进下游，不受 tickInterval 影响 - periodic：共享单一心跳，仅在存在周期任务时才创建
 *
 * 零框架依赖，Web / React Native / Node 均可使用
 */
class TaskHub {
  private tasks = new Map<string, TaskState>();
  /** 按 priority 升序维护，避免每次调度重新排序 */
  private sortedTasks: TaskState[] = [];
  private tickTimer: ReturnType<typeof setInterval> | null = null;
  private started = false;
  private paused = false;
  private readyFired = false;
  private settledFired = false;
  /** 每次 stop 自增，用于让 stop 之前发起的在途执行放弃写回状态 */
  private generation = 0;
  /** Pump 重入保护 */
  private pumping = false;
  private pumpAgain = false;

  private readonly tickInterval: number;
  private readonly maxRetries: number;
  private readonly baseRetryDelay: number;
  private readonly onTaskError?: (taskName: string, error: unknown) => void;
  private readonly onTaskBlocked?: (taskName: string, blockedBy: string) => void;
  private readonly onReady?: () => void;
  private readonly onSettled?: (result: InitSettleResult) => void;

  constructor(options: TaskHubOptions = {}) {
    this.tickInterval = options.tickInterval ?? DEFAULT_TICK_INTERVAL;
    this.maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
    this.baseRetryDelay = options.baseRetryDelay ?? DEFAULT_BASE_RETRY_DELAY;
    this.onTaskError = options.onTaskError;
    this.onTaskBlocked = options.onTaskBlocked;
    this.onReady = options.onReady;
    this.onSettled = options.onSettled;
  }

  /** 注册任务，支持链式调用。同名任务重复注册会抛错 */
  register(def: TaskDef): this {
    this.validateDef(def);

    const state: TaskState = {
      def,
      deps: def.deps ?? [],
      hasRun: false,
      interval: def.type === 'periodic' ? (def.interval ?? DEFAULT_PERIODIC_INTERVAL) : 0,
      lastRun: 0,
      priority: def.priority ?? DEFAULT_PRIORITY,
      retryCount: 0,
      status: 'pending'
    };

    this.tasks.set(def.name, state);
    this.insertSorted(state);

    if (this.started) {
      primePeriodic(state);
      this.syncTicker();
      this.recomputeBlocked();
      this.pump();
      this.settleCheck();
    }

    return this;
  }

  /** 批量注册 */
  registerAll(defs: TaskDef[]): this {
    for (const def of defs) {
      this.register(def);
    }
    return this;
  }

  /** 运行时动态追加任务 */
  add(def: TaskDef): this {
    return this.register(def);
  }

  /** 运行时移除任务（执行过的任务会调用 cleanup） */
  remove(name: string): boolean {
    const task = this.tasks.get(name);
    if (!task) return false;

    teardownTask(task);
    this.tasks.delete(name);

    const idx = this.sortedTasks.indexOf(task);
    if (idx !== -1) this.sortedTasks.splice(idx, 1);

    if (this.started) {
      this.syncTicker();
      this.recomputeBlocked();
      // 从 sortedTasks 中摘除元素可能让进行中的 pump 扫描漏掉一项，重新扫一遍
      this.pump();
      this.settleCheck();
    }

    return true;
  }

  /** 启动调度。依赖引用不完整时直接抛错，避免任务静默永久挂起 */
  start(): void {
    if (this.started) return;

    this.assertDepsRegistered();

    this.started = true;
    this.paused = false;

    for (const task of this.sortedTasks) {
      primePeriodic(task);
    }

    this.recomputeBlocked();
    this.pump();
    this.settleCheck();
    this.syncTicker();
  }

  /**
   * 停止调度：中断在途任务、逆优先级调用 cleanup、任务状态归零
   *
   * 注册表被保留，再次 start() 会从头重跑一遍。因此 init / listener 的 run 应当幂等。 需要连注册表一起清空时用 dispose()
   */
  stop(): void {
    if (!this.started) return;

    this.generation += 1;
    this.clearTicker();

    // 逆优先级顺序清理（数组末尾 = priority 数字大 = 低优先级，先清理）
    for (let i = this.sortedTasks.length - 1; i >= 0; i -= 1) {
      teardownTask(this.sortedTasks[i]);
      resetTask(this.sortedTasks[i]);
    }

    this.started = false;
    this.paused = false;
    this.readyFired = false;
    this.settledFired = false;
  }

  /** 停止调度并清空注册表 */
  dispose(): void {
    this.stop();
    this.generation += 1;
    this.tasks.clear();
    this.sortedTasks = [];
  }

  /** 暂停调度（保留任务状态与退避剩余时间，可 resume 恢复） */
  pause(): void {
    if (!this.started || this.paused) return;
    this.paused = true;
    this.clearTicker();

    for (const task of this.sortedTasks) {
      if (task.retryTimer === undefined) continue;
      task.retryRemaining = Math.max(0, (task.retryAt ?? 0) - Date.now());
      clearTimeout(task.retryTimer);
      task.retryTimer = undefined;
    }
  }

  /** 恢复调度 */
  resume(): void {
    if (!this.started || !this.paused) return;
    this.paused = false;

    for (const task of this.sortedTasks) {
      if (task.retryRemaining === undefined) continue;
      const remaining = task.retryRemaining;
      task.retryRemaining = undefined;
      if (task.status === 'failed') this.scheduleRetry(task, remaining);
    }

    this.pump();
    this.syncTicker();
  }

  /**
   * 立刻执行一次指定任务，并重置它的周期计时
   *
   * 用于「外部事件要求马上跑一遍」的场景，比如页面重新可见时立即轮询一次。 对周期任务而言，这次执行同样会刷新 lastRun，因此下一次心跳会从现在起重新计算间隔。
   *
   * 任务不存在、hub 未运行、任务正在执行、被阻塞或依赖未满足时返回 false。
   */
  trigger(name: string): boolean {
    const task = this.tasks.get(name);

    if (!task || !this.running) return false;
    if (task.status === 'running' || task.status === 'blocked') return false;
    if (!this.depsResolved(task)) return false;

    clearRetry(task);
    this.execute(task);

    return true;
  }

  /** 是否正在运行（已 start 且未 pause） */
  get running(): boolean {
    return this.started && !this.paused;
  }

  /** 获取全部任务快照（调试用），按 priority 升序 */
  snapshot(): TaskSnapshot[] {
    return this.sortedTasks.map(task => this.toSnapshot(task));
  }

  /** 获取单个任务状态 */
  getTask(name: string): TaskSnapshot | undefined {
    const task = this.tasks.get(name);
    return task ? this.toSnapshot(task) : undefined;
  }

  /**
   * 推进所有依赖已满足的 init / listener 任务
   *
   * 调用时机：start、任务完成、退避到期、阻塞解除、运行时注册
   */
  private pump(): void {
    if (!this.started || this.paused) return;

    if (this.pumping) {
      this.pumpAgain = true;
      return;
    }

    this.pumping = true;

    try {
      do {
        this.pumpAgain = false;

        for (const task of this.sortedTasks) {
          if (task.def.type === 'periodic') continue;
          if (task.status !== 'pending') continue;
          if (!this.depsResolved(task)) continue;
          this.execute(task);
        }
      } while (this.pumpAgain);
    } finally {
      this.pumping = false;
    }
  }

  /** 心跳：只负责周期任务 */
  private tick(): void {
    const now = Date.now();

    for (const task of this.sortedTasks) {
      if (task.def.type !== 'periodic') continue;
      if (task.status === 'running' || task.status === 'blocked') continue;
      if (!this.depsResolved(task)) continue;
      if (now - task.lastRun < task.interval) continue;
      this.execute(task);
    }
  }

  /** 仅在存在周期任务时维持心跳 */
  private syncTicker(): void {
    const needed = this.running && this.sortedTasks.some(task => task.def.type === 'periodic');

    if (needed && !this.tickTimer) {
      this.tick();
      this.tickTimer = setInterval(() => this.tick(), this.tickInterval);
      return;
    }

    if (!needed) this.clearTicker();
  }

  private clearTicker(): void {
    if (!this.tickTimer) return;
    clearInterval(this.tickTimer);
    this.tickTimer = null;
  }

  /** 检查依赖是否全部完成 */
  private depsResolved(task: TaskState): boolean {
    return task.deps.every(depName => this.tasks.get(depName)?.status === 'done');
  }

  /** 是否还有重试机会。retryCount 记录「已安排的重试次数」，首次失败时仍为 0 */
  private canRetry(task: TaskState): boolean {
    return this.maxRetries > 0 && task.retryCount < this.maxRetries;
  }

  /** 执行单个任务 */
  private async execute(task: TaskState): Promise<void> {
    const gen = this.generation;
    const controller = new AbortController();

    task.status = 'running';
    task.error = undefined;
    task.hasRun = true;
    task.abort = controller;

    try {
      await task.def.run({ signal: controller.signal });

      if (!this.isCurrent(task, gen)) return;

      task.abort = undefined;
      task.lastRun = Date.now();
      task.retryCount = 0;
      task.status = 'done';

      this.pump();
      this.settleCheck();
    } catch (err) {
      if (!this.isCurrent(task, gen)) return;

      task.abort = undefined;
      task.lastRun = Date.now();
      task.status = 'failed';
      task.error = err;

      this.onTaskError?.(task.def.name, err);

      // periodic 天然在下个周期重试，不参与退避与 blocked 传播
      if (task.def.type === 'periodic') return;

      if (this.canRetry(task)) {
        this.armRetry(task);
        return;
      }

      this.recomputeBlocked();
      this.settleCheck();
    }
  }

  /**
   * 在途执行完成时，确认这次执行的结果仍然该被写回
   *
   * 任务可能已被 remove（对象已不在表中）或经历过 stop（generation 变化）， 此时写回会污染计数与状态
   */
  private isCurrent(task: TaskState, gen: number): boolean {
    return gen === this.generation && this.tasks.get(task.def.name) === task;
  }

  /** 安排下一次退避重试：第 n 次重试延迟 = baseRetryDelay * 2^(n-1) */
  private armRetry(task: TaskState): void {
    const delay = this.baseRetryDelay * 2 ** task.retryCount;
    task.retryCount += 1;
    this.scheduleRetry(task, delay);
  }

  private scheduleRetry(task: TaskState, delay: number): void {
    clearRetry(task);
    task.retryAt = Date.now() + delay;
    task.retryTimer = setTimeout(() => {
      task.retryTimer = undefined;
      task.retryAt = undefined;
      if (task.status !== 'failed') return;
      task.status = 'pending';
      this.pump();
    }, delay);
  }

  /**
   * 由上游终态派生 blocked，迭代到稳定
   *
   * Blocked 是**可恢复**的：上游被移除或重新注册后，下游会自动回到 pending
   */
  private recomputeBlocked(): void {
    let changed = true;

    while (changed) {
      changed = false;

      for (const task of this.sortedTasks) {
        if (task.status === 'running' || task.status === 'done') continue;

        const blocker = this.blockerOf(task);

        if (blocker && task.status !== 'blocked') {
          clearRetry(task);
          task.status = 'blocked';
          this.onTaskBlocked?.(task.def.name, blocker);
          changed = true;
          continue;
        }

        if (!blocker && task.status === 'blocked') {
          task.status = 'pending';
          task.retryCount = 0;
          task.error = undefined;
          changed = true;
        }
      }
    }
  }

  /** 找出导致该任务无法执行的直接上游，没有则返回 null */
  private blockerOf(task: TaskState): null | string {
    for (const depName of task.deps) {
      const dep = this.tasks.get(depName);

      // 依赖被移除 —— 下游永远等不到，视为阻塞而非静默挂起
      if (!dep) return depName;
      if (dep.status === 'blocked') return depName;
      // periodic 失败会在下个周期自愈，不构成永久阻塞
      if (dep.def.type !== 'periodic' && isFailedTerminal(dep)) return depName;
    }

    return null;
  }

  /** Init 任务全部成功 → onReady；全部到达终态 → onSettled */
  private settleCheck(): void {
    if (!this.started) return;

    const inits = this.sortedTasks.filter(task => task.def.type === 'init');
    const result: InitSettleResult = { blocked: [], done: [], failed: [], ok: false };

    for (const task of inits) {
      if (task.status === 'done') result.done.push(task.def.name);
      else if (task.status === 'blocked') result.blocked.push(task.def.name);
      else if (isFailedTerminal(task)) result.failed.push(task.def.name);
      else return; // 仍有任务在途或等待重试
    }

    result.ok = result.failed.length === 0 && result.blocked.length === 0;

    if (result.ok && !this.readyFired) {
      this.readyFired = true;
      this.onReady?.();
    }

    if (!this.settledFired) {
      this.settledFired = true;
      this.onSettled?.(result);
    }
  }

  /** 校验任务定义（含重名与循环依赖检测） */
  private validateDef(def: TaskDef): void {
    if (!def.name) throw new Error('[TaskHub] Task name is required.');
    if (this.tasks.has(def.name)) throw new Error(`[TaskHub] Task "${def.name}" is already registered.`);
    if (!def.run) throw new Error(`[TaskHub] Task "${def.name}" must have a run function.`);

    if (def.type === 'periodic' && def.interval !== undefined && def.interval <= 0) {
      throw new Error(`[TaskHub] Task "${def.name}" interval must be positive.`);
    }

    for (const dep of def.deps ?? []) {
      if (dep === def.name) {
        throw new Error(`[TaskHub] Task "${def.name}" cannot depend on itself.`);
      }
    }

    // 已启动后追加的任务必须能立刻解析依赖，否则同样会静默挂起
    if (this.started) {
      const missing = (def.deps ?? []).filter(dep => !this.tasks.has(dep));
      if (missing.length > 0) {
        throw new Error(`[TaskHub] Task "${def.name}" depends on unregistered task(s): ${missing.join(', ')}.`);
      }
    }

    if (this.hasCycle(def.name, def.deps ?? [])) {
      throw new Error(`[TaskHub] Task "${def.name}" introduces a circular dependency.`);
    }
  }

  /** Start 前统一校验依赖引用完整性，拼错的依赖名在这里暴露而不是静默挂起 */
  private assertDepsRegistered(): void {
    const problems: string[] = [];

    for (const task of this.sortedTasks) {
      const missing = task.deps.filter(dep => !this.tasks.has(dep));
      if (missing.length > 0) problems.push(`"${task.def.name}" -> ${missing.join(', ')}`);
    }

    if (problems.length > 0) {
      throw new Error(`[TaskHub] Unregistered dependencies: ${problems.join('; ')}.`);
    }
  }

  /** 迭代式 DFS：检测新任务是否会形成循环依赖 */
  private hasCycle(newName: string, deps: string[]): boolean {
    const visited = new Set<string>();
    const stack = [...deps];

    while (stack.length > 0) {
      const name = stack.pop()!;
      if (name === newName) return true;
      if (visited.has(name)) continue;
      visited.add(name);
      stack.push(...(this.tasks.get(name)?.deps ?? []));
    }

    return false;
  }

  /** 按 priority 升序插入（二分查找定位） */
  private insertSorted(state: TaskState): void {
    let lo = 0;
    let hi = this.sortedTasks.length;

    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      if (this.sortedTasks[mid].priority <= state.priority) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }

    this.sortedTasks.splice(lo, 0, state);
  }

  /** 内部状态 → 公共快照 */
  private toSnapshot(task: TaskState): TaskSnapshot {
    return {
      blockedBy: task.status === 'blocked' ? (this.blockerOf(task) ?? undefined) : undefined,
      deps: task.deps,
      error: task.error ? String(task.error) : undefined,
      lastRun: task.lastRun,
      name: task.def.name,
      retryCount: task.retryCount,
      status: task.status,
      type: task.def.type
    };
  }
}

export { TaskHub };

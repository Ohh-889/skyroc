/** 任务类型 */
type TaskType = 'init' | 'listener' | 'periodic';

/** 任务运行状态 */
type TaskStatus = 'blocked' | 'done' | 'failed' | 'pending' | 'running';

/** 传给任务执行体的上下文 */
interface TaskContext {
  /** Hub 停止 / 任务被移除时触发，用于中断长耗时的 run */
  signal: AbortSignal;
}

/** 任务定义公共字段 */
interface BaseTaskDef {
  /** 清理函数，仅当任务真正执行过才会被调用 */
  cleanup?: () => void;
  /** 依赖的任务名列表，这些任务完成后才会调度当前任务 */
  deps?: string[];
  /** 任务唯一标识 */
  name: string;
  /** 优先级，数字越小越先启动，默认 10 */
  priority?: number;
  /** 任务执行体 */
  run: (ctx: TaskContext) => void | Promise<void>;
}

/** 一次性初始化任务：依赖满足后执行一次 */
interface InitTaskDef extends BaseTaskDef {
  type: 'init';
}

/** 监听器任务：依赖满足后注册一次，stop 时通过 cleanup 注销 */
interface ListenerTaskDef extends BaseTaskDef {
  type: 'listener';
}

/** 周期任务：依赖满足后按 interval 反复执行 */
interface PeriodicTaskDef extends BaseTaskDef {
  /**
   * 依赖满足后是否立刻执行第一次，默认 true
   *
   * 设为 false 时，首次执行推迟到一个完整的 interval 之后 —— 适用于「启动那一刻跑没有意义」 的轮询，比如版本更新检查
   */
  immediate?: boolean;
  /** 执行间隔（ms），默认 5000。实际触发时刻落在 [interval, interval + tickInterval) 内 */
  interval?: number;
  type: 'periodic';
}

/** 任务定义 — 注册时传入 */
type TaskDef = InitTaskDef | ListenerTaskDef | PeriodicTaskDef;

/** 任务快照 — snapshot() 返回的单个任务信息 */
interface TaskSnapshot {
  /** 当前处于 blocked 时，直接导致阻塞的上游任务名 */
  blockedBy?: string;
  /** 依赖列表 */
  deps: string[];
  /** 最近错误信息 */
  error?: string;
  /** 上次执行时间戳 */
  lastRun: number;
  /** 任务名 */
  name: string;
  /** 已重试次数 */
  retryCount: number;
  /** 当前状态 */
  status: TaskStatus;
  /** 任务类型 */
  type: TaskType;
}

/** 全部 init 任务到达终态后的结果汇总 */
interface InitSettleResult {
  /** 因上游永久失败而从未执行的任务名 */
  blocked: string[];
  /** 成功完成的任务名 */
  done: string[];
  /** 重试耗尽仍失败的任务名 */
  failed: string[];
  /** 是否全部成功（failed 与 blocked 均为空） */
  ok: boolean;
}

/** TaskHub 配置项 */
interface TaskHubOptions {
  /** 重试基础延迟（ms），第 n 次重试延迟 = baseRetryDelay * 2^(n-1)，默认 1000 */
  baseRetryDelay?: number;
  /** 失败任务最大重试次数，默认 3，设为 0 禁用重试 */
  maxRetries?: number;
  /** 全部 init 任务成功完成时触发；无 init 任务时在 start 后立即触发 */
  onReady?: () => void;
  /** 全部 init 任务到达终态时触发，无论成功与否，早于或同步于 onReady 之后 */
  onSettled?: (result: InitSettleResult) => void;
  /** 依赖任务永久失败导致当前任务无法执行时触发，blockedBy 为直接上游任务名 */
  onTaskBlocked?: (taskName: string, blockedBy: string) => void;
  /** 错误回调，任务每次失败都会触发（含重试过程中的失败） */
  onTaskError?: (taskName: string, error: unknown) => void;
  /** 周期任务的心跳间隔（ms），默认 1000。不影响 init / listener 的调度速度 */
  tickInterval?: number;
}

export type {
  InitSettleResult,
  InitTaskDef,
  ListenerTaskDef,
  PeriodicTaskDef,
  TaskContext,
  TaskDef,
  TaskHubOptions,
  TaskSnapshot,
  TaskStatus,
  TaskType
};

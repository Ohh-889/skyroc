# @skyroc/scheduler

协作式任务调度中枢 — 统一管理应用启动时的初始化、定时器和监听器。

## 解决什么问题

复杂应用启动时面临的典型困境：

```
❌ 认证、配置、权限、路由 … 各自 init，执行顺序靠运气
❌ 心跳、上报、轮询、token 刷新 … 每个一个 setInterval，谁也管不着谁
❌ resize、online/offline、visibilitychange … 监听器散落各处，清理全靠记忆
❌ 某个初始化悄悄失败，应用永远停在 loading，没人知道卡在哪
```

TaskHub 的答案：**一个任务注册表 + 依赖关系声明 + 明确的终态信号**。

```
✅ 声明式注册，依赖自动解析
✅ 依赖链事件驱动推进，不靠轮询等待
✅ 周期任务共享唯一心跳
✅ stop() 一次性清理所有任务，且可重新 start
✅ 成功走 onReady，失败走 onSettled，绝不静默挂起
```

## 核心概念

### 三种任务类型

| 类型       | 行为                                        | 典型场景                     |
| ---------- | ------------------------------------------- | ---------------------------- |
| `init`     | 依赖满足后执行**一次**                      | 认证、加载配置、初始化路由   |
| `periodic` | 依赖满足后按 `interval` **周期执行**        | 心跳、数据上报、token 刷新   |
| `listener` | 依赖满足后注册**一次**，stop 时自动 cleanup | resize、网络状态、页面可见性 |

### 调度模型

`init` / `listener` 与 `periodic` 走**两条互不干扰的通路**——前者是依赖编排，后者是时间调度。
把它们绑在同一个心跳上，只会让启动流程被轮询拖慢。

```
                      ┌──────────────────────────────────────┐
  start()  ─────────► │  pump()  事件驱动                     │
                      │                                      │
                      │  扫描 init / listener：               │
                      │    pending + deps 全部 done → 执行     │
                      │                                      │
                      │  任一任务完成 ──► 立即再 pump 一次      │
                      └──────────────────────────────────────┘
                                     │
                                     ▼
                      全部 init 到达终态 → onSettled
                      全部 init 成功     → onReady

                      ┌──────────────────────────────────────┐
  仅当存在周期任务  ──► │  tick()  单一 setInterval             │
                      │    deps 满足 + 间隔到了 → 再次执行      │
                      └──────────────────────────────────────┘
```

**关键含义**：一条 `auth → permissions → routes` 的依赖链，无论 `tickInterval` 设成多少，
都在同一批微任务里跑完。`tickInterval` 只影响周期任务的时间精度。

### 状态机

```
        deps 满足                   成功
pending ─────────► running ──────────────────► done
   ▲                  │
   │                  │ 失败 & 还有重试机会
   │  退避到期          ▼
   └────────────── failed
                      │ 重试耗尽
                      ▼
              下游任务 ──► blocked ◄──► pending
                          （上游被替换后自动恢复）
```

## 安装

包已在 monorepo 内，直接引用：

```ts
import { TaskHub } from '@skyroc/scheduler';
```

## 快速上手

```ts
const hub = new TaskHub({
  onReady: () => {
    console.log('所有初始化完成，应用就绪');
  },
  onSettled: result => {
    if (!result.ok) {
      // 初始化没能全部成功 —— 在这里做降级 UI，而不是让用户对着 loading 发呆
      console.error('启动失败:', result.failed, '被阻塞:', result.blocked);
    }
  },
  onTaskError: (name, err) => {
    console.error(`任务 ${name} 失败:`, err);
  }
});

// ---- 1. 初始化任务（有依赖链）----

hub.register({
  name: 'auth',
  type: 'init',
  priority: 1,
  run: async () => {
    await authService.init();
  }
});

hub.register({
  name: 'permissions',
  type: 'init',
  priority: 2,
  deps: ['auth'],
  run: async () => {
    await permissionService.load();
  }
});

hub.register({
  name: 'routes',
  type: 'init',
  priority: 3,
  deps: ['permissions'],
  run: async () => {
    await routerService.initDynamicRoutes();
  }
});

// ---- 2. 周期任务 ----

hub.register({
  name: 'heartbeat',
  type: 'periodic',
  interval: 30_000,
  deps: ['auth'],
  run: () => {
    api.heartbeat();
  }
});

// ---- 3. 监听器任务 ----

hub.register({
  name: 'network-monitor',
  type: 'listener',
  run: () => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
  },
  cleanup: () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  }
});

// ---- 启动 ----
hub.start();

// ---- 应用卸载时 ----
hub.stop();
```

## API

### `new TaskHub(options?)`

```ts
interface TaskHubOptions {
  /** 周期任务的心跳间隔（ms），默认 1000。不影响 init / listener 的调度速度 */
  tickInterval?: number;
  /** 失败任务最大重试次数，默认 3，设为 0 禁用 */
  maxRetries?: number;
  /** 重试基础延迟（ms），第 n 次重试延迟 = base * 2^(n-1)，默认 1000 */
  baseRetryDelay?: number;
  /** 全部 init 成功完成时触发；无 init 任务时 start 后立即触发 */
  onReady?: () => void;
  /** 全部 init 到达终态时触发，无论成功与否 */
  onSettled?: (result: InitSettleResult) => void;
  /** 任务每次失败都会触发（含重试过程中的失败） */
  onTaskError?: (taskName: string, error: unknown) => void;
  /** 任务因上游永久失败而无法执行时触发 */
  onTaskBlocked?: (taskName: string, blockedBy: string) => void;
}
```

### `.register(def)` / `.registerAll(defs)` / `.add(def)`

注册任务，支持链式调用。`TaskDef` 是按 `type` 判别的联合类型——`interval` 只在
`type: 'periodic'` 上存在，写在别的类型上会被 TypeScript 直接拦下。

```ts
type TaskDef = {
  name: string; // 唯一标识，重复注册会抛错
  priority?: number; // 数字越小越先启动，默认 10
  deps?: string[]; // 依赖的任务名
  run: (ctx: TaskContext) => void | Promise<void>;
  cleanup?: () => void; // 仅当任务真正执行过才会被调用
} & ({ type: 'init' } | { type: 'listener' } | { type: 'periodic'; interval?: number });
```

`ctx.signal` 是一个 `AbortSignal`，在 `stop()` / `dispose()` / `remove()` 时触发，
用来中断长耗时的 run：

```ts
hub.register({
  name: 'sync',
  type: 'init',
  run: async ctx => {
    const res = await fetch('/api/bootstrap', { signal: ctx.signal });
    await applyBootstrap(await res.json());
  }
});
```

注册顺序任意，依赖可以后注册。但**依赖名必须最终存在**：`start()` 时会统一校验，
拼错的依赖名直接抛错，而不是让任务永久挂起。

```ts
hub.register({ name: 'perm', type: 'init', deps: ['authh'], run: loadPerm });
hub.register({ name: 'auth', type: 'init', run: initAuth });
hub.start();
// Error: [TaskHub] Unregistered dependencies: "perm" -> authh.
```

### `.start()` / `.stop()` / `.dispose()`

| 方法        | 停调度 | 调用 cleanup | 重置任务状态 | 清空注册表 |
| ----------- | ------ | ------------ | ------------ | ---------- |
| `stop()`    | ✅     | ✅           | ✅           | ❌         |
| `dispose()` | ✅     | ✅           | ✅           | ✅         |

`stop()` **保留注册表**，因此 `stop()` → `start()` 可以完整重跑一遍——这正是 React
StrictMode 双挂载需要的行为。代价是 `init` / `listener` 的 `run` 应当**幂等**。

彻底销毁（整个 hub 不再使用）用 `dispose()`。

### `.pause()` / `.resume()`

暂停心跳与重试退避计时；`resume()` 按**剩余时间**继续，不会因为暂停而丢掉一次重试。
适用于页面切到后台时暂停、切回前台时恢复。

### `.remove(name)`

移除任务，并对执行过的任务调用 `cleanup`，返回是否命中。
若被移除的任务仍被下游依赖，下游会转入 `blocked` 并触发 `onTaskBlocked`——而不是静默挂起。

### `.snapshot()` / `.getTask(name)`

```ts
hub.snapshot();
// 按 priority 升序：
// [
//   { name: 'auth', type: 'init', status: 'failed',  retryCount: 3, error: 'Error: timeout', deps: [] },
//   { name: 'perm', type: 'init', status: 'blocked', blockedBy: 'auth', retryCount: 0, deps: ['auth'] },
// ]
```

### `.running`

只读属性：已 `start()` 且未 `pause()`。

## 重试机制

失败的 `init` / `listener` 会按指数退避自动重试（`periodic` 天然在下个周期重试，不参与退避）。

```
maxRetries: 3, baseRetryDelay: 1000
  ├─ 初始执行失败
  ├─ 第 1 次重试：1s 后   （base * 2^0）
  ├─ 第 2 次重试：2s 后   （base * 2^1）
  ├─ 第 3 次重试：4s 后   （base * 2^2）
  └─ 仍失败 → 保持 failed，下游转入 blocked，onSettled 汇报失败
```

即 `maxRetries: 3` = **1 次初始执行 + 3 次重试**，共 4 次调用。
退避由独立的 `setTimeout` 精确触发，不受 `tickInterval` 影响。

## 依赖与阻塞

```ts
hub.register({ name: 'auth',        type: 'init', run: ... });
hub.register({ name: 'permissions', type: 'init', deps: ['auth'], run: ... });
hub.register({ name: 'heartbeat',   type: 'periodic', interval: 30000, deps: ['auth'], run: ... });
```

上游**永久失败**（重试耗尽）后，下游沿依赖链级联标记为 `blocked` 并触发 `onTaskBlocked`。
`blocked` 是**派生状态**而非终点——替换掉出问题的上游，下游会自动回到 `pending` 并继续：

```ts
hub.remove('auth');
hub.add({ name: 'auth', type: 'init', run: initAuthViaFallback });
// permissions 自动解除 blocked，并在 auth 完成后执行
```

周期任务的失败**不会**阻塞下游——它会在下个周期自愈。

## 就绪与失败

```ts
interface InitSettleResult {
  ok: boolean; // failed 与 blocked 均为空
  done: string[]; // 成功完成
  failed: string[]; // 重试耗尽仍失败
  blocked: string[]; // 因上游失败而从未执行
}
```

- `onReady` — 只在**全部 init 成功**时触发
- `onSettled` — 全部 init 到达终态就触发，**成功与失败都会走到**

启动流程必须处理失败路径，否则一次网络抖动就能让应用永远停在 loading：

```ts
const hub = new TaskHub({
  onReady: () => store.dispatch(setAppReady(true)),
  onSettled: result => {
    if (!result.ok) store.dispatch(setBootstrapError(result));
  }
});
```

## 与传统方式对比

| 维度           | N 个 `setInterval`          | `TaskHub`                    |
| -------------- | --------------------------- | ---------------------------- |
| 依赖关系       | 无法表达                    | `deps` 天然支持 DAG          |
| 依赖链耗时     | —                           | 事件驱动，不随链长增加等待   |
| 执行顺序       | 靠代码位置，容易出错        | `priority` + 依赖自动保证    |
| 清理           | 逐一保存 timer id，容易遗漏 | `stop()` 一次清理全部        |
| 暂停 / 恢复    | 需自行维护状态              | `pause()` / `resume()`       |
| 状态观测       | 无                          | `snapshot()` 随时看全貌      |
| Timer 数量     | 随业务线性膨胀              | 周期任务共用 1 个            |
| 错误处理       | 各自为政                    | 统一 `onTaskError`           |
| 重试           | 需手动实现                  | 指数退避，开箱即用           |
| 启动失败可观测 | 无                          | `onSettled` / `blocked` 链路 |

## 在 React 中使用

在**模块作用域**创建单例，`useEffect` 里绑定生命周期。`stop()` 保留注册表，
所以 StrictMode 的 mount → unmount → mount 会完整重跑一遍：

```ts
import { useEffect } from 'react';
import { TaskHub } from '@skyroc/scheduler';

const hub = new TaskHub({
  onReady: () => store.dispatch(setAppReady(true)),
  onSettled: result => {
    if (!result.ok) store.dispatch(setBootstrapError(result));
  },
  onTaskError: (name, err) => logger.error(name, err)
});

hub.registerAll([authTask, permissionTask, heartbeatTask, networkTask]);

export const AppScheduler = () => {
  useEffect(() => {
    hub.start();
    return () => hub.stop();
  }, []);

  return null;
};
```

> 前提：`init` / `listener` 的 `run` 必须幂等——重跑一次不能产生副作用叠加。
> 需要跳过重跑时，在任务内部自行短路。

## 设计原则

- **零框架依赖** — 纯 class，Web / React Native / Node 均可使用
- **声明式 > 命令式** — 注册任务定义，调度交给引擎
- **单一职责** — 只做调度，不做业务逻辑
- **不静默失败** — 拼错的依赖、失败的启动、被阻塞的任务，都有明确信号
- **可观测** — snapshot 提供完整的运行时状态

## 测试

```bash
# 从 monorepo 根目录
npx vitest run packages/@core/scheduler

# 或在包目录内
pnpm test
pnpm test:coverage
```

测试按**契约**组织（调度时序、退避时刻、状态机迁移、生命周期边界、并发竞态），
而不是按代码行覆盖组织——覆盖率是结果，不是目标。

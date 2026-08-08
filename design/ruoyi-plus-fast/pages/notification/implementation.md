# 落地决策：taskiq、进程模型、雪花 ID、公告修订

> 文档状态：提案，供讨论
>
> 前置：`platform.md`（目标形态）、`infra.md`（基础设施盘点）。本文取代 `infra.md` §2/§3 的"纯表 + 协程"方案——改用 **taskiq 做执行层，表做真相层**。
>
> 已确认前提：MySQL 8.0+（`SKIP LOCKED` 可用）、Redis 已有、全栈 async、**不考虑兼容，可以全部重写**、**主键用雪花**。

---

## 1. taskiq 负责什么，不负责什么

### 1.1 一句话职责划分

```
MySQL 表    = 真相       事务性入队 · 到期时间 · 可取消可改期 · 可审计 · 跨重启不丢
taskiq      = 执行       worker 池 · 并发控制 · 即时重试 · DI · 序列化
Redis       = 传输       Stream 做队列（有 ack、可重投）
```

**taskiq 不碰"什么时候该干"这个问题，只碰"现在把这个活干掉"。**

### 1.2 为什么不让 taskiq 管入队时机

因为事务性入队做不到（`infra.md` §6.5 的论证）：

```
业务事务：改公告状态 scheduled  +  broker.kiq(publish_notice)
              ↑ MySQL              ↑ Redis     两个存储，无法原子
```

- MySQL 提交成功 → Redis 入队失败 → **公告永远不发**（静默）
- Redis 入队成功 → MySQL 回滚 → **发一条不存在的公告**

所以必须是：**先写表（同事务），再由 relay 搬进 taskiq**。

### 1.3 三段结构

```
┌── API 进程（uvicorn worker × N）─────────────────────────┐
│                                                          │
│  业务事务                                                 │
│    ├─ 写业务表                                            │
│    └─ 写 msg_outbox / msg_task 行     ← 同一个事务         │
│  COMMIT                                                   │
│    ↓ SQLAlchemy after_commit 事件                         │
│  relay.notify()  ← 同步、非阻塞、丢了无所谓                 │
│                                                          │
│  ┌── Relay 协程（每个 API 进程一个）──────────────────┐    │
│  │  领取到期行（SKIP LOCKED） → task.kiq() → 标 sent │    │
│  │  唤醒信号 or 1 秒轮询兜底                          │    │
│  └───────────────────────────────────────────────────┘    │
└──────────────────────┬───────────────────────────────────┘
                       │ Redis Stream
┌──────────────────────▼───────────────────────────────────┐
│  taskiq worker 进程 × M（独立部署单元，同一份代码）        │
│    扇出 · 渲染 · 发邮件 · 发短信 · 推信号                  │
│    失败：SimpleRetryMiddleware 即时重试；仍失败 → 回写表    │
└──────────────────────────────────────────────────────────┘
```

Relay 是**唯一**知道"表里有活要推给 taskiq"的东西。它很薄——领取、`kiq`、标记，大约 60 行。

### 1.4 具体代码形状

```python
# app/core/taskqueue/broker.py
from taskiq import SimpleRetryMiddleware
from taskiq_redis import RedisAsyncResultBackend, RedisStreamBroker

# 用 RedisStreamBroker 而不是 ListQueueBroker：
# Stream 有消费组和 ack，worker 崩了消息会重投给别的 worker。
# ListQueueBroker 是 LPUSH/BRPOP，取出后崩掉那条就没了。
broker = (
    RedisStreamBroker(url=settings.redis_url)
    .with_result_backend(RedisAsyncResultBackend(settings.redis_url))
    # 即时重试：只管网络抖动、死锁这类偶发失败。持续失败交给表，见 §2
    .with_middlewares(SimpleRetryMiddleware(default_retry_count=3))
)
```

```python
# app/modules/notification/tasks.py
@broker.task(retry_on_error=True, max_retries=3)
async def fanout_message(msg_id: int) -> None:
    """扇出一条消息。幂等、可续跑，所以重投安全。"""
    ...

@broker.task(retry_on_error=True, max_retries=5)
async def deliver_external(delivery_id: int) -> None:
    """一条外部渠道投递。"""
    ...
```

```python
# app/core/taskqueue/relay.py
class TaskRelay:
    """把表里到期的活推进 taskiq。

    这是全系统唯一从表往队列搬东西的地方。它不执行业务逻辑，
    只做「领取 → kiq → 标记」，所以它自己失败时重跑是安全的：
    kiq 之前崩 → 行还是 pending，下轮重领；
    kiq 之后、标记之前崩 → 会重复 kiq 一次，靠任务本身幂等兜住。
    """

    async def _tick(self) -> int:
        rows = await self._claim_due(limit=100)      # SKIP LOCKED
        for row in rows:
            await TASK_HANDLERS[row.kind].kiq(**row.payload)
        await self._mark_sent([r.task_id for r in rows])
        return len(rows)
```

注意 relay 的失败语义：**至少一次**。`kiq` 成功但标记失败会重复投递，所以**所有 taskiq 任务必须幂等**。这不是额外负担——扇出靠 `PRIMARY KEY (user_id, msg_id)`、投递靠 `UNIQUE (msg_id, user_id, channel)`，本来就是幂等的。

### 1.5 明确不使用 taskiq scheduler

taskiq 有 `TaskiqScheduler`，但我建议**不用**，三个理由：

1. **分钟粒度。** taskiq scheduler 按分钟对齐轮询 source。重试退避是秒级的，表达不了。
2. **必须恰好跑一个进程。** 和 celery beat 一样——跑两个就重复触发。这就把"选主"这个运维约束塞回来了。而 relay 靠 `SKIP LOCKED`，跑几个都对。
3. **`LabelScheduleSource` 是静态的。** 它从任务装饰器上的 label 读 cron 表达式，表达不了"这条公告改到明天 9 点了"。虽然可以自己实现 `ScheduleSource` 从数据库读，但那就是我下面这张表 + 多一层适配，而且还受第 1、2 条限制。

**周期任务（对账、清理、摘要扫描）也走表**，用自我重排（§3.5）。这样只有一种定时机制，不是两种。

### 1.6 taskiq 真正带来的价值

不用它完全能做（`infra.md` §2 那版），但它省掉的是这些：

| 能力 | 自己写要多少事 |
| --- | --- |
| worker 进程模型 + 优雅退出 | CLI、信号处理、排空逻辑 |
| 并发上限（`--max-async-tasks`） | 自己写信号量 |
| 序列化 + 参数校验 | 自己定协议 |
| 即时重试中间件 | 自己写退避 |
| FastAPI 风格 DI（`taskiq_fastapi.init`） | 自己传 session_factory 到处走 |
| 结果后端（想查任务结果时） | 自己建表 |
| 中间件钩子（埋点、trace 透传） | 自己在每个任务里写 |

最后一条对我们特别有用：`platform.md` §18 的 trace 需要在每个阶段留痕，做成一个 taskiq 中间件比在每个任务里手写干净得多。

---

## 2. 定时与重试：两层，职责分开

### 2.1 判据只有一个

> **这次重试要不要跨越进程重启？**
>
> 不要 → taskiq 中间件（内存、秒级、便宜）
> 要 → 表（落库、可观测、可退避到小时级）

### 2.2 第一层：taskiq `SimpleRetryMiddleware`

处理**偶发失败**：网络抖动、MySQL 死锁、Redis 瞬断。

```python
@broker.task(retry_on_error=True, max_retries=3)
```

特点：进程内、秒级、不落库、重试次数用完就抛给下一层。适合 3 次以内。

### 2.3 第二层：表上的 `attempts` + `next_retry_at`

处理**持续失败**：短信供应商挂了、邮件被限流、对方接口 500。

taskiq 重试用完之后，任务的最后动作是**回写表**：

```python
@broker.task(retry_on_error=True, max_retries=3)
async def deliver_external(delivery_id: int) -> None:
    try:
        await do_send(delivery_id)
    except RetryableError as e:
        # taskiq 的 3 次即时重试已经用完了，说明不是抖动。
        # 交给表做长退避，这次任务算「正常结束」——不能让它继续在 taskiq 里重试。
        await schedule_retry(delivery_id, error=str(e))
        return
```

```python
async def schedule_retry(delivery_id: int, error: str) -> None:
    """指数退避 + 抖动。抖动是必须的：供应商恢复的瞬间，
    上万条积压任务会同时退避到同一秒，把刚恢复的服务再打挂。
    """
    row = await get_delivery(delivery_id)
    if row.attempts >= row.max_attempts:
        await mark_dead(delivery_id, error)          # 进死信，告警
        return
    backoff = min(2 ** row.attempts, 3600)            # 1s 2s 4s ... 上限 1 小时
    jitter = random.uniform(0, backoff * 0.3)
    await upsert_task(
        kind="retry_delivery",
        payload={"delivery_id": delivery_id},
        fire_at=now() + timedelta(seconds=backoff + jitter),
        dedupe_key=f"retry_delivery:{delivery_id}",   # ← 不会排出两个重试
    )
```

### 2.4 为什么必须分两层

只用 taskiq 重试的问题：**worker 重启会丢掉所有在途重试**。供应商宕机 10 分钟，期间发版一次，那批消息全没了——而且没有任何痕迹。

只用表重试的问题：一次 MySQL 死锁要等 1 秒才重试，而它其实立刻重试就成功了。而且每次抖动都写一次库。

### 2.5 到期任务表

```sql
CREATE TABLE sys_msg_task (
    task_id      bigint       NOT NULL COMMENT '雪花ID',
    tenant_id    varchar(20)  NOT NULL,
    kind         varchar(40)  NOT NULL COMMENT 'publish|flush_collapse|retry_delivery|snooze|escalate|digest_scan|reconcile',
    payload      json         NOT NULL,
    fire_at      datetime(3)  NOT NULL COMMENT '毫秒精度：秒精度会让退避任务排序不稳定',
    state        varchar(20)  NOT NULL DEFAULT 'pending' COMMENT 'pending|sent|done|cancelled|dead',
    attempts     int          NOT NULL DEFAULT 0,
    max_attempts int          NOT NULL DEFAULT 8,
    -- relay 领取后记这两个，卡死回收和排查都要用
    locked_by    varchar(64)  NULL,
    locked_at    datetime(3)  NULL,
    last_error   text         NULL,
    -- ★ 幂等键。改期 = 一条 UPSERT；不做这个，管理员改 3 次时间就发 3 次公告
    dedupe_key   varchar(200) NOT NULL,
    create_time  datetime(3)  NOT NULL,
    PRIMARY KEY (task_id),
    UNIQUE KEY uk_msg_task_dedupe (dedupe_key),
    -- state 在前把 done/cancelled 挡在扫描范围外（它们占绝大多数行），fire_at 在后做范围扫
    KEY idx_msg_task_due (state, fire_at)
) COMMENT='通知到期任务';
```

`state='sent'` 是 taskiq 特有的一档：已经 `kiq` 出去了，但还没执行完。区分 `sent` 和 `done` 让"卡在队列里"和"执行中崩了"能分开排查。

领取（MySQL 8.0+）：

```sql
SELECT task_id, kind, payload FROM sys_msg_task
 WHERE state = 'pending' AND fire_at <= now(3)
 ORDER BY fire_at LIMIT 100
 FOR UPDATE SKIP LOCKED;
```

---

## 3. 进程模型：R1 和"worker 是什么"

### 3.1 worker 有两种，别混

| | uvicorn worker | taskiq worker |
| --- | --- | --- |
| 干什么 | 处理 HTTP 请求、维持 WS/SSE 长连接 | 消费队列、执行后台任务 |
| 启动命令 | `uvicorn app.main:app --workers 4` | `taskiq worker app.core.taskqueue.broker:broker` |
| 数量依据 | 请求量、长连接数 | 扇出量、投递量 |
| 部署单元 | 一个 | 另一个 |
| 代码 | **同一份** | **同一份** |

"worker" 这个词在两边都用，但它们是**两个独立的部署单元，跑同一份代码，只是入口命令不同**。

### 3.2 为什么要分开

1. **别抢资源。** 扇出 1000 人要几十秒 CPU，跑在 API 进程里会拖慢请求（Python 是单线程事件循环，一个不 await 的重计算就把整个进程堵住）
2. **独立伸缩。** 大公告发布时加 taskiq worker，不用动 API
3. **独立重启。** 发版后台任务不断用户的 WebSocket 连接
4. **崩溃隔离。** 任务 OOM 不影响在线用户

### 3.3 R1 的答案：一定是多实例

你问"多实例也就是多个进程对吧"——是，但要点是：

> **只要 `uvicorn --workers > 1`，你就已经是多实例了。**

因为 `app/infra/realtime/runtime.py` 里：

```python
_instance_id = uuid4().hex          # 每个进程一个
_registry: ConnectionRegistry | None = None   # 进程内内存
```

连接注册表在**进程内存**里。`--workers 4` 就是 4 份互不相通的注册表。所以 `RedisRealtimeBroker` 不是"为了以后上 K8s 才要的"，是**单机跑 4 个 worker 就必需**。

加上 taskiq worker，实际的进程拓扑是：

```
机器 / Pod
├── uvicorn worker × 4     各有一份连接注册表，各自 instance_id
├── taskiq worker × 2      没有任何连接
└── 共用：MySQL + Redis
```

**结论：所有设计都必须假定多进程。** 这带来一个具体后果，见下。

### 3.4 ★ 需要改 realtime 的一个点（从代码里读出来的）

taskiq worker 进程里**没有任何连接**。它扇出完要推信号，只能靠 Redis Pub/Sub 转给 API 进程。

看 `runtime.py` 的实现：

```python
async def _forward(delivery: RealtimeDelivery) -> None:
    if _broker is not None:              # ← broker 由 start_realtime() 创建
        await _broker.publish(delivery)
```

而 `start_realtime()` 同时做了两件事：**创建 broker（为了发布）** 和 **订阅频道（为了接收）**。

worker 进程需要前者，不需要后者。现在的接口逼它二选一：

- 不调 `start_realtime` → `_broker is None` → `_forward` 什么都不做 → **信号发不出去，静默失败**
- 调 `start_realtime` → 也订阅了 → worker 收到所有投递指令，逐个调 `registry.send_to_user` 命中 0 条。**不错，但纯浪费**，而且 worker 数量多了会放大 Redis 的 fan-out

建议加一个只发布的模式：

```python
async def start_realtime(redis: PrefixedRedis, *, subscribe: bool = True) -> None:
    """subscribe=False 只建发布通道，不订阅。

    给 taskiq worker 用：它要往连接上推信号（发布），但自己没有任何连接
    （不需要订阅）。订阅了的话每条跨实例投递都会在 worker 上白跑一遍
    registry.send_to_user 然后命中 0 条。
    """
```

改动很小，但**不改就是静默失败**——worker 扇出成功、信号发不出去、用户要等下次 sync。这种 bug 在单进程开发环境永远不会暴露。

### 3.5 DI：让任务复用 FastAPI 的依赖

```python
# app/core/taskqueue/broker.py
import taskiq_fastapi

# 让 taskiq 任务能用 FastAPI 的 Depends。省掉把 session_factory
# 手工传到每个任务里，也保证 API 和任务拿到的是同一套依赖装配。
taskiq_fastapi.init(broker, "app.main:app")
```

```python
@broker.task
async def fanout_message(
    msg_id: int,
    session: AsyncSession = TaskiqDepends(get_session),
) -> None:
    ...
```

注意 worker 进程的 lifespan：taskiq 的 `broker.startup()` 会跑 FastAPI 的 lifespan 依赖，但**不会跑 `app/main.py` 的 lifespan 函数体**。所以 worker 里要显式做那些初始化：

```python
@broker.on_event(TaskiqEvents.WORKER_STARTUP)
async def on_worker_start(state: TaskiqState) -> None:
    get_engine()
    install_audit_filling()
    if settings.tenant_enabled:
        install_tenant_scoping()
    # 只发布不订阅，见 §3.4
    await start_realtime(get_redis_client(), subscribe=False)
```

**`install_audit_filling` 在 worker 里也要装**，否则后台任务写的行 `create_by` 是空的。`identity.py` 的注释说得对——定时任务本来就没有操作人，留空是对的，但别是"忘了装所以留空"。

---

## 4. 雪花 ID

### 4.1 worker_id 从 Redis 租

雪花需要机器位。多进程（4 uvicorn + 2 taskiq，还会扩）下不能写死也不能靠 hostname——同一个 Pod 里 6 个进程 hostname 一样。

```python
# app/infra/snowflake.py
WORKER_ID_BITS = 10          # 0..1023

async def lease_worker_id(redis: PrefixedRedis) -> int:
    """开机租一个 worker_id，心跳续租，退出释放。

    逐个试候选位而不是 INCR 取模：INCR 会一直往上涨，重启频繁的环境
    很快绕回来撞上还活着的进程。SET NX 是「找一个真的空位」。
    """
    for candidate in range(1 << WORKER_ID_BITS):
        if await redis.set(f"snowflake:worker:{candidate}", INSTANCE_ID, nx=True, ex=60):
            return candidate
    raise RuntimeError("雪花 worker_id 已用尽，检查是否有大量进程没有正常释放")
```

心跳每 20 秒 `EXPIRE` 续到 60 秒，退出时 `DEL`。**续租失败必须让进程退出**——租约过期意味着别的进程可能已经拿到同一个 id，继续发号会产生重复主键。

项目里 `app/infra/redis/counter.py` 已有 Lua + TTL 的成熟写法，续租逻辑可以套同一个模式。

### 4.2 ★ 雪花不能当 seq 用

有了雪花之后最容易犯的错：

```python
# ❌ 绝对不行
entry.seq = snowflake.next_id()
```

`platform.md` §13.2 论证过：取号顺序和提交顺序无关，客户端会永久跳过在途事务的消息。雪花更糟——机器位在中间，**多进程下连大致有序都不保证**。

`seq` 必须来自**每用户计数器行 + 行锁持有到提交**。MySQL 写法：

```sql
UPDATE sys_msg_cursor SET next_seq = LAST_INSERT_ID(next_seq + 1) WHERE user_id = ?;
SELECT LAST_INSERT_ID();
```

建议在 CI 加一条检查：除 `sequence.py` 外不许出现 `next_seq` 的写操作。这条错了不会立刻报错，只会偶发丢消息。

### 4.3 ★ 分页游标：需要两个 seq（一个真实的设计修正）

这是想清楚雪花和分页之后发现的问题。

原设计里 `seq` 同时承担两件事：**增量同步游标** 和 **列表排序**。但它们要求相反：

- 同步需要"任何变更都推进" → 标记已读也要推进
- 列表需要"位置稳定" → 标记已读**不能**让这条跳到列表顶部

按 `seq` 排序 + 已读推进 seq = **点一下已读，这条消息跳到列表第一位**。

所以拆成两列，同一个计数器分配：

```sql
-- 插入序，永不改。列表排序 + 游标分页用
entry_seq  bigint NOT NULL,
-- 变更序，任何变更都推进。增量同步用
change_seq bigint NOT NULL,

UNIQUE KEY uk_inbox_change (user_id, change_seq),   -- sync
KEY idx_inbox_feed (user_id, entry_seq)             -- 列表 + 分页
```

分配规则：

| 操作 | `entry_seq` | `change_seq` |
| --- | --- | --- |
| 插入 | `next()` | 同 `entry_seq` |
| 标记已读 / 处理态变化 / 修订 / 撤回 | **不变** | `next()` |

好处不只是修掉排序问题——**分页游标也变得极简**：

```sql
-- 加载更多：不用 (publish_time, msg_id) 复合游标，一列搞定
SELECT ... FROM sys_msg_inbox
 WHERE user_id = ? AND entry_seq < :cursor AND dismiss_time IS NULL
 ORDER BY entry_seq DESC LIMIT 20;
```

`entry_seq` 每用户严格单调无重复，所以游标分页天然稳定，实时插入新消息也不会让翻页错位。用雪花 `msg_id` 排序反而做不到这点（多进程下不保证有序）。

### 4.4 出网关序列化成 string

雪花超过 `2^53`，JS `number` 装不下。所有 id 字段**统一 string**。

`entry_seq` / `change_seq` 是每用户从 1 开始的计数器，一辈子到不了 `2^53`，可以用 `number`。**这个区别要写进接口文档**，否则前端会把 seq 也当 string 然后做字符串比较（`"9" > "10"` 为真）。

---

## 5. 已发布公告的修改与撤回

你提这个很关键——它是"三表分离"设计价值最集中的地方，也是单表模型彻底做不到的事。

### 5.1 为什么三表分离让这件事变简单

内容只存在 `sys_msg` **一行**里：

```sql
-- 改一条发给 5000 人的公告
UPDATE sys_msg SET title=?, summary=?, body=?, revision=revision+1 WHERE msg_id=?;
```

**一行。** 5000 个收件人立刻看到新内容，因为列表接口 join `sys_msg` 取 title/summary。

单表模型（benai 那种）要 UPDATE 5000 行，而且中间失败就是一半新一半旧。

### 5.2 修改要分两种模式（必须让发布者选）

| | 静默修订 | 重新提醒 |
| --- | --- | --- |
| 场景 | 改错别字、补链接、调格式 | 时间/地点变了、条款改了 |
| 内容 | 更新 | 更新 |
| `revision` | +1 | +1 |
| 已读态 | **保持已读** | **重置为未读** |
| `change_seq` | 推进（客户端换内容） | 推进 |
| 重新走渠道 | 不 | **是**（重新推送/发邮件） |
| 用户感知 | 内容悄悄变了 | 又被通知了一次 |

**默认静默**，勾选"重要修改，重新提醒收件人"才走第二种。

不给选择的后果：只做静默 → 会议改时间了没人知道；只做重新提醒 → 改个错别字把 5000 人又炸一遍。

### 5.3 修改的代价：N 行 `change_seq`

内容是一行，但要让客户端知道就得推进所有收件人的 `change_seq`。5000 人 = 5000 行 + 5000 次取号。

处理方式：**修改接口立刻返回**（内容已更新，任何新查询都是新的），然后排一个任务分块推进。

```python
await upsert_task(
    kind="propagate_revision",
    payload={"msg_id": msg_id, "revision": new_revision, "renotify": renotify},
    fire_at=now(),
    dedupe_key=f"propagate_revision:{msg_id}:{new_revision}",   # revision 进 key
)
```

`revision` 进 `dedupe_key`：连续改两次要传播两次，不能被去重掉。而同一个 revision 重复排任务要幂等。

在线用户几秒内收敛，离线用户下次 sync 拿到。**这是有意接受的最终一致**——内容本身已经是新的了，延迟的只是"主动告知"。

### 5.4 撤回

```sql
UPDATE sys_msg
   SET status='revoked', revoke_time=now(3), revoke_reason=?, revision=revision+1
 WHERE msg_id=? AND status='published';
```

读路径全部加 `status <> 'revoked'` → 立刻对所有新查询生效。然后同样排任务推进 `change_seq`，客户端收到 `op:'retract'` 移除。

四个必须处理的细节：

**(1) 不删数据。** 撤回是状态。历史、审计、"当时发了什么"都要留。

**(2) push 也要撤回。** 手机通知栏那条要消失，靠静默推送 + 设备注册表（`platform.md` §13.6）。不做这个，用户会看到"公告已撤回"但通知栏还挂着原文。

**(3) 已发出的邮件/短信撤不回。** 这是物理限制。**UI 必须明确告知**：

> 撤回后：站内消息和 App 推送将被移除；已发送的 3,204 封邮件和 156 条短信**无法撤回**。

这是最容易被产品忽略的一点，也是最容易变成事故的一点——发布者以为撤回了，实际上敏感内容已经躺在几千个邮箱里。

**(4) 未发出的投递要取消。** 撤回时把 `sys_msg_delivery` 里 `state='pending'` 的行标 `cancelled`，把 `sys_msg_task` 里相关的重试/升级任务标 `cancelled`。不做的话撤回之后邮件还在慢慢发出去。

```sql
UPDATE sys_msg_delivery SET state='cancelled' WHERE msg_id=? AND state IN ('pending','failed');
UPDATE sys_msg_task SET state='cancelled' WHERE dedupe_key LIKE CONCAT('retry_delivery:%') AND ...;
```

### 5.5 修改历史表（公告是有法律效力的东西）

```sql
CREATE TABLE sys_msg_revision (
    revision_id  bigint       NOT NULL COMMENT '雪花ID',
    msg_id       bigint       NOT NULL,
    revision     int          NOT NULL,
    -- 改之前的内容快照。"当时发的是什么"必须可查
    title_before   varchar(255) NOT NULL,
    summary_before varchar(500) NOT NULL,
    body_before    longtext     NULL,
    change_note  varchar(500) NULL COMMENT '修改说明，重新提醒时会展示给收件人',
    renotified   tinyint(1)   NOT NULL DEFAULT 0,
    operator_id  bigint       NOT NULL,
    create_time  datetime(3)  NOT NULL,
    PRIMARY KEY (revision_id),
    UNIQUE KEY uk_msg_revision (msg_id, revision)
) COMMENT='消息修订历史';
```

HR 通知、制度变更、价格调整这类公告，"我当时收到的是什么版本"是会被追究的。存前值而不是后值：当前值在 `sys_msg` 上，历史链只需要每次的前值。

### 5.6 并发保护：乐观锁

两个管理员同时改同一条公告，后提交的会静默覆盖前一个。

```sql
UPDATE sys_msg SET title=?, revision=revision+1
 WHERE msg_id=? AND revision=:expectedRevision;
-- affected_rows = 0 → 别人已经改过，返回 409 让前端重新加载
```

前端编辑时带上 `revision`，提交时回传。

### 5.7 明确禁止修改的字段

不是所有字段都能改。这几个改了等于换了一条消息：

| 字段 | 为什么禁 |
| --- | --- |
| `category` | 分类变了偏好过滤要重算——本来因为 `informational` 被过滤掉的人，改成 `security` 后该收到吗？这条路走不通，应该撤回重发 |
| `priority` 调高 | 等于绕过用户偏好重新打扰。要更紧急就撤回重发 |
| `audience` 减人 | 语义混乱：他已经读过了怎么办？**已发布只允许加人** |
| `intent` | 同 `category`，它决定能不能合并/延迟，改了下游全乱 |

**`audience` 加人是允许的**，走增量扇出——`ON DUPLICATE KEY UPDATE msg_id=msg_id` 天然只插新人，老收件人的 seq 和已读态完全不受影响。

### 5.8 定时公告在发布前修改：完全是另一回事

这个要和上面严格区分：

```
status='draft' / 'scheduled'  →  随便改，没有收件箱行，没有 change_seq 要推进
                                 改期 = 一条 UPSERT 到 sys_msg_task（§2.5 的 dedupe_key）
status='published'            →  走 §5.2~5.7 全套
```

**发布前修改是简单情况，别让它继承已发布修改的复杂度。** 两个接口分开，或者一个接口内按 status 分支，但校验规则完全不同（发布前不校验 §5.7 的禁改字段）。

---

## 6. 汇总：完整表清单（雪花 + MySQL 8）

```
sys_msg_event           事件（幂等边界）        uk(tenant_id, dedupe_key)
sys_msg_outbox          发件箱                 idx(state, next_retry_at)
sys_msg_task            到期任务               uk(dedupe_key) · idx(state, fire_at)
sys_msg                 消息内容 + 受众 + revision
sys_msg_revision        修订历史               uk(msg_id, revision)
sys_msg_inbox           ★ 收件箱               pk(user_id, msg_id) · uk(user_id, change_seq) · idx(user_id, entry_seq)
sys_msg_cursor          ★ seq 分配器 + 计数器   pk(user_id)
sys_msg_bcast_state     全员公告惰性已读态      pk(user_id, msg_id)
sys_msg_delivery        外部渠道投递           uk(msg_id, user_id, channel)
sys_msg_subscription    对象级订阅 / 静音       pk(user_id, target_type, target_id)
sys_msg_preference      用户偏好
sys_msg_device          设备注册表（推送撤回要用）
sys_msg_trace           管线决策留痕（采样）
```

进程：

```
uvicorn app.main:app --workers 4                      API + 长连接 + Relay 协程
taskiq worker app.core.taskqueue.broker:broker -w 2   后台任务
（不跑 taskiq scheduler，见 §1.5）
```

---

## 7. 待确认

| # | 问题 | 建议 |
| --- | --- | --- |
| **I1** | Relay 跑在 API 进程还是独立进程？ | 先跑在 API 进程（沿用 `OperLogRecorder` 范式，零新部署单元）。它很轻——只做领取和 `kiq`。如果观测到它影响请求延迟，再拆出去 |
| **I2** | taskiq broker 用 `RedisStreamBroker` 还是 `ListQueueBroker`？ | **Stream**。有消费组和 ack，worker 崩了消息重投；List 是 LPUSH/BRPOP，取出即丢 |
| **I3** | `start_realtime(subscribe=False)` 这个改动能做吗？ | 需要改 `app/infra/realtime/runtime.py`。不改就是 worker 推送静默失败（§3.4） |
| **I4** | 修改已发公告要不要审批？ | P0 二次确认 + 记 `sys_msg_revision`；审批作为 P1 |
| **I5** | 撤回后已读历史保留吗？ | 保留。收件箱行标记 retracted 而不是删除，用户看到"该消息已撤回"占位而不是凭空消失 |
| **I6** | `entry_seq` / `change_seq` 拆两列接受吗？ | 接受（§4.3）。不拆的后果是点一下已读消息跳到列表顶部 |

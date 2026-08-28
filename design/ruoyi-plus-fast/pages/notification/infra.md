# 通知平台的运行时决策（对齐 skroc-fast 真实基础设施）

> 文档状态：提案，供讨论
>
> 本文回答三个具体问题：**实时通道保留几条**、**要不要引入队列/MQTT**、**定时发布怎么做**。
>
> 与 `platform.md` 的关系：那份是无约束的目标形态，本文是把它落到 skroc-fast 现有基础设施上的运行时决策。本文修正了 `platform.md` P12 和 `backend.md` §7.3 两处错误。

---

## 0. 先把基础设施摸清楚（全部可核对）

| 项           | 实际情况                                               | 证据                                                                            |
| ------------ | ------------------------------------------------------ | ------------------------------------------------------------------------------- |
| 数据库       | **MySQL**（asyncmy 驱动）                              | `pyproject.toml` `asyncmy>=0.2.9`                                               |
| 缓存         | Redis，有成熟原语层                                    | `app/infra/redis/`：`client` / `counter` / `keyspec` / `ratelimit` / `sequence` |
| 任务队列     | **没有**。无 Celery、无 arq、无 dramatiq、无 taskiq    | `pyproject.toml` 依赖清单                                                       |
| MQTT         | **没有**                                               | 同上                                                                            |
| 定时调度     | **没有**。无 APScheduler、无 cron 集成                 | 同上                                                                            |
| 后台异步范式 | **有**：`asyncio.Queue` + 常驻消费协程 + lifespan 启停 | `app/core/operlog/recorder.py`                                                  |
| 实时推送     | 成熟。WS + SSE 共用一张注册表，Redis Pub/Sub 跨实例    | `app/infra/realtime/{runtime,broker,registry}.py`                               |
| 邮件         | 有                                                     | `app/infra/mail/`，`aiosmtplib`                                                 |
| 短信         | 有                                                     | `app/infra/sms/`                                                                |
| 模板引擎     | 有                                                     | `jinja2`                                                                        |
| 主键         | **自增 BigInteger**，不是雪花                          | `sys_notice.notice_id` `autoincrement=True`                                     |
| 租户/审计    | ORM 层自动填充                                         | `install_tenant_scoping` / `install_audit_filling`                              |

结论先行：**这三个问题都不需要引入任何新组件。** 缺的东西用现有的 MySQL + Redis + 那个消费协程范式全部能补齐，而且补出来的东西比引入 Celery/MQTT 更贴合。

---

## 1. 实时通道：问题本身问错了

### 1.1 修正 `platform.md` P12

原来写的是"保留一条（WebSocket），SSE 作降级不作并联"。**这个说法基于一个错误的模型。**

看 `runtime.py` 的实际契约：

```python
async def send_to_users(user_ids, data, *, message_type, msg="ok", cross_instance=True) -> int:
    """发给这些用户的全部在线连接。"""
```

以及模块开头那段：

> 三个入口都不区分传输方式：目标用户挂的是 WebSocket 还是 SSE，由他自己连的时候决定，业务侧只说发给谁。

所以真实模型是：

```
用户 u1
├── 标签页 A：WebSocket 连接
├── 标签页 B：WebSocket 连接
├── 手机 H5：SSE 连接
└── 桌面客户端：WebSocket 连接
        ↑ 注册表按 user_id 聚合，send_to_user 一次投给这 4 条
```

这**不是"两条冗余通道推同一条消息"**，是**一个用户有 N 条连接**。"保留几条通道"这个问题不存在——传输方式是客户端自己选的，服务端不做这个决定，也不该做。

### 1.2 正确的问题是：N 条连接收到同一个信号会不会出事

不会。因为信号载荷只有一个 `seq`：

```json
{ "code": "0000", "msg": "ok", "type": "message.inbox.changed", "msg_id": "...", "data": { "seq": 1045 } }
```

4 条连接各收到一份 → 4 个客户端实例各自做 `if (seq > lastSeq) scheduleSync()`。结果是 4 次 sync 请求，返回同样的数据，各自更新到同一个 lastSeq。**没有正确性问题，只有 3 次多余的请求。**

对比一下：如果推送里带的是完整消息内容，4 条连接就要靠 `msg_id` 去重、要处理"其中一条连接漏了"的情况、要处理"两条连接的消息顺序不一致"。**只推 `seq` 把这些问题全消掉了**——这是 seq 设计除对账之外的第二个红利。

### 1.3 那 3 次多余请求要不要管

要，但在**前端**管，不在后端：

```
同一浏览器的多个标签页 → BroadcastChannel 选一个 leader
  leader 收到信号 → 执行 sync → 把结果广播给其他标签页
  非 leader → 不发请求，只消费广播
```

跨设备（手机 + 桌面）的重复请求管不了也不用管——它们本来就是独立客户端。

**这件事的收益不只是省请求**：提醒（响铃、浏览器通知）也只该由 leader 触发一次。不选主的话，开 3 个标签页收到一条通知会响 3 次铃。

### 1.4 修正后的 P12

| 原                                | 修正后                                                                                                                                                                                                                        |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 保留一条（WebSocket），SSE 作降级 | **WS 和 SSE 都是一等公民，不做降级，传输由客户端自选。** 服务端只调 `send_to_user`，不关心对方挂的是什么。信号幂等由 `seq` 保证，与连接数无关。同浏览器多标签页在**前端**用 BroadcastChannel 选主，避免 N 次 sync 和 N 次响铃 |

### 1.5 修正 `backend.md` §7.3

我在那一节说"多实例推送有缺口，`local_connections` 说明注册表是进程内的"。**这个判断错了。**

`RedisRealtimeBroker` 已经把这件事做完了，而且做得比我提的方案更周全：

| 我提的               | 项目已有的                                                                                       |
| -------------------- | ------------------------------------------------------------------------------------------------ |
| Redis Pub/Sub 跨实例 | ✅ `broker.py`，`REALTIME_TOPIC = "global:websocket"`                                            |
| —                    | ✅ **回环去重**：`if delivery.source == self._instance_id: return`（发布者一定会收到自己的消息） |
| —                    | ✅ **频道带项目前缀**：多项目共用一台 Redis 不串消息                                             |
| —                    | ✅ **listener 异常兜底**：静默退出会导致跨实例推送全断且无报错，所以整个循环外兜一层             |
| —                    | ✅ **关闭顺序**：先停订阅再关连接，且必须排在关 Redis 之前                                       |

`local_connections` 只是返回值语义——`runtime.py` 的 docstring 明确写了「返回值只统计本机。转发给其他实例走的是 redis pub/sub，至多一次、没有回执」。这是**正确的设计**（跨实例投递数没法同步得知，等它就是把请求挂在 pub/sub 上），不是缺口。

需要补的只有一件事：`send_to_all(tenant_id=...)` 用于全员公告时，**在线的人立刻收到信号，离线的人靠下次 sync**。这不需要改 realtime 层，是通知模块自己的事。

---

## 2. 要不要引入队列 / MQTT

### 2.1 MQTT：不引入，理由是场景不沾

MQTT 解决的是这些问题：

| MQTT 的能力                  | 我们的场景需要吗                                                    |
| ---------------------------- | ------------------------------------------------------------------- |
| 海量设备（十万级）长连接     | ❌ 后台管理系统，连接数和用户数同阶                                 |
| 弱网、断续、低带宽（物联网） | ❌ 浏览器 + 企业网络                                                |
| QoS 0/1/2 分级投递保证       | ❌ **已经有更好的方案**：真相在 `sync` 游标，推送本身可以完全不可靠 |
| 遗嘱消息（Last Will）        | ❌ 用不上                                                           |
| 主题通配符订阅树             | ❌ 我们的路由就是 user_id，注册表足够                               |
| 保留消息（Retained）         | ❌ `sync` 就是这个语义，且顺带对账未读数                            |

引入的成本是实打实的：多一个 broker（EMQX/Mosquitto）要部署、监控、备份、做认证桥接（把 JWT 换成 MQTT 的 username/password 或客户端证书），还要在前端引 MQTT.js。

**换来的唯一好处是"离线消息"，而那件事已经被 `sync` 解决了，还解决得更彻底**——MQTT 的离线消息只补消息，`sync` 同时补消息、已读态、未读数、撤回。

### 2.2 Celery：不引入，理由是它会引入一个同步/异步边界

Celery 功能上够用，但对这个项目有两个具体的不合适：

**(1) 它是同步 worker 模型。** 这个项目全栈 async——`asyncmy`、`SQLAlchemy[asyncio]`、`redis.asyncio`、`aiosmtplib`。在 Celery worker 里跑这些要么用 `asyncio.run()` 包一层（每个 task 建一次事件循环和连接池，性能和连接数都难看），要么引 `celery[gevent]` 换 monkey patch（和 asyncio 生态冲突）。Celery 5 的原生 async 支持一直在"计划中"。

**(2) 它带来一个独立部署单元。** worker 进程、beat 进程、各自的健康检查、各自的日志、各自的配置。而这个项目现在是**一个 uvicorn 进程**，lifespan 里把该起的都起了。加 Celery 等于部署复杂度翻倍。

### 2.3 真正需要的只有三件事

把需求剥到底，异步只需要：

| 需要                                                     | 谁来提供                                           |
| -------------------------------------------------------- | -------------------------------------------------- |
| **(a) 提交后异步执行**（不阻塞请求，且必须晚于事务提交） | `sys_msg_outbox` 表 + 消费协程                     |
| **(b) 失败重试**（带退避，可观测，不丢）                 | 表上的 `attempts` / `next_retry_at` / `last_error` |
| **(c) 定时触发**（延迟队列，可取消可改期）               | `sys_msg_task` 表 + 扫描协程（§3）                 |

这三件事**MySQL 表 + 进程内消费协程全部能做**，而且项目里已经有这个范式。

### 2.4 沿用 `OperLogRecorder` 的形状，但改一个关键点

现有范式（`app/core/operlog/recorder.py`）：

```python
class OperLogRecorder:
    def emit(self, event) -> None:
        """同步、绝不阻塞请求。队列满了就丢日志，不能让日志拖垮业务。"""
        try:
            self._queue.put_nowait(event)
        except asyncio.QueueFull:
            logger.warning("操作日志队列已满，丢弃：...")
```

这个形状要照抄，但有**一处必须改**：

> operlog 队列满了可以丢日志。**通知不能丢。**

所以内存队列的角色不同：

```
operlog：  队列里装的是数据      → 队列满了 = 数据丢了
通知：     队列里装的是唤醒信号   → 队列满了 = 无所谓，真相在表里
```

具体做法：

```python
class OutboxPump:
    """通知发件箱的消费者。

    和 OperLogRecorder 的关键区别：内存队列只是「有活干了」的唤醒信号，
    真相全在 sys_msg_outbox 表里。队列满了直接忽略——协程醒来后会从表里
    领取所有待处理的行，不依赖信号的完整性。

    这个区别决定了两件事：
    - 队列满不用告警（operlog 那边必须告警，因为数据丢了）
    - 进程重启不丢任务（operlog 那边会丢队列里没写完的）
    """

    def __init__(self, session_factory, *, poll_interval: float = 1.0) -> None:
        self._session_factory = session_factory
        self._poll_interval = poll_interval
        # maxsize=1：唤醒信号不需要排队，一个就够
        self._wake: asyncio.Queue[None] = asyncio.Queue(maxsize=1)
        self._task: asyncio.Task[None] | None = None

    def notify(self) -> None:
        """写完 outbox 提交后调。绝不阻塞，绝不抛异常。

        队列满说明协程还没来得及处理上一个信号，那它马上就会领到这一批，
        不需要再排一个信号。
        """
        with suppress(asyncio.QueueFull):
            self._wake.put_nowait(None)

    async def _consume(self) -> None:
        while True:
            claimed = await self._claim_batch(limit=50)
            if claimed:
                await self._process(claimed)
                continue                      # 有活就继续领，不等信号
            # 没活了，等唤醒或超时兜底。超时是必须的：
            # 跨实例的 outbox 行不会给本进程发内存信号
            with suppress(TimeoutError):
                await asyncio.wait_for(self._wake.get(), self._poll_interval)
```

在 `main.py` 的 lifespan 里起停，和 `set_recorder` / `close_recorder` 完全一样的位置。

### 2.5 领取语句（MySQL 版）

MySQL 8.0+ 有 `SKIP LOCKED`：

```sql
-- 事务内
SELECT outbox_id, event_id FROM sys_msg_outbox
 WHERE state IN ('pending','failed') AND next_retry_at <= now(3)
 ORDER BY outbox_id LIMIT 50
 FOR UPDATE SKIP LOCKED;

UPDATE sys_msg_outbox
   SET state='running', attempts=attempts+1, locked_by=:instanceId, locked_at=now(3)
 WHERE outbox_id IN (...);
-- COMMIT
```

**多实例天然分工，不需要选主。** 这是 `SKIP LOCKED` 最大的价值——每个实例都跑消费协程，各领各的，不用协调。

如果 MySQL 是 5.7（没有 `SKIP LOCKED`），退化成乐观抢占，任何版本都能用：

```sql
UPDATE sys_msg_outbox
   SET state='running', attempts=attempts+1, locked_by=:instanceId, locked_at=now(3)
 WHERE outbox_id = :id AND state IN ('pending','failed');
-- 检查 affected_rows：== 1 说明抢到了，== 0 说明别人抢走了，跳过
```

代价是要先 SELECT 一批候选再逐个抢，抢空率随实例数上升。实例数 ≤ 4 时无感。

> **需要确认 MySQL 版本**（§5 决策 R2）。这是唯一影响代码写法的事，机制不变。

### 2.6 卡死回收（表方案必备，队列方案自带）

进程被 kill 时，`state='running'` 的行会永远卡住。必须有回收：

```sql
UPDATE sys_msg_outbox
   SET state='pending', locked_by=NULL, locked_at=NULL
 WHERE state='running' AND locked_at < now(3) - INTERVAL 5 MINUTE;
```

这是"表当队列"相比 Celery 唯一多出来的手工活。但它换来一个大好处：**卡住的任务在表里看得见**（`locked_by` 记了实例 id），而 Celery 里丢失的任务需要翻 worker 日志。

重跑安全的前提是扇出幂等（`PRIMARY KEY (user_id, msg_id)`），这个前提本来就要满足。

### 2.7 三层演进路径（每层都不引入新组件）

| 层     | 什么时候上                 | 做法                                                                           | 新增组件                                   |
| ------ | -------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------ |
| **L1** | 现在                       | MySQL 表 + 进程内消费协程 + 1 秒轮询                                           | 无                                         |
| **L2** | 多实例部署且嫌 1 秒延迟高  | 加一个 Redis Pub/Sub 频道 `notify:outbox:wake`，提交后 publish，所有实例立刻醒 | 无（Redis 已有，`broker.py` 就是现成模板） |
| **L3** | 真到量了（每秒几百条扇出） | Redis Stream（消费组 + ack + pending 列表），或独立 worker 进程                | 无（Redis 已有）                           |

**L2 的设计要点：Redis 只做加速，不做真相。** Pub/Sub 是至多一次，消息丢了没关系——1 秒轮询兜底。这条界限一定要守住，一旦让 Redis 承载"待处理任务列表"，就要处理"Redis 和表不一致"，那是 L3 才值得付的复杂度。

L3 才考虑 Redis Stream，理由：它引入两份真相（Stream 里的 pending + 表里的 state），要维护同步。在没有真实吞吐压力前，这个复杂度换不来东西。

### 2.8 一句话回答

> **不引入队列，不引入 MQTT。** 用 MySQL 表当队列 + 项目里已有的进程内消费协程范式，多实例靠 `SKIP LOCKED` 天然分工。想降延迟就加一个 Redis Pub/Sub 频道做唤醒（`broker.py` 是现成模板），但 Redis 只做加速不做真相。
>
> 这个选择的实质是：**用一张能 SELECT 的表换掉一个要另外运维的 broker。** 代价是要自己写卡死回收（§2.6），收益是零新组件、卡住的任务在表里看得见、且没有同步/异步边界。

---

## 3. 定时发布怎么解决

### 3.1 先看清有几种"定时"

它们看起来是不同功能，其实是同一个机制：

| 场景                       | 延迟量级   | 能不能取消/改期                      |
| -------------------------- | ---------- | ------------------------------------ |
| 定时公告（明天 9 点发）    | 天         | **必须能**（改期、取消是常规操作）   |
| collapse 窗口冲刷          | 秒~分钟    | 不需要                               |
| 投递重试退避               | 秒~小时    | 需要（消息撤回了就别重试了）         |
| snooze（2 小时后再提醒我） | 小时       | 需要                                 |
| 升级阶梯下一跳             | 分钟       | **必须能**（确认了要取消后续所有跳） |
| 摘要（每天本地 9 点）      | 天，周期性 | 需要                                 |
| 过期清理、计数器对账       | 周期性     | 不需要                               |

**一张到期任务表全部覆盖。**

### 3.2 为什么不用 APScheduler / cron

| 方案                               | 问题                                                                                                                                                   |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **APScheduler（内存 jobstore）**   | 调度状态在进程内存 → 多实例重复执行，重启丢任务                                                                                                        |
| **APScheduler（数据库 jobstore）** | 状态已经在数据库了，那就是我下面这张表，只是多一层抽象。而且它的 job 是"要执行的函数 + 参数"，表达不了"这个公告改期了"——要先 remove 再 add，不是幂等的 |
| **系统 cron**                      | 只能表达周期，表达不了"明天 9 点这一次"；且要单独的进程和部署                                                                                          |
| **到期任务表**                     | 全部能表达，可查询、可取消、可改期、可审计、重启不丢                                                                                                   |

APScheduler 唯一的优势是"少写 100 行代码"。但那 100 行换来的是**能用 SQL 回答"明天有哪些公告要发"**——这是运营会问的问题。

### 3.3 表设计

```sql
CREATE TABLE sys_msg_task (
    task_id     bigint       NOT NULL AUTO_INCREMENT,
    tenant_id   varchar(20)  NOT NULL,
    kind        varchar(40)  NOT NULL,   -- publish|flush_collapse|retry_delivery|snooze|escalate|digest_scan|reconcile
    payload     json         NOT NULL,
    -- 毫秒精度。重试退避在秒级以下会有多个任务，秒精度会让排序不稳定
    fire_at     datetime(3)  NOT NULL,
    state       varchar(20)  NOT NULL DEFAULT 'pending',  -- pending|running|done|failed|cancelled
    attempts    int          NOT NULL DEFAULT 0,
    max_attempts int         NOT NULL DEFAULT 5,
    -- 实例 id。卡死回收要用，排查"这个任务卡在哪台机器"也要用
    locked_by   varchar(64),
    locked_at   datetime(3),
    last_error  text,
    -- ★ 幂等键：同一个业务动作不许排出两个任务
    dedupe_key  varchar(200),
    create_time datetime(3)  NOT NULL,
    PRIMARY KEY (task_id),
    UNIQUE KEY uk_msg_task_dedupe (dedupe_key),
    KEY idx_msg_task_due (state, fire_at)
) COMMENT '通知到期任务';
```

### 3.4 `dedupe_key` 是这张表的核心（容易被忽略）

它让"改期"变成一条幂等的 UPSERT，而不是"先删再加"：

```sql
-- 定时公告改期。不管之前排过没排过，结果都是「有且仅有一个待发任务，时间是新的」
INSERT INTO sys_msg_task (tenant_id, kind, payload, fire_at, dedupe_key, create_time)
VALUES (:tenant, 'publish', :payload, :fireAt, CONCAT('publish:notice:', :noticeId), now(3))
ON DUPLICATE KEY UPDATE
    fire_at = VALUES(fire_at),
    payload = VALUES(payload),
    state   = 'pending',
    attempts = 0;
```

没有 `dedupe_key` 的话，管理员改了 3 次发布时间就会排出 3 个任务，公告发 3 次。**这是定时发布最经典的 bug**，而且只在"改期"这个不常测的路径上出现。

取消同样简单：

```sql
UPDATE sys_msg_task SET state='cancelled'
 WHERE dedupe_key = CONCAT('publish:notice:', :noticeId) AND state = 'pending';
```

`kind` 不进 `dedupe_key` 的规则：`dedupe_key` 表达的是**业务动作的身份**，`publish:notice:42` 就够了。不需要 `publish:notice:42:publish`。

### 3.5 扫描协程

和 §2.4 的 `OutboxPump` 同一个形状，同一个 lifespan，只是领取语句不同：

```python
class TaskScheduler:
    """到期任务的扫描与执行。

    每个实例都跑，靠 SKIP LOCKED 分工，不选主。
    """

    async def _consume(self) -> None:
        while True:
            due = await self._claim_due(limit=100)
            if due:
                # 同一批任务并发跑。单个失败不影响其他，各自记 last_error
                await asyncio.gather(*(self._run(t) for t in due), return_exceptions=True)
                continue
            await asyncio.sleep(self._poll_interval)   # 1 秒
```

领取：

```sql
SELECT task_id, kind, payload FROM sys_msg_task
 WHERE state = 'pending' AND fire_at <= now(3)
 ORDER BY fire_at LIMIT 100
 FOR UPDATE SKIP LOCKED;
```

`idx_msg_task_due (state, fire_at)` 这个索引顺序不能反：`state` 在前把 `done`/`cancelled` 挡在扫描范围外（那些会占绝大多数行），`fire_at` 在后做范围扫。反过来会扫到所有历史任务。

### 3.6 一秒轮询够不够

够，而且**别追求更准**：

| 场景          | 1 秒延迟可接受吗     |
| ------------- | -------------------- |
| 定时公告      | ✅ 差 1 秒无人在意   |
| collapse 冲刷 | ✅ 窗口本身是 5 分钟 |
| 重试退避      | ✅ 退避本身是秒级起  |
| 升级阶梯      | ✅ 阶梯间隔是分钟级  |
| 摘要          | ✅ 天级              |

轮询的实际成本：一条走索引的 `SELECT ... LIMIT 100`，空扫时几乎零开销。真嫌它吵可以做**自适应间隔**——查一下"下一个任务什么时候到期"，没有近期任务就睡久一点：

```sql
SELECT MIN(fire_at) FROM sys_msg_task WHERE state = 'pending';
-- 下一个任务在 2 小时后 → 睡 60 秒（不睡 2 小时，因为期间可能插入新任务）
```

但这是优化，L1 不必做。

### 3.7 定时发布的原子性（这个容易漏）

到点了要做的事是"扇出给 N 个人"，可能耗时几十秒。**中间进程挂了怎么办？**

三层保护：

1. **任务标 `running` + `locked_at`**，别的实例不会重复领
2. **扇出本身可续跑**：`sys_msg.fanout_cursor` 记到哪个 user_id 了，重跑从那里接着来
3. **超时回收**：`locked_at < now(3) - INTERVAL 5 MINUTE AND state='running'` → 重置 `pending`

重跑安全的根据是扇出幂等（`PRIMARY KEY (user_id, msg_id)` + MySQL 的 `ON DUPLICATE KEY UPDATE msg_id = msg_id` 空操作）。

> **MySQL 用 `ON DUPLICATE KEY UPDATE` 而不是 `INSERT IGNORE`**：后者会连带吞掉字段截断、类型错误这类真问题。空操作 `SET msg_id = msg_id` 只针对主键冲突。

### 3.8 周期任务（摘要、对账、清理）

周期任务用"**自我重排**"，不用 cron 语法：

```python
async def run_reconcile(payload: dict) -> None:
    await reconcile_unread_counts()
    # 执行完立刻排下一次。任务链不会断，也不需要另一套 cron 配置
    await enqueue_task(
        kind="reconcile",
        fire_at=now() + timedelta(hours=1),
        dedupe_key="reconcile:unread",     # ← 保证链上永远只有一个
    )
```

`dedupe_key` 在这里防的是**任务链分叉**：如果某次执行重跑了，`ON DUPLICATE KEY UPDATE` 会让它仍然只有一个后继，而不是变成两条链越跑越多。

**启动兜底**：lifespan 里检查关键周期任务是否存在，缺了就补排一个。否则某次数据库清理把任务删了，这条链就永久停了，且没有任何报错。

### 3.9 摘要的时区（不要给每个用户排任务）

需求是"每天用户本地时间 9 点发摘要"。

**错的做法**：给每个用户排一个任务。10 万用户 = 10 万行任务，每天重排。

**对的做法**：每小时排一个**扫描任务**，处理"当前 UTC 时刻恰好是本地 9 点"的那批时区：

```python
async def run_digest_scan(payload: dict) -> None:
    """每小时一次，找出此刻当地时间正好是 9 点的时区，给那些时区的用户发摘要。"""
    hour_utc = now_utc().hour
    # 全球时区里，此刻本地时间为 9 点的那些（含半小时偏移的，如 Asia/Kolkata）
    target_zones = zones_where_local_hour_is(9, at_utc_hour=hour_utc)
    for zone in target_zones:
        await dispatch_digests(timezone=zone)
    await enqueue_task(kind="digest_scan", fire_at=next_hour(), dedupe_key="digest:scan")
```

24 次扫描覆盖全球，而不是 10 万个任务。半小时偏移的时区（印度 +5:30、尼泊尔 +5:45）需要按半小时扫，那就是 48 次——仍然是常数。

### 3.10 一句话回答

> **一张 `sys_msg_task` 到期任务表 + 一个扫描协程**，1 秒轮询。定时公告、collapse 冲刷、重试退避、snooze、升级阶梯、摘要、周期对账全部用它。
>
> 三个关键设计：**`dedupe_key` 让改期/取消幂等**（不做这个，管理员改 3 次发布时间就发 3 次公告）；**`SKIP LOCKED` 让多实例天然分工**（不需要选主）；**周期任务自我重排 + 启动兜底**（不需要另一套 cron 配置）。

---

## 4. 落到代码上：需要新增什么

全部在现有结构里，不新增基础设施目录：

```
app/infra/                          ← 不动
  realtime/                         ✅ 已完备，通知模块直接调 send_to_users
  redis/                            ✅ 已有 counter / ratelimit / keyspec，限流直接用
  mail/  sms/                       ✅ 已有，作为投递渠道的适配器

app/core/
  taskqueue/                        ← 新增，与 core/operlog 同级同形
    types.py         Task / TaskKind 协议
    scheduler.py     TaskScheduler（扫描协程，抄 OperLogRecorder 的形状）
    pump.py          OutboxPump（发件箱消费协程）
    registry.py      kind → handler 的注册表

app/modules/notification/           ← 新增业务模块
  models.py          event / msg / inbox / cursor / task / delivery 的 ORM
  sequence.py        ★ seq 分配，全系统唯一允许写 cursor.next_seq 的地方
  ingest.py          事件摄入（幂等）+ 写 outbox
  fanout.py          扇出（幂等、可续跑）
  inbox.py           读侧：list / sync / counts / read / dismiss
  rules.py           事件 → 消息的规则表
  audience.py        受众解析器（复用 sys_dept.ancestors）
  signal.py          调 infra.realtime.send_to_users 推 {seq}
  tasks.py           注册各 kind 的 handler
  api/               路由

app/main.py                         ← 改：lifespan 里起停两个协程
```

`main.py` 的改动就两行，和现有的 `set_recorder` / `close_recorder` 完全对称：

```python
    set_recorder(OperLogRecorder(DbSink(get_session_factory())))
    await start_realtime(redis)
    await start_task_runners(get_session_factory(), redis)   # ← 新增
    try:
        yield
    finally:
        await stop_task_runners()                            # ← 新增（排在最前，先排空）
        await close_recorder()
        await close_realtime()
        await close_redis_client()
        await close_engine()
```

`stop_task_runners` 排在最前面的理由和 `close_recorder` 一样：它要用数据库和 Redis，得在它们关掉之前排空。

---

## 5. MySQL 带来的写法差异（汇总）

`platform.md` 和 `backend.md` 的 DDL 是按 Postgres 写的。MySQL 下的对应写法：

| 用途              | Postgres                                     | MySQL                                                                                                                                                                  |
| ----------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **分配 seq**      | `UPDATE ... RETURNING next_seq - 1`          | `UPDATE cursor SET next_seq = LAST_INSERT_ID(next_seq + 1) WHERE user_id=?;` 然后 `SELECT LAST_INSERT_ID();` ★                                                         |
| **批量分配 seq**  | `WITH ordered AS (...) UPDATE ... RETURNING` | 同事务内两条：`UPDATE ... WHERE user_id IN (...)` 然后 `SELECT user_id, next_seq-1 FROM cursor WHERE user_id IN (...)`。UPDATE 已持锁，SELECT 读到的就是本事务分配的值 |
| **幂等插入**      | `ON CONFLICT DO NOTHING`                     | `ON DUPLICATE KEY UPDATE msg_id = msg_id`（**不用 `INSERT IGNORE`**，它会吞掉真错误）                                                                                  |
| **抢占领取**      | `FOR UPDATE SKIP LOCKED`                     | 同（8.0+）；5.7 退化为乐观 UPDATE 查 affected_rows                                                                                                                     |
| **数组参数**      | `= ANY($1::bigint[])`                        | `IN (...)` 展开占位符，注意长度上限，分批                                                                                                                              |
| **JSON**          | `jsonb`                                      | `json`（MySQL 8 有函数索引可补）                                                                                                                                       |
| **毫秒时间**      | `timestamptz`                                | `datetime(3)`，且**统一存 UTC**（MySQL 的 `datetime` 不带时区）                                                                                                        |
| **advisory lock** | `pg_advisory_xact_lock`                      | `SELECT ... FOR UPDATE` 锁一行租户配置行                                                                                                                               |

★ `LAST_INSERT_ID(expr)` 这个用法值得单独说：它把 expr 写进会话级的 last_insert_id 并返回 expr，所以一条 UPDATE 就完成"自增并记住新值"，再用 `SELECT LAST_INSERT_ID()` 读回来。**这个读是会话级的，不受其他连接影响**，所以不需要 `FOR UPDATE` 再查一次。行锁仍然持有到提交，§ `platform.md` §13.2 的正确性论证完全不变。

**关键：MySQL 的行锁语义和 Postgres 一致**——`UPDATE` 取的行级排他锁持有到事务结束。所以 seq 那套"取号序 = 提交序 = 可见序"的论证在 MySQL 上照样成立。这是好消息，因为那是全套设计里唯一不能妥协的地方。

---

## 6. Python 生态盘点：别人一般用什么

写这一节是因为"表 + 协程"听起来像在造轮子。要说清楚它不是。

### 6.1 先分清两种"定时"，它们根本不是一回事

|                   | A. 周期任务（cron）    | B. 一次性延迟任务（delayed / one-shot）              |
| ----------------- | ---------------------- | ---------------------------------------------------- |
| 例子              | 每小时对账、每天清理   | 明天 9 点发这条公告、30 秒后重试、5 分钟没确认就升级 |
| 数量              | 固定几个，部署时就知道 | **无上界**，数据驱动                                 |
| 来源              | 配置                   | 业务写入                                             |
| 要不要能取消/改期 | 不要                   | **必须要**                                           |
| 谁定义            | 工程                   | 用户/运营                                            |

**Python 生态里绝大多数工具做好了 A，做不好 B。** 而通知平台的定时发布、重试、snooze、升级阶梯全部是 B。这是选型的分水岭。

### 6.2 生态盘点

| 工具              | 模型                           | asyncio                           | A（cron）            | B（延迟/可取消）                               | 存储                                 |
| ----------------- | ------------------------------ | --------------------------------- | -------------------- | ---------------------------------------------- | ------------------------------------ |
| **Celery**        | 老牌全能                       | ✗ 同步 worker，async 支持一直别扭 | ✅ `celery beat`     | ⚠️ `eta`/`countdown` 有坑，见 §6.3             | Redis/RabbitMQ                       |
| **RQ**            | 极简                           | ✗ fork-per-job                    | 插件 `rq-scheduler`  | ⚠️ 同上                                        | Redis                                |
| **Dramatiq**      | Celery 平替，更干净            | ✗ 同步优先                        | 插件 `periodiq`      | ⚠️                                             | Redis/RabbitMQ                       |
| **arq**           | asyncio 原生，极简             | ✅                                | ✅ 内置 `cron()`     | ✅ `_defer_until` + `_job_id` 唯一 + `abort()` | Redis                                |
| **taskiq**        | asyncio 原生，FastAPI 风格 DI  | ✅                                | ✅ `TaskiqScheduler` | ✅                                             | 可插拔                               |
| **SAQ**           | asyncio 原生，比 arq 快，带 UI | ✅                                | ✅                   | ✅                                             | Redis / Postgres                     |
| **procrastinate** | **Postgres 原生**，事务性入队  | ✅                                | ✅                   | ✅                                             | **仅 Postgres** ← 本项目 MySQL，出局 |
| **Huey**          | 轻量                           | 部分                              | ✅                   | ✅                                             | Redis/SQLite                         |
| **APScheduler**   | **纯调度器，不是队列**         | ✅ v3 有 `AsyncIOScheduler`       | ✅ 强项              | ⚠️ 见 §6.4                                     | 可插拔 jobstore                      |
| **Temporal**      | 持久化工作流引擎               | ✅                                | ✅                   | ✅                                             | 自带 server + DB                     |
| **K8s CronJob**   | 外部触发                       | —                                 | ✅                   | ✗                                              | —                                    |

### 6.3 `eta` / `countdown` 是个陷阱（Celery 系通病）

直觉写法：

```python
publish_notice.apply_async(args=[notice_id], eta=datetime(2026, 8, 9, 9, 0))
```

Celery 官方文档自己不建议长 ETA，原因：

1. 消息**立刻投递给某个 worker**，然后在 worker 内存里等到 eta。等一天就占一天
2. 有 prefetch 的话它**占着一个 worker 槽位**
3. worker 重启 → 取决于 ack 设置，要么重投要么丢
4. Redis broker 的 `visibility_timeout` 到了会被重投给另一个 worker → **重复执行**
5. **最致命：拿不到它、取消不了、改不了期。** 运营改了发布时间，你没有任何句柄去撤销那条已经在 broker 里的消息

第 5 条直接杀死定时公告场景。而这恰好是 `dedupe_key` 那张表解决得最漂亮的地方（§3.4）。

### 6.4 APScheduler 的多实例问题

- **v3 + 内存 jobstore**：状态在进程里 → 多实例各跑一份，**重复执行**；重启丢任务
- **v3 + SQLAlchemy jobstore**：状态进库了，但 v3 **没有实例间协调机制**，多个 scheduler 会同时抢同一个 job。社区通用做法是自己加分布式锁——那你已经在写协调逻辑了
- **v4**：重新设计过，scheduler 之间通过 data store 协调，多实例是正确的。但它长期处于预发布状态，上生产要自己评估

**而且即使 v4 可用，它仍然是"调度器"不是"队列"**：它的 job 是"函数 + 参数"，表达不了"这个公告的发布时间改成明天了"——只能 `remove_job` 再 `add_job`，不是原子的、不是幂等的。

### 6.5 决定性的论证：事务性发件箱不是可选项

这是我推荐表方案的**真正原因**，不是"不想引新组件"。

想做的事是：

```
业务事务：改公告状态为 scheduled  +  排一个「到点发布」的任务
                        ↑ 这两件事必须原子
```

如果任务在 **Redis**（arq / taskiq / Celery / SAQ 全都是），你就有两个存储，无法原子：

```
情况一：MySQL 提交成功 → Redis 入队失败      → 公告永远不会发（静默）
情况二：Redis 入队成功 → MySQL 回滚          → 发一条不存在的公告
```

这就是我在 `platform.md` 列的不变式 **I2**。唯一的解法是**事务性发件箱**：任务先落 MySQL（和业务同事务），再由一个 relay 搬到 Redis 队列。

**所以结论是：无论选哪个队列库，那张表都躲不掉。** 而一旦有了表，队列库只帮你省掉"worker 循环"那一段——大约 80 行。

这就是为什么 `procrastinate`（Postgres 原生、任务就在库里、入队即事务）在概念上是最对的答案。可惜它只支持 Postgres。

> 附带一提，这不是 Python 圈子的怪癖。Rails 新默认的 `solid_queue`、`GoodJob` 都是数据库支撑的，理由完全一样。"队列必须在 Redis" 是十年前的默认假设，现在不是了。

### 6.6 所以：如果你想用库，选什么

| 场景                                                 | 选择                                                                                   |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **本项目（MySQL + 全 async + 已有 Redis + 无队列）** | **表 + 协程**（§2）。发件箱躲不掉，而表有了之后队列库只省 80 行                        |
| 如果数据库是 Postgres                                | **procrastinate**。入队即事务，这个问题从根上没有了                                    |
| 如果一定要个库、且接受发件箱 + relay 两段            | **taskiq**（FastAPI 风格 DI，最贴合）或 **arq**（最简单，`_job_id` 天然是 dedupe_key） |
| 如果有复杂长流程（多步、补偿、人工介入）             | **Temporal**。但那是给"审批流"级别的东西用的，通知平台不需要                           |
| 纯周期任务、不想写任何调度代码                       | **K8s CronJob 打内部接口**。土但极其可靠，且和应用解耦                                 |

### 6.7 两个立刻能用的具体技巧

**技巧一：用 SQLAlchemy 的 `after_commit` 事件唤醒消费协程**

这是"提交后异步执行"最干净的写法——不需要业务代码记得调 `notify()`：

```python
from sqlalchemy import event
from sqlalchemy.orm import Session

@event.listens_for(Session, "after_commit")
def _wake_outbox_pump(session: Session) -> None:
    """事务真的提交之后才唤醒，天然满足不变式 I2。

    在同步上下文里执行，所以 notify() 必须同步且绝不阻塞（put_nowait + suppress
    QueueFull）。信号丢了也没关系——轮询兜底，真相在表里。

    标记位由写 outbox 的仓储方法设置：session.info["outbox_dirty"] = True。
    不无条件唤醒是因为绝大多数事务和通知无关。
    """
    if session.info.pop("outbox_dirty", False):
        get_outbox_pump().notify()
```

对比 FastAPI 的 `BackgroundTasks`：它在响应发出后执行，**但和事务提交没有关系，也不持久化**——进程挂了就没了。只适合真正无所谓丢的事（比如打点），不能用来发通知。

**技巧二：`SET NX EX` 当分布式 cron，两行搞定周期任务**

如果暂时不想做 `sys_msg_task` 那套，周期任务可以先这样跑，多实例安全：

```python
async def run_hourly(redis: PrefixedRedis, name: str, fn) -> None:
    """按小时分桶抢锁。所有实例每分钟都试，每个桶只有一个能抢到。

    不需要选主、不需要调度库。锁的 TTL 给 2 小时（大于桶宽），
    这样即使执行中崩了也不会在同一小时内被重跑。
    """
    bucket = datetime.now(UTC).strftime("%Y%m%d%H")
    if await redis.set(f"cron:{name}:{bucket}", "1", nx=True, ex=7200):
        await fn()
```

项目里 `app/infra/redis/counter.py` 已经有 Lua + TTL 的成熟写法，加这个是顺手的事。

**这个技巧的边界**：它只解决 A（周期），完全不解决 B（一次性延迟、可取消）。定时公告还是得靠 `sys_msg_task`。但如果第一版想先把对账、清理这些跑起来，它足够了。

---

## 7. 待确认

| #      | 问题                                         | 为什么要确认                                                                                                                                                                                  |
| ------ | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **R1** | 部署是单实例还是多实例？                     | 单实例可以省掉 `locked_by` / `SKIP LOCKED`（但**表字段别省**，加字段比改并发模型容易）。也决定 §2.7 的 L2 要不要现在做                                                                        |
| ~~R2~~ | ~~MySQL 版本？8.0+ 吗？~~                    | **已确认 8.0+**。`SKIP LOCKED` 可用，§2.5 走主方案，不需要乐观抢占的退化写法                                                                                                                  |
| **R3** | 有没有独立部署 worker 的可能？               | 如果运维接受多一个部署单元，L3 可以直接做独立 worker 进程，省掉"消费协程和 API 抢 CPU"的顾虑                                                                                                  |
| **R4** | `sys_notice` 现有的 5 个接口要不要保持兼容？ | 决定 `backend.md` §2 的方案 C 是否成立。看代码是 `TenantBase` + 自增 `notice_id`，扩展表方案可行                                                                                              |
| **R5** | 主键统一自增还是引入雪花？                   | `sys_notice` 现在是自增。`sys_msg_inbox` 用 `(user_id, msg_id)` 复合主键不需要自增；但 `sys_msg` 需要 id，跟现有约定用自增即可（**注意：自增 id 不能当 seq 用**，原因见 `platform.md` §13.2） |

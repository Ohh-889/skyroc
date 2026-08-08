# 通知模块最终建表方案（可直接实施）

> **本文是 DDL 与关键 SQL 的唯一来源。** 与 `platform.md` / `implementation.md` / `backend.md` 的 DDL 冲突时以本文为准——那几份是设计说明，语法是 Postgres 的，且早于 `review.md` §H 的修正。
>
> 目标库：MySQL 8.0+ · 主键雪花 · 全 async SQLAlchemy 2.x · taskiq 执行层
>
> P0 渠道：**站内 + 实时信号 + 邮件**。短信只留适配器接口不实现（§9.3）。

---

## 0. 命名与基类决定

### 0.1 表前缀用 `sys_notify_`，不用 `sys_msg_`

`app/modules/message/` 已经存在（realtime 的上行消息 handler 注册）。`sys_msg_*` 和它不是一回事但名字太近，会让人一直问"这两个什么关系"。模块名 `notification`，表前缀 `sys_notify_`。

### 0.2 ★ 守门测试查的是"所有带 tenant_id 列的表"，不是 `TenantScoped` 子类

`tests/infra/db/test_tenant.py`：

```python
def _tenant_scoped_tables() -> list[Table]:
    return [table for table in Base.metadata.tables.values() if "tenant_id" in table.columns]
```

```python
assert "tenant_id" in _leading_columns(table)   # 必须是某个索引/约束的最左列
```

所以**自己声明 `tenant_id` 列同样躲不过**。要么这张表有一个 `(tenant_id, ...)` 打头的、真正会被用到的索引，要么它干脆不要这一列。

### 0.3 基类选择：只有两张表带租户列

| 表 | 基类 | `tenant_id` | 理由 |
| --- | --- | --- | --- |
| `sys_notify_event` | `TenantBase` | ✅ 自动 | 查询是 `(tenant_id, dedupe_key)` 和 `(tenant_id, event_type, ...)`，租户天然最左 |
| `sys_notify_msg` | `TenantBase` | ✅ 自动 | 查询是"本租户的公告列表 / 全员公告 feed"，租户天然最左 |
| `sys_notify_msg_revision` | `AuditedBase` | ❌ | 访问路径必然是"先取 msg（已过租户过滤），再取它的修订"，按 `(msg_id, revision)` |
| `sys_notify_task` | `Base` | ❌ | **租户是消息的属性，不是任务的属性。** relay 跨租户领取，查询是 `(state, fire_at)` |
| `sys_notify_delivery` | `Base` | ❌ | 同上，claim 是 `(state, next_retry_at)`，统计是 `(msg_id)` |
| `sys_notify_inbox` | `Base` | ❌ | 量最大，每次访问必带 `user_id`（全局唯一） |
| `sys_notify_cursor` | `Base` | ❌ | 同上 |
| `sys_notify_bcast_state` | `Base` | ❌ | 同上 |
| `sys_notify_preference` | `Base` | ❌ | 同上 |

不带 `tenant_id` 的表全部用裸 `Base`（不带审计列——系统写入没有操作人，5 列全空是浪费：`inbox` 7300 万行 × 5 列）。

**这个选择顺带消灭了 `review.md` H1 那个坑**：Core `insert()` 不填租户、`server_default='000000'` 静默兜底——而这些表根本没有那一列，写不错。唯一带租户又要批量写的表不存在（`event`/`msg` 都是单行 ORM 写入，走 `before_flush` 自动填）。

### 0.4 后台任务必须自己进租户上下文

`task` 不带租户，执行时从 payload 指向的实体取：

```python
msg = await load_msg(session, msg_id)          # 无租户上下文 → scoping 不补条件 → 读得到
with tenant_scope(msg.tenant_id):              # app/core/tenant.py 现成的
    await fanout(session, msg)                 # 之后所有 ORM 读写都正确归属
```

**不进上下文就写 `sys_notify_msg` 的后果**：`_fill_tenant_id` 拿到 `None` 会"放行，落库时由列的 server_default 兜底"→ 写成 `'000000'`。所以凡是要写 `event`/`msg` 的任务，必须先 `tenant_scope`。

### 0.5 红线：`user_id` 永不来自客户端

不带 `tenant_id` 的四张用户表失去了自动租户过滤这道保险，换成一条纪律：

> **`inbox` / `cursor` / `bcast_state` / `preference` 相关接口的 `user_id` 永远取自 `CurrentUserDep.user_id`，任何接口签名里不许出现 `user_id` 参数。**

管理端要统计就按 `msg_id` 聚合（§1.5 的 `ix_sys_notify_inbox_msg`），不按用户查。

### 0.4 索引命名跟 `NAMING_CONVENTION`

`app/infra/db/base.py` 定了 `uq_%(table_name)s_%(column_0_name)s` / `ix_%(column_0_label)s` / `pk_%(table_name)s`。

多列唯一约束**显式命名**（约定只取 `column_0_name`，多列会撞名）。`Index` 照 `sys_notice` 的样子显式命名。

---

## 1. DDL

### 1.1 `sys_notify_event` 事件（幂等边界）

```sql
CREATE TABLE sys_notify_event (
    event_id    bigint       NOT NULL COMMENT '事件ID（雪花）',
    tenant_id   varchar(20)  NOT NULL DEFAULT '000000' COMMENT '租户编号',
    dedupe_key  varchar(200) NOT NULL COMMENT '幂等键，业务方构造，如 flow.approved:1938',
    event_type  varchar(100) NOT NULL COMMENT '事件类型，对应 rules.py 的规则键',
    payload     json         NOT NULL COMMENT '事件载荷，只放引用和摘要，不放 PII 全文',
    occurred_at datetime(3)  NOT NULL COMMENT '业务事实发生时间（UTC）',
    produced_by varchar(100) NOT NULL COMMENT '来源模块，排查用',
    create_dept bigint       NULL,
    create_by   bigint       NULL,
    update_by   bigint       NULL,
    created_at  datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (event_id),
    -- ★ 全系统唯一的幂等保证。应用层不许再做「先查有没有」
    UNIQUE KEY uq_sys_notify_event_dedupe (tenant_id, dedupe_key),
    KEY ix_sys_notify_event_tenant_type (tenant_id, event_type, event_id)
) COMMENT='通知事件';
```

摄入只有一条语句：`INSERT ... ON DUPLICATE KEY UPDATE event_id = event_id`（空操作），然后按 `affected_rows` 判断是不是新事件——**不查询、不判断**。

### 1.2 `sys_notify_task` 到期任务（合并了 outbox，`review.md` H8）

```sql
CREATE TABLE sys_notify_task (
    task_id      bigint       NOT NULL COMMENT '任务ID（雪花）',
    tenant_id    varchar(20)  NOT NULL DEFAULT '000000',
    kind         varchar(40)  NOT NULL COMMENT 'ingest_event|fanout|deliver|publish|flush_collapse|propagate_revision|reconcile|sweep',
    payload      json         NOT NULL COMMENT '只放引用（msg_id/delivery_id），不放渲染内容和收件人列表',
    fire_at      datetime(3)  NOT NULL COMMENT '到期时间。毫秒精度：秒精度会让退避任务排序不稳定',
    state        varchar(20)  NOT NULL DEFAULT 'pending' COMMENT 'pending|sent|done|cancelled|dead',
    attempts     int          NOT NULL DEFAULT 0,
    max_attempts int          NOT NULL DEFAULT 8,
    -- 滑动窗口要用：LEAST(now+window, open_time+max_window)。固定窗口不读它
    open_time    datetime(3)  NULL COMMENT '窗口开启时刻，仅滑动折叠窗口使用',
    locked_by    varchar(64)  NULL COMMENT '领取者实例ID，卡死回收和排查用',
    locked_at    datetime(3)  NULL,
    last_error   text         NULL,
    -- ★ 幂等键。改期/重排是一条 UPSERT；不做这个，管理员改 3 次时间就发 3 次公告
    dedupe_key   varchar(200) NOT NULL,
    created_at   datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (task_id),
    UNIQUE KEY uq_sys_notify_task_dedupe (dedupe_key),
    -- state 在最左：把 done/cancelled 挡在扫描范围外（它们占绝大多数行）
    KEY ix_sys_notify_task_due (state, fire_at),
    -- 卡死回收扫描
    KEY ix_sys_notify_task_locked (state, locked_at)
) COMMENT='通知到期任务';
```

`state='sent'` 是 taskiq 特有的一档：已 `kiq` 出去但还没执行完。区分 `sent` 和 `done` 让"卡在队列里"和"执行中崩了"能分开排查（`review.md` A3）。

### 1.3 `sys_notify_msg` 消息

```sql
CREATE TABLE sys_notify_msg (
    msg_id        bigint       NOT NULL COMMENT '消息ID（雪花）',
    tenant_id     varchar(20)  NOT NULL DEFAULT '000000',
    event_id      bigint       NULL COMMENT 'NULL 表示人工发布的公告',

    -- 三条正交轴（platform.md §3）
    category      varchar(20)  NOT NULL COMMENT 'task|announcement|message|event|alert|security',
    intent        varchar(20)  NOT NULL COMMENT 'transactional|actionable|informational|alerting',
    priority      varchar(20)  NOT NULL DEFAULT 'normal' COMMENT 'low|normal|high|urgent',

    title         varchar(255) NOT NULL,
    summary       varchar(500) NOT NULL,
    body          longtext     NULL COMMENT '详情。列表接口不查这列。写入时已净化（H11）',
    ref_type      varchar(50)  NULL COMMENT '关联业务类型',
    ref_id        varchar(64)  NULL COMMENT '关联业务ID',
    action        json         NULL COMMENT '{kind,label,target} 或 NULL',
    collapse_key  varchar(200) NULL COMMENT '客户端分组键，冗余到 inbox 行',

    audience      json         NOT NULL COMMENT '{kind:users|roles|depts|all, ...}',
    audience_size int          NULL COMMENT '发布前预览写入',

    status        varchar(20)  NOT NULL DEFAULT 'draft' COMMENT 'draft|scheduled|published|revoked',
    revision      int          NOT NULL DEFAULT 1 COMMENT '乐观锁 + 投递幂等键的一部分',
    publish_time  datetime(3)  NULL,
    expire_time   datetime(3)  NULL,
    revoke_time   datetime(3)  NULL,
    revoke_reason varchar(500) NULL,

    -- 仅 audience.kind='all' 的读扩散消息有值
    bcast_seq     bigint       NULL COMMENT '全员公告的租户内单调序号',

    fanout_state  varchar(20)  NOT NULL DEFAULT 'pending' COMMENT 'pending|running|done',
    fanout_cursor bigint       NULL COMMENT '扇出续跑游标，记到哪个 user_id',

    create_dept   bigint       NULL,
    create_by     bigint       NULL,
    update_by     bigint       NULL,
    created_at    datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (msg_id),
    UNIQUE KEY uq_sys_notify_msg_bcast (tenant_id, bcast_seq),
    -- 全员公告 feed（读扩散）
    KEY ix_sys_notify_msg_bcast_feed (tenant_id, status, bcast_seq),
    -- 管理端列表
    KEY ix_sys_notify_msg_admin (tenant_id, status, msg_id),
    -- 扇出待办扫描
    KEY ix_sys_notify_msg_fanout (fanout_state, msg_id),
    -- 一个事件产生的消息（trace 用）
    KEY ix_sys_notify_msg_event (event_id)
) COMMENT='通知消息';
```

### 1.4 `sys_notify_msg_revision` 修订历史

```sql
CREATE TABLE sys_notify_msg_revision (
    revision_id    bigint       NOT NULL COMMENT '雪花',
    tenant_id      varchar(20)  NOT NULL DEFAULT '000000',
    msg_id         bigint       NOT NULL,
    revision       int          NOT NULL COMMENT '这条记录保存的是第几版的「前值」',
    -- 存前值：当前值在 sys_notify_msg 上，历史链只需要每次的前值
    title_before   varchar(255) NOT NULL,
    summary_before varchar(500) NOT NULL,
    body_before    longtext     NULL,
    change_note    varchar(500) NULL COMMENT '修改说明，重新提醒时展示给收件人',
    renotified     tinyint(1)   NOT NULL DEFAULT 0,
    create_dept    bigint       NULL,
    create_by      bigint       NULL,
    update_by      bigint       NULL,
    created_at     datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (revision_id),
    UNIQUE KEY uq_sys_notify_msg_revision_msg (msg_id, revision)
) COMMENT='通知消息修订历史';
```

### 1.5 ★ `sys_notify_inbox` 收件箱（核心表）

```sql
CREATE TABLE sys_notify_inbox (
    user_id      bigint       NOT NULL,
    msg_id       bigint       NOT NULL,

    -- ★ 两个序号，共用 sys_notify_cursor.next_seq 一个计数器（review.md B1）
    -- 插入序，永不变。列表排序 + 分页 tiebreak
    entry_seq    bigint       NOT NULL,
    -- 变更序，任何变更都推进。增量同步游标
    change_seq   bigint       NOT NULL,

    read_time    datetime(3)  NULL,
    action_state varchar(20)  NOT NULL DEFAULT 'none' COMMENT 'none|pending|done|cancelled',
    action_time  datetime(3)  NULL,
    dismiss_time datetime(3)  NULL COMMENT '用户视图移除，不删数据',
    retracted    tinyint(1)   NOT NULL DEFAULT 0 COMMENT '消息被撤回，展示占位而非凭空消失',

    -- ↓ 从 sys_notify_msg 冗余的不可变字段，让列表查询不 join
    category     varchar(20)  NOT NULL,
    intent       varchar(20)  NOT NULL,
    priority     varchar(20)  NOT NULL,
    publish_time datetime(3)  NOT NULL,
    expire_time  datetime(3)  NULL,
    collapse_key varchar(200) NULL COMMENT '客户端分组键；NULL 表示不分组',

    -- ★ 复合主键就是扇出幂等保证：ON DUPLICATE KEY UPDATE 一行代码解决重复
    PRIMARY KEY (user_id, msg_id),
    -- 增量同步（唯一性同时防止同一用户拿到重复 change_seq）
    UNIQUE KEY uq_sys_notify_inbox_change (user_id, change_seq),
    -- 列表 + 分页 tiebreak
    UNIQUE KEY uq_sys_notify_inbox_entry (user_id, entry_seq),
    -- Tab 筛选
    KEY ix_sys_notify_inbox_feed (user_id, category, entry_seq),
    -- 客户端分组 + 会话未读数判断（review.md B3）
    KEY ix_sys_notify_inbox_collapse (user_id, collapse_key, read_time),
    -- ★ 按 msg_id 找收件人：修订传播、撤回传播、送达统计（review.md H3）
    -- 带 user_id 是为了传播时能按序加锁（死锁对策）
    KEY ix_sys_notify_inbox_msg (msg_id, user_id)
) COMMENT='通知收件箱';
```

**没有 `tenant_id`**（§0.3）、**没有 `del_flag`**（有 `dismiss_time`，语义更准且带时间戳）、**没有审计列**（系统写入，5 列全空是浪费）。

### 1.6 ★ `sys_notify_cursor` seq 分配器 + 计数器

```sql
CREATE TABLE sys_notify_cursor (
    user_id             bigint      NOT NULL,
    -- ★ 下一个待分配的序号。全系统唯一的写入点是 sequence.py
    next_seq            bigint      NOT NULL DEFAULT 1,
    -- 未读行数，O(1) 维护
    unread_count        int         NOT NULL DEFAULT 0,
    -- 未读会话数，徽标用。collapse_key 非空时才需要额外判断（review.md B3）
    unread_thread_count int         NOT NULL DEFAULT 0,
    pending_count       int         NOT NULL DEFAULT 0,
    -- 全员公告已读水位
    bcast_read_seq      bigint      NOT NULL DEFAULT 0,
    -- 摘要水位（P1 用，先建列免得再迁移）
    last_digest_seq     bigint      NOT NULL DEFAULT 0,
    updated_at          datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (user_id)
) COMMENT='通知收件箱游标与计数器';
```

### 1.7 `sys_notify_bcast_state` 全员公告惰性已读态

```sql
CREATE TABLE sys_notify_bcast_state (
    user_id      bigint      NOT NULL,
    msg_id       bigint      NOT NULL,
    read_time    datetime(3) NULL,
    dismiss_time datetime(3) NULL,
    PRIMARY KEY (user_id, msg_id)
) COMMENT='全员公告已读态（读扩散，惰性插入）';
```

10 万用户 + 1 条全员公告 = 0 行，直到有人操作它。

### 1.8 `sys_notify_delivery` 外部渠道投递

```sql
CREATE TABLE sys_notify_delivery (
    delivery_id   bigint       NOT NULL COMMENT '雪花',
    tenant_id     varchar(20)  NOT NULL DEFAULT '000000',
    msg_id        bigint       NOT NULL,
    user_id       bigint       NOT NULL,
    channel       varchar(20)  NOT NULL COMMENT 'email|sms|webhook（不含 inapp/realtime）',
    -- ★ revision 进唯一键：修订后「重新提醒」要能重发（review.md A1）
    revision      int          NOT NULL DEFAULT 1,
    state         varchar(20)  NOT NULL DEFAULT 'pending' COMMENT 'pending|sending|sent|failed|cancelled|dead',
    attempts      int          NOT NULL DEFAULT 0,
    max_attempts  int          NOT NULL DEFAULT 5,
    next_retry_at datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    -- 邮件是 Message-ID，短信是服务商流水号。用户报「没收到」时靠它对齐三方日志
    provider_id   varchar(128) NULL,
    last_error    text         NULL,
    created_at    datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    finish_time   datetime(3)  NULL,
    PRIMARY KEY (delivery_id),
    UNIQUE KEY uq_sys_notify_delivery_target (msg_id, user_id, channel, revision),
    KEY ix_sys_notify_delivery_claim (state, next_retry_at),
    KEY ix_sys_notify_delivery_msg (msg_id)
) COMMENT='通知外部渠道投递';
```

**站内和实时推送不进这张表。** 站内的"投递"就是 inbox 那一行；实时推送是易失提示，成功与否不影响正确性（下次 sync 就补上）。给它们建记录是纯写放大。

### 1.9 `sys_notify_preference` 用户偏好（稀疏）

```sql
CREATE TABLE sys_notify_preference (
    user_id     bigint      NOT NULL,
    -- 维度：intent × channel。reason 维度 P1 再加（platform.md §8.4）
    intent      varchar(20) NOT NULL,
    channel     varchar(20) NOT NULL,
    state       varchar(20) NOT NULL COMMENT 'on|off|digest',
    updated_at  datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (user_id, intent, channel)
) COMMENT='通知渠道偏好（只存与默认不同的项）';
```

**稀疏存储**：只有用户改过的组合才有行，没行就用系统默认矩阵（`rules.py` 里的常量）。10 万用户不会产生 10 万 × 16 行。

---

## 2. ★ `allocate_seqs` —— 正确性最关键的一段

`review.md` H2：**放弃 `LAST_INSERT_ID`**。它在 0 行更新时返回本连接上一次的值——不报错、不是 0、是别人的 seq，而且新用户的 `uq(user_id, change_seq)` 检测不出来。

```python
async def allocate_seqs(session: AsyncSession, user_ids: Sequence[int]) -> dict[int, int]:
    """给这批用户各取一个序号，返回 {user_id: seq}。

    全系统只有这个函数能写 sys_notify_cursor.next_seq。绕过它的任何 UPDATE 都会破坏
    「取号序 = 提交序 = 可见序」这条不变式，而且不会立刻出错 —— 症状是偶发丢消息。

    正确性论证（platform.md §13.2）：
      1. SELECT ... FOR UPDATE 对每行取排他锁，锁持有到事务提交
      2. 同一用户的第二个事务取号必须等第一个提交或回滚
      3. 所以对同一用户：取号序 = 提交序 = 可见序
      4. 推论：客户端看到 change_seq = N 时，所有 < N 的变更都已提交可见

    user_ids 去重后升序处理：所有加锁路径统一升序，否则大批扇出和单用户标已读
    相向而行会死锁。
    """
    ordered = sorted(set(user_ids))
    if not ordered:
        return {}

    # 1. 确保游标行存在。新用户第一次收到通知时才真的插入。
    #    ON DUPLICATE KEY 里写个空操作而不是 INSERT IGNORE：后者会连字段截断、
    #    类型错误一起吞掉。
    await session.execute(
        text(
            "INSERT INTO sys_notify_cursor (user_id, next_seq) VALUES (:uid, 1) "
            "ON DUPLICATE KEY UPDATE user_id = user_id"
        ),
        [{"uid": uid} for uid in ordered],
    )

    # 2. 加锁读当前值。这一步就是上面第 1 条论证的落点。
    rows = (
        await session.execute(
            text(
                "SELECT user_id, next_seq FROM sys_notify_cursor "
                "WHERE user_id IN :uids ORDER BY user_id FOR UPDATE"
            ).bindparams(bindparam("uids", expanding=True)),
            {"uids": ordered},
        )
    ).all()

    # 3. 断言。缺行说明第 1 步没生效，宁可炸也不能分配错的号 —— 这正是 H2 那个
    #    静默失败模式要防的。
    if len(rows) != len(ordered):
        raise SeqAllocationFailed(expected=len(ordered), actual=len(rows))

    seqs = {int(uid): int(seq) for uid, seq in rows}

    # 4. 推进。计数器的更新不在这里做 —— 调用方知道这次变更该不该加未读数。
    await session.execute(
        text(
            "UPDATE sys_notify_cursor SET next_seq = next_seq + 1 WHERE user_id IN :uids"
        ).bindparams(bindparam("uids", expanding=True)),
        {"uids": ordered},
    )
    return seqs
```

分配规则：

| 操作 | `entry_seq` | `change_seq` |
| --- | --- | --- |
| 插入 | `allocate_seqs()` | 同 `entry_seq` |
| 已读 / 取消已读 / 处理态 / 修订传播 / 撤回 | **不变** | `allocate_seqs()` |

---

## 3. ★ 批量扇出 —— H1 那个静默失败在这里

`app/infra/db/scoping.py` 明确说了 Core `insert()` **既不填租户也不拦**。而 `TenantScoped.tenant_id` 有 `server_default='000000'`，所以漏传不报错，**静默落到默认租户**，然后用户一条通知都看不到。

`sys_notify_inbox` 按 §0.3 不带 `tenant_id`，所以这张表躲过了这一枪。但 `sys_notify_delivery` 带，**批量插它时必须显式传 `tenant_id`**，取自 `msg.tenant_id` 而不是当前上下文（worker 里没有上下文）。

```python
FANOUT_CHUNK = 500

async def fanout(session: AsyncSession, msg: NotifyMsg) -> None:
    """扇出一条消息。幂等、可续跑、无死锁。"""
    async for chunk in iter_audience(session, msg, after=msg.fanout_cursor, size=FANOUT_CHUNK):
        user_ids = sorted(chunk)            # 统一升序加锁

        seqs = await allocate_seqs(session, user_ids)
        await session.execute(
            insert(NotifyInbox).on_duplicate_key_update(msg_id=NotifyInbox.msg_id),
            [
                {
                    "user_id": uid,
                    "msg_id": msg.msg_id,
                    "entry_seq": seq,
                    "change_seq": seq,
                    # 冗余的不可变字段，让列表查询不 join
                    "category": msg.category,
                    "intent": msg.intent,
                    "priority": msg.priority,
                    "publish_time": msg.publish_time,
                    "expire_time": msg.expire_time,
                    "collapse_key": msg.collapse_key,
                    "action_state": "pending" if msg.action else "none",
                }
                for uid, seq in seqs.items()
            ],
        )
        await bump_unread(session, user_ids, msg)   # 两个计数器，见 §4
        msg.fanout_cursor = user_ids[-1]
        await session.commit()                      # 每块一个事务

        # ★ 提交之后才推信号（不变式 I2）
        await signal_changed(user_ids)
```

四个性质，逐条对应：

| 性质 | 靠什么 |
| --- | --- |
| 幂等 | `PRIMARY KEY (user_id, msg_id)` + `ON DUPLICATE KEY UPDATE msg_id = msg_id` |
| 可续跑 | `fanout_cursor`，按 `user_id` 升序推进 |
| 无死锁 | 块内升序、块间独立事务 |
| 推送晚于提交 | `signal_changed` 在 `commit()` 之后 |

`ON DUPLICATE KEY` 会浪费已分配的 seq（重跑时号被消耗但没插行）。无妨——seq 只要求单调，不要求连续。

---

## 4. 两个未读计数器

`review.md` B3：徽标显示**会话数**，分组头显示**行数**。

```python
async def bump_unread(session, user_ids: list[int], msg: NotifyMsg) -> None:
    """插入后递增计数器。

    collapse_key 为空时（绝大多数通知：审批待办、导入完成、安全告警）两个数一起加，
    不需要额外查询。只有协作类通知才付「判断是不是新会话」这一次索引查询的成本。
    """
    if msg.collapse_key is None:
        await session.execute(
            text("UPDATE sys_notify_cursor "
                 "SET unread_count = unread_count + 1, unread_thread_count = unread_thread_count + 1 "
                 "WHERE user_id IN :uids").bindparams(bindparam("uids", expanding=True)),
            {"uids": user_ids},
        )
        return

    # 该 collapse_key 下已有未读行的用户，会话数不再加
    existing = set((await session.execute(
        text("SELECT DISTINCT user_id FROM sys_notify_inbox "
             "WHERE user_id IN :uids AND collapse_key = :ck "
             "  AND read_time IS NULL AND dismiss_time IS NULL AND msg_id <> :mid")
        .bindparams(bindparam("uids", expanding=True)),
        {"uids": user_ids, "ck": msg.collapse_key, "mid": msg.msg_id},
    )).scalars())

    fresh = [uid for uid in user_ids if uid not in existing]
    ...  # 行数全加，会话数只给 fresh 加
```

标记已读（一条语句，对比"for 循环里 find + save"）：

```sql
-- 1. 更新行，拿到实际影响的条数
UPDATE sys_notify_inbox SET read_time = now(3)
 WHERE user_id = :uid AND msg_id IN :mids
   AND read_time IS NULL AND dismiss_time IS NULL;

-- 2. 计数器 + 推进 change_seq（已读也是一次变更，否则别的设备不知道）
--    greatest(0, ...) 兜底：计数器一定会在某些边界漂移，漂到负数比漂到 3 更难看
UPDATE sys_notify_cursor
   SET unread_count = greatest(0, unread_count - :affected)
 WHERE user_id = :uid;
```

**对账任务**（`reconcile`）定时重算两个计数器，把差值作为 `notify_unread_drift` 指标上报。漂移不可能为零（进程被 kill、迁移脚本直接改表、代码 bug），重要的不是修好它，是**知道它在漂**——这个指标非零且稳定 = 正常，开始增长 = 刚上线的改动破坏了计数器维护。

跨租户扫描用现成口子：`stmt.execution_options(skip_tenant_filter=True)`（`review.md` H7），**不要**卸监听器。

---

## 5. sync 增量对账

```
GET /notification/sync?inbox=<change_seq>&bcast=<bcast_seq>
```

```python
async def sync(session, user_id: int, tenant_id: str, inbox: int, bcast: int) -> SyncView:
    if inbox == 0 or ...:                 # 落后太多
        return SyncView(truncated=True, ...)

    changes = await fetch_changes(session, user_id, since=inbox, limit=200)

    # ★ 游标只能来自返回行的最大 change_seq，绝不单独 SELECT MAX()（review.md A4）
    #   走只读副本时，副本可能已推进到 1045 但只返回到 1040 的行 —— 把游标设成 1045
    #   就永久跳过了 1041~1045。空结果时游标原地不动。
    next_inbox = max((c.change_seq for c in changes), default=inbox)
    ...
```

全员公告 feed（读扩散只用于 `audience.kind='all'`）：

```sql
SELECT m.* FROM sys_notify_msg m
 WHERE m.tenant_id = :tid
   AND m.bcast_seq > :bcast_read_seq
   AND m.status = 'published'
   AND (m.expire_time IS NULL OR m.expire_time > now(3))
   AND NOT EXISTS (
       SELECT 1 FROM sys_notify_bcast_state s
        WHERE s.user_id = :uid AND s.msg_id = m.msg_id
          AND (s.read_time IS NOT NULL OR s.dismiss_time IS NOT NULL))
 ORDER BY m.bcast_seq LIMIT 100;
```

走 `ix_sys_notify_msg_bcast_feed`。全员公告一年几十条，恒定很快。

`bcast_seq` 的分配同样有顺序倒挂问题，但公告发布是人工操作、极罕见，直接串行化：`SELECT ... FOR UPDATE` 锁一行租户配置行即可（MySQL 没有 advisory lock）。

---

## 6. 列表接口用 offset 分页（跟项目现状）

**这是相对 `platform.md` 的一处修正。** 项目的分页基础设施是 offset 制：`PageWindow(current, size)` → `paginate_scalars` → `PageResult(records, total)` → `Page[T]{records,total,current,size}`，前端所有表格组件按这四个字段取数。

通知中心是一个带页码的表格页，offset 是用户预期，也和其余模块一致。**不引入游标分页**。

`apply_sort` 强制补主键做 tiebreak，理由是"排序列值允许重复，数据库对并列行顺序不作保证，翻页时会重复或漏"。`entry_seq` 正好是完美的 tiebreak——每用户严格单调唯一。

```python
_SORT_COLUMNS = {
    "publishTime": NotifyInbox.publish_time,
    "priority":    NotifyInbox.priority,
    "entrySeq":    NotifyInbox.entry_seq,
}
_ordered = apply_sort(stmt, sort, columns=_SORT_COLUMNS,
                      tiebreak_field="entrySeq",
                      tiebreak_direction=SortDirection.DESC,
                      default=(NotifyInbox.entry_seq.desc(),))
```

**默认排序按 `entry_seq DESC`，优先级不参与**（`review.md` B2）。紧急消息用独立区块突出，不插队。

---

## 7. 与现有约定的其余对齐

| 项目约定 | 通知模块怎么跟 |
| --- | --- |
| `R[T]` 信封 `{code,msg,data}` | 全部接口用 `response_model=R[...]` |
| `Code` 枚举只放"前端要走特殊流程"的码 | **不新增业务码**。通知的错误都是"弹个 msg"，走默认的 HTTP 状态码字符串 |
| 权限点模块未落地，暂用 `SuperAdminDep` | 管理端接口用 `SuperAdminDep`，用户端用 `CurrentUserDep` |
| `OperLogRoute` + `@oper_log`，查询接口不标 | 发布/撤回/修订标 `@oper_log`；list/sync/counts/read 不标 |
| service 与 repository 共用一个 session，**事务边界在用例** | `notify.emit(session, ...)` 不 commit，由调用方的用例 commit |
| `AuditMixin` 时间戳是数据库 `CURRENT_TIMESTAMP`，INSERT 后要 `session.refresh()` | 创建公告后要 refresh 才能读 `created_at`/`create_by` |
| 模块结构 | `models/constants/listing/repository/service/exceptions` + `api/deps.py` + `api/v1/routes.py` + `api/v1/schemas/*` |
| 时间统一 UTC，要求 MySQL `time_zone='+00:00'` | 所有 `datetime(3)` 存 UTC，`now(3)` 依赖这个部署前提 |

---

## 8. 事件摄入的鉴权（`review.md` H10）

| 来源 | 方式 | 鉴权 |
| --- | --- | --- |
| 内部业务模块 | **直接函数调用** `notify.emit(session, event, dedupe_key=...)` | 无需（同进程、同事务） |
| 内部异步任务 | 同上 | 同上 |
| 外部系统 | HTTP（P1 再开） | 签名 + `event_type` 白名单 + **不允许提交 `security` 分类** |

**内部调用不走 HTTP。** 走 HTTP 就得鉴权，而任何鉴权都能被伪造成"内部调用"——包括伪造安全告警。P0 不开 HTTP 摄入口。

---

## 9. 渠道抽象：让短信能轻易接入

### 9.1 两种渠道的载荷形状根本不同

读了 `app/infra/mail` 和 `app/infra/sms` 才发现的关键差异：

```python
# 邮件：自由文本
await mailer.send(to=[...], subject=..., text=..., html=...) -> str  # Message-ID

# 短信：模板制
await sms.send(to=..., template_id=..., params={...}) -> str          # 服务商流水号
```

短信**不能自由发文案**（运营商要求预先报备模板）。所以"渲染出一段文字然后各渠道发出去"这个模型对短信是错的。

### 9.2 适配器接口按此设计

```python
class ChannelAdapter(Protocol):
    """一个外发渠道。加渠道 = 加一个实现 + 注册，投递流程一行不用改。"""

    name: str
    #  能承载哪些 intent。短信只发 transactional/alerting，不发 informational
    supports: frozenset[Intent]

    async def send(self, target: DeliveryTarget, payload: ChannelPayload) -> str:
        """发一次，返回服务商侧的追踪 id（写进 delivery.provider_id）。

        可重试的失败抛 ChannelRetryable，不可重试的抛 ChannelPermanent
        （地址无效、模板未报备）—— 投递器按这两类分流，不猜异常类型。
        """
```

`ChannelPayload` 是**按渠道分型**的联合类型，不是一个万能 dict：

```python
@dataclass(frozen=True, slots=True)
class MailPayload:
    subject: str
    text: str
    html: str | None = None

@dataclass(frozen=True, slots=True)
class SmsPayload:
    """模板制。渲染阶段产出的是 (template_id, params)，不是一段文字。"""
    template_id: str
    params: Mapping[str, str]

ChannelPayload = MailPayload | SmsPayload
```

于是渲染阶段按渠道产出不同类型，适配器只认自己那一种。**加短信要写的东西**：

1. `SmsPayload` 已在上面（本次就定下来，不留到以后改类型）
2. 模板注册表里给 `sms` 变体填 `template_id` + 参数映射
3. 一个 `SmsAdapter` 包一层现成的 `SmsSender`
4. 在渠道注册表加一行

**投递器、重试、退避、delivery 表、偏好求交一行都不用动。**

### 9.3 P0 只实现邮件

`sms` 渠道的 `SmsPayload`、`supports`、注册点全部就位，但不注册 `SmsAdapter`。`allowed_channels` 里出现 `sms` 时，投递器记一条 `state='cancelled'`、`last_error='渠道未启用'`，不报错——这样 P1 打开短信只是注册一个适配器。

### 9.4 重试分两层（`implementation.md` §2）

| 层 | 管什么 |
| --- | --- |
| taskiq `SimpleRetryMiddleware`（3 次） | 偶发失败：网络抖动、MySQL 死锁。进程内、秒级、不落库 |
| `delivery.attempts` + `next_retry_at` | 持续失败：供应商挂了。落库、可观测、退避到小时级 |

判据：**这次重试要不要跨越进程重启？** 要 → 表；不要 → 中间件。

退避 **必须加抖动**：不加的话供应商恢复瞬间上万条积压任务退避到同一秒，把刚恢复的服务再打挂。

```python
backoff = min(2 ** attempts, 3600)
jitter = random.uniform(0, backoff * 0.3)
```

---

## 10. P0 交付清单

```
migrations/versions/xxxx_notify.py          9 张表
app/modules/notification/
├── constants.py        Category / Intent / Urgency / Reason / Channel / 状态枚举
├── models.py           9 个 ORM 模型（基类按 §0.2）
├── snowflake.py        雪花 ID + Redis 租 worker_id
├── sequence.py         ★ allocate_seqs（全系统唯一写 next_seq 的地方）
├── rules.py            NotificationRule 类型化注册表 + 默认偏好矩阵
├── audience.py         解析器：user / role / dept(ancestors) / all
├── templates.py        模板渲染 + 变量校验 + 按渠道分型载荷
├── listing.py          InboxCriteria / MsgCriteria
├── repository.py       inbox / msg / task / delivery 四组查询
├── ingest.py           emit()：幂等写 event + task，不 commit
├── fanout.py           扇出（幂等、可续跑）
├── inbox.py            读侧：list / sync / counts / read / dismiss
├── publish.py          管理端：草稿 / 受众预览 / 发布 / 撤回 / 修订
├── delivery.py         投递器 + 渠道注册表
├── channels/
│   ├── base.py         ChannelAdapter 协议 + 载荷类型
│   └── mail.py         邮件适配器（P0 唯一实现）
├── signal.py           调 send_to_users 推 {change_seq}
├── tasks.py            taskiq 任务 + kind → handler 注册
├── exceptions.py
└── api/
    ├── deps.py
    └── v1/routes.py + schemas/

app/core/taskqueue/
├── broker.py           RedisStreamBroker + SimpleRetryMiddleware
├── relay.py            表 → taskiq 搬运（唯一一处）
└── runtime.py          lifespan 启停

app/main.py             改：lifespan 起停 relay
app/infra/realtime/runtime.py   已改：subscribe=False（给 worker 用）
```

**不做（留 P1）**：折叠/摘要/限流/snooze、升级阶梯、webhook 出站、设备注册表与推送撤回、trace 表、reason 维度偏好、外部 HTTP 摄入、读扩散的混合时间线。

字段先存着不用（`intent`、`collapse_key`、`last_digest_seq`），事件先埋着不分析——这样 P1 开工时有历史数据可用，不用从零积累。

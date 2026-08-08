# 通知模块后端设计（ruoyi-plus-fast 自有服务）

> ## ⚠️ 本文已被取代，仅作历史记录
>
> 它写在两个错误前提上：**(1)** 按 benai 的栈假设（Postgres / SQLAlchemy / UoW / Celery / UUID 主键），实际是 MySQL 8 + 雪花 + 无队列；**(2)** §7.3 断言"多实例推送有缺口"，实际 `RedisRealtimeBroker` 早已解决——那是只看前端类型名就下结论。
>
> 核心机制（三表分离、`seq`、outbox、读写扇出分流）已被 `platform.md` + `implementation.md` 完整覆盖且更准确。**要实现请看 `review.md` → `platform.md` → `implementation.md`，不要照本文的 DDL 写。**
>
> 保留原因：记录了两次判断失误的过程。

> 文档状态：历史稿
>
> 与另两份的关系：`plan.md` = 功能范围，`architecture.md` = 整体分层与前端，**本文 = 后端**。
>
> **本文的定位**：ruoyi-plus-fast 有自己的后端服务，不是 benai。benai 只作为反面参考——它的单表模型和"先推送后提交"是本文要绕开的两个坑，具体在 §14 单独列出，正文不再夹叙。

---

## 0. 从本项目的既有事实出发

设计不能凭空开始。下面这些是我从代码里读出来的约束，全部可核对：

| 事实 | 证据 | 对设计的约束 |
| --- | --- | --- |
| 后端是 RuoYi 血统的 Python 服务，`app/` 布局 | `features/realtime/message.ts` 注释指向 `app/core/codes.py`、`app/infra/realtime/constants.py` | 表名走 `sys_*`，字段走 `create_by/create_time/del_flag/tenant_id` |
| 主键是雪花 bigint，前端不敢当 number 用 | `NoticeId = number \| string`、`UserId = number \| string` | **id 出网关一律序列化为 string**，见 §3.0 |
| `sys_notice` 已存在且前端接口层已写好 | `service/api/system-notice/`，`/system/notice/list` 等 5 个接口 | 新设计**不许动它**，见 §2 |
| `sys_notice` 只有内容，没有受众和已读态 | `NoticeItem` 字段仅 `noticeId/noticeTitle/noticeContent/noticeType/status/createBy/remark` | 收件箱必须是新增的一层 |
| 分页形状是 MyBatis-Plus 的 `Page` | `{current, size, total, records}` | 列表接口沿用；`/sync` 是例外，见 §8.2 |
| 部门树用 `ancestors` 逗号链 | `system-dept/types.ts:16` `ancestors: string` | **受众展开不需要递归 CTE**，见 §6.1 |
| 实时信封已经定死 | `{code,msg,data,msg_id,request_id,type}`，`type` 命名 `模块.资源.动作`，`code='0000'/'0001'` | 新消息类型**沿用这个信封**，不发明协议，见 §7.1 |
| WS 和 SSE 共用一张连接注册表 | `.env`「后端的连接注册表是同一张，推消息不区分两者」 | 信号层只对接注册表，不区分传输 |
| 推送接口返回的是 `local_connections` | `sse/api.ts`、`websocket/api.ts` | **注册表是进程内的**，多实例部署有缺口，见 §7.3 |
| 有租户 | `auth.d.ts` 的 `tenantId`、`sys_client` | 每张表带 `tenant_id`，见 §3.6 |

---

## 1. 后端要解决的问题，按难度排序

| 难度 | 问题 | 落在哪一节 |
| --- | --- | --- |
| ★★★ | 客户端如何**可靠对账**：多设备、断线、重复投递下未读数始终正确 | §4（`seq`） |
| ★★★ | 多实例部署时推送怎么跨进程 | §7.3 |
| ★★ | 一条事件如何**幂等**扇出到 N 人，可中断续跑 | §5、§6 |
| ★★ | 推送与事务的时序 | §5.1（outbox） |
| ★ | 和已有 `sys_notice` 怎么共存 | §2 |
| ★ | 分类、模板、渠道、统计 | §9、§10 |

只有前四个是"设计错了要付几个月代价"的。后面的都是装修。

---

## 2. 先定和 `sys_notice` 的关系（本项目最重要的一个决策）

`sys_notice` 已经有完整的前端接口层（`service/api/system-notice/`：list / detail / create / update / delete）。三个选项：

| 选项 | 做法 | 问题 |
| --- | --- | --- |
| A | 扩展 `sys_notice`，加受众、已读、seq | 已读态是 `用户 × 公告` 的关系，塞进 `sys_notice` 就变成 benai 那张单表。而且现有 5 个接口的语义全变 |
| B | 废弃 `sys_notice`，全部搬到新表 | 前端 5 个接口 + 页面全部重写；以后合并 RuoYi 上游会冲突 |
| **C** | **`sys_notice` 原样保留，作为「内容源」之一；收件箱是独立新增的一层** | 需要一个订阅关系把两者接起来 |

**选 C。** 理由不是"改动小"，而是职责本来就不同：

```
sys_notice          = 管理员写的一篇公告（内容 + 生命周期）
sys_msg_inbox       = 某个用户与某条消息的关系（已读、处理、删除）
```

这两个东西的**基数完全不同**（一条公告 : N 个用户），本来就不该在一张表。`sys_notice` 只是恰好是消息的来源之一——另外还有业务事件、告警、待办。

具体接法：`sys_notice` 发布时产生一条 `sys_msg`，`sys_msg.source_type='notice'`、`source_id=notice_id`。`sys_notice` 表本身**零改动**（受众和定时发布放在 §3.3 的扩展表里，仍然不动主表）。

好处：
- 现有 `/system/notice/*` 5 个接口和前端页面**一行都不用改**
- 以后 RuoYi 上游改 `sys_notice`，我们的收件箱层不受影响
- 通知模块可以先只接业务事件上线，公告接入是独立的一步

`noticeType` 映射（`'1'`=通知 `'2'`=公告）：

```
sys_notice.notice_type = '1'  →  sys_msg.category = 'announcement', priority = 'normal'
sys_notice.notice_type = '2'  →  sys_msg.category = 'announcement', priority = 'high'
```

两者都落到 `announcement`。RuoYi 原来这两个值的区分是展示用的，语义上都是"组织下发的公告"，没必要在新模型里保留两个分类。

---

## 3. 表设计

### 3.0 三条全局约定（先说，后面不重复）

**约定一：所有 id 出网关序列化为 string。**
雪花 id 超过 `2^53`，JS 的 `number` 装不下。前端 `NoticeId = number | string` 这个联合类型就是这个坑的痕迹。新接口**统一返回 string**，别让前端再猜。

例外：`seq` 是**每用户从 1 开始**的计数器，一个用户一辈子收不到 9 千万亿条消息，可以安全地用 `number`。这个区别要写在接口文档里，否则前端会把 seq 也当 string 然后做字符串比较（`"9" > "10"`）。

**约定二：新表打破 RuoYi 的 `char(1)` 状态编码。**
RuoYi 习惯 `status = '0'/'1'`。但这里要表达 6 种分类 × 4 种优先级 × 4 种处理态，用数字编码等于把可读性全部扔掉——`category='3'` 谁也看不出是什么。新表用**语义化 varchar**。

代价：和 `sys_notice.status` 风格不一致。我认为值得，且边界清晰（`sys_notice` 保持原样，新表统一新风格）。

**约定三：收件箱表不加 `del_flag`。**
它有 `dismissed_at`（用户从视图里移除），语义比 `del_flag` 准确得多，而且带时间戳。加 `del_flag` 会让 §3.5 的每个索引都得带一个 `del_flag='0'` 条件，白占空间。

### 3.1 事件表：幂等边界

```sql
CREATE TABLE sys_msg_event (
    event_id     bigint      PRIMARY KEY,           -- 雪花
    tenant_id    varchar(20) NOT NULL,
    -- 幂等键，业务侧构造。例：'flow.approved:1938...'
    -- 唯一索引是全系统唯一的幂等保证，应用层不许再做「先查有没有」
    dedupe_key   varchar(200) NOT NULL,
    event_type   varchar(100) NOT NULL,             -- 'flow.approved' 等
    payload      json        NOT NULL,
    occurred_at  datetime    NOT NULL,
    produced_by  varchar(100) NOT NULL,             -- 来源模块，排查用
    create_time  datetime    NOT NULL,

    CONSTRAINT uk_msg_event_dedupe UNIQUE (tenant_id, dedupe_key)
);
```

摄入只有一条语句：`INSERT ... ON CONFLICT DO NOTHING RETURNING event_id`。返回空 = 处理过了，直接结束。**不查询、不判断。**

`dedupe_key` 带 `tenant_id` 进唯一键：不同租户的业务 id 可能撞。

### 3.2 发件箱：让推送永远晚于提交

```sql
CREATE TABLE sys_msg_outbox (
    outbox_id     bigint      PRIMARY KEY,
    event_id      bigint      NOT NULL,
    tenant_id     varchar(20) NOT NULL,
    state         varchar(20) NOT NULL DEFAULT 'pending',  -- pending|running|done|failed
    attempts      int         NOT NULL DEFAULT 0,
    next_retry_at datetime    NOT NULL,
    last_error    text,
    create_time   datetime    NOT NULL
);

CREATE INDEX idx_msg_outbox_claim ON sys_msg_outbox (state, next_retry_at);
```

业务事务里**只 INSERT 两行**（event + outbox）然后提交。渲染文案、扇出、推送、发邮件全部由后台任务在**新事务**里做。

业务事务回滚 → outbox 行也没了 → 什么都不会发生。这是**结构性**保证，不是 try/except 能替代的（§14.2）。

领取用抢占式写法，多 worker 不打架：

```sql
UPDATE sys_msg_outbox SET state='running', attempts=attempts+1
 WHERE outbox_id IN (
     SELECT outbox_id FROM sys_msg_outbox
      WHERE state IN ('pending','failed') AND next_retry_at <= now()
      ORDER BY outbox_id LIMIT 50
      FOR UPDATE SKIP LOCKED
 ) RETURNING outbox_id, event_id;
```

> MySQL 8.0+ 也支持 `SKIP LOCKED`。如果本项目用的是 MySQL 5.7，这里退化成"先 SELECT 再乐观 UPDATE 带 state 条件"，见 §12 决策 B2。

### 3.3 消息表 + 公告扩展表

```sql
CREATE TABLE sys_msg (
    msg_id        bigint      PRIMARY KEY,
    tenant_id     varchar(20) NOT NULL,
    event_id      bigint,                            -- NULL = 人工发布

    -- 内容源：把 sys_notice 接进来而不修改它（§2）
    source_type   varchar(20) NOT NULL,              -- 'event' | 'notice'
    source_id     bigint,                            -- source_type='notice' 时为 notice_id

    category      varchar(20) NOT NULL,              -- task|announcement|message|event|alert|security
    priority      varchar(20) NOT NULL DEFAULT 'normal',
    title         varchar(255) NOT NULL,
    summary       varchar(500) NOT NULL,
    body          text,                              -- 详情。列表接口不查这列
    ref_type      varchar(50),                       -- 业务对象坐标
    ref_id        varchar(64),
    action        json,                              -- {kind,label,target} 或 NULL

    -- 受众定义原样保留：撤回和统计都要靠它
    audience      json        NOT NULL,
    audience_size int,                               -- 发布前预览写入

    status        varchar(20) NOT NULL DEFAULT 'draft', -- draft|scheduled|published|revoked
    publish_time  datetime,
    expire_time   datetime,
    revoke_time   datetime,
    revoke_reason varchar(500),

    -- 仅全员公告有值（读扩散），见 §6.2
    bcast_seq     bigint,

    -- 扇出续跑游标
    fanout_state  varchar(20) NOT NULL DEFAULT 'pending',  -- pending|running|done
    fanout_cursor bigint,

    create_by     bigint      NOT NULL,
    create_dept   bigint,
    create_time   datetime    NOT NULL,

    CONSTRAINT uk_msg_source UNIQUE (tenant_id, source_type, source_id)  -- 同一公告不许生成两条消息
);

CREATE UNIQUE INDEX uk_msg_bcast_seq ON sys_msg (tenant_id, bcast_seq);
CREATE INDEX idx_msg_bcast_feed ON sys_msg (tenant_id, bcast_seq, status);
CREATE INDEX idx_msg_fanout ON sys_msg (fanout_state, msg_id);
```

公告的受众和定时发布，放在**扩展表**而不是改 `sys_notice`：

```sql
CREATE TABLE sys_notice_publish (
    notice_id     bigint      PRIMARY KEY,           -- 与 sys_notice 一对一
    tenant_id     varchar(20) NOT NULL,
    audience      json        NOT NULL,
    audience_size int,
    priority      varchar(20) NOT NULL DEFAULT 'normal',
    scheduled_at  datetime,
    published_at  datetime,
    msg_id        bigint,                            -- 发布后回填
    create_by     bigint      NOT NULL,
    create_time   datetime    NOT NULL
);
```

这样 `sys_notice` 一个字段都没动，但公告获得了受众、定时、撤回能力。老接口继续用，新接口 `/system/notice/{id}/publish` 走扩展表。

### 3.4 收件箱：唯一带 `user_id` 的表

```sql
CREATE TABLE sys_msg_inbox (
    user_id      bigint      NOT NULL,
    msg_id       bigint      NOT NULL,
    tenant_id    varchar(20) NOT NULL,

    -- 每用户单调递增。整套对账机制的核心，见 §4
    seq          bigint      NOT NULL,

    read_time    datetime,
    -- 处理态，与已读态正交（architecture.md §3.3）
    action_state varchar(20) NOT NULL DEFAULT 'none',   -- none|pending|done|cancelled
    action_time  datetime,
    dismiss_time datetime,

    -- ↓ 从 sys_msg 复制的不可变字段。发布后永不改，复制是为了列表查询不 join
    category     varchar(20) NOT NULL,
    priority     varchar(20) NOT NULL,
    publish_time datetime    NOT NULL,
    expire_time  datetime,

    PRIMARY KEY (user_id, msg_id),
    CONSTRAINT uk_msg_inbox_seq UNIQUE (user_id, seq)
);

-- 增量同步：唯一的热路径
CREATE INDEX idx_inbox_sync ON sys_msg_inbox (user_id, seq);
-- 列表 + Tab 筛选
CREATE INDEX idx_inbox_feed ON sys_msg_inbox (user_id, category, publish_time DESC, msg_id);
-- 未读兜底（正常走 §5 的计数器）
CREATE INDEX idx_inbox_unread ON sys_msg_inbox (user_id, read_time, dismiss_time);
```

**三个刻意的设计**：

1. **主键 `(user_id, msg_id)` 而不是自增 id。** 这个复合主键**就是**扇出幂等保证——`ON CONFLICT DO NOTHING` 一行代码解决重复，无并发窗口。RuoYi 习惯每张表一个自增/雪花主键，这里刻意不这么做。
2. **`category`/`priority`/`publish_time`/`expire_time` 从 `sys_msg` 冗余过来。** 它们发布后不可变，所以冗余安全；换来"按分类筛选 + 时间倒序分页"完全不 join。`title`/`body` **不**冗余——那些要支持改文案和撤回。
3. **没有 `tenant_id` 索引。** `user_id` 全局唯一，`tenant_id` 在这张表只用于**行级越权校验**（查出来的行必须匹配当前会话租户），不用于检索。

### 3.5 游标表：seq 分配器 + 计数器

```sql
CREATE TABLE sys_msg_cursor (
    user_id        bigint      PRIMARY KEY,
    tenant_id      varchar(20) NOT NULL,
    -- 下一个待分配的 seq。全系统唯一的写入点是 §4 的分配器
    next_seq       bigint      NOT NULL DEFAULT 1,
    -- 与 seq 在同一事务里维护的计数器
    unread_count   int         NOT NULL DEFAULT 0,
    pending_count  int         NOT NULL DEFAULT 0,
    -- 全员公告的已读水位，见 §6.2
    bcast_read_seq bigint      NOT NULL DEFAULT 0,
    update_time    datetime    NOT NULL
);
```

### 3.6 全员公告已读态（读扩散）

```sql
CREATE TABLE sys_msg_bcast_state (
    user_id      bigint   NOT NULL,
    msg_id       bigint   NOT NULL,
    read_time    datetime,
    dismiss_time datetime,
    PRIMARY KEY (user_id, msg_id)
);
```

只有用户**真的操作过**才插行。10 万用户 + 1 条全员公告 = 0 行，直到有人点它。

### 3.7 外部渠道投递

```sql
CREATE TABLE sys_msg_delivery (
    delivery_id   bigint      PRIMARY KEY,
    msg_id        bigint      NOT NULL,
    user_id       bigint      NOT NULL,
    tenant_id     varchar(20) NOT NULL,
    channel       varchar(20) NOT NULL,              -- email|sms|wecom
    state         varchar(20) NOT NULL DEFAULT 'pending',
    attempts      int         NOT NULL DEFAULT 0,
    next_retry_at datetime    NOT NULL,
    provider_id   varchar(128),                      -- 第三方回执 id
    last_error    text,
    create_time   datetime    NOT NULL,
    finish_time   datetime,

    CONSTRAINT uk_msg_delivery UNIQUE (msg_id, user_id, channel)
);
CREATE INDEX idx_msg_delivery_claim ON sys_msg_delivery (state, next_retry_at);
```

**站内和实时推送不进这张表。** 站内的"投递"就是 `sys_msg_inbox` 那一行本身；实时推送是易失提示，成功与否不影响正确性（下次 sync 就补上了）。给它们建投递记录是纯写放大。

---

## 4. `seq` 的分配（这一节是全文的技术核心）

### 4.1 为什么不能用全局自增/雪花

直觉方案：所有变更取一个全局序号。**这是错的**，而且错法很隐蔽。

```
时刻   事务 A（用户 U）      事务 B（同一用户 U）      客户端
 t1    取号 100
 t2                          取号 101
 t3                          COMMIT
 t4                                                  sync?since=99 → 看到 101
                                                     lastSeq = 101
 t5    COMMIT
 t6                                                  sync?since=101 → 空
```

**seq=100 那条消息永久丢失。** 客户端再也不会请求 ≤101 的东西。

取号顺序和提交顺序无关——这是所有基于自增 id 的增量同步的经典陷阱。症状是**未读数偶尔少一条，无任何错误日志**。

雪花 id 一样中招，而且更糟：它带机器位，多实例下连"大致有序"都不保证。

### 4.2 方案：每用户计数器行，行锁持有到提交

```sql
UPDATE sys_msg_cursor
   SET next_seq = next_seq + 1, update_time = now()
 WHERE user_id = :userId
RETURNING next_seq - 1 AS seq;         -- MySQL 无 RETURNING，见下
```

正确性论证：

1. 这条 UPDATE 对该行取**行级排他锁**，锁持有到事务结束。
2. 因此对同一用户，事务 B 的取号必须**等事务 A 提交或回滚**。
3. 所以对同一用户：**取号序 = 提交序 = 可见序**。
4. 推论：客户端看到 seq=N 时，该用户所有 seq<N 的变更都已提交可见。`sync?since=N` 安全。

竞争范围只有单个用户那一行。单用户的通知写入速率天然极低，不构成瓶颈。

**MySQL 没有 `RETURNING`**，写法是（在同一事务、同一连接内）：

```sql
UPDATE sys_msg_cursor
   SET next_seq = (@new := next_seq + 1), update_time = now()
 WHERE user_id = :userId;
SELECT @new - 1 AS seq;
```

或者更稳妥：`SELECT next_seq FROM sys_msg_cursor WHERE user_id=? FOR UPDATE` 然后 UPDATE。`FOR UPDATE` 同样把锁持到提交，论证不变，只是多一次往返。

### 4.3 批量扇出的两个坑

**坑 1：一次锁 1000 行会死锁。** 扇出给 1000 人 = 一个事务锁 1000 个游标行；同时这些用户各自的"标记已读"也在锁自己那行。两个方向相遇就死锁。

对策：**所有路径统一按 `user_id` 升序加锁**，再加分块（每块独立事务）。

**坑 2：1000 次单行 UPDATE 太慢。** 批量化：

```sql
-- Postgres
WITH ordered AS (SELECT unnest(:userIds::bigint[]) AS user_id ORDER BY 1)
UPDATE sys_msg_cursor c
   SET next_seq = c.next_seq + 1,
       unread_count = c.unread_count + 1,
       update_time = now()
  FROM ordered o WHERE c.user_id = o.user_id
RETURNING c.user_id, c.next_seq - 1 AS seq;
```

调用方传**已排序**的数组。seq 和计数器在同一条语句里推进，天然一致。

MySQL 下退化成 `WHERE user_id IN (...) ORDER BY user_id`（MySQL 的 UPDATE 不支持 ORDER BY 配 IN，需要拆成先 `SELECT ... FOR UPDATE ORDER BY user_id` 再批量 UPDATE）。

### 4.4 如果单用户竞争真成了瓶颈

逃生方案：全局序列 + **水位线**，只暴露 `seq < min(在途事务最小 seq)` 的变更（逻辑复制、Debezium 的思路）。代价是要维护在途事务表，且有可见性延迟。

**不建议一开始就上。** 先用 §4.2，等真观测到 `sys_msg_cursor` 上的锁等待再说（§11 有这个指标）。

> 这一节写这么长，是因为它是**唯一一个"设计错了没法靠改代码补救"的地方**。表结构错了可以迁移；seq 语义错了等于对账机制失效，症状是偶发丢消息，排查成本以月计。

---

## 5. 计数器：未读数必须 O(1)

未读数是最高频的读（每个页面的铃铛都要），不能 `COUNT(*)`。

`sys_msg_cursor.unread_count` / `pending_count` 在**每次改已读态/处理态的同一事务里**维护：

```sql
-- POST /notification/read  一条语句
WITH updated AS (
    UPDATE sys_msg_inbox SET read_time = now()
     WHERE user_id = :userId AND msg_id = ANY(:msgIds)
       AND read_time IS NULL AND dismiss_time IS NULL
    RETURNING 1
)
UPDATE sys_msg_cursor
   SET unread_count = greatest(0, unread_count - (SELECT count(*) FROM updated)),
       next_seq = next_seq + 1              -- 已读也是一次变更，必须推进 seq
 WHERE user_id = :userId
RETURNING next_seq - 1 AS seq, unread_count;
```

三点：

1. `greatest(0, ...)` 兜底。计数器一定会在某些边界漂移，漂到负数比漂到 3 更难看。
2. **已读也要推进 seq**，否则另一台设备不知道你标了已读。
3. 返回**权威** `unread_count`，客户端不自己加减。

### 5.1 对账任务（必须有）

定时重算计数器，把差值作为指标上报。漂移不可能为零（进程被 kill、迁移脚本直接改表、代码 bug），重要的不是修好它，是**知道它在漂**。

`msg_unread_drift` 是整个通知系统**最有价值的健康信号**：非零且稳定 = 正常；开始增长 = 刚上线的改动破坏了计数器维护。

---

## 6. 扇出

### 6.1 受众展开：吃掉 RuoYi 的 `ancestors`

`sys_dept.ancestors` 是逗号分隔的祖先链（本项目 `system-dept/types.ts:16` 已确认）。这让"部门及所有子部门的用户"变成一条平凡的 SQL，**不需要递归 CTE**：

```sql
SELECT u.user_id
  FROM sys_user u JOIN sys_dept d ON d.dept_id = u.dept_id
 WHERE u.tenant_id = :tenantId
   AND (d.dept_id = :rootDeptId
        OR d.ancestors LIKE concat('%,', :rootDeptId, ',%'))
   AND u.del_flag = '0' AND u.status = '0'
   AND u.user_id > :cursor            -- 分块续跑
 ORDER BY u.user_id LIMIT :size;
```

四种受众的解析器：

| `audience.kind` | 解析方式 |
| --- | --- |
| `users` | 直接给定 `userIds`，仍需过滤 `del_flag`/`status` |
| `roles` | `sys_user_role` join，注意一个用户多角色要 `DISTINCT` |
| `depts` | 上面那条 SQL，`includeChildren` 控制是否带 `ancestors` 条件 |
| `all` | 读扩散，不展开，见 §6.2 |

`ORDER BY u.user_id` + `user_id > cursor` 同时满足两件事：**分块续跑**和 **§4.3 的升序加锁**。一个排序解决两个问题。

### 6.2 读扩散只用于 `all`

**规则**：
- `users` / `roles` / `depts` → 一律写扩散；展开人数 > 1000 **拒绝发布**（提示改用全员公告）
- `all` → 只有这一种走读扩散

为什么这么切：读扩散最麻烦的是"查询时判断这条是否命中我"。如果只有 `all`，这个判断**恒真**，谓词消失，未读数一条便宜 SQL 就出来了。一旦允许 `roles`/`depts` 读扩散，每次查列表都要带用户的角色/部门树做集合运算，而且"用户换部门后历史公告的可见性"会变成一个说不清的问题（RuoYi 的部门调整是常规操作，这不是假想）。

未读公告数：

```sql
SELECT count(*) FROM sys_msg m
 WHERE m.tenant_id = :tenantId
   AND m.bcast_seq IS NOT NULL
   AND m.status = 'published'
   AND m.bcast_seq > :bcastReadSeq
   AND (m.expire_time IS NULL OR m.expire_time > now())
   AND NOT EXISTS (
       SELECT 1 FROM sys_msg_bcast_state s
        WHERE s.user_id = :userId AND s.msg_id = m.msg_id
          AND (s.read_time IS NOT NULL OR s.dismiss_time IS NOT NULL));
```

走 `idx_msg_bcast_feed`。全员公告一年几十条，这个查询恒定很快。

`bcast_seq` 的分配同样有 §4.1 的倒挂问题，但公告发布是**人工操作、极其罕见**，直接串行化即可：Postgres 用 `pg_advisory_xact_lock`，MySQL 用 `SELECT ... FOR UPDATE` 锁一行租户级配置行。

### 6.3 扇出流程

```
领取 outbox
  → 查 sys_msg_event，按 §9 的规则渲染出 sys_msg（一行）
  → 分块循环：
       每块 500 人，user_id 升序
       ┌─ 事务开始
       │   批量分配 seq + 递增 unread_count（§4.3 那条语句）
       │   批量 INSERT sys_msg_inbox，ON CONFLICT DO NOTHING
       │   更新 sys_msg.fanout_cursor
       └─ 事务提交
       ↓ 提交之后才推送（§14.2）
       推送信号给这一块的用户
  → 标记 fanout_state='done'
  → 外部渠道：批量 INSERT sys_msg_delivery，交给投递任务
```

四个性质，逐条对应问题：

| 性质 | 靠什么 |
| --- | --- |
| 幂等 | `PRIMARY KEY (user_id, msg_id)` + `ON CONFLICT DO NOTHING` |
| 可续跑 | `fanout_cursor`，按 user_id 升序推进 |
| 无死锁 | 块内升序、块间独立事务 |
| 推送晚于提交 | 推送调用在事务块外 |

`ON CONFLICT DO NOTHING` 会**浪费已分配的 seq**（重跑时号被消耗但没插行）。无妨——seq 只要求单调，不要求连续。

---

## 7. 实时信号

### 7.1 沿用现有信封，不发明协议

本项目的信封已经定死（`features/realtime/message.ts`），新消息类型直接进去：

```json
{
  "code": "0000",
  "msg": "ok",
  "type": "message.inbox.changed",
  "msg_id": "1938...",
  "request_id": null,
  "data": { "seq": 1045 }
}
```

`type` 遵循现有的 `模块.资源.动作` 命名。`code` 用现有的 `SUCCESS='0000'`。

**载荷只有一个 `seq`。** 客户端收到后：`if (seq > lastSeq) scheduleSync()`（带防抖合并）。

这一步把前端 `features/realtime/message.ts` 里 `withMsgId` 那套 `msg_id` 去重逻辑**整体作废**——`seq` 比较天然幂等。也不再需要"WS 和 SSE 同时连着"这种冗余（`architecture.md` 决策 D1）。

**可选优化**：`data` 里带完整 entry，客户端乐观插入省一次往返。但这是优化不是基础——推送丢了照样对。

### 7.2 现有 `/sse/push`、`/websocket/push` 怎么办

这两个接口现在是**联调工具**（`sse-test`、`websocket-test` 页面在用），载荷是 `{title, content, type}` 直接推。

建议：**保留，但明确标记为 debug 接口**，加权限点 `monitor:realtime:push`，生产环境可关。业务不许调它——业务走 §3.1 的事件摄入。

理由：联调页面是真实需求（`design/ruoyi-plus-fast/pages/test/realtime-debug.md` 已经在写了），但它绕过了持久化。如果不划清界限，早晚有人图省事直接用它发业务通知，然后刷新页面消息就没了。

### 7.3 ~~多实例部署的缺口~~ ← 本节结论错误，已作废

> **修正**：这一节说的缺口**不存在**。skroc-fast 的 `app/infra/realtime/broker.py` 已经用 Redis Pub/Sub 做了跨实例转发，还处理了回环去重、频道项目前缀隔离、listener 异常兜底和关闭顺序。
>
> `local_connections` 只是返回值语义——`runtime.py` 明确写了「返回值只统计本机。转发给其他实例走的是 redis pub/sub，至多一次、没有回执」。那是**正确的设计**（跨实例投递数无法同步得知），不是缺口。
>
> 我当时只看了前端的响应类型就下了结论，没读后端。详见 `infra.md` §1.5。
>
> 下面原文保留，作为"从类型名推断架构"这种错误的记录。

两个接口的响应类型都叫 **`local_connections`**：

```ts
export interface SsePushResponse {
  /** 当前后端实例成功投递的连接数，含该用户的 WebSocket 连接。 */
  local_connections: number;
}
```

`local` 说明**连接注册表是进程内的**。单实例没问题，多实例部署时：用户连在实例 A，业务事件在实例 B 处理 → **推不到**。

三个选项：

| 选项 | 做法 | 评价 |
| --- | --- | --- |
| A | Redis Pub/Sub，每个实例订阅，收到后查本地注册表投递 | **推荐**。RuoYi 血统项目一定有 Redis，零新组件 |
| B | Redis 存 `user_id → 实例` 路由表，定向转发 | 更省带宽，但要处理路由表过期和实例下线 |
| C | 不修，客户端靠轮询兜底 | 只在确定单实例部署时可接受 |

**关键结论：即使不修，正确性也不受影响。** 因为真相在 `/sync`，推送只是提示。缺口的后果是"通知延迟到用户下次打开页面"，不是"通知丢失"。这正是 §0 那套设计换来的东西——**基础设施可以先欠着**。

如果选 A，Redis 的定位要写死：**只做跨实例的扇出通道，不做任何真相**。不缓存未读数、不缓存列表。这条界限一松，缓存一致性就会变成下一个坑。

---

## 8. 接口

### 8.1 用户端

```
GET  /notification/list?category=&read=&actionState=&current=&size=    列表（沿用 Page 形状）
GET  /notification/sync?inbox=<seq>&bcast=<seq>                        ★ 增量对账
GET  /notification/counts                → {unread, pending, byCategory}
GET  /notification/{msgId}               详情（含 body）
POST /notification/read      {msgIds}    批量已读
POST /notification/unread    {msgIds}    批量取消已读
POST /notification/dismiss   {msgIds}    批量移除视图
GET  /notification/preference
PUT  /notification/preference
```

### 8.2 `/sync` 是分页形状的例外

其余列表接口沿用 `{current, size, total, records}`。`/sync` **不能**套这个形状：

```json
{
  "changes":   [ { "seq": 1043, "op": "upsert", "entry": {...}, "msg": {...} } ],
  "broadcasts":[ ... ],
  "inboxSeq":  1045,
  "bcastSeq":  90,
  "unreadCount": 7,
  "pendingCount": 2,
  "truncated": false
}
```

硬套 `Page` 会误导前端去做页码计算——它不是分页，是**游标增量**，`total` 在这里没有意义。这个例外要在接口文档里显式说明，否则一定有人按惯例接错。

`truncated: true` 的判定：`inbox=0` 或落后超过 1000 条 → 不返回增量，客户端全量重载。这条兜底必须有，否则离线两个月的客户端会拉爆接口。

### 8.3 三条约定

1. **`GET /{msgId}` 不自动标已读。** 已读是显式的 `POST /read`。GET 有副作用等于不可缓存、不可重试，而且"预览"和"已读"无法区分。（benai 那边是自动标的，§14.3）
2. **批量操作一次请求**，不是循环调单条。
3. **写操作返回权威 `unread_count` 和新 `seq`**，客户端直接采用，不自己算。

### 8.4 管理端

在现有 `/system/notice/*` **之外**新增，不改老接口：

```
POST /system/notice/{id}/audience-preview   → {count, sample[]}   ★ 发布前必查
POST /system/notice/{id}/publish            {scheduledAt?}
POST /system/notice/{id}/revoke             {reason}
GET  /system/notice/{id}/stats              → {delivered, read, actioned}
```

`audience-preview` 单独强调：**发布前不知道要发给多少人，是这类系统最常见的事故源。** 权限点沿用 RuoYi 风格：`system:notice:publish`、`system:notice:revoke`。

---

## 9. 编排规则：事件 → 消息

本项目**没有** benai 那样的事件注册表，要新建。我建议做成最朴素的形态——一个字典，不做配置化：

```python
class MsgRule(BaseModel):
    category: str
    priority: str
    audience_resolver: str      # 解析器名，不是 notify_xxx 布尔开关
    template_key: str           # 指向模板，不内联字符串
    ref_extractor: str | None   # 从 payload 提取 (ref_type, ref_id)
    action_builder: str | None
    allowed_channels: list[str] # 系统策略允许的渠道
    locked_channels: list[str]  # 用户不可关闭的（security 走这里）

MSG_RULES: dict[str, MsgRule] = { ... }
```

三个刻意的选择：

1. **`audience_resolver` 用字符串指向注册的解析器，不用一堆布尔开关。** 布尔开关加第三种受众时要改模型 + 所有分支；注册表是开放的。
2. **`locked_channels` 在后端。** 哪些渠道用户不能关是系统策略，前端只读取并置灰，不硬编码（`architecture.md` §8）。
3. **不做规则引擎、不做可视化配置。** 配置化的规则引擎最后一定变成没人敢改的黑盒。事件到通知的映射就是代码，改它就发版。

模板渲染要**显式校验变量**：模板声明所需字段，渲染前检查 payload 是否齐全，缺变量**直接失败**。用 `Template.substitute` 会抛 `KeyError`（信息不足），用 `safe_substitute` 会把 `$member_name` 原样发给用户（更糟）。两个都不能直接用。

---

## 10. 后台任务

**不假设具体调度器。** 本项目用什么（APScheduler / 自带 worker / 外部 Job 平台）我没核实，这里只定义任务语义：

| 任务 | 频率 | 语义 |
| --- | --- | --- |
| `process_outbox` | 秒级 | 领取 outbox → 生成 msg → 触发扇出 |
| `fanout_msg` | 触发式 | 分块扇出，可重入 |
| `deliver_pending` | 秒级 | 外部渠道投递 + 指数退避 |
| `publish_scheduled` | 分钟级 | 定时公告到点发布 |
| `propagate_revoke` | 触发式 | 撤回后分块推进 seq |
| `reconcile_counts` | 小时级 | ★ 计数器对账 + 漂移指标（§5.1） |
| `archive_inbox` | 天级 | 归档超期条目（§13） |

### 10.1 没有调度器时的降级方案

如果项目现在还没有异步任务基础设施，可以先这样跑起来：

- **发布即同步扇出**，受众上限压到 200 人（一个请求内跑完，2 秒内）
- outbox 表照建照写，但由**下一个请求顺带领取**（每个 API 请求后台起个 task 处理 1 条）
- `reconcile_counts` 做成一个手动触发的运维接口

这个降级方案的价值：**表结构和代码路径和最终形态完全一致**，等有了调度器只是把触发方式换掉，不用重写。反过来（先写同步逻辑，以后改异步）就是重构。

---

## 11. 可观测性

按阶段埋点，能定位到哪一层坏了：

| 指标 | 类型 | 作用 |
| --- | --- | --- |
| `msg_event_ingested{type,result}` | counter | `result=duplicate` 比例反映上游重复投递程度 |
| `msg_outbox_lag_seconds` | gauge | 最老 pending 行的年龄。**worker 挂了的第一信号** |
| `msg_fanout_entries{category}` | counter | 写放大。突增说明有人发了大受众 |
| `msg_delivery{channel,state}` | counter | 外部渠道成功率 |
| `msg_sync_changes` | histogram | 每次 sync 的变更数。P99 高说明客户端在积压 |
| `msg_sync_truncated` | counter | 全量重载次数，应接近 0 |
| **`msg_unread_drift`** | gauge | **§5.1 的对账差值。最重要的一个** |
| `msg_cursor_lock_wait_ms` | histogram | §4.2 的行锁等待。持续上升才考虑 §4.4 |
| `msg_push_cross_instance_miss` | counter | §7.3 的缺口有多严重，用数据决定要不要修 |

---

## 12. 需要拍板的决策

| 编号 | 问题 | 建议 | 影响 |
| --- | --- | --- | --- |
| **B1** | `sys_notice` 保留还是改造？ | **原样保留 + 扩展表**（§2 选项 C）。老接口零改动 | 高 |
| **B2** | 数据库是 PostgreSQL 还是 MySQL？版本？ | **需要你确认**。影响 `RETURNING`、`SKIP LOCKED`、`ON CONFLICT` 三处写法（MySQL 用 `ON DUPLICATE KEY UPDATE`），机制不变 | 中，落地前必须定 |
| **B3** | `seq` 用每用户计数器还是全局序列+水位线？ | **每用户计数器**（§4.2）。简单、无延迟、正确性可证 | 高，改不动 |
| **B4** | 读扩散只允许 `all`？ | **是**（§6.2）。允许 `roles`/`depts` 会引入"换部门后历史公告可见性"的死结 | 高 |
| **B5** | 写扩散上限 1000？ | 是。到 1000 已经要分 2 块跑，超了该用全员公告 | 中 |
| **B6** | 多实例推送缺口（§7.3）修不修？ | 看部署形态。**单实例先不修**，但 `msg_push_cross_instance_miss` 指标要先埋 | 中 |
| **B7** | 新表打破 RuoYi 的 `char(1)` 状态编码？ | **打破**（§3.0 约定二）。6 分类 × 4 优先级 × 4 处理态用数字编码不可读 | 低 |
| **B8** | `/sse/push`、`/websocket/push` 保留吗？ | 保留为 debug 接口 + 权限点 + 生产可关（§7.2） | 低 |
| **B9** | 处理态谁回写？ | 业务域调 `resolve_action(ref_type, ref_id, state)`。跨模块约定，要提前谈 | 高 |
| **B10** | 现在有异步任务基础设施吗？ | **需要你确认**。没有就走 §10.1 降级方案，表结构不变 | 中 |
| **B11** | `sys_msg_inbox` 现在分区吗？ | 不分。1000 用户 × 20 条/天 × 365 ≈ 730 万行/年，加上 §3.4 的索引毫无压力。预留 `HASH(user_id)` | 低 |

---

## 13. 容量与归档

`sys_msg_inbox` 是唯一无限膨胀的表。

**分区**（如果要）用 `HASH(user_id)` 而不是 `RANGE(create_time)`：所有热查询都带 `user_id`，按时间分区会让每次 sync 扫所有分区。代价是归档不能 `DETACH PARTITION`，要跑分块 DELETE。

**但建议先不分区**（B11）。等单表过 5000 万行再说，届时哈希分区可以在线做。

**归档规则**：
- 已读且 `publish_time < now() - 180 天` → 删
- **未读的不删**（删了用户会发现未读数少了）
- **`security` 分类不删**（审计要求）
- `sys_msg_event` / `sys_msg` **永不删**——它们是审计源，量级小得多

---

## 14. 附录：benai 的三个坑（本文绕开的东西）

放在附录，因为它们不是本项目的现状，只是设计时的负面教材。

### 14.1 单表模型

benai 的 `Notification` 表把 `user_id` + `title/content` + `is_read` + `target_scope` 压在一起。后果：一条公告发 1 万人 = 1 万行相同文案；撤回要 UPDATE 1 万行；改文案不可能；"这条公告已读多少"要扫 `metadata`。

本文 §3 的三表分离（event / msg / inbox）就是针对这个。

### 14.2 推送发生在事务提交之前

`notification_service.py` 里 `repository.create()` 之后立刻 `connection_manager.send_notification()`，而仓储注明"必须在 UnitOfWork 上下文中调用"——**还没 commit**。外层事务回滚时客户端已经收到一条数据库里不存在的通知，拿 id 去查会 404。现有的 try/except 只吞推送异常，不解决时序。

本文 §3.2 的 outbox + §6.3 「推送调用在事务块外」就是针对这个。这类 bug 只能**结构性**消除。

### 14.3 幂等做成了 check-then-act

`find_by_event_metadata(event_type, occurred_at, trigger_user_id, alert_id)` 配 `NotificationFanoutResult(status="skipped", existing_count=...)`——先查有没有再决定插不插。两个 worker 同时消费同一事件就会各插一条。

本文把幂等全部压到**数据库唯一索引**上：`uk_msg_event_dedupe`、`PRIMARY KEY (user_id, msg_id)`、`uk_msg_delivery`。应用层不许再做判断。

顺带一个：benai 的 `mark_as_read_batch` 是 for 循环里 `find_by_id` + `save`，标 50 条 = 100 次往返。根因是仓储接口只给了单条语义。本文 §5 的批量语句和仓储接口的批量签名（`allocate_seqs` / `mark_read(user_id, msg_ids)`）就是不给循环留机会。

---

## 15. 一句话总结

> 这套后端的全部难点集中在：**让"未读数"这个数字在多设备、断线、并发扇出、重复投递、多实例部署下始终正确**。
>
> 三条不可妥协的机械保证：
> 1. 幂等落在**唯一索引**上（`uk_msg_event_dedupe`、`PK(user_id, msg_id)`），不落在应用逻辑里；
> 2. `seq` 用**每用户计数器行**分配，行锁持有到提交，保证取号序 = 提交序 = 可见序；
> 3. 推送**永远晚于事务提交**，靠 outbox 结构性保证，不靠 try/except。
>
> 这三条定死之后，多实例推送缺口可以先欠着（§7.3），异步调度可以先降级（§10.1），分类模板渠道都能边做边改。这三条错了，症状是偶发丢消息，代价以月计。
>
> 而本项目特有的两件事：**`sys_notice` 原样不动、靠扩展表长出受众和撤回**（§2），**受众展开吃 RuoYi 的 `ancestors` 逗号链、不写递归 CTE**（§6.1）。

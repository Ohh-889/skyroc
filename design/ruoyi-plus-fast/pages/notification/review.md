# 通知模块设计自查（全文评审）

> 文档状态：评审记录。**本文是这批文档的最终权威**——凡与前文冲突，以本文为准。
>
> 评审对象：`architecture.md`、`backend.md`、`platform.md`、`infra.md`、`implementation.md`
>
> 评审方式：把设计当成要交付的实现来读，找会出 bug 的、会让两个人写出不同东西的、以及能砍掉的。

## 阅读顺序（新读者从这里开始）

```
要实现后端 → 0 → 1 → 2；要对接前端 → 直接看 frontend-guide.md

0. review.md          ← 本文。权威结论 + 前文哪些作废
1. schema.md          最终建表方案（DDL 唯一来源）
2. implementation.md  落地：taskiq / 进程模型 / 雪花 / 公告修订
3. frontend-guide.md  ★ 前端对接：真实的 25 个接口 + 5 条反直觉纪律
4. platform.md        目标形态：三轴、管线、疲劳控制、可解释性
5. infra.md           基础设施：为什么表当队列、Python 生态选型
6. architecture.md    前端分层（决策 D1 已修正）
7. plan.md            PRD。产品部分有效；§6.2/7.3/7.4/10/11 五节已标注作废
8. backend.md         早期稿，已被 platform + implementation 取代。§7.3 结论错误
```

**后端已实现**：`skroc-fast/app/modules/notification/` + `app/core/taskqueue/`，
迁移 `a1c9d4e77b02`，25 个接口，2078 个测试通过，已在真实 MySQL 9.6 + Redis 8.8 上跑通全链路。

---

# A. 会导致 bug（必改）

## A1 ★ `uk_delivery` 少了 `revision`，修订后重发会被静默拦掉

`platform.md` §14 / `backend.md` §3.7：

```sql
CONSTRAINT uk_delivery UNIQUE (msg_id, user_id, channel)
```

`implementation.md` §5.2 又要求"重新提醒"模式**重新走渠道**（重发邮件/推送）。

**冲突**：公告改期后勾选"重新提醒"，插 delivery 行时撞唯一键 → `ON DUPLICATE KEY` 空操作 → **邮件不会发第二次，而且没有任何报错**。发布者以为通知到了，实际上只有站内变了。

**修正**：

```sql
CONSTRAINT uk_msg_delivery UNIQUE (msg_id, user_id, channel, revision)
```

同时 `sys_msg_delivery` 加 `revision int NOT NULL DEFAULT 1`。幂等性质不变（同一 revision 重投仍然只发一次），但换了 revision 就是一次新投递。

## A2 ★ 收件箱写入与疲劳控制的顺序有歧义，两个人会写出两种东西

`platform.md` §4 管线是 ⑤ 收件箱写入 → ⑥ 疲劳控制。但 §18.1 的 trace 示例里写着：

```
├─ shape  ok  12 collapsed into 4 (key=doc:42)
```

"12 合成 4"——**合成的是收件箱行还是投递？** 按管线顺序，收件箱行已经写完了，不可能再合成。

**这个歧义必须消掉，否则一个人会实现成"收件箱里一条合并行"，另一个人实现成"12 条独立行 + 1 条合并推送"。**

**定为规则（新增不变式 I6）**：

> **收件箱永远是"一个事件一行"，collapse / digest / throttle 只作用于外发渠道和提醒决策，绝不改收件箱行。**

理由三条：

1. **收件箱是记录，合并会丢信息。** 用户点进去要能看到"到底是哪 12 条评论"
2. **已读粒度必须是单条。** 合并成一行之后，"我读了其中 3 条"无法表达
3. **它让管线顺序自洽**：⑤ 无条件写入，⑥ 只做减法（少发几条外发），不回头改 ⑤ 的产物

**代价与配套**：一篇热门文档会产生 50 条收件箱行，列表看着刷屏。解法是**客户端按 `collapse_key` 分组**，所以 `collapse_key` 必须存到收件箱行上：

```sql
-- sys_msg_inbox 新增
collapse_key varchar(200) NULL COMMENT '客户端按它分组展示；NULL 表示不分组',
KEY idx_inbox_collapse (user_id, collapse_key, entry_seq)
```

这也是 GitHub 的做法——通知列表按 thread 分组，但每条 thread 里的事件是独立记录的。

## A3 ★ `state='sent'` 的任务丢了没人管

`implementation.md` §2.5 定义了 `pending|sent|done|cancelled|dead`，但 §3 只写了对 outbox `running` 的卡死回收。

**漏洞**：relay 把任务 `kiq` 出去标成 `sent`，taskiq worker 在执行前崩了（OOM、被 kill）。Redis Stream 的消费组会重投给别的 worker——**但如果那条 Stream 消息本身没了**（Redis 重启且未持久化、或 Stream 被 trim），任务就永久卡在 `sent`。

**修正**：`sent` 也要有超时回收，且必须要求任务执行完回写 `done`。

```sql
-- 回收扫描（和 outbox 的回收同一个任务里做）
UPDATE sys_msg_task
   SET state='pending', locked_by=NULL, locked_at=NULL, last_error='sent 超时未完成，重新排队'
 WHERE state='sent' AND locked_at < now(3) - INTERVAL 10 MINUTE;
```

超时阈值要**大于最长任务的执行时间**（大受众扇出可能几分钟），否则正在跑的任务会被重复投递。建议 10 分钟，并按 `kind` 分别配置。

配套：任务成功执行完必须 `UPDATE ... SET state='done'`。这一步不能省——省了就分不清"还在跑"和"跑完了"。

## A4 ★ 只读副本上算出的 cursor 会让客户端跳过消息

`platform.md` §21 我提到了这个陷阱，但给的解法（"返回 `min(副本可见最大 seq, 请求时刻 cursor)`"）是含糊的，实现不出来。

**正确的解法很简单**：

> **`cursor` 只能来自本次返回行的最大 `change_seq`，绝不单独查一次"最新 seq"。**

```python
changes = await fetch_changes(user_id, since=since, limit=200)
next_cursor = max((c.change_seq for c in changes), default=since)   # ← 空结果时原地不动
```

为什么这样就安全：客户端的 cursor 永远只推进到**它实际收到过的**那一行，副本再落后也不会跳过中间的行。副本追上之后下次 sync 自然拿到。

反例（我原来的写法）：单独 `SELECT MAX(change_seq)` 拿到 1045，但因为副本延迟只返回到 1040 的行，客户端 cursor 变成 1045 → **1041~1045 永久丢失**。这就是 §13.2 那个坑换了个地方重现。

`unread_count` 从同一次查询/同一副本读，和返回的行自洽；短暂偏旧，下次 sync 收敛。可接受。

## A5 策略过滤可能让消息没有收件箱行，`I3` 就破了

`platform.md` 管线 ④ 策略过滤在 ⑤ 收件箱写入**之前**。如果策略把 `inapp` 也过滤掉了，这条消息就只有邮件、没有收件箱行——那"已读"没地方存，`I3`（站内是唯一真相）直接破产。

**定为规则**：

> **`inapp` 永远无条件写入，不参与策略过滤。** ④ 只决定**外发渠道**（push/email/sms/webhook），⑤ 无条件执行。

配套澄清（§3.1 举例要改）：我用"验证码"当 `transactional` 的例子是错的——验证码不该进通知中心。而且本项目已有独立模块 `app/modules/smscode` / `emailcode`，**验证码根本不走通知平台**。

`transactional` 的正确例子是"支付成功"、"密码已修改"、"账号在新设备登录"——这些**确实应该**留在通知中心里可查。所以规则无例外。

## A6 未读数与过期的关系没定

`platform.md` §7.2 说 `expires_at` 在查询时判断，但 `idx_inbox_unread` 这个索引里没有 `expire_time`，而 `unread_count` 是计数器维护的。

**结果**：过期的通知仍然算在未读数里，而列表里可能已经不显示了 → 徽标显示 5，点进去只有 3 条。

**定为规则**：

> **过期不影响未读数。** 过期的通知仍然是"没看过"，徽标该算它。`expire_time` 只影响两件事：全员公告的可见性（读扩散的 feed 谓词）、`actionable` 的处理态展示（过期待办不显示"去处理"按钮）。

理由：未读数是"你有多少没看的东西"，和内容还有没有时效性是两个问题。而且让计数器去追过期时间意味着要跑定时任务改计数——那是 §7.2 明确要避免的。

---

# B. 会让两个人写出不同东西（必须定）

## B1 ★ `entry_seq` / `change_seq` 只在 implementation.md 里存在，其余文档还是单个 `seq`

`implementation.md` §4.3 拆成两列（插入序 + 变更序），但 `platform.md` §13/§14 和 `backend.md` 全文还是 `seq` 一列，`uk_inbox_seq (user_id, seq)`。

**这是最容易照着旧文档写错的一处**，因为单列 seq 看起来完全合理，错误只在"点已读之后消息跳到列表顶部"时才暴露。

**权威定义**（覆盖所有前文的 `seq`）：

```sql
entry_seq  bigint NOT NULL COMMENT '插入序，永不变。列表排序 + 游标分页',
change_seq bigint NOT NULL COMMENT '变更序，任何变更都推进。增量同步',

UNIQUE KEY uk_inbox_change (user_id, change_seq),
KEY idx_inbox_feed (user_id, entry_seq),
```

| 操作                                           | `entry_seq` | `change_seq`   |
| ---------------------------------------------- | ----------- | -------------- |
| 插入                                           | `next()`    | 同 `entry_seq` |
| 已读 / 取消已读 / 处理态变化 / 修订传播 / 撤回 | **不变**    | `next()`       |

两列共用 `sys_msg_cursor.next_seq` 一个计数器。§13.2 的行锁论证针对的是**这个计数器**，不受拆列影响。

前文出现的裸 `seq`：sync 语境读作 `change_seq`，列表/分页语境读作 `entry_seq`。

## B2 ★ 列表排序：优先级不参与

现有包 `notification-store.ts` 的 `compareNotifications` 是"先按优先级，再按时间"。这和游标分页**不兼容**——`entry_seq` 游标假设顺序稳定，而按优先级排会让"加载更多"错位、重复、漏项。

**定为规则**：

> **列表严格按 `entry_seq DESC` 排序。优先级只影响视觉强调（色条、图标、置顶徽记），不影响位置。**

例外：面板顶部可以单独开一个"紧急"区块（独立查询 `priority='urgent' AND read_time IS NULL`，最多 3 条），和主列表分开。这样既突出了紧急项，又不破坏主列表的分页稳定性。

## B3 徽标数：两个数都要存，徽标显示会话数

A2 定了"收件箱一事件一行 + 客户端按 `collapse_key` 分组"。那徽标显示 **14 条未读** 还是 **3 个未读会话**？

场景：开会两小时，一篇文档被评论 12 次 + 2 条无关通知。

|        | 徽标   | 面板里看到 |
| ------ | ------ | ---------- |
| 行数   | **14** | 3 个分组   |
| 会话数 | **3**  | 3 个分组   |

行数方案最实际的问题不是观感，是**徽标和眼睛看到的对不上**——面板只有 3 行，用户会找那 11 条去哪了。

**结论：两个数都存，徽标显示会话数。**

```sql
unread_count        int NOT NULL DEFAULT 0 COMMENT '未读行数，O(1) 维护',
unread_thread_count int NOT NULL DEFAULT 0 COMMENT '未读会话数，徽标用',
```

维护规则（成本比想象的低，这是关键）：

| 操作                             | 行数 | 会话数                          |
| -------------------------------- | ---- | ------------------------------- |
| 插入，`collapse_key IS NULL`     | +1   | +1（**无需额外查询**）          |
| 插入，`collapse_key = K`         | +1   | 查 K 是否已有未读行 → 没有才 +1 |
| 标记已读，`collapse_key IS NULL` | −1   | −1                              |
| 标记已读，`collapse_key = K`     | −1   | 查 K 是否还有未读 → 没有才 −1   |
| 全部已读                         | 归零 | 归零                            |

> **只有 `collapse_key` 非空才需要额外查询。** 而绝大多数通知（审批待办、导入完成、安全告警）`collapse_key` 都是 NULL——那时两个数相等，走原来的 O(1) 路径。只有协作类通知付这个成本，而那恰好是唯一会分歧的场景。
>
> 额外查询走 `idx_inbox_collapse (user_id, collapse_key, entry_seq)`，加个 `read_time` 前缀条件即可。

参照系：**Gmail 的未读数是会话数不是邮件数**（12 封回复算 1 条未读），GitHub 数 thread。通知中心是 inbox 隐喻，跟它们对齐更符合直觉。

分组头上显示行数（"Q4方案V2 · 12 条"），两个数各就各位。

## B4 受众解析在扇出过程中变化

大受众扇出跨越几分钟。期间某个用户被停用/离职。

- 已经写入的块：行已存在
- 后续的块：解析器带 `status='0' AND del_flag='0'`，自然排除

**结果是"一半收到一半没收到"。** 这是可接受的，但要写明，否则会被当成 bug 查。

**定为规则**：受众在**每个块解析时**求值，不做发布时快照。理由：快照要么存 N 行（等于提前扇出），要么在长扇出中变得过时。而"停用用户收到了通知"本身无害——他登录不了。

## B5 `sys_msg_task` 的 `dedupe_key` 唯一约束和历史留存冲突

`UNIQUE (dedupe_key)` + `ON DUPLICATE KEY UPDATE` 让改期/重排是幂等的（这是对的，见 §2.5）。但副作用：**同一个 key 永远只有一行，历史被覆盖**。

对 `digest:scan`、`reconcile:unread` 这种周期任务，覆盖正是想要的。对 `retry_delivery:{id}` 也没问题。

但对 `publish:notice:{id}`，"这条公告被改期过 3 次"这个事实会丢。

**定为规则**：任务表不承担审计。改期审计走 `sys_msg_revision` 或操作日志（项目已有 `sys_oper_log`）。任务表只回答"接下来要干什么"。

配套：`retry_delivery:*` 这类一次性 key 的行会累积，需要清理——`state IN ('done','cancelled') AND create_time < now() - 30 天` 定期删。这条我之前漏了。

---

# C. 可以砍掉 / 简化

## C1 ★ 删掉 `aggregation_window` 和 `digest_bucket` 两张表

`platform.md` §10.1 定义了 `aggregation_window`（折叠窗口），§14 还列了 `digest_bucket`（摘要待发内容）。

**有了 A2 的规则（收件箱无条件写入）之后，这两张表都不需要了**——它们要存的数据已经在收件箱里了：

```sql
-- 折叠时要发什么：直接查收件箱，不需要 aggregation_window
SELECT msg_id, category FROM sys_msg_inbox
 WHERE user_id = ? AND collapse_key = ? AND entry_seq > :window_start_seq;

-- 摘要要发什么：同理
SELECT ... FROM sys_msg_inbox
 WHERE user_id = ? AND read_time IS NULL AND entry_seq > :last_digest_seq
   AND category IN (...);
```

唯一还需要的是**"什么时候冲刷"**——那就是 `sys_msg_task` 里一行：

```
dedupe_key = "flush_collapse:{user_id}:{collapse_key}"
fire_at    = 第一条到达时间 + window
```

`ON DUPLICATE KEY UPDATE` 天然实现了两种窗口语义：

- **固定窗口**：`INSERT ... ON DUPLICATE KEY UPDATE fire_at = fire_at`（不动，保持第一条的截止时间）
- **滑动窗口**：`ON DUPLICATE KEY UPDATE fire_at = LEAST(:newFireAt, open_time + max_window)`

**收益**：少两张表、少两处"和收件箱不一致"的可能、少两处清理逻辑。摘要水位存在 `sys_msg_cursor` 上加一列 `last_digest_seq` 就够。

## C2 删掉 `message_audience_snapshot`

`platform.md` §14 列了它（"发布时的受众快照，撤回和统计用"）。

不需要：

- **写扩散**：`sys_msg_inbox` 的行**就是**受众快照，比另存一份更准
- **读扩散（全员）**：受众是"所有人"，没什么可快照的
- **统计**：`COUNT(*) FROM sys_msg_inbox WHERE msg_id=?` 就是送达数

## C3 ★ trace 不要存 per-recipient 决策，`why` 用重放

`platform.md` §18.1 的 trace 示例里，`policy` 阶段列了每个收件人的渠道裁剪决策。一条 5000 人的公告 = 5000 行决策。**trace 会变成全库最大的表**，比消息本身大一个量级。

**修正**：

| 存什么                  | 怎么存                                                                   |
| ----------------------- | ------------------------------------------------------------------------ |
| 每阶段的**聚合**结果    | 一行/阶段：`resolve: 47 人（direct=2, watching=44, author=1）, 排除 4`   |
| 用到的**版本号**        | `rule@3`, `template@5`, `event@2` ← 这个最重要，出问题要知道当时用的哪版 |
| **样本**                | 前 3 个收件人的完整决策路径，够看出规律                                  |
| 完整 per-recipient 决策 | **不存。查询时重放**                                                     |

`GET /admin/why?user=&msg=` 改成**重放**：拿这条消息和这个用户，重新跑一遍策略栈（纯函数，不写库），输出完整决策路径。

前提是策略栈必须是 `(用户偏好, 规则, 消息) → 渠道集` 的**纯函数**——它本来就是，这个约束顺便还保证了它可测试。

**诚实的限制**：重放用的是**当前**偏好。如果用户中间改过设置，重放结果和当时不同。所以响应里要标明「基于当前偏好」。真要追溯当时状态，得给 `sys_msg_preference` 加变更历史——那是独立需求，不为 trace 而做。

## C4 雪花 worker_id 的租约循环加个随机起点

`implementation.md` §4.1 是从 0 试到 1023。多个进程同时启动会都从 0 开始抢，前几个位打架。

```python
start = secrets.randbelow(1 << WORKER_ID_BITS)
for i in range(1 << WORKER_ID_BITS):
    candidate = (start + i) % (1 << WORKER_ID_BITS)
    ...
```

小事，但同时拉起 6 个进程时能少几十次无效往返。

---

# D. 文档一致性

## D1 `platform.md` §9.0 和 §22.4 直接冲突

§9.0：「文案该在数据库」。§22.4：「文件做基线，库做覆盖层」。§22.4 标了"修正 §9.0"，但 §9.0 本身读起来仍然像结论。

**权威结论**（覆盖 §9.0）：

```
文件（git，JSON，按 locale 分目录）  = 基线，走翻译流程，必须完整
数据库                              = 覆盖层，运营临时改，可以为空
渲染：库里有覆盖 → 用覆盖；否则 → 用文件基线
```

顺序不能反：文件是基线、库是覆盖。反过来会让"新增一种语言"变成数据库迁移。

## D2 `backend.md` 整体降级为历史稿

它是在"以为后端是 benai 那套"和"以为多实例推送有缺口"两个错误前提下写的。核心机制（三表、seq、outbox）已经被 `platform.md` + `implementation.md` 完整覆盖且更准。

**建议在文件头加一行"已被取代"**，避免有人照着它的 Postgres DDL 和 `sys_notice` 扩展表方案去实现。§2（和 `sys_notice` 的关系）那节仍然有价值——但既然"不考虑兼容、可以重写"，那节的前提也不成立了。

## D3 `architecture.md`（前端）—— ✅ 已改完

四处已修正：

1. `InboxEntry.seq` 单列 → 拆成 `entrySeq` / `changeSeq`，并注明"别当 string 比较"
2. sync 契约 → 两个游标（`inbox` + `bcast`）、`counts` 含 `unreadThreads`、`op: 'patch'` 不改位置、**`inboxCursor` 只能来自返回行的最大 `changeSeq`**（A4）
3. 决策 D1「只连一条」→ 标注问题问错，改为两种传输都是一等公民
4. 新增 §11.1「列表排序：优先级不参与」+ 紧急区块的 UI 形态

`InboxEntry` 同时补了 `collapseKey`（A2 的客户端分组要用）。

## D4 `start_realtime(subscribe=False)` —— ✅ 已实现

`skroc-fast/app/infra/realtime/runtime.py` 加了 `subscribe` 关键字参数，默认 `True`（现有行为不变）：

- `subscribe=True` → 建 broker + 订阅频道（API 进程）
- `subscribe=False` → 只建 broker，跳过 `broker.start()`（taskiq worker）

实现只有一处判断——`publish()` 只用 redis 客户端，不碰 `_pubsub`/`_listener`，所以发布专用模式下 broker 从不 `start`。`close_realtime()` 对没起过的 listener/pubsub 是空操作，不用改。

日志加了 `模式=收发|仅发布`：发布专用的进程收不到消息是正常的，日志里要能和"订阅挂了"区分。

配套两个测试（`tests/infra/realtime/test_runtime.py`）：

- `test_publish_only_mode_forwards_without_consuming` —— 两个断言各盯一个故障方向：转发通道没建起来（worker 推送静默不到达）、订阅了（收下别人的投递指令然后全部命中 0 条）
- `test_close_is_safe_for_a_broker_that_never_subscribed`

`uv run pytest tests/infra/realtime -q` → 40 passed；ruff check + format 通过。

---

# E. 汇总：最终表清单

砍掉 3 张（`aggregation_window`、`digest_bucket`、`message_audience_snapshot`），改动 3 处约束：

```
sys_msg_event         uk(tenant_id, dedupe_key)
sys_msg_outbox        idx(state, next_retry_at)
sys_msg_task          uk(dedupe_key) · idx(state, fire_at)          ← 兼做延迟队列/折叠窗口/摘要触发
sys_msg               内容 + 受众 + revision
sys_msg_revision      uk(msg_id, revision)
sys_msg_inbox         pk(user_id, msg_id)
                      uk(user_id, change_seq)         ← B1
                      idx(user_id, entry_seq)         ← B1
                      idx(user_id, collapse_key, entry_seq)  ← A2
sys_msg_cursor        pk(user_id) · next_seq · unread_count · pending_count
                      · bcast_read_seq · last_digest_seq       ← C1
sys_msg_bcast_state   pk(user_id, msg_id)
sys_msg_delivery      uk(msg_id, user_id, channel, revision)  ← A1
sys_msg_subscription  pk(user_id, target_type, target_id)
sys_msg_preference
sys_msg_device
sys_msg_trace         聚合 + 版本号 + 样本，不存 per-recipient   ← C3
```

# F. 新增/修正的不变式

原有 I1~I5 不变，新增两条：

| #      | 不变式                                                                                          |
| ------ | ----------------------------------------------------------------------------------------------- |
| **I6** | **收件箱是"一事件一行"。collapse / digest / throttle 只作用于外发渠道，绝不改收件箱行。**（A2） |
| **I7** | **`inapp` 无条件写入，不参与策略过滤。** 策略只决定外发渠道。（A5）                             |

修正 I4 的表述：

> ~~每用户的变更序号单调~~ → **每用户有两个序号：`entry_seq`（插入序，不变）和 `change_seq`（变更序，任何变更都推进）。两者共用同一个每用户计数器，该计数器的取号序 = 提交序 = 可见序。**

# H. 后端集成问题（读了 skroc-fast 的 db 层之后新发现的）

前面的评审是设计内部自查。这一轮是把设计对着 `app/infra/db/` 的实际行为核对，发现的问题更具体。

## H1 ★★ 批量插入绕过租户自动填充，会静默落到默认租户

`app/infra/db/scoping.py` 的模块文档明确写了：

> **不覆盖两种写法**：`text()` 原生 SQL，和 Core 的 `insert()`（既不填租户也不拦）

因为 `_fill_tenant_id` / `_fill_audit_columns` 都挂在 `before_flush`，只作用于 `session.new` / `session.dirty`——**ORM 单元工作**。

而扇出必然用 Core `insert()` + executemany（500 行一批，逐个 `session.add` 太慢）。于是：

```python
# ❌ tenant_id 不会被自动填
await session.execute(insert(MsgInbox), [{"user_id": ..., "msg_id": ...}, ...])
```

`TenantScoped.tenant_id` 有 `server_default=DEFAULT_TENANT_ID`（`'000000'`），所以**不会报错，会静默落到默认租户**。多租户部署下的后果：

1. 所有 inbox 行 `tenant_id='000000'`
2. 用户查询时被自动租户条件过滤掉
3. **用户一条通知都看不到，而且全链路没有任何报错**

比 NOT NULL 违约糟糕得多——那个至少会炸。

**修正**：批量插入**必须显式传 `tenant_id`**，取自 `sys_msg.tenant_id`（不是取自当前上下文——worker 里没有上下文）。

```python
rows = [
    {"user_id": uid, "msg_id": msg.id, "tenant_id": msg.tenant_id,   # ← 必须显式
     "entry_seq": seq, "change_seq": seq, "category": msg.category, ...}
    for uid, seq in seqs.items()
]
```

并且加一条测试：**多租户下扇出后，抽查 inbox 行的 `tenant_id` 必须等于消息的 `tenant_id`**。这条不写，上线前发现不了。

## H2 ★★ `LAST_INSERT_ID` 在 0 行更新时静默返回旧值

`implementation.md` §4.2 和 `infra.md` §5 推荐的 MySQL 取号写法：

```sql
UPDATE sys_msg_cursor SET next_seq = LAST_INSERT_ID(next_seq + 1) WHERE user_id = ?;
SELECT LAST_INSERT_ID();
```

**漏洞**：如果游标行不存在（新用户第一次收到通知），`UPDATE` 匹配 0 行，而 `SELECT LAST_INSERT_ID()` 返回的是**本连接上一次的值**——不报错，不是 0，是别人的 seq。

后果：给新用户分配了一个错误的起点，而 `uq(user_id, change_seq)` 检测不出来（该用户还没有任何行）。之后该用户的 seq 序列从错误位置开始，客户端对账全乱。

而且原生 SQL **不会被自动补租户条件**（scoping 只管 ORM），所以也没有第二道防线。

**修正：放弃 `LAST_INSERT_ID`，用显式两步。** 笨一点，但没有隐式会话状态：

```python
async def allocate_seqs(session, user_ids: list[int], tenant_id: str) -> dict[int, int]:
    """批量取号。user_ids 必须已排序（统一加锁顺序，见 platform.md §13.2）。"""
    ordered = sorted(set(user_ids))

    # 1. 确保游标行存在。新用户第一次收到通知时才会真的插入
    await session.execute(
        text("""INSERT INTO sys_msg_cursor (user_id, tenant_id, next_seq, update_time)
                VALUES (:uid, :tid, 1, now(3))
                ON DUPLICATE KEY UPDATE user_id = user_id"""),  # 空操作
        [{"uid": uid, "tid": tenant_id} for uid in ordered],
    )

    # 2. 加锁读当前值。行锁持有到提交 —— 这一步就是正确性论证的落点
    rows = (await session.execute(
        text("SELECT user_id, next_seq FROM sys_msg_cursor "
             "WHERE user_id IN :uids ORDER BY user_id FOR UPDATE"),
        {"uids": tuple(ordered)},
    )).all()

    # 3. 断言。缺行说明第 1 步没生效，宁可炸也不能分配错的号
    if len(rows) != len(ordered):
        raise RuntimeError(f"游标行缺失：期望 {len(ordered)} 行，实到 {len(rows)} 行")

    seqs = {uid: seq for uid, seq in rows}

    # 4. 推进
    await session.execute(
        text("UPDATE sys_msg_cursor SET next_seq = next_seq + 1, "
             "unread_count = unread_count + 1, update_time = now(3) "
             "WHERE user_id IN :uids"),
        {"uids": tuple(ordered)},
    )
    return seqs
```

行锁语义不变（`SELECT ... FOR UPDATE` 的锁同样持有到提交），所以 §13.2 的"取号序 = 提交序 = 可见序"论证完全成立。代价是多一次往返，换掉一个静默失败模式——值得。

## H3 ★★ 缺 `(msg_id)` 索引，撤回和修订会全表扫

`sys_msg_inbox` 的 PK 是 `(user_id, msg_id)`，所有索引都以 `user_id` 开头。

但有三个高频操作是**按 `msg_id` 找收件人**：

| 操作             | 查询                                      |
| ---------------- | ----------------------------------------- |
| 修订传播（§5.3） | 找出这条消息的所有收件人推进 `change_seq` |
| 撤回传播（§5.4） | 同上                                      |
| 送达/已读统计    | `COUNT(*) WHERE msg_id = ?`               |

PK 最左是 `user_id`，这三个查询**用不上任何索引**。7300 万行全表扫，每次撤回都发生。

**修正**：

```sql
KEY idx_inbox_msg (msg_id, user_id)   -- 带 user_id 是为了传播时能按序加锁（§4.3 死锁对策）
```

## H4 表基类选择：大表不该继承 `TenantBase`

`app/infra/db/base.py` 有三个基类，`TenantBase = TenantScoped + AuditMixin + Base`，审计列有 5 个：`create_by` / `create_dept` / `update_by` / `create_time` / `update_time`。

`sys_msg_inbox` 是系统写入的，没有操作人。按 `identity.py` 的说法"没有操作者时这几列留空"——那就是 **5 列全空 × 7300 万行**，纯浪费。

`base.py` 说三个基类是"按带哪些公共列分"，`TenantScoped + Base` 是合法的第四种组合（`TenantBase` 本身就是这么拼的）。

| 表                                               | 基类                          | 理由                       |
| ------------------------------------------------ | ----------------------------- | -------------------------- |
| `sys_msg_event` / `sys_msg` / `sys_msg_revision` | `TenantBase`                  | 要审计：谁发的、谁改的     |
| `sys_msg_task`                                   | `TenantScoped + Base`         | 系统表，无操作人           |
| `sys_msg_delivery`                               | `TenantScoped + Base`         | 同上                       |
| **`sys_msg_inbox`**                              | **`Base`（不带租户，见 H5）** | 量最大，5 个空审计列不能要 |
| **`sys_msg_cursor`**                             | **`Base`**                    | 同上                       |
| **`sys_msg_bcast_state`**                        | **`Base`**                    | 同上                       |

## H5 `TenantScoped` 要求 `tenant_id` 是索引最左列，我的 inbox 索引全违反

`app/infra/db/tenant.py`：

> 每张表都要自己保证 tenant_id 是某个索引的最左列，漏了就是全表扫描，**测试里有一条守着**

我给 `sys_msg_inbox` 设计的索引全部以 `user_id` 开头，没有一个以 `tenant_id` 开头 → **会被那条测试直接抓住**。

两个选项：

|         | 做法                                                                            | 评价                                                    |
| ------- | ------------------------------------------------------------------------------- | ------------------------------------------------------- |
| (a)     | 加一个 `(tenant_id, ...)` 索引                                                  | 没有任何查询会以 `tenant_id` 打头，纯为过测试而加，浪费 |
| **(b)** | **`sys_msg_inbox` / `sys_msg_cursor` / `sys_msg_bcast_state` 不带 `tenant_id`** | 推荐                                                    |

选 (b) 的理由：这三张表的每一次访问都**必然带 `user_id`**，而 `user_id` 全局唯一。租户过滤在这里提供不了额外保护，只是多一列 + 一个用不上的索引。

**代价是失去了自动过滤这道保险，所以必须换一条规则**：

> **收件箱相关接口的 `user_id` 永远取自 `current_user.id`，绝不接受客户端传入。** 没有任何一个接口签名里可以出现 `user_id` 参数。

这条要在 code review 里当红线看——它是 (b) 方案唯一的防线。管理端要看别人的收件箱？没有这个功能；要统计就按 `msg_id` 聚合（H3 的索引），不按用户查。

## H6 `notify.emit()` 必须显式传 session，且不能自己 commit

`app/infra/db/session.py` 的约定：

> **这里不 commit。** 事务边界属于用例，由它自己调 `await session.commit()`
> 代价是用例忘了 commit 时数据会被静默丢掉（退出时回滚，不报错）

而且项目没有 session 的 ContextVar（不像 tenant / operator 那样）——session 走 FastAPI 依赖注入。

所以摄入接口必须是：

```python
async def emit(session: AsyncSession, event: DomainEvent, *, dedupe_key: str) -> int | None:
    """写入事件 + 到期任务两行，返回 event_id；重复投递返回 None。

    **不 commit。** 事务边界属于调用方的用例（app/infra/db/session.py 的约定）。
    调用方忘了 commit 的后果是通知静默不发 —— 所以业务用例的测试必须断言事件真的落库了。
    """
```

配套的 `after_commit` 钩子（`infra.md` §6.7）由 `emit` 设标记：

```python
session.info["notify_dirty"] = True
```

## H7 `skip_tenant_filter=True` 是现成的跨租户豁免（好消息）

对账任务要扫所有租户的游标行。`scoping.py` 已经提供了口子：

```python
stmt.execution_options(skip_tenant_filter=True)
```

不用自己设计，也**不要**为此卸掉监听器（模块文档明确警告了）。

## H8 合并 `sys_msg_outbox` 和 `sys_msg_task`

两张表干的是同一件事：一行待办 + `fire_at` + 重试状态 + 抢占领取 + 卡死回收。outbox 就是 `fire_at = now()` 且 `kind = 'ingest_event'` 的 task。

合并后省掉：一张表、一套基类选择、一个 claim 查询、一个回收扫描、一份索引。

唯一顾虑：ingest 行量大且短命，会不会拖累 `idx(state, fire_at)` 的扫描？不会——`state` 是索引最左列，`done` 的行被前缀直接排除。配合 H9 的清理即可。

**建议合并，只保留 `sys_msg_task`。**

## H9 `sys_msg_task` 需要清理，且 `payload` 只放引用

两条之前漏了：

1. **清理**：`retry_delivery:*`、`ingest_event:*` 这类一次性 key 的行会持续累积。加一个周期任务：`DELETE WHERE state IN ('done','cancelled') AND create_time < now() - INTERVAL 30 DAY`，分块删。
2. **`payload` 只放引用**（`msg_id` / `delivery_id` / `user_id`），**不放渲染后的内容，不放收件人列表**。大受众的收件人列表会把 json 列撑爆，而且它本来就该从受众定义重新解析（B4：受众在每个块解析时求值）。

## H10 事件摄入的鉴权（platform.md §6.3 漏了）

`POST /platform/events` 如果暴露成 HTTP 接口，任何拿到 token 的人都能伪造任意通知——包括伪造"安全告警"。

**分三种来源，鉴权完全不同**：

| 来源         | 方式                                         | 鉴权                                                         |
| ------------ | -------------------------------------------- | ------------------------------------------------------------ |
| 内部业务模块 | **直接函数调用** `notify.emit(session, ...)` | 无需鉴权（同进程、同事务）                                   |
| 内部异步任务 | 同上                                         | 同上                                                         |
| 外部系统     | HTTP `POST /platform/events`                 | 签名 + 白名单 `event_type`，且**不允许提交 `security` 分类** |

关键：**内部调用不走 HTTP。** 走 HTTP 就得鉴权，而任何鉴权都能被伪造成"内部调用"。

## H11 Markdown 净化在写入时做，不在渲染时

`sys_msg.body` 支持受限 Markdown。净化必须在**写入时做一次并存净化后的结果**，不能在渲染时做。

理由：渲染发生在多处（站内 / 邮件 / 推送 / 摘要 / 折叠模板），任何一处漏了就是 XSS。写入时净化一次，之后所有渲染路径读到的都已经是安全的。

代价是净化规则变严时旧数据不会自动重新净化——可接受，比多处漏网好。

## H12 索引命名要跟 `NAMING_CONVENTION`

`app/infra/db/base.py` 定了约定：

```python
"uq": "uq_%(table_name)s_%(column_0_name)s",
"ix": "ix_%(column_0_label)s",
"pk": "pk_%(table_name)s",
```

我前文写的 `uk_msg_inbox_change`、`uk_msg_event_dedupe` 都不符合（前缀是 `uk_` 不是 `uq_`）。

`UniqueConstraint` 不给名字时按约定自动生成；`Index` 可以像 `sys_notice` 那样显式命名（它用了 `ix_sys_notice_tenant_id_notice_id`）。**多列唯一约束建议显式命名**，因为约定只取 `column_0_name`，多列约束会撞名。

---

# G. 三个决策（已定）

| #      | 问题                      | 结论                                                                                                                     |
| ------ | ------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **V1** | 徽标数 = 行数还是会话数？ | **两个都存，徽标显示会话数。** 详见改后的 B3——成本比我最初判断的低，因为 `collapse_key IS NULL` 时两数相等、无需额外查询 |
| **V2** | 折叠窗口固定还是滑动？    | **默认固定，规则里可选滑动。** 判据见 §G.1                                                                               |
| **V3** | `backend.md` 作废还是删？ | **标注作废保留**，已加文件头警示。它记录了两次判断失误（抄 benai 骨架、凭前端类型名推断后端架构）                        |

## G.1 固定窗口 vs 滑动窗口

窗口 5 分钟，评论在 0:00 / 0:03 / 0:06 / 0:09 到达：

```
固定窗口（从第一条起算，到点就发）
0:00 ●─────────────┐ flush_at=0:05
0:03 ●             │ 不变
0:05               ▼ 发「2 条评论」
0:06 ●─────────────┐ 新窗口 flush_at=0:11
0:09 ●             │
0:11               ▼ 发「2 条评论」
     → 30 分钟讨论提醒 6 次，但每次都及时

滑动窗口（每来一条往后推，安静满 5 分钟才发）
0:00 ●  flush_at=0:05
0:03 ●  flush_at→0:08
0:06 ●  flush_at→0:11
0:09 ●  flush_at→0:14
0:30               ▼ max_window 兜底，发「12 条评论」
     → 整场只提醒 1 次，但可能等 30 分钟
```

|          | 固定                                                | 滑动                                                                      |
| -------- | --------------------------------------------------- | ------------------------------------------------------------------------- |
| 延迟上界 | window，**可预测**                                  | max_window                                                                |
| 提醒次数 | 活跃讨论连续多次                                    | 整场 1 次                                                                 |
| 额外参数 | 无                                                  | **必须有 max_window 兜底**，否则持续讨论永不通知                          |
| SQL      | `ON DUPLICATE KEY UPDATE fire_at = fire_at`（不动） | `fire_at = LEAST(:now+window, open_time+max_window)`，需要 `open_time` 列 |

**选择判据：**

> **这一波事件结束前的中间状态，用户看了有用吗？**
>
> - **有用 → 固定。** 评论、审批意见、讨论——你可能想中途参与，等结束就晚了
> - **没用 → 滑动。** 批量导入进度、多步部署、CI 连续失败、同事连改 20 处配置——只关心最终结果

**默认固定**：延迟可预测、出问题好解释、无额外参数。而 max_window 调不好就是"要么等太久，要么形同虚设"。

滑动需要 `sys_msg_task` 加一列 `open_time datetime(3)`（窗口开启时刻），只有滑动用得上。

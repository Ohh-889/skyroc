# 通知模块架构提案（从零设计）

> 文档状态：提案，供讨论
>
> 与 `plan.md` 的关系：`plan.md` 回答"通知中心要有什么功能"，本文回答"这套东西该怎么切、数据长什么样、哪一层负责什么"。两份文档冲突的地方，以本文的模型为准重写 PRD 的第 10、11 章。
>
> 参考实现：`benai-backend/domains/notification`、`api/v1/endpoints/messaging/notifications.py`、`packages/web/admin-notification`、`apps/ruoyi-plus-fast/src/features/{realtime,sse,websocket}`

---

## 0. 先给结论

如果从零设计，我只坚持三件事，其余都可以谈：

1. **通知不是一张表，是三个模型**：事件（Event）、消息（Message）、收件箱条目（Inbox Entry）。把它们塞进一张表，公告、撤回、统计、多受众全部做不了。
2. **实时通道不是数据源，是失效信号**。真相永远来自 `GET /notifications?since=<seq>`。WebSocket/SSE 只负责告诉客户端"你该拉了"，顺便捎带一份乐观内容。
3. **前端要分成"运行时"和"收件箱"两层**。运行时（音效、免打扰、浏览器通知、Toast）是本地的、易失的；收件箱（列表、未读数、已读态）是服务端状态。现在这两层揉在一个 `NotificationStore` 里。

---

## 1. 我认为两份参考实现踩的坑

先说清楚"为什么要重新设计"，否则后面的模型看起来像过度设计。

### 1.1 benai 后端：`Notification` 表把三个概念压成了一个

```python
class Notification(BaseModel):
    id: UUID
    user_id: UUID          # ← 收件箱维度
    title: str             # ← 消息内容维度
    content: str           # ← 消息内容维度
    metadata: Dict         # ← 事件维度
    is_read: bool          # ← 收件箱维度
    target_scope: ...      # ← 受众维度
```

直接后果：

| 问题 | 表现 |
| --- | --- |
| 公告写扩散不可控 | 给 1 万人发一条公告 = 1 万行完全相同的 `title/content` |
| 无法撤回 | 撤回要 UPDATE 1 万行；改文案更是不可能 |
| 无法统计 | "这条公告送达/已读多少"要全表扫 `metadata` |
| 幂等靠约定 | `metadata.occurred_at` 被当成幂等键（`models.py:79` 的注释），但它不是唯一索引 |
| 批量操作 O(N) 次往返 | `mark_as_read_batch` 是 for 循环里 `find_by_id` + `save`（`notification_service.py:402`） |

`NotificationFanoutResult` 里有 `status="skipped"` + `existing_count`，说明去重是在应用层"查一下有没有"实现的——并发下会漏。

### 1.2 benai 后端：推送 payload 里塞了路由决策

> **§1.1 / §1.2 说的是 benai，不是本项目。** 本项目后端是 skroc-fast，这两节只有教学价值——留着是因为它们分别催生了两条硬约束：**三表分离**（§3）和**幂等必须落在唯一索引上**（`review.md` I1）。
>
> 真正关于本项目现状的是下面 §1.3 / §1.4，那两条至今仍然成立。

```python
payload_meta.setdefault("message_type", get_message_type_for_reference_type(...))
```

`message_type` 是给前端分支渲染用的（`websocket_schema.py:28` 注释直说了）。这等于**后端在替前端决定用哪个组件渲染**。加一种前端展示形态就要动后端枚举，两个仓库绑死发版。

正确的做法是后端只给 `(category, reference_type, reference_id, action)` 这类**语义**字段，怎么渲染是前端的事。

### 1.3 本仓库前端：`NotificationStore` 是内存队列，不是收件箱

`packages/web/admin-notification/src/notification-store.ts` 是一个容量 99 的优先级队列（`maxNotifications: 99`），只在内存里。它现在同时承担：

- 展示状态（列表、未读数）
- 运行时副作用（音效、浏览器通知、免打扰）
- 去重（靠 `id`）

问题是**第 100 条进来会挤掉第 1 条**，而收件箱里那条其实还在。刷新页面全部丢失。它作为"运行时"是合格的，作为"收件箱"完全不成立。

### 1.4 本仓库前端：realtime 被通知模块绑架了

```tsx
// SseEffect.tsx
const offMessage = client.on('message', raw => {
  const notification = parseRealtimeNotification(raw);
  if (notification) notifications.add(notification);
});
```

`features/realtime/message.ts` 里 `parseRealtimeNotification` 直接返回 `AddNotificationInput`——realtime 层认识通知包的类型。这意味着以后来一条"某个表格要刷新"的推送，没地方接。

而且 WS 和 SSE 同时连着，靠 `msg_id` 去重（`message.ts:108` 的注释写得很清楚）。**去重能解决重复，解决不了丢失**：断线那段时间的消息，两条通道都没有。

---

## 2. 分层

```
┌────────────────────────────────────────────────────────┐
│ L0  业务域        只发领域事件，完全不认识"通知"          │
│     审批通过 / 导入失败 / 权限变更 / 登录异常             │
└───────────────────────┬────────────────────────────────┘
                        │ DomainEvent
┌───────────────────────▼────────────────────────────────┐
│ L1  通知编排       决定「谁」收到「什么」走「哪些渠道」    │
│     订阅规则 · 模板渲染 · 受众展开 · 用户偏好 · 去重幂等   │
└───────────────────────┬────────────────────────────────┘
                        │ Message + Inbox Entries
┌───────────────────────▼────────────────────────────────┐
│ L2  投递           站内 / 实时推送 / 邮件 / 短信          │
│     重试 · 回执 · 限流 · 降级                            │
└───────────────────────┬────────────────────────────────┘
                        │ HTTP(真相)  +  Realtime(信号)
┌───────────────────────▼────────────────────────────────┐
│ L3  客户端         收件箱(服务端状态) + 运行时(本地)      │
└────────────────────────────────────────────────────────┘
```

一句话记住每层的边界：

- **L0 不能出现 `title`/`content`**。业务域一旦开始拼文案，模板系统就没意义了。
- **L1 不能出现渠道细节**。它只输出"这条消息该发给这些人，允许走这些渠道"。
- **L2 不能有业务分支**。它只认 `(收件人, 渲染好的内容, 渠道)`。
- **L3 不能把推送当真相**。

---

## 3. 领域模型

### 3.1 三张表

```ts
/** 事件：业务事实，不可变，唯一约束保证幂等 */
interface NotificationEvent {
  id: string;
  /** 幂等键，唯一索引。同一业务事实重复投递直接冲突丢弃 */
  dedupeKey: string;          // 例：`approval.passed:${approvalId}`
  eventType: string;          // 例：`approval.passed`
  payload: Record<string, unknown>;
  occurredAt: string;
  producedBy: string;         // 来源模块，排查用
}

/** 消息：给人看的内容，一条事件可能生成多条消息（不同受众/不同文案） */
interface NotificationMessage {
  id: string;
  eventId: string | null;     // null = 管理员手工发布的公告
  category: NotificationCategory;
  priority: NotificationPriority;
  title: string;
  summary: string;
  body: string | null;        // 详情，列表接口不返回
  /** 语义化的关联对象，前端自己决定怎么跳 */
  reference: { type: string; id: string } | null;
  /** 需要用户动作时才有 */
  action: { kind: 'navigate' | 'api'; label: string; target: string } | null;
  /** 受众定义，保留下来才能做「撤回」和「统计」 */
  audience: Audience;
  publishedAt: string | null;
  expiresAt: string | null;
  revokedAt: string | null;
  createdBy: string;
}

/** 收件箱条目：唯一带 userId 的表，只存状态 */
interface InboxEntry {
  userId: string;
  messageId: string;
  /**
   * 插入序，永不变。列表排序 + 游标分页用。
   *
   * 和 changeSeq 分开是因为两者要求相反：同步要"任何变更都推进"，列表要"位置稳定"。
   * 合成一列的话，点一下已读会让这条消息跳到列表第一位。
   */
  entrySeq: number;
  /** 变更序，任何变更（已读、处理态、修订、撤回）都推进。增量同步用。见 §4 */
  changeSeq: number;
  readAt: string | null;
  /** 处理态，与已读态正交。见 §3.3 */
  actionState: ActionState;
  actionUpdatedAt: string | null;
  dismissedAt: string | null;  // 用户视图删除，不删数据
  deliveredAt: string | null;
  /** 客户端按它把同一对象的多条变化折叠成一组展示；null 表示不分组 */
  collapseKey: string | null;
}
```

> 两个 seq 共用同一个每用户计数器（`review.md` B1）。id 类字段出网关都是 string（雪花超过 `2^53`），但 `entrySeq`/`changeSeq` 是每用户从 1 开始的计数器，用 `number` 安全——**别把它们当 string 比较，`"9" > "10"` 为真**。

**关键点**：`InboxEntry` 里没有 `title`/`content`。列表接口 join 出来。这样撤回一条公告是 `UPDATE message SET revokedAt=now() WHERE id=?`——一行。

### 3.2 分类只保留一个维度

`plan.md` 里同时有 `type`（视觉：info/success/warning/error/message）和 `category`（业务：task/announcement/...）。我建议**砍掉 `type`**。

理由：`type` 是渲染决策，可以从 `(category, priority)` 完全推导出来。留两个字段的结果一定是数据里出现 `type=success + category=security` 这种自相矛盾的组合，然后前端要写一堆兜底。

```ts
type NotificationCategory =
  | 'task'          // 待办：需要我做事
  | 'announcement'  // 公告：组织下发
  | 'message'       // 协作：有人 @ 我
  | 'event'         // 系统事件：我发起的操作有结果了
  | 'alert'         // 异常告警
  | 'security';     // 安全

type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';
```

前端一张映射表定死 `category → 图标/颜色`，`priority → 是否弹浏览器通知/是否响铃`。这张表在**前端**，改视觉不用后端发版。

### 3.3 状态机：两条正交的轴（这条很重要）

`plan.md` §7.3 写的是一条线：

```
未读 → 已读 → 处理中 → 已处理
```

**这是错的。** 反例：审批待办推给我，我在审批系统里直接批了，通知从没被点开过。这时它是"已处理 + 未读"。硬串成一条线，要么强行把它标成已读（未读数不准），要么它永远卡在"未读"（用户困惑）。

正确的是两条独立的轴：

```
阅读态（所有消息都有）
  unread ──→ read
         ←──          （允许标记为未读，用户会想「留着待会儿看」）

处理态（仅 action != null 的消息有）
  none                              ← 不需要处理的消息恒为 none
  pending ──→ done                  ← 用户点了处理按钮
          ──→ cancelled             ← 业务对象关闭了/审批被撤回
          ──→ expired               ← 过了 expiresAt
```

推论：

- 未读数 = `readAt IS NULL`
- 待办数 = `actionState = 'pending'`
- **这是两个数字，铃铛上显示哪个要单独决策**（见 §12 决策 D3）
- 处理态由**业务系统回写**，不由用户点通知触发。通知里的"去处理"按钮只是个快捷入口。

---

## 4. 一致性：`seq` 游标同步（整套设计的地基）

这是我认为最值得先定下来的东西。

### 4.1 问题

客户端会遇到这些情况：

- WS 和 SSE 同时连着，同一条消息到两次
- 断线 3 分钟，期间有 5 条消息
- 开了 4 个标签页
- 在手机上把某条标了已读，电脑上的未读数还是旧的

**靠 `msg_id` 去重只解决第一个。** 后三个都解决不了。

### 4.2 方案

给每个用户的收件箱一个**单调递增的 `seq`**（per-user sequence，不是全局）。任何变更——新消息、已读、处理态变化、撤回——都推进 `seq`。

客户端持有**两个游标**：`inbox`（写扩散的收件箱行）和 `bcast`（全员公告的读扩散 feed）。两条 feed 的产生方式不同，游标必须分开。

```
GET /api/notifications/sync?inbox=1042&bcast=88
→ {
    changes: [
      { changeSeq: 1043, op: 'upsert',  entry: {...}, message: {...} },
      { changeSeq: 1044, op: 'patch',   messageId: 'x', readAt: '...' },
      { changeSeq: 1045, op: 'retract', messageId: 'y', reason: 'revoked' }
    ],
    broadcasts: [ ... ],
    // ★ 只能是本次返回行的最大 changeSeq，服务端绝不单独查一次"最新 seq"
    inboxCursor: 1045,
    bcastCursor: 90,
    counts: { unread: 14, unreadThreads: 3, pending: 2, byCategory: {...} },
    truncated: false   // true 表示落后太多，客户端应全量重载
  }
```

三个契约细节，错一个就会丢消息或显示不一致：

1. **`inboxCursor` 必须来自返回行的最大 `changeSeq`**，服务端不许单独 `SELECT MAX()`。读接口走只读副本时，副本可能已经推进到 1045 但只返回到 1040 的行——客户端把游标设成 1045 就永久跳过了 1041~1045。空结果时游标原地不动。（`review.md` A4）
2. **`counts` 有两个未读数**：`unread` 是行数（分组头上显示），`unreadThreads` 是会话数（**徽标显示这个**）。一篇被评论 12 次的文档 + 2 条独立通知 = `unread: 14, unreadThreads: 3`，而面板里只有 3 个分组——徽标显示 14 用户会找那 11 条去哪了。（`review.md` B3）
3. **`op: 'patch'` 不改变条目位置**。它只更新状态字段，列表顺序由 `entrySeq` 决定，不受 `changeSeq` 影响。

这一个接口同时解决：

| 场景 | 怎么解决 |
| --- | --- |
| 重复推送 | `changeSeq <= lastCursor` 直接丢弃，不需要 `msg_id` |
| 断线补齐 | 重连后 `sync?inbox=<lastCursor>` |
| 多设备已读同步 | 已读也是一次 `changeSeq` 推进 |
| 未读数漂移 | 每次 sync 返回权威值，客户端不自己算 |
| 落后太多 | `truncated: true` → 丢弃本地缓存全量重拉 |

### 4.3 实时通道退化成一行信号

有了 sync，WebSocket/SSE 推的东西可以极简：

```json
{ "type": "notification.changed", "data": { "seq": 1045 } }
```

客户端收到后：`if (seq > lastSeq) scheduleSync()`（带 200ms 防抖合并）。

**可选优化**：推送里同时带上完整的 entry，客户端可以乐观插入并直接更新 `lastSeq`，省掉一次往返。但这是优化，不是协议基础——推送丢了照样对。

> 这一步直接把当前 `features/realtime/message.ts` 里 `withMsgId` 那套去重逻辑作废了，也不再需要"WS 和 SSE 同时连"这种冗余设计（见决策 D1）。

---

## 5. 受众展开：写扩散 vs 读扩散

`audience` 有几种形态：

```ts
type Audience =
  | { kind: 'users'; userIds: string[] }
  | { kind: 'roles'; roleIds: string[] }
  | { kind: 'depts'; deptIds: string[]; includeChildren: boolean }
  | { kind: 'all' };
```

策略：

| 受众规模 | 策略 | 理由 |
| --- | --- | --- |
| ≤ 阈值（建议 1000） | **写扩散**：发布时插入 N 条 `InboxEntry` | 查询简单，一条 SQL 出列表 |
| > 阈值 / `all` | **读扩散**：不插 entry，查询时 union | 不然发一条全员公告要写几十万行 |

读扩散需要一张辅助表记录"用户对广播消息的状态"：

```ts
interface BroadcastState {
  userId: string;
  messageId: string;
  readAt: string | null;
  dismissedAt: string | null;
}
```

只有用户**真的操作过**才插一行。未读判定 = 消息发布时间晚于用户的 `broadcastCursor` 且不在 `BroadcastState` 里。

我知道这增加了复杂度。**但如果 P0 就想清楚阈值切换点，后面加公告不用重构。** 如果决定 P0 只做写扩散，也要把阈值检查和"超过阈值就拒绝发布"做上，避免哪天有人发全员公告把库写挂。

---

## 6. 前端分层（落到本仓库）

### 6.1 三个包/目录，职责严格分开

```
packages/web/admin-notification/          纯运行时 + 展示，零 API 依赖
├── runtime/
│   ├── notification-runtime.ts           音效 · 免打扰 · 浏览器通知 · 权限
│   └── presentation-rules.ts             category/priority → 图标/颜色/是否响铃
├── ui/
│   ├── NotificationButton.tsx
│   ├── NotificationPanel.tsx
│   ├── NotificationItem.tsx
│   └── NotificationEmpty.tsx
└── types.ts                              展示契约，不含业务枚举取值

apps/ruoyi-plus-fast/src/features/notification/
├── api.ts               HTTP 契约（列表/sync/已读/处理/偏好）
├── dto.ts               后端 DTO ←→ 展示模型的转换 + zod 校验
├── inbox.ts             收件箱：分页缓存 · lastSeq · 未读数（服务端状态）
├── sync.ts              订阅 realtime 的 notification.changed → 触发增量同步
├── preferences.ts       用户偏好读写
└── index.ts             装配

apps/ruoyi-plus-fast/src/features/realtime/
└── （保持通用）只解信封 + 按 type 分发给订阅者，不认识通知包
```

### 6.2 关键改动：realtime 反转依赖

现在是 `SseEffect` 主动把消息转成通知。应该反过来——realtime 提供订阅，通知模块自己注册：

```ts
// features/realtime/dispatcher.ts —— 通用，不认识通知
export function subscribeRealtime(type: string, handler: (data: unknown) => void): () => void;

// features/notification/sync.ts —— 通知模块自己接
subscribeRealtime('notification.changed', data => {
  const parsed = ChangedSignalSchema.safeParse(data);
  if (parsed.success) inbox.onRemoteChange(parsed.data.seq);
});
```

这样后面加"数据字典变了，刷新缓存"这类推送，加一个订阅者就行，不用动通知模块。

### 6.3 运行时 vs 收件箱

| | 收件箱 `inbox.ts` | 运行时 `notification-runtime.ts` |
| --- | --- | --- |
| 数据来源 | 服务端 | 本地 |
| 持久化 | 服务端 + 可选 IndexedDB 缓存 | 无（配置存 localStorage） |
| 容量 | 分页，无上限 | 无状态 |
| 职责 | 列表 · 未读数 · 已读 · 分页 · 同步 | 响铃 · 弹浏览器通知 · 免打扰判定 |
| 现在在哪 | 不存在 | `notification-store.ts` 里混着 |

新消息到达时的编排：

```
sync 拿到新 entry
  → inbox 更新列表和未读数（渲染）
  → 对 seq > 上次会话最大值 的那些，逐条问 runtime.shouldAlert(message)
      → runtime 按 priority + 免打扰 + 用户偏好决定响不响铃、弹不弹浏览器通知
```

注意**只对"本次会话之后新产生的"提醒**。重连补齐 20 条历史消息不应该响 20 次铃——这是当前实现一定会踩的坑。

### 6.4 多标签页

用 `BroadcastChannel('notification')`：

- 一个 tab 通过 leader election 持有实时连接
- leader 收到信号后 sync，把结果广播给其他 tab
- 提醒（响铃/浏览器通知）只由 leader 触发，或只由 `document.visibilityState === 'visible'` 的 tab 触发

不做这个，开 5 个标签页就是 5 条连接 + 5 次响铃。P1 做，但连接管理的接口要在 P0 留好口子。

---

## 7. 接口契约

### 7.1 用户端

```
GET    /api/notifications?category=&read=&actionState=&cursor=<entrySeq>&limit=
GET    /api/notifications/sync?inbox=<changeSeq>&bcast=<bcastSeq>   ← 核心
GET    /api/notifications/counts   → { unread, unreadThreads, pending, byCategory }
GET    /api/notifications/{id}                        → 含 body 详情
POST   /api/notifications/read      { ids | filter }  ← 批量，一次往返
POST   /api/notifications/unread    { ids }
POST   /api/notifications/dismiss   { ids }
GET    /api/notification-preferences
PUT    /api/notification-preferences
```

三点约定：

1. **列表接口用游标分页，不用 page/size**。实时插入会让页码分页错位（第 1 页看到的最后一条，翻到第 2 页又出现）。
2. **`GET /{id}` 不自动标记已读**。benai 后端现在会自动标（`notification_service.py:321`），这会让"预览"和"已读"无法区分，而且 GET 有副作用不可缓存、不可重试。已读是显式的 `POST /read`。
3. **批量操作是一次请求**，不是循环调单条。

### 7.2 管理端

```
GET    /api/admin/notices?status=&category=&createdBy=
POST   /api/admin/notices                     创建草稿
PUT    /api/admin/notices/{id}                仅草稿可改
POST   /api/admin/notices/{id}/preview-audience  → { count, sample: [...] }  ← 发布前必须
POST   /api/admin/notices/{id}/publish        { scheduledAt? }
POST   /api/admin/notices/{id}/revoke         { reason }
GET    /api/admin/notices/{id}/stats          → { delivered, read, actioned }
```

`preview-audience` 是我要单独强调的：**发布前不知道要发给多少人，是这类系统最常见的事故源**。

---

## 8. 偏好与不可关闭渠道

```ts
interface NotificationPreferences {
  /** 全局免打扰 */
  dnd: { enabled: boolean; start: string; end: string } | null;
  /** 按分类 × 渠道的开关 */
  channels: Record<NotificationCategory, {
    inApp: boolean;      // 恒为 true，不可关（站内是兜底）
    browser: boolean;
    sound: boolean;
    email: boolean;
  }>;
}
```

策略必须由**服务端**决定哪些不可关，而不是前端灰一个开关就完事：

- `security` 分类：站内 + 邮件不可关闭
- `priority = 'urgent'`：穿透免打扰
- 前端从 `GET /notification-preferences` 里读到 `locked: string[]` 字段来禁用对应开关，**不硬编码**

---

## 9. 我不打算做的事（非目标）

明确写下来，避免讨论时反复回到这些：

- **不做规则引擎**。"什么事件发给谁"用代码里的订阅表（`eventType → 受众解析函数`），不做可视化配置。配置化的规则引擎最后一定变成没人敢改的黑盒。
- **不做富文本编辑器**。公告正文 P0 用受限 Markdown（白名单渲染），附件 P1。
- **不做通知的评论/回复**。那是 IM，不是通知。
- **不做客户端全量离线缓存**。IndexedDB 只缓存最近 N 条用于秒开，`truncated` 时直接丢。
- **不做"重要通知强制弹窗"**。用户会训练出无脑点关闭，反而降低所有通知的效力。

---

## 10. 分阶段

### M0：地基（不做 UI）

- 三张表 + `seq` 机制 + 幂等键唯一索引
- `GET /notifications`、`/sync`、`/counts`、`POST /read`
- realtime 只推 `notification.changed`
- 前端 `features/notification/` 骨架：`api` / `dto` / `inbox` / `sync`

**验收**：断网 1 分钟后重连，列表和未读数与服务端完全一致；WS+SSE 双连不产生重复。

### M1：可用的通知中心

- 铃铛面板（读 inbox 的前 20 条）+ `/notifications` 独立页
- 分类 Tab、已读/未读筛选、批量已读、删除视图
- 运行时层拆分：音效/免打扰/浏览器通知从 store 里剥出来
- 处理态（`actionState`）+ 业务系统回写

### M2：公告发布

- 草稿 → 受众预览 → 发布 → 撤回
- 读扩散（`all` / 大受众）
- 送达/已读统计

### M3：治理

- 模板 + 变量校验
- 邮件渠道 + 投递记录 + 重试
- 按分类的用户偏好
- 多标签页 leader election

---

## 11. 迁移：现有代码怎么办

| 现状 | 处理 |
| --- | --- |
| `NotificationStore`（PriorityQueue，容量 99） | 拆成 `NotificationRuntime`（保留音效/免打扰/浏览器通知）+ 删掉队列。队列职责移交 `features/notification/inbox.ts` |
| `parseRealtimeNotification` 返回 `AddNotificationInput` | 改为 realtime 只分发信封；通知模块自己订阅 `notification.changed` |
| `features/realtime/message.ts` 的 `withMsgId` 去重 | 删掉，由 `seq` 取代 |
| WS + SSE 同时连接 | 见决策 D1，倾向只保留一条 |
| `NotificationPanel` 直接读 store 快照 | 改为读 `useInbox()`，支持分页/加载更多/错误重试 |
| **`compareNotifications`（先按优先级，再按时间）** | **删掉优先级参与排序**，见 §11.1。这是唯一一处和现有实现语义冲突、必须改的地方 |

### 11.1 ★ 列表排序：优先级不参与

现有 `notification-store.ts`：

```ts
/** 先按优先级，再按时间倒序（新的在前），最后按入队序号倒序。 */
function compareNotifications(a, b) {
  return getWeight(a.priority) - getWeight(b.priority) || b.timestamp - a.timestamp || b.seq - a.seq;
}
```

这套排序和游标分页**不兼容**。`entrySeq` 游标（`WHERE entrySeq < :cursor ORDER BY entrySeq DESC`）的前提是顺序稳定；按优先级排会让"加载更多"错位——第 1 页末尾那条翻到第 2 页又出现，而某些低优先级的旧消息永远翻不到。

原因是优先级排序**不是**服务端能表达的单调游标：两条消息的相对位置取决于 `priority`，而 `priority` 不参与索引，服务端没法从"上一页最后一条"推出"下一页从哪开始"。

**定为规则**：

> **列表严格按 `entrySeq DESC`。优先级只影响视觉强调（左侧色条、图标、标签），不影响位置。**

紧急消息要突出，用**独立区块**而不是插队：

```
┌─ 面板 ────────────────────────┐
│ ⚠ 2 项紧急              [处理]│ ← 独立查询：priority=urgent AND unread，最多 3 条
├───────────────────────────────┤
│ Q4方案V2 · 12 条         [展开]│ ← 主列表：entrySeq DESC，按 collapseKey 分组
│ 导入完成                       │
│ 权限变更                       │
│              [加载更多]        │ ← 游标 = 当前最后一条的 entrySeq
└───────────────────────────────┘
```

两个查询各自稳定，紧急区块不分页（最多 3 条，超了显示"还有 N 项"跳通知中心），主列表分页不受干扰。

这也顺带解决了原实现里那句注释担心的事——"已读与否不参与排序：否则点一下已读整个列表会跳动"。用 `entrySeq` 之后，**任何状态变化都不会让位置变动**，因为 `entrySeq` 插入后永不改（`review.md` B1）。
| 后端 `Notification` 单表 | 新建三张表，老表保留只读；写路径先切，读路径灰度 |

`packages/web/admin-notification` 的定位保持不变——**通用运行时 + 展示组件，不碰 API**。这一点当前设计是对的，继续守住。

---

## 12. 需要你拍板的决策

| 编号 | 问题 | 我的建议 | 影响面 |
| --- | --- | --- | --- |
| ~~D1~~ | ~~WS 和 SSE 是不是要同时连？~~ | **问题问错了，已修正。** 后端 `send_to_user` 按 user_id 聚合、不区分传输——"两条通道"实际是"一个用户 N 条连接"（多标签页 + 多设备）。WS 和 SSE 都是一等公民，不做降级，传输由客户端自选。信号幂等由 `changeSeq` 保证，与连接数无关。同浏览器多标签页在**前端**用 BroadcastChannel 选主，避免 N 次 sync 和 N 次响铃。详见 `infra.md` §1 | — |
| **D2** | `type`（视觉）和 `category`（业务）是否都保留？ | **只留 `category` + `priority`**，视觉由前端映射 | 中，改契约 |
| **D3** | 铃铛徽标显示未读数还是待办数？ | 显示**未读数**，待办数在面板顶部单独一行"N 项待处理"。两个数字挤一个徽标一定误导 | 低 |
| **D4** | 已读是否可逆（标记为未读）？ | **可逆**。用户会用它当"稍后处理"。代价是未读数要走 sync 而不是本地自减 | 低 |
| **D5** | 写扩散阈值定多少？P0 是否直接上读扩散？ | 阈值 1000。**P0 只做写扩散 + 超阈值拒绝发布**，M2 再补读扩散 | 中 |
| **D6** | `GET /{id}` 是否自动标已读？ | **否**。已读必须显式。与 benai 现有行为不一致，需要确认调用方 | 中 |
| **D7** | 处理态由谁写？ | **业务系统回写**（审批服务完成后调通知服务）。通知里的按钮只做跳转。反过来做会让通知服务依赖所有业务域 | 高，跨团队约定 |
| **D8** | 重连补齐的历史消息要不要响铃？ | **不响**。只对"本次会话建立后新产生"的提醒 | 低 |
| ~~D9~~ | ~~这套是给 ruoyi-plus-fast 后端还是复用 benai 那套？~~ | **已确认：ruoyi-plus-fast 自有服务**，benai 仅作反面参考。后端设计见 `backend.md`，无约束版见 `platform.md` | — |

---

## 13. 一句话总结

> 通知模块的难点从来不是"怎么把一条消息显示在铃铛里"，而是**在多设备、断线、多标签页、重复投递的前提下，让"未读数"这个数字始终正确**。
>
> 这个问题只有一种解法：服务端持有单调游标，客户端只做增量对账，实时通道退化成一个"你该拉了"的信号。
>
> 剩下的都是产品细节，可以边做边改。

# 通知模块前端对接指南

> 后端已实现（`skroc-fast/app/modules/notification/`，25 个接口）。本文是**接口契约 + 几条
> 反直觉的纪律**。
>
> 产品需求看 `plan.md`（技术章节已作废，开头有标注），前端分层看 `architecture.md`。

---

## 0. 先看这五条，写之前

每条都是"按直觉写就会错"，而且**错了不会报错**：

| #   | 纪律                                         | 违反的症状                                              |
| --- | -------------------------------------------- | ------------------------------------------------------- |
| 1   | `inboxCursor` 用服务端返回的，**不要自己算** | 永久跳过中间几条消息                                    |
| 2   | 列表按 `entrySeq` 倒序，**优先级不参与排序** | 「加载更多」重复和漏项                                  |
| 3   | 徽标显示 `unreadThreads`，不是 `unread`      | 徽标数字和面板里能看到的条数对不上                      |
| 4   | 未读数用接口返回的，**不要本地加减**         | 两个标签页各减一次，数字变负                            |
| 5   | id 类字段是 **string**，seq 类是 **number**  | 雪花 id 超 2^53 精度丢失；seq 当字符串比较 `"9" > "10"` |

---

## 1. 接口总览

```
用户端（当前登录用户自己的收件箱）
GET    /notification/sync?inbox=&bcast=      ★ 增量对账，整套机制的核心
GET    /notification/counts                  两个未读数 + 待办数 + 分类计数
GET    /notification/list                    分页列表（offset）
GET    /notification/{msgId}                 详情（含正文）。★ 不会标已读
POST   /notification/read        {msgIds}    批量已读
POST   /notification/unread      {msgIds}    批量取消已读（可逆）
POST   /notification/read-all                全部已读
POST   /notification/dismiss     {msgIds}    从视图移除（不删数据）
POST   /notification/broadcast/{msgId}/read  标记一条全员公告已读
GET    /notification/preference              渠道偏好完整矩阵
PUT    /notification/preference              改一项，返回完整矩阵

管理端（SuperAdminDep 门禁；权限点模块落地后换成权限校验）
GET    /notification/msg/list                消息列表
GET    /notification/msg/catalog             通知目录（从规则表生成）
POST   /notification/msg                     新建草稿
PUT    /notification/msg/{id}                改草稿
DELETE /notification/msg/{id}                删草稿（只有草稿能删）
GET    /notification/msg/{id}                消息详情
GET    /notification/msg/{id}/audience-preview   ★ 发布前必查
POST   /notification/msg/{id}/publish        发布 / 定时发布（再调一次 = 改期）
POST   /notification/msg/{id}/cancel-schedule    取消排期
PUT    /notification/msg/{id}/revise         修订已发布的
GET    /notification/msg/{id}/revoke-impact  ★ 撤回前必查
POST   /notification/msg/{id}/revoke         撤回
GET    /notification/msg/{id}/stats          送达/已读/已处理
GET    /notification/msg/{id}/revisions      修订历史
```

响应统一是项目现有的 `{ code, msg, data }` 信封，成功码 `"0000"`。**没有新增业务码** ——
通知的失败都是"弹个 msg"，走默认的 HTTP 状态码字符串。

---

## 2. `/sync` —— 整套机制的核心

### 2.1 请求与响应

```http
GET /notification/sync?inbox=1042&bcast=88
```

```jsonc
{
  "changes": [
    { "changeSeq": 1043, "op": "upsert",  "item": { /* InboxItem */ } },
    { "changeSeq": 1044, "op": "patch",   "item": { /* 只更状态 */ } },
    { "changeSeq": 1045, "op": "retract", "item": { /* 已撤回 */ } }
  ],
  "broadcasts": [ /* 全员公告，没有收件箱行 */ ],
  "inboxCursor": 1045,
  "bcastCursor": 90,
  "counts": { "unread": 14, "unreadThreads": 3, "pending": 2, "byCategory": {...} },
  "truncated": false
}
```

### 2.2 ★ 纪律一：游标只能用服务端给的

```ts
// ✅
cursor = res.data.inboxCursor;

// ❌ 永远不要自己算
cursor = Math.max(...res.data.changes.map(c => c.changeSeq)); // 空结果时变成 -Infinity
cursor = lastKnownSeq + res.data.changes.length; // 服务端 seq 会跳号
```

服务端返回的 `inboxCursor` **只来自本次返回行的最大 `changeSeq`**，绝不会是一个"更新但你
没收到"的值。读接口以后走只读副本时这条尤其关键：副本可能已推进到 1045 但只返回到 1040 的
行，你把游标设成 1045 就永久跳过了 1041~1045。

空结果时 `inboxCursor` **原地不动**（等于你传进去的值），不是 0。

### 2.3 三种 `op`

| op        | 客户端该做什么                                                               |
| --------- | ---------------------------------------------------------------------------- |
| `upsert`  | 新条目，插进列表（按 `entrySeq` 找位置）                                     |
| `patch`   | **只更新状态字段，不改列表位置**。已读、处理态、内容修订都是这个             |
| `retract` | 消息被撤回。显示"该消息已撤回"占位，**不要凭空移除** —— 用户会以为自己看错了 |

### 2.4 `truncated: true`

落后太多（离线很久）。丢掉本地缓存，走 `/list` 全量重载，然后用返回的游标重新开始。

### 2.5 两个游标

`inbox` 是写扩散的收件箱行，`bcast` 是全员公告（读扩散，没有收件箱行）。两条 feed 产生方式
不同，游标必须分开存。

---

## 3. 实时信号

WebSocket / SSE 收到的信封（沿用项目现有格式）：

```jsonc
{
  "code": "0000",
  "msg": "ok",
  "type": "notification.inbox.changed",
  "msg_id": "...",
  "request_id": null,
  "data": { "change_seq": 1045 }
}
```

**载荷只有一个序号，没有消息内容。** 拿到之后：

```ts
if (changeSeq > lastCursor) scheduleSync(); // 带 200ms 防抖合并
```

### 3.1 为什么不带内容

带了就要处理三件事：同一用户多条连接（多标签页 + 多设备）收到重复、两条连接顺序不一致、
某条连接漏了。只推序号这三个问题都不存在 —— 每个客户端拿到同一个数，各自和自己的游标比。

**信号丢了也没关系**：真相在 `/sync`，下次打开页面自然补齐。所以不用给它做重试或 ACK。

### 3.2 WS 和 SSE 都是一等公民

后端 `send_to_user` 按 user_id 聚合、**不区分传输**。你连 WS 还是 SSE 由客户端自己决定，
也可以同时连——那不是"冗余通道"，是"一个用户 N 条连接"，服务端一次投给全部。

### 3.3 多标签页要选主

同一浏览器开 3 个标签页 = 3 条连接 = 收到 3 次信号。用 `BroadcastChannel` 选一个 leader：

- leader 收到信号 → 执行 sync → 把结果广播给其他标签页
- 非 leader → 不发请求，只消费广播

**收益不只是省请求**：提醒（响铃、浏览器通知）也只该由 leader 触发一次，否则开 3 个标签页
收到一条通知会响 3 次。

### 3.4 重连补齐的历史消息不要响铃

断线重连后 sync 可能一次拿回 20 条。**只对"本次会话建立之后新产生"的提醒**，否则会连响
20 次。判据：记住会话开始时的 `inboxCursor`，比它大的才走提醒。

---

## 4. 列表与排序

### 4.1 offset 分页，不是游标

```http
GET /notification/list?current=1&size=20&category=task&unread=true
```

返回项目现成的 `Page` 形状 `{ records, total, current, size }` —— 和其余所有表格一致。

### 4.2 ★ 纪律二：优先级不参与排序

默认按 `entrySeq` 倒序。**不要按 priority 排**，因为服务端没法从"上一页最后一条"推出下一页
从哪开始 —— 结果是加载更多时重复和漏项。

紧急消息要突出，用**独立区块**：

```
┌─ 面板 ────────────────────────┐
│ ⚠ 2 项紧急              [处理]│ ← 独立查询 ?priority=urgent&unread=true&size=3
├───────────────────────────────┤
│ Q4方案V2 · 12 条         [展开]│ ← 主列表，按 collapseKey 分组
│ 导入完成                       │
│              [加载更多]        │
└───────────────────────────────┘
```

两个查询各自稳定，互不干扰。

### 4.3 `entrySeq` vs `changeSeq`

```
entrySeq    插入序，永不变        列表排序、分页定位用这个
changeSeq   变更序，任何变更都推进  只用来做同步游标
```

**别拿 `changeSeq` 排序** —— 那会让用户点一下已读，那条消息就跳到列表第一位。

### 4.4 按 `collapseKey` 分组

同一对象的多条变化（一篇文档被评论 12 次）`collapseKey` 相同。列表里折叠成一组展示，
组头显示"12 条"。`collapseKey` 为 `null` 的不分组。

---

## 5. 未读数：两个数字

```jsonc
"counts": { "unread": 14, "unreadThreads": 3, "pending": 2, "byCategory": {...} }
```

| 字段            | 是什么         | 显示在哪             |
| --------------- | -------------- | -------------------- |
| `unreadThreads` | 未读**会话**数 | ★ **徽标**           |
| `unread`        | 未读**行**数   | 分组头上的"12 条"    |
| `pending`       | 待处理数       | 面板顶部"N 项待处理" |

一篇被评论 12 次的文档 + 2 条独立通知 = `unread: 14, unreadThreads: 3`，而面板里按
`collapseKey` 分组只有 3 组。**徽标显示 14 的话用户会找那 11 条去哪了。**

对齐 Gmail（未读数是会话数不是邮件数）和 GitHub（数 thread）。

### ★ 纪律四：不要本地加减未读数

写操作的响应里带**权威计数**，直接采用：

```jsonc
// POST /notification/read 的响应
{ "affected": 1, "changeSeq": 1046, "counts": { "unread": 13, "unreadThreads": 2, ... } }
```

自己算的话，两个标签页同时点已读会各减一次，而实际只改了一行。

---

## 6. 详情不会标已读

`GET /notification/{msgId}` **不改任何状态**。已读是显式的 `POST /notification/read`。

所以「点开就算已读」这个交互要前端自己发两个请求，或者做成「打开抽屉 → 停留 1 秒 → 标已读」
这类显式动作。

理由：GET 有副作用等于不可缓存、不可重试，而且"预览"和"已读"无法区分。

---

## 7. 处理态：和已读态正交

```
readTime      null / 非 null，且可逆
actionState   none | pending | done | cancelled
```

**这两个是独立的两轴，不是一条线。** "已处理 + 未读"是合法状态：审批待办推给我，我在审批
系统里直接批了，通知从没被点开过。

- `actionState = "none"` → 这条不需要处理，不显示按钮
- `actionState = "pending"` → 显示 `action.label` 按钮，点了按 `action.target` 跳转
- `actionState = "done" / "cancelled"` → 显示"已处理"，按钮消失

**前端不调接口改处理态** —— 它由业务系统在处理完之后回写，前端会通过 sync 的 `patch` 收到
变化。按钮只是个跳转快捷方式。

过期待办：`actionState === "pending" && expireTime < now()`，前端自己算，后端不落这个状态。

---

## 8. 渠道偏好

```http
GET /notification/preference
```

```jsonc
{
  "items": [
    { "intent": "transactional", "channel": "email", "state": "on", "locked": true },
    { "intent": "informational", "channel": "email", "state": "digest", "locked": false }
  ]
}
```

三点：

1. **返回的是完整矩阵**（默认值已经合并好），不是"用户改过的那几项"。前端直接画表，
   不要自己维护一份默认值 —— 那会让默认值有两份定义。
2. **`locked: true` 的格子置灰。** 哪些渠道不可关是系统策略，服务端说了算。
   （服务端也会拒绝改锁定项，所以前端漏了置灰不会造成数据问题，只是体验差。）
3. **`state` 有三档**：`on` / `off` / `digest`。`digest` 不是"关"，是"攒起来一天发一次"。
   只给开关两档的话，用户只能在"太吵"和"啥都收不到"之间选，然后他会选关掉。
   （P0 后端还没实现摘要投递，但档位先存在。）

站内（`inapp`）**不在矩阵里** —— 它是唯一真相，已读态得有地方存，所以恒定开启。
摆一个关不掉的开关只会让人以为能关。

`PUT` 改一项后**返回改完的完整矩阵**，前端直接替换，不用再拉一次。

---

## 9. 管理端：三个必须做的确认弹窗

### 9.1 发布前：受众预览

```http
GET /notification/msg/{id}/audience-preview
→ { "count": 47, "sample": ["1","7","806"], "kind": "depts",
    "exceedsLimit": false, "limit": 1000 }
```

**发布前不知道要发给多少人，是这类系统最常见的事故源。** 发布按钮前必须先调它并展示。

`count: -1` 表示全员公告（读扩散，不展开人数），界面显示"全部用户"。
`exceedsLimit: true` 时发布会被拒，提示改用全员公告。

### 9.2 撤回前：★ 已发出的邮件撤不回来

```http
GET /notification/msg/{id}/revoke-impact
→ { "inboxRecipients": 3204, "cancelledDeliveries": 156,
    "alreadySent": { "email": 3048 } }
```

弹窗必须把 `alreadySent` **原样写出来**：

> 撤回后：站内消息将标记为已撤回，尚未发出的 156 条投递会被取消。
> **已发送的 3,048 封邮件无法撤回。**

这是最容易被忽略、也最容易变成事故的一点 —— 发布者以为撤回了，而敏感内容已经躺在几千个
邮箱里。

### 9.3 修订：默认静默，重新提醒要显式勾

```http
PUT /notification/msg/{id}/revise
{ "title": "...", "summary": "...", "expectedRevision": 1,
  "renotify": false, "changeNote": "修正错别字" }
```

- `renotify: false`（默认）→ 内容更新，收件人的已读态保持，不重走渠道。改错别字用这个
- `renotify: true` → 重置为未读并重走渠道。时间/地点变了用这个

界面上做成一个复选框「重要修改，重新提醒收件人」，**默认不勾**。不给选择的后果：只做静默 →
会议改时间了没人知道；只做重新提醒 → 改个错别字把 5000 人又炸一遍。

**`expectedRevision` 是乐观锁**，从详情接口拿到的 `revision` 原样回传。返回 409 说明有人在
你编辑期间改过了，提示重新加载 —— 不要静默重试，那会把别人的改动盖掉。

### 9.4 禁改字段

已发布的消息不许改 `category` / `intent` / `priority`，改了返回 400。界面上这三个在已发布
状态下应该置灰，并提示"如需调整请撤回后重新发布"。

（理由：改了意味着偏好过滤要重算 —— 本来因为 informational 被过滤掉的人，改成 security
之后该收到吗？说不清。）

---

## 10. 字段类型：string 还是 number

```jsonc
{
  "msgId": "79600019719872512", // ← string，雪花 id 超过 2^53
  "entrySeq": 1043, // ← number，每用户从 1 开始的计数器
  "changeSeq": 1045 // ← number
}
```

**id 类一律 string，seq 类一律 number。**

seq 当字符串比较会出事：`"9" > "10"` 为 `true`。而 id 当 number 会精度丢失 ——
项目里 `NoticeId = number | string` 这个联合类型就是这个坑的痕迹，新接口不让它再猜。

---

## 11. 现有前端包要改的三处

`packages/web/admin-notification` 保持"通用运行时 + 展示组件、零 API 依赖"的定位不变，
但有三处要动（详见 `architecture.md` §11）：

1. **`NotificationStore`（容量 99 的内存优先级队列）拆成两半**：运行时（音效/免打扰/浏览器
   通知）留在包里，列表和未读数移交 `features/notification/inbox.ts`（服务端状态）。
   现状是第 100 条进来会挤掉第 1 条，而收件箱里那条还在。

2. **`compareNotifications` 删掉优先级排序**（§4.2）。这是唯一一处和现有实现语义冲突、
   必须改的代码。

3. **realtime 依赖反转**：`SseEffect` 现在直接调 `notifications.add(parseRealtimeNotification(raw))`，
   realtime 层认识通知包的类型。改成 realtime 只分发信封、通知模块自己订阅
   `notification.inbox.changed`，否则以后来一条"某个表格要刷新"的推送没地方接。

免打扰、浏览器通知、声音这三个**后端不管**，纯前端运行时（`plan.md` §7.4 把它们排到 P0
是对的，只是实现方不是后端）。

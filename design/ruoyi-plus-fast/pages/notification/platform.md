# 通知平台设计（无约束版）

> 文档状态：提案，供讨论
>
> **本文不受任何现状约束**：不考虑 `sys_notice`、不考虑 RuoYi 表约定、不考虑 benai、不考虑现有 `@skyroc/web-admin-notification` 包。目标是设计一个能长期演进、覆盖多类场景的通知平台。
>
> 落地路径在 §23。地基必须一次做对的部分和可以后加的部分，那一节分得很清楚。

---

# 第一部分：立场与骨架

## 1. 这个系统本质上是什么

一句话：**通知平台是一个编译器加一个调度器。**

- **编译器**：输入是领域事件（"文档 42 被评论了"），输出是一组具体投递指令（"给张三的 iOS 推一条中文推送、给李四的邮箱发一封英文摘要邮件"）。中间要经过收件人解析、偏好过滤、模板渲染、渠道选择——每一步都是一次"降级翻译"。
- **调度器**：不是所有指令都立刻执行。有的要合并（5 分钟内的 10 条评论合成 1 条），有的要等（用户在免打扰时段），有的要升级（10 分钟没人看就打电话）。

把它当 CRUD 做，就会得到一个"能发消息但没人敢改规则"的系统。把它当编译器做，架构自然就分出来了。

## 2. 两个问题决定架构好坏

我用这两个问题检验任何通知系统设计：

1. **"我为什么收到了这条？"**
2. **"我为什么没收到那条？"**

如果系统能**机械地**回答这两个问题——不是靠翻日志猜，而是有一条完整的决策记录——那它的管线一定是良好分层的：因为每个阶段都必须记录自己的判断和依据。

反过来，如果回答不了，说明有阶段在"顺手做决定"而没留痕。这类系统的典型症状是：用户投诉收不到通知，工程师查半天说"应该是偏好设置的问题吧"。

**这两个问题是本文所有设计的第一驱动力。** §18 的 trace 子系统不是附加功能，它是架构的验证器。

## 3. 三条正交轴（本文最核心的思想）

绝大多数通知系统只有一个 `type` 字段，然后所有事情都从它派生。这是根本性的错误——因为至少有三个**互相独立**的维度：

### 3.1 `intent`：这条消息能不能被推迟或合并

```
transactional   不可延迟、不可合并、不可静音。验证码、支付结果、密码重置
actionable      需要用户做事。可以合并，不能丢。审批待办、待确认
informational   仅供知悉。可合并、可摘要、可静音。评论、点赞、状态变化
alerting        异常。不可合并（每一条都是独立事实），需要升级路径。任务失败、服务异常
```

`intent` 决定的是**时间上的自由度**。这必须是数据而不是代码里的 if——否则"这条能不能进日报摘要"就得改代码。

### 3.2 `reason`：我为什么在收件人列表里

```
direct       直接指向我。@我、指派给我、发给我的私信
assigned     我是这个对象的负责人
author       我是这个对象的创建者
watching     我主动订阅了这个对象
team         我所在的组/部门被指向
broadcast    全员/角色/部门广播
system       系统强制（安全、合规）
```

`reason` 决定的是**偏好解析的输入**。这是 GitHub 的核心设计，被大多数后台系统漏掉。

它的价值：同一个事件（"文档被评论"），`reason=direct`（评论里 @了我）要立刻推送，`reason=watching`（我只是订阅了这篇文档）进日报就够了。**没有 `reason`，这两件事只能用同一套策略**，结果一定是要么太吵要么漏掉重要的。

而且它直接回答 §2 的第一个问题——"我为什么收到了这条"的答案，第一句就是 `reason`。

### 3.3 `urgency`：多快必须到达

```
critical   秒级，必须确认送达，支持升级（未读 → 换渠道 → 换人）
high       秒级，尽力送达
normal     分钟级
low        小时级，可进摘要
```

`urgency` 决定的是**渠道选择和升级策略**。

### 3.4 为什么必须正交

因为现实里这些组合都存在，而单一 `type` 字段表达不了：

| 场景               | intent        | reason    | urgency      |
| ------------------ | ------------- | --------- | ------------ |
| 支付成功           | transactional | direct    | high         |
| 有人在文档里 @ 你  | informational | direct    | normal       |
| 你订阅的文档被改了 | informational | watching  | low          |
| 分配给你的审批待办 | actionable    | assigned  | normal       |
| 生产环境服务挂了   | alerting      | team      | **critical** |
| 你的密码被修改     | transactional | system    | high         |
| 全员放假通知       | informational | broadcast | low          |

注意第 5 行：`alerting + team + critical`。用单一 `type='alert'` 表达不了"这是给团队的、要升级、不能合并"。而这三个属性各自驱动不同的下游子系统——`intent` 驱动聚合器，`reason` 驱动偏好解析，`urgency` 驱动渠道与升级。

**这三个字段是整套管线的输入参数。定错了，后面所有子系统都得写 if。**

## 4. 全景管线

```
   ┌──────────────┐
   │ 业务域        │  只发领域事件。不认识"通知"、"渠道"、"模板"
   └──────┬───────┘
          │ DomainEvent（有版本化 schema）
   ┌──────▼──────────────────────────────────────────────────┐
   │ ① 摄入 Ingest        幂等去重 · schema 校验 · 落库 · outbox │
   └──────┬──────────────────────────────────────────────────┘
   ┌──────▼──────────────────────────────────────────────────┐
   │ ② 规则匹配 Match      事件 → 命中哪些规则（版本化、可模拟）  │
   └──────┬──────────────────────────────────────────────────┘
   ┌──────▼──────────────────────────────────────────────────┐
   │ ③ 收件人解析 Resolve  受众代数 → [(user, reason)]          │
   │                       订阅表 · 角色 · 部门树 · 事件派生     │
   └──────┬──────────────────────────────────────────────────┘
   ┌──────▼──────────────────────────────────────────────────┐
   │ ④ 策略过滤 Policy     策略栈求交 → [(user, reason, 渠道集)] │
   │                       系统 > 租户 > 角色默认 > 用户 > 对象静音│
   └──────┬──────────────────────────────────────────────────┘
   ┌──────▼──────────────────────────────────────────────────┐
   │ ⑤ 收件箱写入 Inbox    ★ 站内是第一公民，先落库再谈其他渠道  │
   │                       每用户 seq 推进（§13）               │
   └──────┬──────────────────────────────────────────────────┘
   ┌──────▼──────────────────────────────────────────────────┐
   │ ⑥ 疲劳控制 Shape      collapse · debounce · digest · 限流  │
   │                       ← intent 决定这一层有多大自由度      │
   └──────┬──────────────────────────────────────────────────┘
   ┌──────▼──────────────────────────────────────────────────┐
   │ ⑦ 调度 Schedule       时区 · 免打扰 · 定时 · 延迟队列      │
   └──────┬──────────────────────────────────────────────────┘
   ┌──────▼──────────────────────────────────────────────────┐
   │ ⑧ 渲染 Render         模板 × locale × 渠道 → 具体内容      │
   │                       ← 放在这里而不是更早，见 §9.3        │
   └──────┬──────────────────────────────────────────────────┘
   ┌──────▼──────────────────────────────────────────────────┐
   │ ⑨ 投递 Dispatch       渠道适配器 · 供应商容灾 · 升级阶梯    │
   └──────┬──────────────────────────────────────────────────┘
   ┌──────▼──────────────────────────────────────────────────┐
   │ ⑩ 回执与收敛 Converge 送达/已读/已处理 · 多设备 · 推送撤回  │
   └──────┬──────────────────────────────────────────────────┘
   ┌──────▼──────────────────────────────────────────────────┐
   │ ⑪ 反馈 Feedback       退订 · 举报太吵 · 效果统计 → 反哺规则 │
   └─────────────────────────────────────────────────────────┘

   横向贯穿：Trace（每阶段记录决策）· Simulate（不发真的跑一遍）· Kill Switch
```

**每一个阶段都必须能被单独关掉、单独重跑、单独观测。** 这是"可扩展"的实际含义——不是"能加字段"，而是"能在不理解全局的情况下安全改动一个阶段"。

## 5. 五条不变式

写在最前面，后面所有设计都不许违反：

| #      | 不变式                                           | 违反的后果                         |
| ------ | ------------------------------------------------ | ---------------------------------- |
| **I1** | 幂等落在数据库唯一约束上，不落在应用逻辑里       | 并发下重复通知，且不可复现         |
| **I2** | 任何外发动作（推送、邮件、短信）都晚于事务提交   | 事务回滚后用户收到不存在的通知     |
| **I3** | 站内收件箱是唯一真相，其他渠道都是它的投影       | 各渠道状态发散，"已读"无法统一     |
| **I4** | 每用户的变更序号单调，且取号序 = 提交序 = 可见序 | 偶发丢消息，无日志，排查成本以月计 |
| **I5** | 每个管线阶段的决策必须留痕                       | 回答不了 §2 的两个问题             |

I4 的完整论证在 §13.2——那是全文唯一一个"设计错了没法靠改代码补救"的地方。

---

# 第二部分：子系统

## 6. ① 事件契约与摄入

### 6.1 事件契约要版本化

业务域发出的事件是**平台的公开 API**，必须像 API 一样管理：

```python
@event("doc.comment.created", version=2)
class DocCommentCreated(BaseModel):
    doc_id: str
    doc_title: str
    comment_id: str
    comment_excerpt: str        # 摘要，不是全文
    actor_id: str
    mentioned_user_ids: list[str]
    occurred_at: datetime
```

有一个**事件注册表**（schema registry），提供：

- **校验**：摄入时校验，形状不对**立刻拒绝并返回错误**，不静默丢弃也不"尽力渲染"
- **版本共存**：v1 和 v2 同时可用，规则声明自己吃哪个版本
- **兼容性检查**：CI 里检查 schema 变更是否破坏兼容（加可选字段 OK，改类型/删字段 = 破坏）
- **文档自动生成**：业务团队能自助查"我该发什么事件"

**为什么值得做**：没有 schema 的事件系统会在 6 个月后变成 `payload: dict` 里塞了 40 个来源不明的键，没人敢删。这是通知系统最常见的腐化路径。

### 6.2 PII 不进事件载荷（一个重要取舍）

事件载荷里**只放引用和摘要**，不放完整的敏感内容：

```
✅ {doc_id, doc_title, comment_excerpt: "关于第三节的..."}
❌ {comment_body: "<完整评论，可能含身份证号>"}
```

理由：事件表是永久保留的审计源（§20），把 PII 写进去意味着 GDPR 删除请求要去改历史事件。

**但这引出一个真实的张力**：渲染时（阶段⑧）要回查业务库拿完整内容。如果那时对象已被删除/权限已变，就渲染不出来了。

解法：**渲染后的内容快照落在 message 上**（`title`/`summary`/`body`），而不是每次读取时重新渲染。也就是：

- 事件载荷 = 引用（可长期保留，无 PII）
- message 内容 = 一次性渲染的快照（有 PII，按留存策略清理）
- 读接口 = 直接读快照，不回查业务库

代价是"对象改名了通知里还是旧名字"。我认为这是对的——通知是**当时发生了什么**的记录，不是对象的实时视图。

### 6.3 摄入接口

```
POST /platform/events
{
  "eventType": "doc.comment.created",
  "version": 2,
  "dedupeKey": "doc.comment.created:c_8f3a",   ← 调用方构造，必填
  "occurredAt": "...",
  "payload": { ... }
}
→ 201 {eventId}  |  200 {eventId, duplicate: true}
```

一条语句完成：`INSERT ... ON CONFLICT (tenant_id, dedupe_key) DO NOTHING RETURNING event_id`。返回空 = 处理过了。**不查询、不判断**（I1）。

同一事务内写 outbox 行，然后提交。之后一切由 worker 在新事务里做（I2）。

**摄入必须支持三种来源**：内部服务调用、消息队列消费、外部 HTTP（带签名的 webhook in）。三者共用同一个摄入函数，只是鉴权不同。

## 7. ② 规则引擎

这是"可扩展"真正住的地方。

### 7.1 规则是声明式的、版本化的数据

> **⚠️ 结论已修正 → 用类型化 Python，不用 YAML。见 §7.4。**
>
> 下面这份 YAML 是**我为了说明概念编的，不是任何规范**。领域概念都有真实出处（`collapse` ≈ Alertmanager 的 `group_by`/`group_wait`，`reason` 照搬 GitHub Notifications API 的 `reason` 字段，`digest`/`delay` 是 Novu 的 workflow step，`when:` 的"刻意受限"取自 GitHub Actions `if:` 和 AWS Cedar），但把它们塞进 YAML 是我套的壳。
>
> 保留原文，因为它把**需要表达哪些东西**列得最清楚——§7.4 的类型化版本表达的是同一组概念。

```yaml
id: doc.comment.notify
version: 3
event: doc.comment.created@2

# 前置条件。表达式语言故意受限：只有布尔/比较/成员判断，无循环无函数定义
when: |
  event.doc.visibility != 'private'

# 收件人：受众代数表达式，每一项带 reason
audience:
  - mentions(event.mentioned_user_ids)          as direct
  - assignee(doc, event.doc_id)                 as assigned
  - author(doc, event.doc_id)                   as author
  - watchers(doc, event.doc_id)                 as watching
exclude:
  - event.actor_id # 不通知自己
  - muted(doc, event.doc_id) # 对象级静音

# 三条正交轴（§3）
intent: informational
urgency:
  direct: normal # 按 reason 分别设定
  default: low

# 疲劳控制
collapse:
  key: 'doc:{{event.doc_id}}'
  window: 5m
  template: doc.comment.collapsed # 合并后用另一个模板

template: doc.comment.created

# 渠道：系统建议值，最终结果要和用户偏好求交（§8）
channels:
  direct: [inapp, push, email]
  default: [inapp]

# 运维开关
enabled: true
sample_rate: 1.0 # 灰度：只对 x% 的收件人生效
```

### 7.2 三个必须有的能力

**能力一：模拟（simulate）**

```
POST /platform/rules/doc.comment.notify/simulate
{ "eventPayload": {...}, "asOfVersion": 4 }
→ {
    "matched": true,
    "recipients": [
      { "userId": "u1", "reason": "direct",
        "channelsProposed": ["inapp","push","email"],
        "channelsFinal": ["inapp","push"],
        "droppedChannels": [
          { "channel":"email", "stage":"policy",
            "by":"user_preference", "detail":"informational.email=off" }
        ]},
      { "userId": "u2", "reason": "watching",
        "channelsFinal": [], "dropped":"quiet_hours → 延迟到 09:00" }
    ],
    "estimatedFanout": 47
  }
```

**不能模拟的规则引擎，没人敢改规则**。这会导致所有人都绕过它，回去写硬编码——"可扩展"就死了。这个接口不是运维工具，它是规则引擎能否被采纳的前提。

**能力二：回放（replay）**

拿昨天的真实事件跑新规则版本，输出差异报告（"新规则会多发 3200 条通知，其中 2800 条给 watching"），但**不真发**。

**能力三：分级开关（kill switch）**

按 规则 / 渠道 / 租户 / 事件类型 四个维度独立关停，秒级生效。

理由：通知系统的故障模式是**发疯**——某个规则的受众解析出 bug，一分钟发 50 万条。这时候需要的不是"回滚发版"，是**一个开关**。这必须是地基能力，不能后加。

### 7.3 规则该配置化到什么程度（一个我明确的立场）

**表达式语言必须故意受限。** `when` 里只允许布尔运算、比较、成员判断、字段访问。不允许：循环、函数定义、调用外部服务、访问数据库。

理由：一旦规则语言图灵完备，它就变成了一门没有调试器、没有测试框架、没有类型检查的编程语言，而且运行在通知管线的关键路径上。这不是扩展性，是把复杂度藏到一个更糟的地方。

**受众解析器（`watchers`、`assignee` 这些）是代码，注册进来给规则用。** 规则只做组合，不做实现。要加新的解析方式就写代码——那是**应该**发版的东西。

这条界限的实际效果：**运营能改的（文案、渠道、开关、阈值）配置化；工程语义（受众怎么算、事件怎么解析）留在代码里。**

### 7.4 规则用类型化 Python，不用 YAML（修正 §7.1）

§7.1 那份 YAML 的问题：它已经包含 `when:` 表达式、`{{ }}` 模板、条件映射三样东西——**加起来就是一门语言，但没有类型检查器、没有 IDE 支持、没有跳转定义、没有重构**。这是 Helm/Ansible 那套"YAML 工程"抱怨的根源。

值得注意的是 **Novu 自己后来转向了 code-first**（`@novu/framework`，TypeScript + Zod schema 定义 workflow），不是 YAML 也不是 UI 编排。

同一组概念，用 Pydantic 表达：

```python
RULES: list[NotificationRule] = [
    NotificationRule(
        id="doc.comment.notify",
        event=DocCommentCreated,                          # 类型引用，不是字符串
        when=lambda e: e.doc_visibility != "private",      # 真 Python，有类型检查
        audience=[
            Mentions(field="mentioned_user_ids", reason=Reason.DIRECT),
            Assignee(target="doc", id_field="doc_id", reason=Reason.ASSIGNED),
            Watchers(target="doc", id_field="doc_id", reason=Reason.WATCHING),
        ],
        exclude=[Actor(), Muted(target="doc", id_field="doc_id")],
        intent=Intent.INFORMATIONAL,
        urgency={Reason.DIRECT: Urgency.NORMAL, "*": Urgency.LOW},
        collapse=Collapse(
            key="doc:{doc_id}",
            window=timedelta(minutes=5),
            template="doc.comment.collapsed",
        ),
        template="doc.comment.created",
        channels={Reason.DIRECT: [InApp, Push, Email], "*": [InApp]},
    ),
]
```

它**仍然是声明式的**——是数据，只是有类型的数据。换来五件事：

| 收益                   | 说明                                                                    |
| ---------------------- | ----------------------------------------------------------------------- |
| 静态检查               | mypy/pyright 抓拼错的 reason、漏掉的字段、类型不对的 window             |
| 可跳转、可重构         | 改 `Watchers` 签名，所有用处立刻报错                                    |
| **不用发明表达式语言** | `when=` 是真 Python。省掉的是"设计 + 文档化 + 调试一门 DSL"这整块工作量 |
| 启动即校验             | Pydantic 在 import 期炸，不是某条消息触发时才炸                         |
| 模拟/回放/版本化不变   | git 就是版本，`simulate` 照样能跑（§7.2）                               |

代价是**改规则要发版**。这恰好符合 §7.3 划的界——受众怎么算是工程语义。

### 7.5 三层必须拆开（§7.1 最大的问题）

那份 YAML 把三种变更频率、三类作者、三种生效要求混在一个文件里：

| 层                                         | 存哪                           | 谁改      | 频率   | 生效要求 |
| ------------------------------------------ | ------------------------------ | --------- | ------ | -------- |
| **规则**（受众、intent、collapse 逻辑）    | 类型化 Python，git             | 工程      | 低     | 发版     |
| **模板文案**                               | 数据库（版本化 + 预览 + 灰度） | 运营/产品 | **高** | 分钟级   |
| **开关、阈值、`sample_rate`、kill switch** | 数据库/配置中心                | 运维      | 中     | **秒级** |

混在一起的具体后果：**改一个错别字要走发版流程，而 kill switch 又必须不发版就生效**——这两个需求在同一个文件里没法同时满足。§7.2 说 kill switch 必须是地基能力（"需要它的时候正在发疯，没时间发版"），那它就不能和规则同源。

### 7.6 如果坚持用 YAML

最低两条，否则一定腐化：

1. **生成 JSON Schema**，编辑器直接校验（`# yaml-language-server: $schema=...`）
2. **加载时 Pydantic 全量校验，含交叉引用**：`template` 指向的模板存在吗、`as direct` 是合法 reason 吗、`event` 版本存在吗。**启动失败远好过运行时静默降级**

但做完第 2 条会发现：你写了一个 YAML parser 加一套 Pydantic 模型；直接用 Pydantic 模型的话，第 1 条和 YAML 本身都不需要了。

## 8. ③④ 受众代数与策略栈

### 8.1 订阅模型（多数后台系统缺失的一块）

除了"角色/部门"这种静态受众，必须有**对象级订阅**：

```sql
CREATE TABLE subscription (
    user_id      bigint      NOT NULL,
    target_type  varchar(50) NOT NULL,     -- 'doc' | 'project' | 'flow_instance' | 'service'
    target_id    varchar(64) NOT NULL,
    -- 显式订阅 vs 自动订阅（评论过就自动 watch，像 GitHub）
    source       varchar(20) NOT NULL,     -- 'explicit' | 'auto' | 'inherited'
    -- 静音优先级高于订阅。同一张表，state 区分
    state        varchar(20) NOT NULL,     -- 'watching' | 'muted' | 'participating'
    create_time  datetime    NOT NULL,
    PRIMARY KEY (user_id, target_type, target_id)
);
CREATE INDEX idx_sub_target ON subscription (target_type, target_id, state);
```

三个要点：

1. **`source='auto'`**：用户评论过/参与过就自动订阅（GitHub 模式）。这是"多场景"的关键——不需要用户手动订阅每一篇文档就能收到相关更新。
2. **`state='muted'` 和订阅同表**：静音不是"删除订阅"，是一个显式状态。删除订阅会被自动订阅逻辑重新加回来，用户会觉得"我明明关了"。
3. **`inherited`**：订阅了项目 = 隐式订阅项目下所有文档。解析时要向上找，这需要一个层级关系表或者约定 `target_id` 可以是路径。

### 8.2 受众代数

受众表达式是**集合运算**，不是一堆 if：

```
audience = ( mentions(...) as direct )
         ∪ ( assignee(doc, id) as assigned )
         ∪ ( watchers(doc, id) as watching )
         − ( {actor} ∪ muted(doc, id) ∪ inactive_users )
```

实现上是一组**解析器**（resolver），每个解析器是 `(event, params) → Iterator[user_id]`，注册到表里：

```python
@resolver("watchers")
def resolve_watchers(target_type: str, target_id: str) -> Iterator[UserId]:
    """分块迭代，按 user_id 升序（见 §17.3 的加锁顺序要求）"""
```

**同一用户被多个解析器命中时，`reason` 取优先级最高的那个**（`direct > assigned > author > watching > team > broadcast`）。这个优先级表是平台常量，不可配置——它是 `reason` 语义的一部分。

### 8.3 策略栈：分层、有序、可解释

一个 `(user, reason, intent, urgency)` 组合最终能走哪些渠道，由**五层策略求交**决定：

```
第 1 层  系统策略        安全类必走站内+邮件，不可关。租户和用户都不能覆盖
第 2 层  租户策略        本租户关闭了短信渠道 / 设置了全局配额
第 3 层  角色默认        新员工默认订阅哪些、默认渠道
第 4 层  用户偏好        按 (intent × reason × channel) 的三维开关
第 5 层  对象级静音      这篇文档我不想再收到
```

求交顺序是**从上到下**，每一层只能**收窄**不能放宽（除了第 1 层的强制项）。

**关键设计：每一层的裁剪结果都要记录。**

```json
{
  "userId": "u1",
  "reason": "watching",
  "intent": "informational",
  "proposed": ["inapp", "push", "email"],
  "decisions": [
    { "layer": "system", "action": "keep", "result": ["inapp", "push", "email"] },
    { "layer": "tenant", "action": "drop", "channel": "push", "detail": "tenant.push_enabled=false" },
    { "layer": "user", "action": "drop", "channel": "email", "detail": "pref[informational][watching].email=false" },
    { "layer": "mute", "action": "keep" }
  ],
  "final": ["inapp"]
}
```

这就是 §2 两个问题的机械答案。用户问"为什么没收到邮件"，直接把这段翻译成人话。

### 8.4 用户偏好的维度

偏好是 **`intent × reason × channel`** 的三维开关，不是一维的"通知类型开关"：

```
                    inapp  push  email  sms
transactional/*      强制  强制   强制    -     ← 系统策略锁定
actionable/assigned   ✓     ✓     ✓      -
actionable/team       ✓     ✓     ✗      -
informational/direct  ✓     ✓     ✗      -
informational/watch   ✓     ✗     摘要    -     ← "摘要"是第三种状态
alerting/team         ✓     ✓     ✓      ✓
```

三点：

1. **单元格的值有三种：开 / 关 / 摘要**。"摘要"不是"关"——它是"别实时打扰我，攒起来一天发一次"。这是降低疲劳最有效的选项，而大多数系统只给开关两档，结果用户只能在"太吵"和"啥都收不到"之间选。
2. **锁定项由系统策略决定**，前端读到 `locked` 列表后置灰，不硬编码。
3. 这张表看着大（4 intent × 7 reason × 4 channel = 112 格），但 UI 不必全展开——默认按 intent 分组给一行开关，"高级设置"里才展开 reason 维度。

## 9. ⑧ 内容渲染

### 9.0 模板要拆成两半

> **⚠️ 本节结论已被 §22.4 修正 → 见 `review.md` D1。** 下表的"文案该在数据库"只在**单语言**场景成立。有翻译流程时，**文件是基线、库是覆盖层**（翻译产业链围绕文件构建，翻译公司不会登录后台点击）。
>
> 下面"变量契约在代码 / 文案不在代码"这个拆分本身是对的，保留。

"模板"是两种东西粘在一起了，它们该待在不同地方：

|            | **变量契约**                        | **文案本体**                      |
| ---------- | ----------------------------------- | --------------------------------- |
| 内容       | 需要哪些变量、什么类型              | title / body / subject 的实际文字 |
| 谁改       | 工程                                | 运营 / 产品 / 法务                |
| 频率       | 跟事件契约一起变，低                | **最高**                          |
| 生效       | 发版                                | **分钟级**                        |
| 要静态检查 | **要**（必须和事件 payload 对得上） | 不要                              |
| **该在哪** | **代码（Pydantic）**                | **数据库**                        |

按 §7.5 划的界，**文案放在 git 里是违规的**——它要分钟级生效、作者不是工程师、要预览灰度回滚，这些 git 都给不了。

```python
# 代码：变量契约。和事件类型绑定，mypy 能查
class ContractExpiringVars(BaseModel):
    contract_name: str
    days_left: int
    contract_url: HttpUrl
```

```sql
-- 数据库：文案本体
sys_msg_template(key, version, channel, locale, field, content, status, created_by, ...)
```

拆开的实际收益：**编辑后台能拿变量契约做即时校验**。运营输 `{{contractNam}}`（少个 e）保存时就被拒，而不是等这条通知真的触发时渲染失败。CI 里再做一次全量检查：库里每条模板引用的变量必须是声明的子集。

**例外：邮件 HTML/MJML 骨架该在 git。** 它是代码不是文案——要编译、要测 Outlook/Gmail 兼容、要走 review。

```
git:  templates/email/contract-expiring.mjml   骨架 · 布局 · 按钮 · 暗色适配
库:   subject / 正文段落 / CTA 文字             运营改的部分
```

骨架留占位，文案从库注入。和 i18n 一致：布局在代码，字符串在资源。

**P0 的务实做法**：文案先放 git 的 seed YAML，**但渲染路径按数据库设计**——启动 seed 进库，渲染只从库读。P0 不做编辑后台（改文案就重新 seed），P1 加后台**零重构**。这和 `infra.md` §10.1 同一个思路：先简化触发方式，别简化代码路径。反过来（先直接读文件，以后改成读库）就是重构。

### 9.1 模板的形状（下面这份 YAML 是 seed 格式，不是运行时真相）

```yaml
key: doc.comment.created
version: 5
variables: # 变量 schema，渲染前校验
  actorName: { type: string, required: true }
  docTitle: { type: string, required: true }
  excerpt: { type: string, required: false, maxLength: 120 }
  docUrl: { type: url, required: true }

variants:
  inapp:
    zh-CN:
      title: '{{actorName}} 评论了《{{docTitle}}》'
      summary: '{{excerpt}}'
    en-US:
      title: '{{actorName}} commented on {{docTitle}}'
      summary: '{{excerpt}}'
  push:
    zh-CN:
      title: '{{actorName}} 评论了《{{docTitle}}》'
      body: '{{excerpt}}' # push 有长度限制，单独写而不是截断 inapp 的
  email:
    zh-CN:
      subject: '[{{docTitle}}] {{actorName}} 的新评论'
      html: '@include: email/doc-comment.zh-CN.mjml'
```

### 9.2 三条硬规则

1. **变量缺失 = 渲染失败，不是尽力而为。** `Template.substitute` 抛 `KeyError`（信息太少），`safe_substitute` 把 `$actorName` 原样发给用户（更糟）。两个都不能直接用——要**先按 schema 校验**，失败进死信队列并告警。
2. **每个渠道单独写文案，不做自动截断。** push 限 100 字符不是"把站内文案截断到 100"，是"为 push 写一句 100 字符内说得清的话"。自动截断会在句子中间断开。
3. **模板变更走版本 + 灰度 + 可回滚。** 改文案是最高频的变更，也是最容易发出错别字给 10 万人的操作。要有预览、要有 lint（检查变量是否都声明了、检查 HTML 是否安全）。

### 9.3 为什么渲染放在管线第 ⑧ 步（这么晚）

直觉会把渲染放在很早——事件进来就渲染好。但渲染依赖两个只有到最后才知道的东西：

- **locale**：收件人的语言。同一条消息给不同人是不同语言
- **是否被合并**：collapse 之后要用另一个模板（"3 人评论了"而不是"张三评论了"）

放在阶段⑧（疲劳控制和调度之后），这两件事都已确定。放在前面就要么渲染多次，要么渲染完了再重渲染。

**代价**：渲染失败发生得很晚，此时收件箱行已经写了（阶段⑤）。所以收件箱行要允许"内容待渲染"状态——写入时先落一个占位，渲染成功后回填。这是刻意接受的复杂度，换来的是多语言和合并都不用特殊处理。

## 10. ⑥ 疲劳控制（决定用户会不会关掉整个通知）

这一层的存在理由：**通知系统真正的失败不是"发不出去"，是"发太多导致用户全部忽略"。** 后者没有报错，没有指标，只有用户默默关掉。

四种机制，作用于不同时间尺度：

### 10.1 Collapse（折叠）：同一对象的多次变化合成一条

```
5 分钟内：张三评论 → 李四评论 → 王五评论
折叠为：  "张三、李四和另 1 人评论了《方案 V2》"
```

实现：按 `(user_id, collapse_key)` 开一个聚合窗口。

```sql
CREATE TABLE aggregation_window (
    user_id      bigint      NOT NULL,
    collapse_key varchar(200) NOT NULL,
    -- 参与折叠的消息 id 列表
    msg_ids      json        NOT NULL,
    actor_ids    json        NOT NULL,     -- 去重后的触发者，用于"张三和另 2 人"
    open_time    datetime    NOT NULL,
    flush_at     datetime    NOT NULL,     -- 到点冲刷
    PRIMARY KEY (user_id, collapse_key)
);
CREATE INDEX idx_agg_flush ON aggregation_window (flush_at);
```

两种窗口语义，规则里选：

- **固定窗口**：第一条到达后 5 分钟冲刷。延迟可预测
- **滑动窗口（debounce）**：每来一条重置 5 分钟，最长等 30 分钟。适合"等这一波改完再通知"

**只有 `intent=informational` 和 `actionable` 可以折叠。** `transactional` 和 `alerting` 不行——每一条都是独立事实。这就是 §3.1 那个字段的用处。

### 10.2 Digest（摘要）：跨对象的定时汇总

用户偏好里选了"摘要"的那些，不实时发，攒到每天/每周固定时间发一封。

关键细节：**摘要的发送时间是收件人本地时间**。"每天早上 9 点"对北京和纽约的用户是两个不同的 UTC 时刻。这要求：

- 设备/用户表记录 `timezone`
- 调度器按时区分片跑（每个整点跑一次，处理"当地时间正好 9 点"的那批用户）

摘要里的内容要**重新排序和分组**，不是按时间倒序糊一堆——按 reason 分组（"3 条 @你的" / "12 条订阅更新"），这才有可读性。

### 10.3 Throttle（限流）：硬上限

```
每用户 每渠道 每小时 最多 N 条
超出后：informational 直接丢弃并计数（在收件箱里仍可见）
        actionable 降级到摘要
        transactional / alerting 不限流
```

这是**保护用户也保护供应商配额**的底线。超出时的处理必须按 intent 分档——统一丢弃会丢掉验证码。

### 10.4 Snooze / Mute（用户主动降噪）

- **Snooze**：这条消息 2 小时后再提醒我。需要延迟队列
- **Mute object**：这个对象我不想再收到（写 `subscription.state='muted'`）
- **Mute thread**：这条消息的后续更新我不想再收到（比 mute object 粒度更细）

这三个是**用户表达"太吵了"的正当出口**。没有它们，用户唯一的出口是关掉整个通知——那就彻底失去这个渠道了。

### 10.5 反馈闭环（阶段⑪）

用户点"太吵了 / 退订"时，记录 `(rule_id, reason, user_id)`。按规则聚合出**退订率**：

```
规则 doc.comment.notify (reason=watching)：
  发送 12,400 条，打开率 3%，退订 240 人 (1.9%)
  → 这条规则的 watching 分支应该默认改成摘要
```

**这是唯一能告诉你"哪条规则在伤害用户"的数据。** 没有它，通知规则只会单调增加，因为每个业务团队都觉得自己的通知很重要。

## 11. ⑦ 调度

需要一个**延迟队列**（不是 cron），支持：

| 用途                      | 延迟量级 |
| ------------------------- | -------- |
| collapse 窗口冲刷         | 秒~分钟  |
| 免打扰结束后投递          | 小时     |
| snooze                    | 小时~天  |
| 定时公告                  | 天~月    |
| 升级阶梯的下一步（§12.3） | 分钟     |
| 投递重试退避              | 秒~小时  |

实现选择：`(fire_at, task)` 表 + 索引 + 抢占式领取。够用且可查询可取消。用 Redis ZSET 更快但可观测性差、重启要恢复。

**免打扰的两种语义要分清**（规则里选）：

- **抑制（suppress）**：免打扰期间不发，**过后也不补**。适合 informational
- **延迟（defer）**：攒到免打扰结束一起发。适合 actionable
- **穿透（bypass）**：`urgency=critical` 和 `intent=transactional` 无视免打扰

大多数系统只做了"抑制"，然后用户抱怨"半夜的审批早上没看到"。

## 12. ⑨ 渠道与投递

### 12.1 渠道适配器

```python
class ChannelAdapter(Protocol):
    name: str
    # 这个渠道能不能承载这种 intent（短信不适合 informational）
    supports: set[Intent]
    # 单条最大长度、是否支持富文本、是否支持内联动作
    capabilities: ChannelCapabilities

    async def send(self, target: DeliveryTarget, content: RenderedContent) -> SendResult:
        ...
    # 供应商回调解析（送达/失败/退信/点击）
    def parse_receipt(self, raw: dict) -> Receipt:
        ...
```

渠道清单（按接入顺序）：`inapp` → `push`(APNs/FCM/厂商通道) → `email` → `sms` → `webhook` → `im`(企微/钉钉/飞书/Slack) → `voice`(电话外呼，仅 critical)

**`webhook` 出站要单列**：让外部系统订阅通知，是"多场景"的重要一环（客户想把告警接到自己的系统）。需要签名、重试、失败熔断。

### 12.2 供应商容灾

每个渠道下挂多个供应商，带健康度和权重：

```
sms:
  - provider: aliyun,  weight: 80, health: ok
  - provider: tencent, weight: 20, health: ok
  失败 → 换供应商重试（不是同一个供应商重试）
  连续失败率 > 30% → 自动降权
```

关键：**同一供应商的重试和换供应商的重试是两件事**。前者对付网络抖动，后者对付供应商故障。只做前者，供应商宕机时会把消息全部重试到死。

### 12.3 升级阶梯（`urgency=critical` 专用）

这是告警场景的核心，也是普通通知系统和"能撑住 oncall"的区别：

```yaml
escalation:
  - wait: 0     channels: [inapp, push]
  - wait: 5m    channels: [sms]          if_not: acknowledged
  - wait: 10m   channels: [voice]        if_not: acknowledged
  - wait: 15m   target: on_call_backup   if_not: acknowledged
  - wait: 20m   target: team_lead        if_not: acknowledged
stop_when: [acknowledged, resolved]
```

要点：

- **停止条件是"已确认（acknowledged）"，不是"已读"**。已读可能是误触，确认是显式动作
- 每一步是延迟队列里的一个任务，`stop_when` 满足时取消后续任务
- **升级可以换人**（`on_call_backup`、`team_lead`），这需要值班表（on-call schedule）——一个独立子系统，但接口很窄：`resolve_oncall(team, at_time) → user_id`

### 12.4 内联动作（inbound）

邮件里的"批准/驳回"按钮、push 的快捷操作。需要**签名的动作令牌**：

```
token = sign({
  msg_id, user_id, action: 'approve',
  exp: now + 7d, nonce
})
```

三条安全要求：

1. **单次使用**（nonce 落库，用过即废）——邮件会被转发
2. **有过期时间**
3. **敏感动作不允许一键完成**，令牌只用于"跳转到已登录的确认页"，不直接执行

## 13. ⑤⑩ 收件箱与状态收敛

### 13.1 站内收件箱是唯一真相（I3）

所有渠道都是收件箱的投影。这条的实际含义：

- 阶段⑤（写收件箱）**在所有外发渠道之前**。收件箱写失败 = 整条失败
- push/email 里的"已读"不回写状态，用户在哪个渠道点开都汇聚到收件箱
- 实时推送（WebSocket/SSE）**不是渠道**，是"收件箱变了"的失效信号

### 13.2 每用户单调序号（I4，全文技术核心）

**问题**：客户端要在多设备、断线、重复推送、多标签页下保证未读数正确。靠"推送里带消息内容 + 客户端按 id 去重"解决不了断线丢失。

**方案**：每个用户的收件箱有一个单调递增 `seq`。任何变更（新消息、已读、处理态变化、撤回）都推进它。客户端只持有 `lastSeq`，走增量对账。

**为什么不能用全局自增/雪花**：

```
时刻   事务 A（用户 U）     事务 B（同一用户 U）     客户端
 t1    取号 100
 t2                         取号 101
 t3                         COMMIT
 t4                                                 sync?since=99 → 看到 101，lastSeq=101
 t5    COMMIT
 t6                                                 sync?since=101 → 空
```

**seq=100 永久丢失。** 取号顺序和提交顺序无关——这是所有基于自增 id 的增量同步的经典陷阱。症状是**未读数偶尔少一条，无任何错误日志**。雪花更糟：带机器位，多实例下连大致有序都不保证。

**正确做法**：每用户一行计数器，行锁持有到提交。

```sql
UPDATE inbox_cursor
   SET next_seq = next_seq + 1
 WHERE user_id = :userId
RETURNING next_seq - 1 AS seq;
```

论证：

1. 该语句对这一行取**行级排他锁**，锁持有到事务结束
2. 同一用户的第二个事务取号必须**等第一个提交或回滚**
3. 因此对同一用户：**取号序 = 提交序 = 可见序**
4. 推论：客户端看到 seq=N 时，所有 seq<N 的变更都已提交可见，`sync?since=N` 安全

竞争范围只有单用户那一行。单用户的通知写入速率天然极低。

**逃生方案**（真出现锁竞争再上）：全局序列 + 水位线，只暴露 `seq < min(在途事务最小 seq)` 的变更。代价是要维护在途事务表 + 可见性延迟。先埋 `cursor_lock_wait_ms` 指标，用数据决定。

### 13.3 对账接口

```
GET /inbox/sync?cursor=1042&bcast=88
→ {
    changes: [
      {seq:1043, op:'upsert', entry:{...}, msg:{...}},
      {seq:1044, op:'patch',  msgId:'x', readAt:'...'},
      {seq:1045, op:'retract', msgId:'y', reason:'revoked'}
    ],
    broadcasts: [...],
    cursor: 1045, bcast: 90,
    counts: {unread: 7, pending: 2, byCategory: {...}},
    truncated: false
  }
```

一个接口解决五件事：重复推送（`seq <= lastSeq` 丢弃）、断线补齐、多设备已读同步、未读数漂移（每次返回权威值）、落后太多（`truncated` → 全量重载）。

实时通道退化成一行信号：`{type:'inbox.changed', data:{seq:1045}}`。客户端 `if (seq > lastSeq) scheduleSync()`，带防抖。

### 13.4 消息修订与撤回

现实里消息会变：待办被别人处理了、告警自动恢复了、公告发错了。

```
revision   int      每次内容变更递增
retracted  bool     撤回（内容仍在，标记不可见）
superseded_by msg_id  被另一条消息取代
```

三种语义要分开：

- **修订（revise）**：内容变了，`revision+1`，seq 推进。客户端替换
- **撤回（retract）**：不该发，标记后客户端移除。**push 也要撤回**（§13.6）
- **取代（supersede）**："服务已恢复"取代"服务异常"，两条合并显示为一条已解决

`superseded_by` 是告警场景的关键——没有它，收件箱会堆满"异常/恢复/异常/恢复"。

### 13.5 设备注册表

```sql
CREATE TABLE user_device (
    device_id    varchar(64) PRIMARY KEY,
    user_id      bigint      NOT NULL,
    platform     varchar(20) NOT NULL,      -- ios|android|web|desktop
    push_token   varchar(255),
    locale       varchar(20) NOT NULL,
    timezone     varchar(50) NOT NULL,
    -- 这台设备已经同步到哪了，用于推送撤回和"只推给不在线的设备"
    synced_seq   bigint      NOT NULL DEFAULT 0,
    last_seen    datetime    NOT NULL,
    push_enabled boolean     NOT NULL DEFAULT true
);
```

它支撑三个能力：多设备 locale/timezone、推送撤回、**"用户正在网页端活跃就不推手机"**（最有效的降噪手段之一，几乎零成本）。

### 13.6 推送撤回

用户在网页上读了消息，手机通知栏那条应该消失。

实现：已读事件触发向该用户**其他设备**发一条静默推送（`content-available` / data-only message），客户端 SDK 收到后调系统 API 移除通知。

这个功能的存在与否，直接决定用户对通知系统的观感——"我明明看过了手机还在提醒"是最招人烦的体验之一。

---

# 第三部分：工程

## 14. 数据模型全景

```
━━ 写侧 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
event                 事件（幂等边界，永久保留，无 PII）
event_schema          事件契约注册表（版本化）
outbox                事务性发件箱
rule / rule_version   规则（声明式，版本化）
template / template_version   模板

━━ 消息与收件箱 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
message               消息内容 + 受众定义 + 生命周期 + revision
message_audience_snapshot   发布时的受众快照（撤回和统计用）
inbox_entry           ★ 唯一带 user_id 的核心表：seq + 状态
inbox_cursor          ★ seq 分配器 + 计数器 + 各类水位
broadcast_state       全员公告的惰性已读态（读扩散）

━━ 疲劳与调度 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
subscription          对象级订阅 / 静音
preference            用户偏好（intent × reason × channel）
aggregation_window    折叠窗口
digest_bucket         摘要待发内容
scheduled_task        延迟队列
throttle_counter      限流计数（Redis，可丢）

━━ 投递 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
user_device           设备注册表
delivery              外部渠道投递记录 + 重试状态
delivery_receipt      供应商回执（送达/失败/退信/点击）
escalation_run        升级阶梯的执行状态
suppression_list      退信/退订黑名单（邮件必须有）

━━ 可观测 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
notification_trace    ★ 每阶段决策记录（I5）
feedback              退订/太吵/举报
```

核心三张表的关键约束：

```sql
-- 幂等（I1）
CONSTRAINT uk_event_dedupe   UNIQUE (tenant_id, dedupe_key)
CONSTRAINT pk_inbox_entry    PRIMARY KEY (user_id, message_id)   ← 扇出幂等就是它
CONSTRAINT uk_inbox_seq      UNIQUE (user_id, seq)               ← seq 唯一性
CONSTRAINT uk_delivery       UNIQUE (message_id, user_id, channel)

-- 收件箱的冗余字段：从 message 复制不可变的筛选/排序键，让列表查询不 join
inbox_entry.category / priority / intent / reason / published_at
-- title/body 不冗余（要支持修订和撤回）
```

## 15. 扇出策略：三档

| 受众规模                          | 策略           | 机制                                                                |
| --------------------------------- | -------------- | ------------------------------------------------------------------- |
| ≤ 1000                            | **写扩散**     | 逐个插 `inbox_entry`，分块 500，`ON CONFLICT DO NOTHING`            |
| 全员（`all`）                     | **读扩散**     | 不插行，`message.bcast_seq` + 用户水位 + `broadcast_state` 惰性记录 |
| 超大 + 高频（万人以上的活跃对象） | **混合时间线** | 写扩散给活跃用户，非活跃用户读扩散                                  |

**为什么读扩散只给 `all`**：读扩散最麻烦的是"查询时判断这条是否命中我"。`all` 时这个判断恒真，谓词消失，未读数一条便宜 SQL 就出来。一旦允许 `roles`/`depts` 读扩散，每次查列表都要带用户的角色/部门树做集合运算，而且"用户换部门后历史公告的可见性"会变成一个说不清的死结（部门调整是常规操作，不是假想）。

**第三档（混合）什么时候需要**：某个对象有 5 万订阅者且每天变化几十次（比如一个大项目）。纯写扩散是 5 万 × 几十 = 每天百万行。这时按"最近 7 天登录过"切分，活跃用户写扩散（体验好），非活跃用户读扩散（不浪费存储）。**这一档 P0 不做，但表结构要留得下**——`inbox_entry` 里不能有"必须存在才算收到"的隐含假设。

## 16. 热点与背压

三个必须想清楚的失控场景：

**场景一：某个规则受众解析出 bug，一分钟 50 万条。**

- 防线 1：每规则每分钟扇出上限，超过自动熔断并告警
- 防线 2：kill switch（§7.2）
- 防线 3：扇出队列和普通队列隔离，别把验证码堵死

**场景二：某个用户是 1000 个对象的订阅者，每秒收到几十条。**

- `inbox_cursor` 那一行成为热点（§13.2 的行锁）
- 对策：**同一批次内合并**——一次扇出给同一用户的多条消息，一个事务里一次取号取 N 个（`next_seq += N`），而不是 N 次取号

**场景三：供应商挂了，重试队列雪崩。**

- 指数退避 + 抖动 + 每渠道并发上限
- 熔断：失败率超阈值直接停止投递，消息留在队列（**不丢，因为收件箱已经有了**）

第三条体现了 I3 的价值：**外部渠道全挂了也不丢消息，因为站内是真相。** 这是"站内第一公民"设计换来的最大好处。

## 17. 幂等与一致性的机械保证

汇总散落在各处的机制，方便 review 时逐条检查：

| 环节         | 机制                                                 |
| ------------ | ---------------------------------------------------- |
| 事件重复摄入 | `uk_event_dedupe` + `ON CONFLICT DO NOTHING`         |
| 扇出重复执行 | `PK(user_id, message_id)` + `ON CONFLICT DO NOTHING` |
| 扇出中断续跑 | `message.fanout_cursor`，按 user_id 升序推进         |
| 扇出死锁     | **所有路径统一按 user_id 升序加锁** + 分块独立事务   |
| 投递重复发送 | `uk_delivery(message_id, user_id, channel)`          |
| 外发早于提交 | outbox：业务事务只写两行，外发全在 worker 新事务     |
| seq 顺序倒挂 | 每用户计数器行 + 行锁到提交（§13.2）                 |
| 计数器漂移   | 与 seq 同事务维护 + 定时对账 + `unread_drift` 指标   |
| 客户端丢消息 | `sync?since=` 增量对账 + `truncated` 全量兜底        |
| 动作令牌重放 | nonce 单次使用 + 过期时间                            |

## 18. 可观测、可解释、可运维

### 18.1 Trace（I5）

每条通知在每个阶段留一行决策：

```
trace_id: t_8f3a...  (= event_id)
├─ ingest    ok      dedupeKey=..., schema=doc.comment.created@2
├─ match     ok      rules=[doc.comment.notify@3], skipped=[doc.digest@1 (when=false)]
├─ resolve   ok      47 recipients: direct=2, watching=44, author=1
│                    excluded: actor=1, muted=3
├─ policy    ok      u1: [inapp,push,email] → [inapp,push]  (user pref: email=off)
│                    u2: [inapp] → []                       (quiet_hours → defer 09:00)
├─ inbox     ok      47 entries, seq 1043..1089
├─ shape     ok      12 collapsed into 4 (key=doc:42)
├─ schedule  ok      35 immediate, 12 deferred
├─ render    ok      zh-CN×35, en-US×12
├─ dispatch  partial push: 33 ok / 2 failed(invalid token) | email: 12 queued
└─ converge  ...     read: 8/47 (17%), acked: 2
```

采样策略：`transactional`/`alerting` 全量留 trace，`informational` 采样 1%——全量存 trace 的量级会超过消息本身。

**这份 trace 直接回答 §2 的两个问题。** 客服工单变成"把 trace_id 贴进来"。

### 18.2 关键指标

| 指标                                | 为什么它重要                                                                           |
| ----------------------------------- | -------------------------------------------------------------------------------------- |
| `outbox_lag_seconds`                | worker 挂了的第一信号                                                                  |
| **`unread_drift`**                  | 计数器对账差值。**最重要的健康信号**：非零稳定=正常，开始增长=刚上线的改动破坏了计数器 |
| `sync_truncated_total`              | 应接近 0。升高说明客户端在大面积落后                                                   |
| `cursor_lock_wait_ms`               | §13.2 的行锁等待。持续上升才考虑逃生方案                                               |
| `fanout_rate{rule}`                 | 突增 = 某规则受众解析出问题                                                            |
| **`unsubscribe_rate{rule,reason}`** | **唯一能告诉你哪条规则在伤害用户的数据**                                               |
| `open_rate{rule,channel}`           | 低开启率 = 这条通知没价值，该删规则                                                    |
| `escalation_triggered`              | 升级被触发的次数。高说明第一跳渠道不可靠                                               |
| `render_failure{template}`          | 模板变量缺失，一定要告警                                                               |

`unsubscribe_rate` 和 `open_rate` 这两个是**反哺规则设计**的。没有它们，通知规则只会单调增加，因为每个业务团队都觉得自己的通知很重要。

### 18.3 运维接口

```
POST /admin/rules/{id}/simulate     不发真的跑一遍
POST /admin/rules/{id}/replay       拿历史事件跑新版本，出差异报告
POST /admin/killswitch              按 规则/渠道/租户/事件类型 关停
GET  /admin/trace/{traceId}         完整决策路径
POST /admin/messages/{id}/retract   撤回（含推送撤回）
GET  /admin/quota                   各租户/渠道配额使用情况
POST /admin/deadletter/{id}/retry   死信重投
GET  /admin/why?user=&msg=          "他为什么没收到" 的直接答案
```

最后一个 `GET /admin/why` 值得单独说：它是把 trace 反向查询包装成一个人类能直接用的接口。客服和实施团队最常问的就是这个问题，做成接口能省掉大量工程师时间。

## 19. 多租户、i18n、合规

**租户隔离**：每张表带 `tenant_id`；租户级配额、渠道开关、模板覆盖（租户可以改文案）、供应商（大客户用自己的短信账号）。

**i18n**：locale 来自设备/用户，模板按 locale 存。没有对应 locale 时**回退链**（`zh-TW → zh-CN → en-US`），回退发生时记指标——否则会长期悄悄发错语言。

**时区**：所有存储 UTC，所有展示和调度用户本地。摘要/免打扰/定时公告都依赖它。

**合规**：

- 邮件必须有退订链接和 `suppression_list`（退信/投诉自动加黑，再发就是违规）
- 事件表无 PII（§6.2），message 内容按留存策略清理
- 删除用户时：`inbox_entry` 删、`message` 保留（可能多人收）、`event` 保留（审计）、PII 字段脱敏
- `security` 类通知不可关闭且永久保留

## 20. 留存与容量

| 表                     | 留存                                           | 理由                         |
| ---------------------- | ---------------------------------------------- | ---------------------------- |
| `event`                | 永久（冷存归档）                               | 审计源，量级远小于 inbox     |
| `message`              | 永久                                           | 同上                         |
| `inbox_entry`          | 已读 180 天后删；**未读不删**；`security` 不删 | 删未读会让用户发现未读数少了 |
| `delivery` + `receipt` | 90 天                                          | 量最大，价值随时间衰减最快   |
| `trace`                | transactional/alerting 90 天，其他 7 天        | 全量留会超过消息本身         |
| `aggregation_window`   | 冲刷即删                                       | 临时状态                     |

`inbox_entry` 是唯一无限膨胀的表。分区用 **`HASH(user_id)`** 而不是 `RANGE(time)`——所有热查询都带 `user_id`，按时间分区会让每次 sync 扫所有分区。代价是归档要跑分块 DELETE 而不是 `DETACH PARTITION`。

**但 P0 不分区**：1 万用户 × 20 条/天 × 365 天 ≈ 7300 万行/年，加上 §14 的索引没有压力。等过 5 亿行再说。

## 21. 部署拓扑

```
                     ┌─────────────────┐
   业务服务 ─────────→│ Ingest API      │→ event + outbox（同事务提交）
   外部 webhook ─────→│ (无状态，可水平)  │
                     └─────────────────┘
                              ↓ outbox
        ┌──────────────────────────────────────────┐
        │  Pipeline Worker（可水平扩，按 event 分片）│
        │  match → resolve → policy → inbox        │
        └──────────────────────────────────────────┘
                     ↓                    ↓
        ┌────────────────────┐   ┌───────────────────────┐
        │ Shaper（聚合/摘要）  │   │ Scheduler（延迟队列）  │
        └────────────────────┘   └───────────────────────┘
                              ↓
        ┌──────────────────────────────────────────┐
        │  Dispatch Worker（按渠道分队列！）         │
        │  push | email | sms | webhook | im       │
        └──────────────────────────────────────────┘
                     ↓
        ┌──────────────────────────────────────────┐
        │  Realtime Gateway（长连接，独立伸缩）      │
        │  连接注册表在 Redis，跨实例 Pub/Sub 扇出   │
        └──────────────────────────────────────────┘

        ┌──────────────────────────────────────────┐
        │  Inbox Read API（无状态，只读库/只读副本） │
        │  list / sync / counts / read              │
        └──────────────────────────────────────────┘
```

三个刻意的切分：

1. **渠道分队列。** 邮件供应商挂了不能堵住验证码短信。共用一个队列 = 一个渠道的故障变成全渠道故障。
2. **实时网关独立伸缩。** 长连接的资源模型（内存、连接数）和无状态 API 完全不同，混在一起没法调容量。连接注册表**必须在 Redis**——放进程内存就无法多实例部署。
3. **读 API 走只读副本。** `sync` 是最高频接口（每个客户端每几秒一次），它和写侧竞争主库是不必要的。注意副本延迟：`sync` 返回的 `cursor` 必须来自副本自己看到的数据，否则客户端会拿到"未来的 cursor"然后跳过消息。**这是个真陷阱**——解法是 sync 返回 `min(副本可见的最大 seq, 请求时刻的 cursor)`。

## 22. 扩展契约：新业务接入要写什么

"可扩展"的验收标准是：**一个业务团队要加一种新通知，需要动多少平台代码？答案应该是零。**

他们写**两个 Python 声明 + 一条模板记录**，全在自己的模块里：

```python
# 1. 事件契约
@event("contract.expiring", version=1)
class ContractExpiring(BaseModel):
    contract_id: int
    contract_name: str
    days_left: int
    owner_id: int
    dept_id: int


# 2. 模板变量契约（§9.0：契约在代码，文案在库）
class ContractExpiringVars(BaseModel):
    contract_name: str
    days_left: int
    contract_url: HttpUrl


# 3. 规则（§7.4：类型化，不用 YAML）
RULES = [
    NotificationRule(
        id="contract.expiring.notify",
        event=ContractExpiring,
        audience=[
            User(field="owner_id", reason=Reason.ASSIGNED),
            DeptManagers(field="dept_id", reason=Reason.TEAM),   # 不存在就 import 报错
        ],
        intent=Intent.ACTIONABLE,
        urgency={Reason.ASSIGNED: Urgency.NORMAL, "*": Urgency.LOW},
        collapse=Collapse(key="dept:{dept_id}", window=timedelta(hours=1)),
        template="contract.expiring",
        vars=ContractExpiringVars,       # 编辑后台和 CI 都用它校验文案里的变量
        channels={Reason.ASSIGNED: [InApp, Push, Email], "*": [InApp]},
    ),
]

# 4. 文案 → 在后台里填。首版可以提一份 seed YAML（§9.1）
```

关键差别在 `DeptManagers`：写成 YAML 里的 `dept_managers(...)` 时，拼错或者这个 resolver 不存在是**运行时错误**，而且可能只在"这个部门恰好有 manager"那条分支上才炸。写成类型时是**启动就报错**。

### 22.1 PM 想看"我们会在什么时候通知用户"

这是支持 YAML 清单的最好理由——声明式的东西可读性好。但更好的答案是**自动生成目录**：

```
GET /admin/notification-catalog
→ 从 RULES 生成人类可读的表：
  事件 / 触发条件 / 谁会收到（按 reason 分列）/ 走哪些渠道 / 是否合并 / 当前开关状态
```

生成的目录严格优于手写清单，因为**它不会和实现脱节**。手写的 YAML 清单三个月后一定有几条和代码不一致，而且没人知道哪条是对的。

### 22.2 总判据

这条判据从头到尾一致，可以直接拿去判断任何一块配置：

|                  | **代码（Python）**                    | **数据库**                                       | **git 文件**                         |
| ---------------- | ------------------------------------- | ------------------------------------------------ | ------------------------------------ |
| 谁改             | 工程                                  | 运营 / 运维                                      | 工程                                 |
| 生效             | 发版                                  | 秒~分钟                                          | 发版                                 |
| 要静态检查       | ✅                                    | ✗（运行时校验）                                  | 视情况                               |
| 要预览/灰度/回滚 | git 够了                              | **需要运行时能力**                               | git 够了                             |
| 例子             | 事件契约、规则、resolver、变量 schema | **文案**、开关、阈值、kill switch、`sample_rate` | 邮件 MJML 骨架、seed 数据、i18n 兜底 |

### 22.3 什么适合放 YAML / 文件——按接受程度看

上面那张判据表是按"谁改、多快生效"分的。但还有一个维度：**别的工程师看到会不会觉得奇怪**。这条线画得比较准：

> **YAML 承载"纯数据、不引用代码符号、不表达条件"的东西，大家都觉得正常。一旦要引用代码符号或表达逻辑，就开始被质疑。**

| 放 YAML 大家觉得正常 | 放 YAML 会被质疑                           |
| -------------------- | ------------------------------------------ |
| 多语言文案           | `when:` 条件表达式                         |
| 大块表格 / 矩阵数据  | 引用 resolver 名（`dept_managers(...)`）   |
| seed / fixtures      | 引用类型名（`event: contract.expiring@1`） |
| 邮件模板骨架（MJML） | 需要和 payload 对齐的变量 schema           |
| CI / 编排 / 部署     | 需要 mypy 检查的契约                       |

§7.1 那份 YAML 里右边那列占了大半——问题不是"用了 YAML"，是**用 YAML 干了它不擅长的事**。

**YAML 该赢的一个场景：大表格。** 偏好默认值是 `intent × reason × channel` 的矩阵（4×7×4 = 112 格），写成 Python 嵌套字典时引号逗号的噪音会盖掉内容：

```yaml
defaults:
  transactional:
    '*': { inapp: locked, push: locked, email: locked, sms: off }
  actionable:
    assigned: { inapp: on, push: on, email: on, sms: off }
    team: { inapp: on, push: on, email: off, sms: off }
  informational:
    direct: { inapp: on, push: on, email: off, sms: off }
    watching: { inapp: on, push: off, email: digest, sms: off }
```

YAML + 加载时 Pydantic 校验枚举合法性，可读性和安全性都拿到。

### 22.4 ★ 翻译工作流把文案往文件方向拉（修正 §9.0）

§9.0 说"文案该在数据库"，那是**单语言场景**的结论。有正式翻译流程时不成立：

**整个翻译产业链是围绕文件构建的**——提取 → 送翻 → 回填 → PR review。Crowdin / Weblate / Lokalise 都吃文件。**翻译公司不会登录后台去点击。**

而且本仓库已有约定：`packages/web/admin-i18n/src/langs/{zh-cn,en-us}/notification.json`，前端 i18n 是**按 locale 分目录的 JSON**。后端文案用同一形式，前后端一致，翻译工具一套配置搞定。

**结论：文件做基线，库做覆盖层。**

```
文件（git，跟代码发版）      = 基线。所有 locale 的完整文案，走翻译流程
数据库（可选，优先级更高）    = 覆盖层。运营临时改某条，不等发版
渲染：库里有覆盖 → 用覆盖；没有 → 用文件基线
```

四个好处：翻译流程不受影响；运营能紧急改措辞（法务要求、金额写错）；**覆盖层空着也能跑**，所以 P0 完全不做后台没问题；覆盖记录带 `created_by` + 时间，还能"清除覆盖"回到基线。

**顺序不能反**：文件是基线、库是覆盖。反过来（库是基线、文件兜底）会让"新增一种语言"变成数据库迁移。

### 22.5 落到本项目的具体选择

| 东西                                      | 放哪     | 格式                       | 理由                                           |
| ----------------------------------------- | -------- | -------------------------- | ---------------------------------------------- |
| 事件契约、规则、resolver                  | 代码     | Pydantic                   | 要类型检查、要引用符号                         |
| 变量契约                                  | 代码     | Pydantic                   | 要和 event payload 对齐                        |
| **文案基线**                              | git 文件 | **JSON，按 locale 分目录** | **对齐现有 `admin-i18n` 约定**，翻译工具吃这个 |
| 文案覆盖层                                | 数据库   | —                          | 运营改文案不等发版（P1）                       |
| 邮件骨架                                  | git 文件 | MJML                       | 是代码，要编译要测客户端兼容                   |
| 偏好默认矩阵                              | git 文件 | **YAML**                   | 大表格，YAML 可读性明显更好                    |
| 开关 / 阈值 / `sample_rate` / kill switch | 数据库   | —                          | **要秒级生效**，不能发版                       |
| 初始数据                                  | git 文件 | YAML                       | seed                                           |

两个"随项目约定"而非个人偏好的选择：

1. **文案用 JSON 不用 YAML** —— `admin-i18n` 已经是 JSON，前后端一致比格式偏好重要
2. **配置继续走 `.env` + pydantic-settings，不引入 YAML 配置** —— 项目现在就是这套，多一种配置来源只会让"这个值到底从哪来"变难查

然后业务代码里一行：

```python
await notify.emit(ContractExpiring(...), dedupe_key=f"contract.expiring:{cid}:{date}")
```

**没写的东西**：受众怎么查、偏好怎么算、什么时候发、哪个渠道、失败怎么重试、已读怎么同步、多语言怎么处理。全部由平台负责。

唯一需要平台改代码的情况：**要一种新的受众解析方式**（比如 `dept_managers` 还不存在）。那确实应该发版——它是工程语义，不是配置。

---

# 第四部分：边界与路径

## 23. 即使无约束也不做的事

好设计要有边界。这些我明确不做，理由不是"没时间"：

| 不做                                    | 理由                                                                                                     |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **图灵完备的规则语言**                  | 会变成没有调试器、没有类型检查、跑在关键路径上的编程语言。这不是扩展性，是把复杂度藏到更糟的地方（§7.3） |
| **可视化规则编排器**                    | 拖拉拽出来的规则一样难懂，还多一个不敢改的 UI。声明式 YAML + 模拟 + diff 已经够了                        |
| **规则里调外部服务**                    | 通知管线的关键路径上不能有不可控的网络调用。要富化数据就在事件里带上                                     |
| **通用工作流引擎**                      | 通知里的 action 只做"跳转"和"调一个幂等接口"。审批流是别的系统的事                                       |
| **IM / 评论 / 回复**                    | 通知是单向广播。做成双向就是 IM，那是完全不同的系统（在线状态、消息顺序、群成员、历史漫游）              |
| **富文本编辑器 + 任意 HTML**            | 受限 Markdown 白名单渲染。任意 HTML = XSS 面 + 邮件客户端兼容地狱                                        |
| **通知的通知**（"你有 5 条未读"的提醒） | 用户已经忽略了 5 条，第 6 条不会改变什么。该做的是降低前 5 条的数量                                      |
| **强制弹窗 / 不可关闭的模态**           | 用户会训练出无脑点关闭的肌肉记忆，反而降低**所有**通知的效力                                             |
| **客户端全量离线缓存**                  | 只缓存最近 N 条用于秒开，`truncated` 时直接丢。做全量同步的复杂度换不来价值                              |
| **ML 智能排序 / 智能免打扰**            | 在没有 `unsubscribe_rate` 和 `open_rate` 数据之前谈这个是本末倒置。先把反馈闭环（§10.5）做出来           |

## 24. 落地路径：什么必须一次做对

无约束不等于一次全做。关键是分清**地基**和**装修**：

### 地基（必须一开始就对，后改代价极大）

| 项                                       | 为什么不能后加                                                                                     |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **`intent` / `reason` / `urgency` 三轴** | 它们是所有下游子系统的输入参数。后加等于所有历史数据没有这三个值，且每个子系统都已经写了 if 来绕过 |
| **`seq` 语义（§13.2）**                  | 改它 = 所有客户端的 lastSeq 失效 + 对账机制重写。而且错的症状是偶发丢消息                          |
| **幂等的唯一约束（§17）**                | 后加要先清理已有重复数据，而重复数据可能已经被用户看到了                                           |
| **outbox（I2）**                         | 后加要把所有外发点从业务事务里拆出来，那是全量重构                                                 |
| **三张核心表的分离**                     | event / message / inbox 合并了再拆，是数据迁移 + 全部读写路径重写                                  |
| **事件 schema 注册表**                   | 后加时已经有 40 个来源不明的 payload 键，没人敢动                                                  |
| **kill switch**                          | 需要它的时候（正在发疯）没时间发版                                                                 |
| **trace 的埋点位置**                     | 每阶段留痕要在写这个阶段时就做，事后补等于重读所有代码                                             |

### 装修（可以后加，不影响地基）

第二批：折叠、摘要、限流、snooze、对象静音、多渠道（email/sms）、供应商容灾、设备注册表、推送撤回、模拟/回放接口。

第三批：升级阶梯 + 值班表、内联动作令牌、webhook 出站、IM 渠道、混合时间线扇出、租户级模板覆盖、反馈闭环的自动建议。

### 第一版的最小可用形态

```
① 摄入（幂等 + schema）      ✅ 地基
② 规则匹配（YAML，无 when 表达式，先只做直接映射）
③ 受众解析（user / role / dept / subscription 四个解析器）
④ 策略栈（先只做 系统 + 用户 两层）
⑤ 收件箱 + seq                ✅ 地基
⑥ 疲劳控制                    ⏭ 跳过（intent 字段先存着不用）
⑦ 调度                       ⏭ 只做免打扰
⑧ 渲染（inapp 一个渠道，一个 locale）
⑨ 投递（inapp + 实时信号）
⑩ 对账（sync）                ✅ 地基
⑪ 反馈                       ⏭ 跳过（但埋 open/unsubscribe 事件）
横向：trace ✅ · kill switch ✅ · simulate ✅
```

注意跳过的那几个：**字段先存着不用**（`intent` 照样写进库）、**事件先埋着不分析**（open/unsubscribe 照样记录）。这样第二批开工时有历史数据可用，而不是从零开始积累。

## 25. 决策清单

| #   | 问题                                          | 建议                                                                                                                                                                                                                                    |
| --- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1  | 三轴（intent/reason/urgency）是否接受？       | **接受**。这是全文最核心的设计，也是唯一没法后加的抽象                                                                                                                                                                                  |
| P2  | 规则配置化到什么程度？                        | 声明式 YAML + 受限表达式；解析器是代码（§7.3）                                                                                                                                                                                          |
| P3  | `seq` 用每用户计数器还是全局+水位线？         | 每用户计数器（§13.2），先埋锁等待指标                                                                                                                                                                                                   |
| P4  | 读扩散只给 `all`？                            | 是。允许 roles/depts 读扩散会引入换部门后可见性的死结                                                                                                                                                                                   |
| P5  | 站内是否绝对第一公民？                        | 是（I3）。这换来"外部渠道全挂也不丢消息"                                                                                                                                                                                                |
| P6  | 偏好维度是 `intent × reason × channel` 三维？ | 是。但 UI 默认只展开 intent 一维                                                                                                                                                                                                        |
| P7  | 摘要（digest）是不是 P0？                     | **不是 P0，但偏好里的"摘要"档位要先存在**——否则用户只能在吵和聋之间选，会直接关掉                                                                                                                                                       |
| P8  | 升级阶梯（escalation）要不要？                | 有 oncall/告警场景才要。没有就别做，它拖着一个值班表子系统                                                                                                                                                                              |
| P9  | trace 采样率？                                | transactional/alerting 全量，informational 1%                                                                                                                                                                                           |
| P10 | 事件载荷放 PII 吗？                           | 不放（§6.2）。代价是内容快照落在 message 上，接受                                                                                                                                                                                       |
| P11 | 延迟队列用表还是 Redis ZSET？                 | **表**。可查询、可取消、重启不丢。慢是可以接受的                                                                                                                                                                                        |
| P12 | ~~实时通道保留几条？~~                        | **问题问错了，已修正 → 见 `infra.md` §1。** 注册表按 user_id 聚合、不区分传输，"两条通道"实际是"一个用户 N 条连接"。WS 和 SSE 都是一等公民，不做降级；信号幂等由 seq 保证，与连接数无关；同浏览器多标签页在前端用 BroadcastChannel 选主 |

---

## 26. 一句话总结

> 通知平台是**编译器 + 调度器**：把领域事件编译成 per-收件人 per-渠道的投递指令，然后按时间自由度调度它们。
>
> 全部设计压在三件事上：
>
> 1. **三条正交轴**（`intent` 能不能延迟合并 / `reason` 我为什么收到 / `urgency` 多快要到）——它们是所有下游子系统的输入参数，是唯一无法后加的抽象。
> 2. **站内收件箱是唯一真相**，每用户单调 `seq` 保证取号序 = 提交序 = 可见序，客户端只做增量对账。这换来两个大礼：外部渠道全挂也不丢消息，以及未读数在多设备断线并发下始终正确。
> 3. **每个阶段的决策都留痕**，所以系统能机械地回答"我为什么收到/没收到这条"。这不是运维功能，它是架构分层是否正确的验证器——回答不了，说明有阶段在偷偷做决定。
>
> 剩下的（折叠、摘要、升级、多渠道、多租户）都是可以后加的装修。而**疲劳控制是唯一一个"不做会导致整个系统失效"的装修**——因为通知系统真正的死法不是发不出去，是发太多导致用户全部忽略，而这个失败模式没有报错、没有指标，只有用户默默关掉开关。

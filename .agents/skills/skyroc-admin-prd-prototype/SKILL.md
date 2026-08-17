---
name: skyroc-admin-prd-prototype
description: 为 Skyroc Admin / RuoYi Plus Fast 模块编写来源可追溯的 PRD，并生成可独立打开、可交互、经过桌面端和移动端验收的 HTML 设计原型。仅在用户明确要求使用本 Skill 时启用。
---

# Skyroc Admin PRD 与 HTML 原型

本 Skill 用于把当前 FastAPI 契约、React 实现、仓库设计规范以及可用的历史或外部参考整理成一套可实施的 PRD，并为每个真实页面生成独立 HTML 原型。

不要把历史接口、字段或权限字符当作永久事实。每次任务都必须重新读取当前源码。

## 适用范围

在用户明确说出以下任一表达时使用本 Skill：

- “使用 `skyroc-admin-prd-prototype`”
- “按 Skyroc Admin PRD 原型 Skill 做”
- “用之前那套 PRD 和 HTML 设计流程”且明确指向本 Skill

典型任务包括：

- 为一个管理模块编写 PRD。
- 判断模块需要拆成几个页面。
- 生成一个或多个独立 HTML 设计图。
- 在已有 PRD 或原型基础上继续设计。
- 对照当前 FastAPI、React 实现和可用参考资料修订设计。

本 Skill 不负责把 HTML 原型直接改造成生产 React 页面，除非用户同时明确要求实施前端功能。

## 默认交付物

没有另行指定时，交付：

1. 一份 Markdown PRD。
2. 每个真实页面一份独立的 `index.html`。
3. 必要的桌面端和移动端验收截图。
4. 一份简短验收结论，区分已验证内容和未验证内容。

默认路径：

```text
design/ruoyi-plus-fast/pages/<domain>/<module>.md
design/ruoyi-plus-fast/prototypes/<page-slug>/index.html
design/ruoyi-plus-fast/prototypes/<page-slug>/qa/*.png
```

如果相邻模块使用不同目录层级，沿用相邻模块，不为统一路径而搬动旧文件。

## 必须读取的资料

开始设计前，完整执行 [证据读取顺序](references/evidence-order.md)。至少确认：

- 当前设计系统和信息架构。
- 至少一个业务形态相近的 PRD 和一个视觉或交互形态相近的原型；需要比较设计模式时再读取两个以上样例。
- FastAPI 当前 routes、schemas、service/use case、权限，以及与当前模块直接相关的测试或接口文档。
- 当前 React 路由、页面、API 类型与请求封装（如果已经存在）。
- 用户提供或仓库中确实存在的历史、外部参考实现（如果有）。

用户给出的路径优先于默认路径。路径不存在时，先在相邻仓库中搜索实际位置，不要直接向用户索要可自行发现的信息。

## 工作流

### 1. 明确架构和事实边界

在动手写文件前，用简短说明明确：

- 模块解决什么问题。
- 前端、后端、基础设施各自负责什么。
- 哪些是当前源码确认的事实。
- 哪些是为了补齐体验提出的设计假设。
- 哪些能力当前不存在，原型不得伪装成已经对接。

创建一份内部事实表，至少包含：

| 证据             | 已确认能力 | 缺口或冲突 | 对设计的影响 |
| ---------------- | ---------- | ---------- | ------------ |
| 当前 FastAPI     |            |            |              |
| 当前 React       |            |            |              |
| 设计系统和旧原型 |            |            |              |
| 可选参考资料     |            |            |              |

遇到冲突时，以当前目标系统的真实后端契约为实现事实；历史或外部参考只用于理解业务边界和比较设计方案。不要为了视觉一致而虚构接口。

### 2. 决定页面数量

按照任务目标而不是参考页面的文件数量拆分页面：

- 不同菜单入口、权限边界、用户角色或长期工作区通常是独立页面。
- 新增、编辑、详情、确认等短任务通常使用抽屉或弹窗。
- 用户明确要求两个页面时，必须生成两个能独立打开的 HTML 文件；不能用一个页面里的 Tab 或状态切换冒充两个页面。
- 独立页面之间需要真实导航关系时，使用相对链接互相跳转。

在 PRD 中先给出页面清单、页面 ID、路由、使用者和边界，再展开页面细节。

### 3. 编写 PRD

以 [PRD 产物规范](references/prd-rules.md) 为准，并从 [PRD 模板](templates/prd.md) 起草。

PRD 必须做到：

- 来源可追溯，事实与假设分开。
- 页面结构、字段、表格列、筛选、状态和交互足够具体。
- 接口、权限、错误、空状态、并发和危险操作有明确设计。
- 同时说明桌面端和窄屏行为。
- 明确原型与当前生产实现之间的差距。

### 4. 生成独立 HTML 原型

以 [HTML 原型规范](references/prototype-rules.md) 为准。

优先参考当前仓库中的黄金样例：

- `design/ruoyi-plus-fast/prototypes/user/index.html`
- `design/ruoyi-plus-fast/prototypes/role/index.html`
- `design/ruoyi-plus-fast/prototypes/menu-final/index.html`
- `design/ruoyi-plus-fast/prototypes/oss/index.html`
- `design/ruoyi-plus-fast/prototypes/oss-config/index.html`

黄金样例用于理解布局、层级、信息密度和交互质量，不是复制固定业务内容。新页面应保持同一产品家族感，同时让业务特征决定局部布局。

可以从 [后台页面骨架](templates/admin-page.html) 起步。交付前必须替换模板占位内容，并删除未使用的演示结构。

### 5. 验收

完整执行 [验收清单](references/acceptance-checklist.md)。最低要求：

1. 使用 Oxfmt 检查 PRD 和 HTML。
2. 使用本 Skill 的静态检查脚本检查每个原型。
3. 启动本地静态服务，通过浏览器访问，不只使用文件预览。
4. 分别检查桌面、窄屏和手机宽度。
5. 点击查询、重置、新增、编辑、详情、危险操作、关闭浮层等主要交互。
6. 检查浏览器控制台错误和页面横向溢出。
7. 截取能证明主页面、关键浮层和移动端状态的图片。

静态检查命令示例：

```bash
node .agents/skills/skyroc-admin-prd-prototype/scripts/verify-prototypes.mjs \
  design/ruoyi-plus-fast/prototypes/example-a \
  design/ruoyi-plus-fast/prototypes/example-b
```

## 不可妥协的规则

- 不复制旧 PRD 中可能已经过期的接口事实。
- 不把历史或外部参考行为描述成 FastAPI 已实现行为。
- 不把静态 HTML 描述成已经完成后端联调。
- 不用 Tab 冒充用户要求的多个页面。
- 不把所有业务塞进一个超长弹窗。
- 不生成只有视觉、没有关键点击反馈的“截图式页面”。
- 不使用外部图标 CDN 作为关键依赖；优先内联 SVG。
- 不在原型中写入真实密钥、Token、个人信息或生产地址。
- 不因制作原型而修改当前 React 生产代码，除非用户明确要求。

## 完成报告

最终只需要说明：

1. PRD 和页面数量。
2. 每个页面的主要内容和关键交互。
3. 生成文件的绝对路径。
4. 执行过的格式、静态和浏览器验证。
5. 当前仍属于设计假设或尚未真实联调的部分。

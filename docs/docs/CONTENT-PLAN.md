# docs/docs 主文档门户 —— 内容与改动清单

> 目标：`docs/docs` 成为唯一主文档门户（docs.skyroc.xxx），吸收 `project-docs` + `admin-docs` + `core-docs` + `web-kit-docs` 四个站点；`web-ui-docs`、`native-ui-docs` 保持独立应用，只做导航与搜索互通。
> 现状：`docs/docs` 是全新 Fumadocs 脚手架，`content/docs` 下只有 `index.mdx`（Hello World）和 `test.mdx`，首页壳子已在 `app/(home)/` 搭好但所有链接都指向占位 `/docs`。

---

## 一、最终目录结构（`content/docs/`，共约 134 篇，拆成 7 个 root）

侧边栏不是一棵，而是**七棵独立的树**。Fumadocs 里在文件夹 `meta.json` 加 `"root": true` 即可，
`DocsLayout` 的 `tabs` 默认就是 `getLayoutTabs(tree)`，会自动把每个 root 变成顶部切换器的一项，
`app/docs/layout.tsx` 无需改动。七个 root 共用同一个应用、同一份搜索索引、同一次构建。

| root                | URL 前缀          | 篇数 | 读者意图                             |
| ------------------- | ----------------- | ---- | ------------------------------------ |
| 指南 `guide/`       | `/docs/guide/`    | 23   | 「这项目怎么跑、怎么组织、怎么协作」 |
| Admin 应用 `admin/` | `/docs/admin/`    | 39   | 「我要改 admin 的某个功能」          |
| 跨端核心 `core/`    | `/docs/core/`     | 23   | 「`@core/*` 的这个 API 怎么用」      |
| 跨端 Hooks `hooks/` | `/docs/hooks/`    | 10   | 「这个 hook 的签名和行为是什么」     |
| 表单原语 `form/`    | `/docs/form/`     | 9    | 「表单怎么写、怎么校验、怎么不重渲染」 |
| Web 端包 `web/`     | `/docs/web/`      | 21   | 「`web/*` 的这个 API 怎么用」        |
| 包总览 `packages/`  | `/docs/packages/` | 9    | 「31 个包都有啥、这个能力在哪个包」  |

原来五棵包树全挂在 `packages/` 下面，`core` + `web` 就占 44 篇，把侧边栏压垮了。
四棵各自提为 root：`core/` 与 `web/` 本来就是从 core-docs / web-kit-docs 两个独立站整站搬来的，提上来是还原原本形态，
且 URL 与旧站一致（`/docs/core/:slug`、`/docs/web/:slug`），第三节的重定向表因此少两条规则；
`hooks/` 与 `form/` 原本各只有一篇几百行的单页，提为 root 时按源码结构拆成 10 / 9 篇。

`packages/` 留下 `index.mdx` 全局总表 + `cross-platform.mdx` + `internal/`，改名「包总览」——
不叫「包参考」是因为 core / hooks / form / web 都不在里面了，挂那块牌子会误导；
「包总览」与 `index.mdx` 的 frontmatter、header 中间导航的「包文档」一项三处对齐。

```text
content/docs/
├── meta.json                       根导航：index / guide / admin / core / hooks / form / web / packages
├── index.mdx                       门户首页（不属于任何 root，落在 fallback 树）
│
├── guide/                 23 篇    root: true　icon: Compass
│   ├── index.mdx                   指南落地页
│   ├── getting-started/    6 篇    ← project-docs/getting-started/*
│   │   introduction / tech-stack / quick-start / directory / glossary / faq
│   │
│   ├── architecture/       7 篇    ← project-docs/architecture/*
│   │   monorepo / package-layering / platform-first / adapter-pattern
│   │   dependency-graph / naming / catalog
│   │   （原 turborepo 已并入 engineering/build-system）
│   │
│   └── engineering/       10 篇    ← project-docs/engineering/*
│       overview / conventions / typescript / build-system / exports-strategy /
│       new-package / lint-and-format / test / git-commit / ci
│
├── admin/                 39 篇    ← admin-docs 整站（补上现在缺失的 admin-app 导航）
│   index
│   getting-started/    quick-start / project-structure / editor-setup / component-boundaries
│   architecture/       bootstrap / runtime-providers
│   configuration/      env-and-vite / storage-and-cache
│   routing/            overview / guards / permission / route-meta / route-cache /
│                       error-loading-and-exception
│   layout/             overview / menus-and-tabs
│   request/            overview / service-modules / proxy-and-backend
│   theme/              overview / tokens-and-antd / runtime-and-cache / i18n-and-icons / icons
│   features/           auth-login(+api) / antd-feedback(+api) / form-rules(+api) /
│                       notification(+api) / use-table-api / table-and-form /
│                       charts-and-dashboard / demo-pages
│   deployment/         build-and-deploy
│   faq
│
├── core/                  23 篇    root: true　icon: Box　✅ 已执行
│   index                           @core 总览（原 project-docs/core/overview.mdx 降级为目录页）
│   axios / color / scheduler / scripts / service / state
│                                   ← core-docs/*.mdx（唯一事实源）
│   logger / types                  ← project-docs/core/*.mdx（core-docs 无此两篇，需补写）
│   utils/                 14 篇    ← core-docs/utils/*
│       overview / array / crypto / date / emitter / path / priority-queue /
│       query / reg / singleflight / storage / subject / utils / web
│
├── hooks/                 10 篇    root: true　icon: Webhook　✅ 已执行
│   index                           总览：子入口边界、hook 清单、跨端策略
│   store                           Store<S> 基类 + useStore + Subscribable
│   use-array / use-loading / use-count-down-timer / use-captcha / use-now
│                                   ← 主入口五个 hook，逐个对着源码写
│   use-copy / use-system-theme     ← ./web 子入口两个 DOM hook
│                                   （原 packages/hooks.mdx 单页 181 行拆开）
│
├── form/                   9 篇    root: true　icon: ClipboardList　✅ 已执行
│   index                           总览：包信息、四条主线、目录结构、测试
│   quick-start                     基础表单 / 动态数组 / 带校验
│   type-safety                     泛型 Values 与 type-utils 驱动的路径推导
│   subscription                    ChangeTag bitmask 精确订阅
│   components                      Form / Field / List / ComputedField
│   hooks                           八个 hook 的签名与用途
│   validation                      StandardSchema / Rule / 错误读取
│   form-core                       FormStore / event / middleware / resolver
│   web-ui                          在 @skyroc/web-ui 中的使用
│                                   （原 packages/form.mdx 单页 260 行拆开）
│
├── web/                   21 篇    root: true　icon: Globe　✅ 已执行
│   index                           目录页（与 core 一致用 index.mdx，非 overview）
│   admin-vite / admin-runtime / admin-i18n / materials / tailwind-plugin
│                                   ← web-kit-docs/*.mdx（唯一事实源）
│   admin-layouts/          8 篇    ← web-kit-docs/admin-layouts/*
│       overview / quick-start / menus / static-menu-generation /
│       dynamic-menu-generation / slots / state-tabs / api
│   theme/                  3 篇    ← web-kit-docs/theme/*（overview / antd-theme / admin-theme）
│   devtools / admin-notification / admin-styles
│                                   ← project-docs/web/*.mdx，已对着源码重写补详
│   ui.mdx                          新写：一页指路，跳 ui.skyroc.xxx
│                                   取代 ui-shadcn / ui-antd / ui-compose 三篇
│
└── packages/               6 篇    root: true　icon: Package　title「包总览」
    ├── index.mdx                   29 个包总表 + 分层图 + 依赖关系；
    │                               开头一张分流表指向 core / hooks / form / web 四个 root，
    │                               总表每行的链接也直接指过去
    ├── cross-platform.mdx  1 篇    跨端共享层（hooks + primitives）与纯类型的归属规则；
    │                               原 shared/{overview,type-utils,ui-types}.mdx 三篇随
    │                               packages/shared 目录删除而合并为这一篇
    └── internal/           4 篇    ← project-docs/internal/*
        overview / tsconfig / config / uno-config
```

### 根与各 root 的 `meta.json`

根 `content/docs/meta.json` 只负责三个 root 的顺序：

```json
{
  "pages": ["index", "guide", "admin", "core", "hooks", "form", "web", "packages"]
}
```

每个 root 靠 `"root": true` 独立成树，`title` / `description` / `icon` 会显示在切换器里：

```json
// guide/meta.json
{
  "title": "指南",
  "description": "跑起来、读懂仓库、按规范协作",
  "icon": "Compass",
  "root": true,
  "pages": [
    "index",
    "---快速上手---",
    "getting-started",
    "---架构设计---",
    "architecture",
    "---工程化---",
    "engineering"
  ]
}
```

`admin/meta.json` 用 `LayoutDashboard`，`core/` 用 `Box`，`hooks/` 用 `Webhook`，`form/` 用 `ClipboardList`，`web/` 用 `Globe`，`packages/` 用 `Package`（`lucideIconsPlugin()` 已在 `lib/source.ts` 启用）。

### 侧边栏排序规则

`pages` 数组一律**手写**，不用文件名字母序。两条规则：

1. **目录页永远第一**：`index`（root 与包目录）或 `overview`（子目录）打头。
2. **其余按依赖方向从上到下**：先应用直接消费的，再往底层走；`packages/*` 的分组名与 `packages/index.mdx` 里的分组表保持一致，读者在两处看到的顺序相同。

`web/meta.json` 是这条规则的样板（分组名与 `packages/index.mdx` 的「设计系统 / 主题 / 布局与样式 / 运行时 / 构建」逐字对应）：

```json
{
  "title": "Web 端包",
  "description": "packages/web 下 14 个 Web 平台包：设计系统、主题、布局、运行时与构建",
  "pages": [
    "index",
    "---设计系统---", "ui",
    "---主题---", "tailwind-plugin", "theme",
    "---布局与样式---", "materials", "admin-layouts", "admin-styles",
    "---运行时---", "admin-runtime", "admin-i18n", "admin-notification", "devtools",
    "---构建---", "admin-vite"
  ]
}
```

`theme/` 与 `admin-layouts/` 两个子目录同理：前者按算法层 → React 层排（`overview` / `antd-theme` / `admin-theme`），后者按接入路径排（概览 → 快速接入 → 菜单三篇 → 插槽 → 状态与页签 → API）。

`core/meta.json` 的 `title` 原本是脚手架遗留的 `Core Docs`，提为 root 时已改成「跨端核心」。

## 二、重复内容的取舍（每个主题只留一个事实源）

`project-docs/core/*` 与 `core-docs/*`、`project-docs/web/*` 与 `web-kit-docs/*` 是同题两写，行数差距悬殊，一律**保留详细版，短版降级为目录页或删除**：

| 主题            | project-docs（短） | core-docs / web-kit-docs（详） | 处置                                       |
| --------------- | ------------------ | ------------------------------ | ------------------------------------------ |
| axios           | 68 行              | 309 行                         | 删短版，用详版                             |
| color           | 84 行              | 735 行                         | 删短版，用详版                             |
| scheduler       | 136 行             | 337 行                         | 删短版，用详版                             |
| scripts         | 121 行             | 385 行                         | 删短版，用详版                             |
| service         | 184 行             | 382 行                         | 删短版，用详版                             |
| state           | 91 行              | 452 行                         | 删短版，用详版                             |
| utils           | 114 行（1 篇）     | 14 篇 / 3141 行                | 短版改写成 `utils/overview` 之外的目录入口 |
| admin-i18n      | 143 行             | 433 行                         | 删短版，用详版                             |
| admin-runtime   | 146 行             | 631 行                         | 删短版，用详版                             |
| admin-vite      | 217 行             | 1029 行                        | 删短版，用详版                             |
| materials       | 149 行             | 451 行                         | 删短版，用详版                             |
| tailwind-plugin | 123 行             | 605 行                         | 删短版，用详版                             |
| admin-theme     | 158 行             | 759 行                         | 删短版，用详版                             |
| antd-theme      | 106 行             | 477 行                         | 删短版，用详版                             |
| admin-layouts   | 193 行（1 篇）     | 8 篇 / 1640 行                 | 短版删除，用详版目录                       |

**只有短版、没有详版的 5 篇**（`core/logger`、`core/types`、`web/devtools`、`web/admin-notification`、`web/admin-styles`）搬过来后对着源码重写。

`web/` 这三篇搬过来时发现短版已经落后于代码，已按源码修正：

| 页面 | 落后点 |
| --- | --- |
| `web/devtools` | 缺 `AdminDevtoolsConfig.enabled`；`jotai` 实为 `boolean \| AdminJotaiDevtoolsConfig`（旧文档写成 `\| false`）；`theme` 在根配置而非 `jotai` 内；`triggerOffset` 值是 `number \| string`，补上四个 CSS 变量与默认值判定表 |
| `web/admin-notification` | 整个通知模型写错（`description`/`time`/`data` 实为 `content`/`timestamp`/`meta`，`type` 五种、`priority` 四档）；漏掉 `NotificationStore` 与 `DEFAULT_NOTIFICATION_CONFIG` 两个导出、五个语义快捷方法、优先级排序规则、免打扰、浏览器原生通知与 React 树外投递；依赖表写了并不存在的 `nanoid` |
| `web/admin-styles` | `global.css` 自己 `@import` 了另外两个文件，旧文档教人三个都引；各文件作用描述过泛，已按实际 CSS 补细节 |

`web/admin-vite` 是详版，配置面写得完整，但没有公共导出速查，已补一节 `## 公共导出`（`defineConfig` 之外的 9 个 helper 与 8 个插件工厂）。其余 web-kit-docs 迁过来的详版逐个核对过导出符号，与源码一致。

### guide 内部的去重（已执行）

上表处理的是**跨站同题两写**。`guide/` 这棵树内部还有一批**站内自我重复**，已按「同一个事实只留一处正文，其余用链接指过去」收敛：

| 重复内容                    | 唯一事实源                      | 其余各页的处置                                                           |
| --------------------------- | ------------------------------- | ------------------------------------------------------------------------ |
| Turborepo 任务定义与语义    | `engineering/build-system`      | 删除 `architecture/turborepo`（整篇被覆盖），链接改指 build-system       |
| 平台目录树 / 为什么按平台切 | `architecture/platform-first`   | `naming` 删前两节；`introduction` 树改为一句话；`conventions` 目录表删除 |
| 目录 → 包名映射规则         | `architecture/naming`           | `platform-first`、`conventions`、`new-package` 三处表格改链接            |
| 分层图 / 禁止的依赖方向     | `architecture/package-layering` | `dependency-graph` 只留 7 条具体功能链路，改名「关键依赖链路」           |
| `RequestAdapter` 接口与注入 | `architecture/adapter-pattern`  | `package-layering` 的代码块改为一段说明 + 链接                           |
| catalog 配置与流程          | `architecture/catalog`          | `tech-stack`「版本治理」压成三条规则表 + 链接                            |
| workspace glob              | `architecture/monorepo`         | `directory` 删除同款 yaml                                                |
| commit type 表              | `engineering/git-commit`        | `conventions` 删表留链接                                                 |
| tsdown 配置                 | `engineering/build-system`      | `exports-strategy` 删代码块留约束描述                                    |
| 包数量 / workspace 清单     | `getting-started/directory`     | `faq` 删表、`dependency-graph` 删「包数量速览」                          |
| useCallback / useMemo 规则  | `engineering/conventions`       | `faq` 两个 Q 删除；`introduction`、`overview` 保留一行 + 链接            |

`getting-started/faq` 同时做了瘦身：只保留正文没覆盖的「为什么这么设计」与一次性排查经验，操作类问题统一在开头指路。

**`web/ui-shadcn`、`web/ui-antd`、`web/ui-compose` 三篇不迁移**：`packages/web/ui/` 下的 shadcn / antd / compose 由 `web-ui-docs` 承载（含实时 Demo、Props 表），主站只保留一页 `packages/web/ui.mdx` 指路，顺带修掉 `ui-shadcn.mdx:129` 那个失效的 GitHub 占位链接。

---

## 三、`docs/docs` 代码侧要改的文件

| 文件                       | 改动                                                                                                                                                                                                                                           |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `content/docs/test.mdx`    | 删除（脚手架残留）                                                                                                                                                                                                                             |
| `content/docs/index.mdx`   | 重写，去掉 Fumadocs/Next.js 官方 Cards                                                                                                                                                                                                         |
| `content/docs/meta.json`   | 新建，见上                                                                                                                                                                                                                                     |
| `lib/shared.ts`            | ✅ 已改 `gitConfig.branch: 'main'` → `'master'`（远端默认分支就是 master，之前所有"编辑此页"链接 404）；`repo: 'skyroc'` 是对的——仓库已从 `skyroc-admin` 改名                                                                                                             |
| `app/docs/DocsGlassHeader.tsx` | ✅ 中间导航改为「指南 / Admin / 包文档」三项（见下）；GitHub 图标去重。跨站链接待域名定稿后以「生态 ▾」下拉补在 GitHub 图标左侧，六站共用同一份                                                                                                                 |
| `next.config.mjs`          | 加 `redirects()`：旧站路径 → 新路径永久跳转，见下                                                                                                                                                                                              |
| `package.json`             | `name: "docs"` → `"@skyroc/docs"`；`dev` 固定端口（接管 project-docs 的 `--port 8848`）                                                                                                                                                        |
| `app/(home)/1.md`          | 移出 `app/`（这是诊断记录，不该留在路由目录），归入 `docs/internal/` 或删除                                                                                                                                                                    |
| `app/(home)/modules/*.tsx` | ✅ `DocumentationMapSection`、`ReadingPathsSection`、`HomeHeroSection` 的死链已全部改成真实路径；`#documentation-map` 这类锚点占位仍在 |
| `app/api/search/route.ts`  | 后续接跨站索引：主站搜索结果里带上 Web UI / Native UI，并标注来源站点                                                                                                                                                                          |

### 重定向映射（`next.config.mjs`）

```text
# 旧 project-docs 路径 → guide root
/docs/getting-started/:slug* → /docs/guide/getting-started/:slug*
/docs/architecture/turborepo → /docs/guide/engineering/build-system   （该页已并入构建体系）
/docs/architecture/:slug*    → /docs/guide/architecture/:slug*
/docs/engineering/:slug*     → /docs/guide/engineering/:slug*

# 旧 project-docs 包路径 → core / web / packages 三个 root
/docs/core/:slug            → 无需重定向（core 已提为 root，路径原样保留）
/docs/web/:slug             → 无需重定向（同上）
/docs/web/admin-layouts     → /docs/web/admin-layouts/overview
/docs/web/ui-shadcn|ui-antd|ui-compose → /docs/web/ui
/docs/shared/form           → /docs/form
/docs/shared/hooks          → /docs/hooks
/docs/shared/:slug          → /docs/packages/cross-platform
/docs/internal/:slug        → /docs/packages/internal/:slug
/docs/admin-app/:slug*      → /docs/admin/:slug*     （修复 meta.json:15 与 index.mdx:51 的死链）

# 旧独立站整站跳转
core-docs 全站  /:slug*     → docs.skyroc.xxx/docs/core/:slug*
web-kit-docs 全站 /:slug*   → docs.skyroc.xxx/docs/web/:slug*
admin-docs 全站  /:slug*    → docs.skyroc.xxx/docs/admin/:slug*
project-docs 全站 /:slug*   → 按上面三条 root 规则分流
```

---

## 四、跨站引流（三层，六站统一）

1. **顶部导航**分两块，按「站内定位」与「跨站跳转」切开：

   - **中间三项（站内）**：指南 | Admin | 包文档。7 个 root 在侧栏切换器里是折叠的（可见 DOM 只渲染当前项），
     header 是唯一常驻可见的站内导航但塞不下 7 项，所以按读者意图收敛成三组；
     「包文档」落到 `/docs/packages`，那页开头的分流表负责把人送到 core / hooks / form / web 四棵包树。
   - **右侧（跨站）**：官网 | Web UI | Native UI | Playground | GitHub，六站共用同一份。
     域名还是 `.xxx` 占位，定稿后以「生态 ▾」下拉挂在 GitHub 图标左侧，不占横向宽度。
2. **上下游链接**（写在页面正文固定位置）：
   - 架构页 → 对应包的详细 API
   - `core/*`、`hooks/*`、`form/*`、`web/*` → "在 Admin 中如何使用"（`/docs/admin/...`）
   - `admin/*` → "查看完整包 API"（`/docs/core/...`、`/docs/hooks/...`、`/docs/form/...`、`/docs/web/...`）
   - Web UI 组件页 → "Admin 使用案例"
   - Native UI 组件页 → "在 Expo Playground 中打开"
3. **页脚"相关内容"**四槽位：上一层概览 / 应用指南 / 底层 API / 相关组件

---

## 五、随迁清理

- `docs/admin-docs/ADMIN_DOCS_PLAN.md`：迁移完成后移入 `docs/internal/` 或删除
- `docs/native-ui-docs/content/docs/test.mdx`：公开前删除
- `docs/native-ui-docs/lib/shared.ts`：仍是 My App / Fumadocs 示例仓库脚手架信息，换成项目自己的
- `docs/expo-snack-integration.md`、`docs/snack-babel-config-probe.html`：实验记录移入 `docs/internal/experiments/`，失效即删
- 各站默认 Fumadocs `README.md`：换成本站维护说明
- 旧站外壳（`project-docs/`、`admin-docs/`、`core-docs/`、`web-kit-docs/`）在重定向验证通过后整目录删除

---

## 六、落地顺序

1. 定 `content/docs/meta.json` 与 URL 方案，`docs/docs` 先跑起来（不动正文）
2. 修 `lib/shared.ts` 的 branch（✅）、删 `test.mdx`、重写 `index.mdx`（✅）、挪走 `app/(home)/1.md`
3. 搬 `admin-docs` 整站 → `content/docs/admin/`（同时修掉 admin-app 死链）
4. 搬 `core-docs` → `core/`，`web-kit-docs` → `web/`（✅ 已完成，两棵已提为独立 root，`web/` 21 篇齐；两个站壳待第 8 步统一删）
5. 搬 `project-docs` 的 getting-started / architecture / engineering / shared / internal，逐篇按第二节表格取舍重复页
   （`shared/` 三篇后来随 `packages/shared` 目录删除，合并为 `packages/cross-platform.mdx`）
   （✅ 已完成；其中 `shared/hooks.mdx`、`shared/form.mdx` 两个单页已提为 `hooks/`、`form/` 两个 root 并按源码拆页）
6. 配 `next.config.mjs` 重定向 + 六站统一顶部导航 + 页脚"相关内容"
7. 首页 `app/(home)/modules/*` 换成真实链接（✅ 死链部分已完成）
8. 删旧站外壳与重复正文，最后接跨站搜索

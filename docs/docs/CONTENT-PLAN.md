# docs/docs 主文档门户 —— 内容与改动清单

> 目标：`docs/docs` 成为唯一主文档门户（docs.skyroc.xxx），吸收 `project-docs` + `admin-docs` + `core-docs` + `web-kit-docs` 四个站点；`web-ui-docs`、`native-ui-docs` 保持独立应用，只做导航与搜索互通。
> 现状：`docs/docs` 是全新 Fumadocs 脚手架，`content/docs` 下只有 `index.mdx`（Hello World）和 `test.mdx`，首页壳子已在 `app/(home)/` 搭好但所有链接都指向占位 `/docs`。

---

## 一、最终目录结构（`content/docs/`，共约 118 篇，拆成 3 个 root）

侧边栏不是一棵，而是**三棵独立的树**。Fumadocs 里在文件夹 `meta.json` 加 `"root": true` 即可，
`DocsLayout` 的 `tabs` 默认就是 `getLayoutTabs(tree)`，会自动把每个 root 变成顶部切换器的一项，
`app/docs/layout.tsx` 无需改动。三个 root 共用同一个应用、同一份搜索索引、同一次构建。

| root | URL 前缀 | 篇数 | 读者意图 |
| --- | --- | --- | --- |
| 指南 `guide/` | `/docs/guide/` | 23 | 「这项目怎么跑、怎么组织、怎么协作」 |
| Admin 应用 `admin/` | `/docs/admin/` | 39 | 「我要改 admin 的某个功能」 |
| 包参考 `packages/` | `/docs/packages/` | 55 | 「`@skyroc/xxx` 这个 API 怎么用」 |

```text
content/docs/
├── meta.json                       根导航：index / guide / admin / packages
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
├── packages/              55 篇    root: true　icon: Package
│   ├── index.mdx                   新写（31 个包总表 + 分层图 + 依赖关系）
│   │
│   ├── core/              23 篇
│   │   overview                    ← project-docs/core/overview.mdx（降级为目录页）
│   │   axios / color / scheduler / scripts / service / state
│   │                               ← core-docs/*.mdx（唯一事实源）
│   │   logger / types              ← project-docs/core/*.mdx（core-docs 无此两篇，需补写）
│   │   utils/             14 篇    ← core-docs/utils/*
│   │       overview / array / crypto / date / emitter / path / priority-queue /
│   │       query / reg / singleflight / storage / subject / utils / web
│   │
│   ├── web/               21 篇
│   │   overview                    ← project-docs/web/overview.mdx（降级为目录页）
│   │   admin-vite / admin-runtime / admin-i18n / materials / tailwind-plugin
│   │                               ← web-kit-docs/*.mdx（唯一事实源）
│   │   admin-layouts/      8 篇    ← web-kit-docs/admin-layouts/*
│   │       overview / quick-start / menus / static-menu-generation /
│   │       dynamic-menu-generation / slots / state-tabs / api
│   │   theme/              3 篇    ← web-kit-docs/theme/*（overview / admin-theme / antd-theme）
│   │   admin-devtools / admin-notification / admin-styles
│   │                               ← project-docs/web/*.mdx（web-kit 无，唯一版本，建议补详）
│   │   ui.mdx                      新写：一页指路，跳 ui.skyroc.xxx
│   │                               取代 ui-shadcn / ui-antd / ui-compose 三篇
│   │
│   ├── shared/             3 篇    ← project-docs/shared/{overview,type-utils,ui-types}.mdx
│   ├── form.mdx            1 篇    ← project-docs/shared/form.mdx（@skyroc/form 在 primitives/，不属 shared）
│   ├── hooks.mdx           1 篇    ← project-docs/shared/hooks.mdx（@skyroc/hooks 在 packages/hooks，不属 shared）
    └── internal/           4 篇    ← project-docs/internal/*
        overview / tsconfig / config / uno-config
```

### 根与各 root 的 `meta.json`

根 `content/docs/meta.json` 只负责三个 root 的顺序：

```json
{
  "pages": ["index", "guide", "admin", "packages"]
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
  "pages": ["index", "---快速上手---", "getting-started",
            "---架构设计---", "architecture", "---工程化---", "engineering"]
}
```

`admin/meta.json` 用 `LayoutDashboard`，`packages/meta.json` 用 `Package`（`lucideIconsPlugin()` 已在 `lib/source.ts` 启用）。

## 二、重复内容的取舍（每个主题只留一个事实源）

`project-docs/core/*` 与 `core-docs/*`、`project-docs/web/*` 与 `web-kit-docs/*` 是同题两写，行数差距悬殊，一律**保留详细版，短版降级为目录页或删除**：

| 主题 | project-docs（短） | core-docs / web-kit-docs（详） | 处置 |
| --- | --- | --- | --- |
| axios | 68 行 | 309 行 | 删短版，用详版 |
| color | 84 行 | 735 行 | 删短版，用详版 |
| scheduler | 136 行 | 337 行 | 删短版，用详版 |
| scripts | 121 行 | 385 行 | 删短版，用详版 |
| service | 184 行 | 382 行 | 删短版，用详版 |
| state | 91 行 | 452 行 | 删短版，用详版 |
| utils | 114 行（1 篇） | 14 篇 / 3141 行 | 短版改写成 `utils/overview` 之外的目录入口 |
| admin-i18n | 143 行 | 433 行 | 删短版，用详版 |
| admin-runtime | 146 行 | 631 行 | 删短版，用详版 |
| admin-vite | 217 行 | 1029 行 | 删短版，用详版 |
| materials | 149 行 | 451 行 | 删短版，用详版 |
| tailwind-plugin | 123 行 | 605 行 | 删短版，用详版 |
| admin-theme | 158 行 | 759 行 | 删短版，用详版 |
| antd-theme | 106 行 | 477 行 | 删短版，用详版 |
| admin-layouts | 193 行（1 篇） | 8 篇 / 1640 行 | 短版删除，用详版目录 |

**只有短版、没有详版的 5 篇**（`core/logger`、`core/types`、`web/admin-devtools`、`web/admin-notification`、`web/admin-styles`）直接搬过来，标记为"待补详"。

### guide 内部的去重（已执行）

上表处理的是**跨站同题两写**。`guide/` 这棵树内部还有一批**站内自我重复**，已按「同一个事实只留一处正文，其余用链接指过去」收敛：

| 重复内容 | 唯一事实源 | 其余各页的处置 |
| --- | --- | --- |
| Turborepo 任务定义与语义 | `engineering/build-system` | 删除 `architecture/turborepo`（整篇被覆盖），链接改指 build-system |
| 平台目录树 / 为什么按平台切 | `architecture/platform-first` | `naming` 删前两节；`introduction` 树改为一句话；`conventions` 目录表删除 |
| 目录 → 包名映射规则 | `architecture/naming` | `platform-first`、`conventions`、`new-package` 三处表格改链接 |
| 分层图 / 禁止的依赖方向 | `architecture/package-layering` | `dependency-graph` 只留 7 条具体功能链路，改名「关键依赖链路」 |
| `RequestAdapter` 接口与注入 | `architecture/adapter-pattern` | `package-layering` 的代码块改为一段说明 + 链接 |
| catalog 配置与流程 | `architecture/catalog` | `tech-stack`「版本治理」压成三条规则表 + 链接 |
| workspace glob | `architecture/monorepo` | `directory` 删除同款 yaml |
| commit type 表 | `engineering/git-commit` | `conventions` 删表留链接 |
| tsdown 配置 | `engineering/build-system` | `exports-strategy` 删代码块留约束描述 |
| 包数量 / workspace 清单 | `getting-started/directory` | `faq` 删表、`dependency-graph` 删「包数量速览」 |
| useCallback / useMemo 规则 | `engineering/conventions` | `faq` 两个 Q 删除；`introduction`、`overview` 保留一行 + 链接 |

`getting-started/faq` 同时做了瘦身：只保留正文没覆盖的「为什么这么设计」与一次性排查经验，操作类问题统一在开头指路。

**`web/ui-shadcn`、`web/ui-antd`、`web/ui-compose` 三篇不迁移**：`packages/web/ui/` 下的 shadcn / antd / compose 由 `web-ui-docs` 承载（含实时 Demo、Props 表），主站只保留一页 `packages/web/ui.mdx` 指路，顺带修掉 `ui-shadcn.mdx:129` 那个失效的 GitHub 占位链接。

---

## 三、`docs/docs` 代码侧要改的文件

| 文件 | 改动 |
| --- | --- |
| `content/docs/test.mdx` | 删除（脚手架残留） |
| `content/docs/index.mdx` | 重写，去掉 Fumadocs/Next.js 官方 Cards |
| `content/docs/meta.json` | 新建，见上 |
| `lib/shared.ts` | `gitConfig.branch: 'main'` → **`'master'`**（仓库默认分支是 master，现在所有"编辑此页"链接都会 404）；`appName` 保持 `Skyroc Docs` |
| `lib/layout.shared.tsx` | 补统一顶部导航 `links`：官网 / 文档 / Admin / Web UI / Native UI / Playground / GitHub（六站共用同一份，另外五站复制同样配置） |
| `next.config.mjs` | 加 `redirects()`：旧站路径 → 新路径永久跳转，见下 |
| `package.json` | `name: "docs"` → `"@skyroc/docs"`；`dev` 固定端口（接管 project-docs 的 `--port 8848`） |
| `app/(home)/1.md` | 移出 `app/`（这是诊断记录，不该留在路由目录），归入 `docs/internal/` 或删除 |
| `app/(home)/modules/*.tsx` | 目前 `DocumentationMapSection`、`ReadingPathsSection`、`HeaderNavigation`、`HomeHeroSection` 的 href 全是占位 `/docs`、`#documentation-map`；导航定稿后换成真实路径（`/docs/getting-started/quick-start`、`/docs/admin`、`/docs/packages` 等） |
| `app/api/search/route.ts` | 后续接跨站索引：主站搜索结果里带上 Web UI / Native UI，并标注来源站点 |

### 重定向映射（`next.config.mjs`）

```text
# 旧 project-docs 路径 → guide root
/docs/getting-started/:slug* → /docs/guide/getting-started/:slug*
/docs/architecture/turborepo → /docs/guide/engineering/build-system   （该页已并入构建体系）
/docs/architecture/:slug*    → /docs/guide/architecture/:slug*
/docs/engineering/:slug*     → /docs/guide/engineering/:slug*

# 旧 project-docs 包路径 → packages root
/docs/core/:slug            → /docs/packages/core/:slug
/docs/web/admin-layouts     → /docs/packages/web/admin-layouts/overview
/docs/web/ui-shadcn|ui-antd|ui-compose → /docs/packages/web/ui
/docs/web/:slug             → /docs/packages/web/:slug
/docs/shared/form           → /docs/packages/form
/docs/shared/hooks          → /docs/packages/hooks
/docs/shared/:slug          → /docs/packages/shared/:slug
/docs/internal/:slug        → /docs/packages/internal/:slug
/docs/admin-app/:slug*      → /docs/admin/:slug*     （修复 meta.json:15 与 index.mdx:51 的死链）

# 旧独立站整站跳转
core-docs 全站  /:slug*     → docs.skyroc.xxx/docs/packages/core/:slug*
web-kit-docs 全站 /:slug*   → docs.skyroc.xxx/docs/packages/web/:slug*
admin-docs 全站  /:slug*    → docs.skyroc.xxx/docs/admin/:slug*
project-docs 全站 /:slug*   → 按上面三条 root 规则分流
```

---

## 四、跨站引流（三层，六站统一）

1. **顶部导航**（所有站点同一份）：官网 | 文档 | Admin | Web UI | Native UI | Playground | GitHub
2. **上下游链接**（写在页面正文固定位置）：
   - 架构页 → 对应包的详细 API
   - `packages/core/*`、`packages/web/*` → "在 Admin 中如何使用"（`/docs/admin/...`）
   - `admin/*` → "查看完整包 API"（`/docs/packages/...`）
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
2. 修 `lib/shared.ts` 的 branch、删 `test.mdx`、重写 `index.mdx`、挪走 `app/(home)/1.md`
3. 搬 `admin-docs` 整站 → `content/docs/admin/`（同时修掉 admin-app 死链）
4. 搬 `core-docs` → `packages/core/`，`web-kit-docs` → `packages/web/`
5. 搬 `project-docs` 的 getting-started / architecture / engineering / shared / internal，逐篇按第二节表格取舍重复页
6. 配 `next.config.mjs` 重定向 + 六站统一顶部导航 + 页脚"相关内容"
7. 首页 `app/(home)/modules/*` 换成真实链接
8. 删旧站外壳与重复正文，最后接跨站搜索

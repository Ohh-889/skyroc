# Skyroc

<div align="center">

![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-19.1-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue.svg)
![Vite](https://img.shields.io/badge/Vite-8.0-purple.svg)
![pnpm](https://img.shields.io/badge/pnpm-10.4.1-orange.svg)
![Turborepo](https://img.shields.io/badge/Turborepo-2.7-red.svg)

**一个跨端、分层、可复用的现代前端工程化平台。**

中后台（Admin）是它的首个落地产物，React Native / 小程序 正在路上。

</div>

---

## 概述

Skyroc 不是一个"后台管理系统"，而是一整套**「分层、跨端、可复用」的前端基础设施**。

你看到的应用（`apps/*`）只是一层薄壳，负责装配与业务页面；真正的能力沉淀在数十个 `@skyroc/*` workspace 包中——从平台无关的跨端内核（`@core/*`）、到 Web 工程套件（`web/*`）、再到 UI 组件库（`@skyroc/web-ui`），形成清晰的分层依赖关系。

Web 端已成熟稳定，跨端扩展（React Native / Expo、小程序）正在规划演进中。

### 为什么选择这套架构

- 🧱 **分层解耦** — Core 内核平台无关，Web Kit 按需组装，应用只写业务；层与层之间边界清晰，可独立演进
- 🌐 **跨端复用** — `@core/*` 系列严禁依赖 DOM/Web API，可在 Web、React Native、小程序之间共享状态、工具、请求、日志等核心逻辑
- 🔧 **统一工程化** — pnpm catalog 全局锁定依赖版本，Turborepo 任务缓存与并行编排，oxlint + oxfmt 毫秒级质量检查
- 📦 **开箱即用** — `skyroc-admin` 作为干净的起手模板，`admin-example` 内置完整功能 demo，`pnpm create:admin` 一键生成新项目

---

## 架构分层

```text
┌──────────────────────────────────────────────────────────────────┐
│  Applications         apps/admin · apps/admin-example            │  业务薄壳
└──────────────────────────────────────────────────────────────────┘
                                ▲ 依赖
┌──────────────────────────────────────────────────────────────────┐
│  Web Kit              packages/web/*（布局 / 主题 / UI / Vite）   │  Web 工程层
└──────────────────────────────────────────────────────────────────┘
                                ▲ 依赖
┌──────────────────────────────────────────────────────────────────┐
│  Adapter              @skyroc/adapter-*（Ant Design / Tailwind）  │  UI 适配层
└──────────────────────────────────────────────────────────────────┘
                                ▲ 依赖
┌──────────────────────────────────────────────────────────────────┐
│  Core                 packages/@core/*（platform-agnostic）       │  跨端内核
│                       ↕ 可被 Web / React Native / 小程序 共享     │
└──────────────────────────────────────────────────────────────────┘
```

### 包命名约定

| 前缀 | 适用范围 | 约束 |
|------|---------|------|
| `@skyroc/utils` / `@skyroc/axios` / ... (非前缀) | 跨平台 | 禁止依赖 DOM / Web API |
| `@skyroc/web-*` | 仅 Web 应用 | 可依赖 DOM / 浏览器 API |
| `@skyroc/adapter-*` | UI 库适配层 | 依赖特定 UI 库（如 Ant Design） |

---

## 应用（apps/）

| 应用 | 包名 | 说明 | 启动 | 在线预览 |
|------|------|------|------|---------|
| **skyroc-admin** | `skyroc-admin` | 干净的中后台起手模板，页面精简（首页/登录/异常），适合二次开发 | `pnpm --filter skyroc-admin dev`（端口 9527） | [skyroc-admin.com](https://skyroc-admin.com/) |
| **admin-example** | `admin-example` | 含完整 demo 页面的示例应用，覆盖插件/管理/交互/图表等场景 | `pnpm --filter admin-example dev`（端口 9528） | [skyroc-admin.com](https://skyroc-admin.com/) |
| **web-ui-playground** | `skyroc-ui-playground` | `@skyroc/web-ui` 组件库交互式 playground | `pnpm --filter skyroc-ui-playground dev` | [ui-play.skyroc.me](https://ui-play.skyroc.me/) |

---

## 版本历史

| 版本 | 技术栈 | 在线预览 | 文档 | 仓库 |
|------|--------|---------|------|------|
| **v3（当前）** | React 19 · Vite 8 · TanStack Router · Jotai · Antd 6 | [skyroc-admin.com](https://skyroc-admin.com/) | [admin-docs.skyroc.me](https://admin-docs.skyroc.me) | [GitHub](https://github.com/Ohh-889/skyroc-admin) · [Gitee](https://gitee.com/sjgk_dl/react-admin) |
| **v2** | React 19 · Vite 6 · React Router V7 · Redux Toolkit · Antd 5 | [admin-v2.skyroc.me](https://admin-v2.skyroc.me/home) | [admin-v2-docs.skyroc.me](https://admin-v2-docs.skyroc.me) | — |
| **v1** | React 18 · Vite 5 · React Router V6 · Redux Toolkit · Antd 5 | [admin-v1.skyroc.me](https://admin-v1.skyroc.me/) | [admin-docsv1.skyroc.me](https://admin-docsv1.skyroc.me) | — |

---

## 文档站点

项目提供 5 个独立文档站点，均位于 `docs/`，基于 Next.js + Fumadocs 构建，部署于 Cloudflare：

| 文档站 | 说明 | 在线地址 |
|--------|------|---------|
| **project-docs** | 项目总览、整体架构与开发指南 | [project-docs.skyroc.me](https://project-docs.skyroc.me) |
| **admin-docs** | `apps/admin` 的路由、菜单、权限与请求服务 | [admin-docs.skyroc.me](https://admin-docs.skyroc.me) |
| **core-docs** | `@core/*` 基础设施层各包的用途与边界 | [core-docs.skyroc.me](https://core-docs.skyroc.me) |
| **web-kit-docs** | 应用壳、主题、布局材料与 Ant Design 适配 | [web-kit-docs.skyroc.me](https://web-kit-docs.skyroc.me) |
| **web-ui-docs** | `@skyroc/web-ui` 组件库 API 与设计系统 | [web-ui-docs.skyroc.me](https://web-ui-docs.skyroc.me) |

本地启动任一文档站：

```bash
pnpm --filter <docs-package-name> dev
```

---

## 包列表

### 🧬 跨端内核（`packages/@core/*`）

| 包名 | 职责 |
|------|------|
| `@skyroc/utils` | 平台无关工具函数，含 `./web` 子路径提供浏览器专用工具（下载、窗口、BOM） |
| `@skyroc/axios` | 类型安全的 Axios 客户端——重试、转换管道、请求取消、Token 刷新、后端响应适配 |
| `@skyroc/service` | 平台无关的请求与查询基础设施，适配器模式接入 UI、鉴权、导航与 React Query |
| `@skyroc/core-state` | Jotai 状态管理封装，跨平台支持 |
| `@skyroc/logger` | 跨平台日志系统（基于 LogLayer），支持 Web / React Native / 小程序 |
| `@skyroc/scheduler` | 协作式任务调度器——统一初始化、周期任务与监听器管理 |
| `@skyroc/color` | 色彩工具与调色板生成（基于 colord / culori，OKLCH 算法，Ant Design 色阶） |
| `@skyroc/types` | 全局类型定义，跨平台支持 |
| `@skyroc/type-utils` | 高级 TypeScript 工具类型（表单路径、类型变换等） |
| `@skyroc/scripts` | 项目 CLI——changelog、release、git-commit、cleanup 等自动化脚本 |

### 🎨 UI 组件库（`packages/web/ui/*`）

| 包名 | 职责 |
|------|------|
| `@skyroc/web-ui` | 基于 Radix UI + Tailwind CSS 的现代 React 组件库（类 shadcn/ui 风格） |
| `@skyroc/web-ui-antd` | Ant Design 复合组件，面向管理系统场景 |
| `@skyroc/web-ui-compose` | 基于 UI primitives 的无状态复合组件 |

### 🧩 Web 工程套件（`packages/web/*`）

| 包名 | 职责 |
|------|------|
| `@skyroc/web-admin-layouts` | 可复用后台应用壳——菜单、权限、路由页签、布局状态 |
| `@skyroc/materials` | 插槽式 AdminLayout 与多风格 PageTab 物料组件 |
| `@skyroc/web-admin-theme` | Ant Design 主题工具——配置、预设、hooks、CSS 变量、暗黑/系统主题检测 |
| `@skyroc/adapter-antd-theme` | Ant Design 主题适配——基于 OKLCH 色彩空间的自定义算法 |
| `@skyroc/web-admin-i18n` | 后台国际化运行时与语言切换 UI |
| `@skyroc/web-admin-vite` | Vite 构建辅助与插件预设，可配置的 admin 应用构建套件 |
| `@skyroc/web-admin-runtime` | 启动插件运行时辅助（bootstrap plugins） |
| `@skyroc/web-admin-notification` | 可复用通知 Provider / hooks / Header 动作 |
| `@skyroc/web-admin-devtools` | 仅开发态加载的 devtools 面板（可配置） |
| `@skyroc/web-admin-styles` | 全局共享 CSS 资源 |
| `@skyroc/tailwind-plugin` | Tailwind CSS 主题插件——OKLCH 设计令牌、反馈色、侧边栏调色板与设计系统预设 |

### 🔗 共享与原语（`shared / primitives / hooks`）

| 包名 | 职责 |
|------|------|
| `@skyroc/ui-tokens` | 跨平台设计令牌——颜色、间距、圆角、字体，零运行时依赖 |
| `@skyroc/ui-types` | 跨平台共享 UI 类型定义 |
| `@skyroc/form` | 类型安全的高级表单处理库（`filed-form`），支持字段管理与验证 |
| `@skyroc/hooks` | 平台无关 React Hooks 核心，含 `./web` 子路径提供浏览器专用 hooks |

### 🛠️ 工程配置（`internal/*`）

| 包名 | 职责 |
|------|------|
| `@skyroc/config` | 共享开发配置（Vitest、Oxlint 等） |
| `@skyroc/tsconfig` | 共享 TypeScript 基础配置 |
| `@sa/uno-config` | UnoCSS 预设配置——主题快捷方式与设计令牌 |

---

## 技术栈

| 分类 | 技术 | 版本 |
|------|------|------|
| 框架 | React | 19.1.0 |
| 构建 | Vite | ^8.0.14 |
| 构建编排 | Turborepo | ^2.7.1 |
| 包管理 | pnpm | 10.4.1 |
| 语言 | TypeScript | ^6.0.3 |
| 路由 | TanStack Router | ^1.140.0 |
| 数据 | TanStack Query | ^5.90.12 |
| 状态 | Jotai | ^2.16.0 |
| UI | Ant Design | ^6.1.0 |
| UI | @skyroc/web-ui（Radix UI + Tailwind） | workspace |
| 样式 | UnoCSS | ^66.5.10 |
| 样式 | Tailwind CSS | ^4.1.18 |
| 动画 | Motion | ^12.23.26 |
| 国际化 | i18next | 25.7.2 |
| 图表 | ECharts | ^6.0.0 |
| HTTP | Axios | ^1.7.9 |
| 代码质量 | oxlint | ^1.60.0 |
| 格式化 | oxfmt | ^0.45.0 |
| 单元测试 | Vitest | ^4.0.18 |
| E2E 测试 | Playwright | ^1.59.1 |
| Mock | MSW | ^2.7.0 |
| 包打包 | tsdown | ^0.18.2 |

---

## 快速开始

### 环境要求

- **Node.js** >= 20
- **pnpm** >= 8.7（推荐使用仓库锁定的 `pnpm@10.4.1`）

### 安装

```bash
# 克隆仓库
git clone https://github.com/Ohh-889/skyroc-admin.git
cd skyroc-admin

# 安装所有依赖（一次性安装整个 monorepo）
pnpm install
```

### 启动开发

```bash
# 启动全量 dev（所有 apps 与 packages 的 dev 任务）
pnpm dev

# 仅启动主后台应用（端口 9527）
pnpm --filter skyroc-admin dev

# 仅启动示例应用（端口 9528）
pnpm --filter admin-example dev
```

### 构建

```bash
# 构建全部包与应用
pnpm build

# 仅构建主应用
pnpm --filter skyroc-admin build
```

### 创建新 Admin 项目

```bash
# 在本仓库 apps/ 下新增一个 app，保留 workspace: / catalog: 协议
pnpm create:admin my-admin

# 生成一个脱离本仓库也能 pnpm install 的独立工程
pnpm sa create-admin my-admin --target ~/projects/my-admin
```

两者的区别见 [`@skyroc/scripts` 文档](packages/@core/scripts/README.md#sa-create-admin)。

---

## 常用脚本

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动所有应用/包的开发模式 |
| `pnpm build` | 构建全部包与应用 |
| `pnpm lint` | 运行 oxlint 代码检查 |
| `pnpm format` | 使用 oxfmt 格式化代码 |
| `pnpm format:check` | 校验代码格式（CI 用） |
| `pnpm typecheck` | 全量 TypeScript 类型检查 |
| `pnpm test` | 运行单元测试（Vitest） |
| `pnpm test:e2e` | 运行端到端测试（Playwright） |
| `pnpm test:ui` | 启动 Vitest UI |
| `pnpm clean` | 清理所有构建产物 |
| `pnpm create:admin <name>` | CLI 脚手架在 `apps/` 下创建新 admin 项目（仓库内模式） |
| `pnpm sync:admin-template` | 同步 admin 模板变更 |

---

## 项目结构

```text
skyroc-admin/
├── apps/                               # 业务应用（薄壳）
│   ├── admin/                          # skyroc-admin：干净的起手模板
│   ├── admin-example/                  # 含完整 demo 页面的示例应用
│   └── web-ui-playground/              # @skyroc/web-ui 组件 playground
│
├── packages/
│   ├── @core/                          # 跨端内核（platform-agnostic）
│   │   ├── utils/                      # @skyroc/utils
│   │   ├── axios/                      # @skyroc/axios
│   │   ├── service/                    # @skyroc/service
│   │   ├── state/                      # @skyroc/core-state
│   │   ├── logger/                     # @skyroc/logger（Web/RN/小程序）
│   │   ├── scheduler/                  # @skyroc/scheduler
│   │   ├── color/                      # @skyroc/color（OKLCH）
│   │   ├── types/                      # @skyroc/types
│   │   ├── type-utils/                 # @skyroc/type-utils
│   │   └── scripts/                    # @skyroc/scripts（CLI 工具）
│   │
│   ├── web/                            # Web 工程套件
│   │   ├── admin-layouts/              # @skyroc/web-admin-layouts
│   │   ├── materials/                  # @skyroc/materials
│   │   ├── admin-theme/                # @skyroc/web-admin-theme
│   │   ├── antd-theme/                 # @skyroc/adapter-antd-theme
│   │   ├── admin-i18n/                 # @skyroc/web-admin-i18n
│   │   ├── admin-vite/                 # @skyroc/web-admin-vite
│   │   ├── admin-runtime/              # @skyroc/web-admin-runtime
│   │   ├── admin-notification/         # @skyroc/web-admin-notification
│   │   ├── admin-devtools/             # @skyroc/web-admin-devtools
│   │   ├── admin-styles/               # @skyroc/web-admin-styles
│   │   ├── tailwind-plugin/            # @skyroc/tailwind-plugin
│   │   └── ui/
│   │       ├── shadcn/                 # @skyroc/web-ui（Radix + Tailwind）
│   │       ├── antd/                   # @skyroc/web-ui-antd
│   │       └── compose/                # @skyroc/web-ui-compose
│   │
│   ├── shared/                         # 跨端共享
│   │   ├── ui-tokens/                  # @skyroc/ui-tokens（设计令牌）
│   │   └── ui-types/                   # @skyroc/ui-types
│   │
│   ├── primitives/
│   │   └── filed-form/                 # @skyroc/form（类型安全表单）
│   │
│   ├── hooks/                          # @skyroc/hooks
│   │
│   ├── native/      ⬅ 规划中           # React Native 专用包
│   └── miniapp/     ⬅ 规划中           # 小程序专用包
│
├── docs/                               # 文档站点（Next.js + Fumadocs）
│   ├── project-docs/
│   ├── admin-docs/
│   ├── core-docs/
│   ├── web-kit-docs/
│   └── web-ui-docs/
│
└── internal/                           # 内部共享配置
    ├── tsconfig/                        # @skyroc/tsconfig
    ├── uno-config/                      # @sa/uno-config
    └── config/                          # @skyroc/config
```

---

## 路线图

| 状态 | 端 | 说明 |
|------|----|----|
| ✅ 已就绪 | **Web · Admin** | `apps/admin` + `apps/admin-example`，完整中后台能力 |
| ✅ 已就绪 | **Web · UI 组件库** | `@skyroc/web-ui`，Radix UI + Tailwind 组件库 |
| 🚧 规划中 | **React Native / Expo** | `packages/native/*`，复用 `@core/*` 跨端内核；`@skyroc/logger` 已支持 RN 日志 |
| 🗓️ 规划中 | **小程序 / Mini Program** | `packages/miniapp/*`，`@skyroc/logger` 已支持小程序日志能力 |

> 跨端扩展的核心优势：`@skyroc/service`（请求/查询）、`@skyroc/core-state`（Jotai 状态）、`@skyroc/utils`、`@skyroc/color` 等内核包均不依赖 DOM，可直接被 Native / 小程序 端复用。

---

## 特别鸣谢

本项目基于 [Soybean](https://github.com/honghuangdc) 开发的优秀开源项目 [Soybean Admin](https://github.com/soybeanjs/soybean-admin) 演进而来，在此特别感谢 Soybean 为中后台开发领域做出的开源贡献。如果你喜欢这类项目，也请给 [Soybean Admin](https://github.com/soybeanjs/soybean-admin) 点个 star ⭐️。

同时感谢以下优秀开源项目：

- [Radix UI](https://www.radix-ui.com/) — 无障碍无头 UI 组件
- [shadcn/ui](https://ui.shadcn.com/) — 设计灵感
- [TanStack](https://tanstack.com/) — Router / Query / Form
- [Ant Design](https://ant.design/) — 企业级 UI 组件库
- [Jotai](https://jotai.org/) — 原子化状态管理
- [Turborepo](https://turbo.build/) — Monorepo 编排工具

---

## 如何贡献

欢迎任何形式的贡献，包括功能扩展、Bug 修复、文档改进或错别字纠正。

1. Fork 项目
2. 创建特性分支 `git checkout -b feature/your-feature`
3. 提交变更（使用 `pnpm commit` 生成符合 Conventional Commits 规范的提交信息）
4. 推送并开启 Pull Request

提交 PR 前请运行：

```bash
pnpm lint        # 代码检查
pnpm typecheck   # 类型检查
pnpm test        # 单元测试
```

---

## 开源协议

本项目基于 [MIT](./LICENSE) 协议开源，永久免费使用。

---

## 联系

- **作者**：Ohh-889
- **GitHub**：[github.com/Ohh-889](https://github.com/Ohh-889)
- **邮箱**：1509326266@qq.com
- **官网**：[skyroc-admin.com](https://skyroc-admin.com)

<div align="center">

如果这个项目对你有帮助，请给我们一个 ⭐️！

</div>

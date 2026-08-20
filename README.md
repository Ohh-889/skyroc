<div align="center">

<img src="./apps/admin/public/favicon.svg" width="112" alt="Skyroc Logo" />

# Skyroc

**跨端、分层、可复用的现代前端工程化平台**

从中后台应用到 Web / Native UI，再到请求、状态、日志与工程工具，能力全部沉淀为边界清晰的 workspace 包。

[在线预览](https://admin.skyroc.me/) · [项目文档](https://project-docs.skyroc.me/) · [Admin 文档](https://admin-docs.skyroc.me/) · [Web UI 文档](https://web-ui-docs.skyroc.me/) · [Native UI 文档](https://native-ui.skyroc.me/) · [GitHub](https://github.com/Ohh-889/skyroc-admin) · [Gitee](https://gitee.com/sjgk_dl/react-admin)

<p align="center"><a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19.2-149ECA?logo=react&amp;logoColor=white" alt="React" height="20" /></a> <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&amp;logoColor=white" alt="TypeScript" height="20" /></a> <a href="https://vite.dev/"><img src="https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&amp;logoColor=white" alt="Vite" height="20" /></a> <a href="https://expo.dev/"><img src="https://img.shields.io/badge/Expo-SDK_57-000020?logo=expo&amp;logoColor=white" alt="Expo" height="20" /></a> <a href="https://pnpm.io/"><img src="https://img.shields.io/badge/pnpm-10.4-F69220?logo=pnpm&amp;logoColor=white" alt="pnpm" height="20" /></a> <a href="https://turbo.build/"><img src="https://img.shields.io/badge/Turborepo-2.7-EF4444?logo=turborepo&amp;logoColor=white" alt="Turborepo" height="20" /></a></p>

</div>

> [!TIP]
> 想先看效果，打开 [Admin 在线预览](https://admin.skyroc.me/)、[Web UI 文档](https://web-ui-docs.skyroc.me/) 或 [Native UI 文档](https://native-ui.skyroc.me/)；想直接开发，从 [`apps/admin`](./apps/admin) 开始。

## ✨ 为什么是 Skyroc

- 🧱 **分层解耦** — 应用只负责装配与业务，稳定能力进入 Core、Web Kit、Native UI 等独立包。
- 🌐 **跨端复用** — 请求、状态、日志、调度、类型和工具收敛平台差异，可被 Web、React Native 与未来小程序复用。
- 🎨 **双端设计系统** — `@skyroc/web-ui` 与 `@skyroc/native-ui` 共用设计令牌，各自保留符合平台习惯的实现。
- 🔧 **统一工程化** — pnpm catalog 管理版本，Turborepo 编排任务，oxlint、oxfmt、Vitest 与 Playwright 统一质量流程。
- 📦 **开箱即用** — `skyroc-admin` 提供干净骨架，`admin-example` 展示完整能力，`pnpm create:admin` 可以创建新应用。

Web Admin、Web UI 和 React Native / Expo 组件库都已经落地；小程序目录仍作为后续扩展预留。

## 🚀 在线体验与文档

| 内容                | 说明                         | 入口                                                    |
| ------------------- | ---------------------------- | ------------------------------------------------------- |
| **Skyroc Admin**    | 当前 v3 管理端               | [在线预览](https://admin.skyroc.me/)                    |
| **RuoYi Plus Fast** | RuoYi / FastAPI 全栈管理端   | [在线预览](http://47.98.185.172:8080/)                  |
| **Admin 文档**      | 路由、菜单、权限、请求与主题 | [admin-docs.skyroc.me](https://admin-docs.skyroc.me/)   |
| **Web UI 文档**     | Web 组件 API 与设计系统      | [web-ui-docs.skyroc.me](https://web-ui-docs.skyroc.me/) |
| **Native UI 文档**  | Native 组件 API 与真实 Demo  | [native-ui.skyroc.me](https://native-ui.skyroc.me/)     |

<details>
<summary><strong>历史版本与文档</strong></summary>

| 版本           | 技术栈                                                            | 在线预览                                              | 文档                                        |
| -------------- | ----------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------- |
| **v3（当前）** | React 19 · Vite 8 · TanStack Router · Jotai · Ant Design 6        | [admin.skyroc.me](https://admin.skyroc.me/)           | [Admin Docs](https://admin-docs.skyroc.me/) |
| **v2**         | React 19 · Vite 6 · React Router 7 · Redux Toolkit · Ant Design 5 | [admin-v2.skyroc.me](https://admin-v2.skyroc.me/home) | [v2 Docs](https://admin-v2-docs.skyroc.me/) |
| **v1**         | React 18 · Vite 5 · React Router 6 · Redux Toolkit · Ant Design 5 | [admin-v1.skyroc.me](https://admin-v1.skyroc.me/)     | [v1 Docs](https://admin-docsv1.skyroc.me/)  |

</details>

## 🧭 选择你的入口

| 目标                 | 应用                                                       | 启动命令                                   |
| -------------------- | ---------------------------------------------------------- | ------------------------------------------ |
| 基于干净骨架开发后台 | [`apps/admin`](./apps/admin)                               | `pnpm --filter skyroc-admin dev`           |
| 查看完整后台能力     | [`apps/admin-example`](./apps/admin-example)               | `pnpm --filter admin-example dev`          |
| 对接 RuoYi / FastAPI | [`apps/ruoyi-plus-fast`](./apps/ruoyi-plus-fast)           | `pnpm --filter ruoyi-plus-fast dev`        |
| 开发 Web 组件        | [`apps/web-ui-playground`](./apps/web-ui-playground)       | `pnpm --filter skyroc-ui-playground dev`   |
| 开发 Native 组件     | [`apps/native-ui-playground`](./apps/native-ui-playground) | `pnpm --filter native-ui-playground start` |

## 🏗️ 架构设计

Skyroc 不是把所有代码堆进一个 Admin 应用，而是让应用成为轻量装配层，让基础能力可以独立理解、测试和演进。

```text
┌────────────────────────────────────────────────────────────────────┐
│ Applications                                                       │
│ admin · admin-example · ruoyi-plus-fast · Web / Native Playground │
│ 负责：业务页面、路由装配、服务适配与应用配置                        │
└──────────────────────────────┬─────────────────────────────────────┘
                               │ depends on
┌──────────────────────────────▼─────────────────────────────────────┐
│ Platform                                                           │
│ packages/web/* · packages/native/*                                 │
│ 负责：布局、主题、UI、i18n、通知、运行时与构建预设                  │
└──────────────────────────────┬─────────────────────────────────────┘
                               │ depends on
┌──────────────────────────────▼─────────────────────────────────────┐
│ Foundation                                                         │
│ packages/@core/* · packages/shared/* · packages/hooks              │
│ 负责：请求、状态、日志、调度、色彩、类型与通用工具                  │
└────────────────────────────────────────────────────────────────────┘

internal/* ── 为各 workspace 提供 TypeScript、测试、Lint 与 UnoCSS 配置
```

### 架构约束

1. 应用层负责业务与装配，不复制共享包已经提供的能力。
2. Web 与 Native 的 UI、主题和平台 API 分开维护。
3. 跨端包把平台差异收敛在明确的子路径或适配器中。
4. 公共类型保持单一来源；设计令牌由 `@skyroc/tailwind-plugin` 统一生成，再按平台输出。
5. 调整包布局或依赖方向前，先阅读 [`packages/ARCHITECTURE.md`](./packages/ARCHITECTURE.md)。

### 包命名约定

| 命名                | 适用范围                             | 示例                                               |
| ------------------- | ------------------------------------ | -------------------------------------------------- |
| `@skyroc/<能力>`    | 跨端基础设施、共享能力或平台无关原语 | `@skyroc/utils`、`@skyroc/service`、`@skyroc/form` |
| `@skyroc/web-*`     | Web 布局、主题、UI 与运行时能力      | `@skyroc/web-admin-layouts`、`@skyroc/web-ui`      |
| `@skyroc/native-*`  | React Native / Expo 专属能力         | `@skyroc/native-ui`                                |
| `@skyroc/adapter-*` | 对具体第三方库的适配层               | `@skyroc/adapter-antd-theme`                       |
| `@sa/*`             | 兼容历史命名的仓库内部配置           | `@sa/uno-config`                                   |

## 📦 Workspace 包地图

| 分层           | 包                                                                                                                                                                            |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **跨端内核**   | `@skyroc/types` · `@skyroc/utils` · `@skyroc/axios` · `@skyroc/service` · `@skyroc/core-state` · `@skyroc/logger` · `@skyroc/scheduler` · `@skyroc/color` · `@skyroc/tailwind-plugin` · `@skyroc/scripts` |
| **共享与原语** | `@skyroc/type-utils` · `@skyroc/ui-types` · `@skyroc/hooks` · `@skyroc/form`                                                                                                  |
| **Web Kit**    | `@skyroc/web-admin-*` · `@skyroc/materials` · `@skyroc/adapter-antd-theme`                                                                                                    |
| **UI**         | `@skyroc/web-ui` · `@skyroc/web-ui-antd` · `@skyroc/web-ui-compose` · `@skyroc/native-ui`                                                                                     |
| **内部配置**   | `@skyroc/config` · `@skyroc/tsconfig` · `@sa/uno-config`                                                                                                                      |

<details>
<summary><strong>查看全部包的职责</strong></summary>

### 🧬 跨端内核 — `packages/@core/*`

| 包名                 | 职责                                                                              |
| -------------------- | --------------------------------------------------------------------------------- |
| `@skyroc/types`      | 全局类型与 API 类型声明，作为低依赖类型基础                                       |
| `@skyroc/utils`      | 平台无关工具集合，通过 `./web`、`./path`、`./cn`、`./crypto` 等子路径隔离特定能力 |
| `@skyroc/axios`      | 类型安全的 Axios 客户端，提供重试、转换管道、请求取消与后端响应处理               |
| `@skyroc/service`    | 请求与 TanStack Query 基础设施，通过适配器接入鉴权、导航和消息反馈                |
| `@skyroc/core-state` | Jotai 状态封装与可注入存储的跨端状态能力                                          |
| `@skyroc/logger`     | 基于 LogLayer 的 Web、React Native、小程序日志与存储适配                          |
| `@skyroc/scheduler`  | 零运行时依赖的协作式任务调度器，统一 init、periodic 与 listener 任务              |
| `@skyroc/color`      | 基于 colord / culori 的色彩工具与 OKLCH、Ant Design 调色板生成                    |
| `@skyroc/tailwind-plugin` | 设计令牌唯一来源，生成 Web / Native 的 Tailwind v4 主题变量与预设            |
| `@skyroc/scripts`    | 创建应用、同步模板、提交、清理、发布与 changelog 等仓库 CLI                       |

### 🔗 共享能力与原语

| 包名                 | 位置                             | 职责                                                     |
| -------------------- | -------------------------------- | -------------------------------------------------------- |
| `@skyroc/type-utils` | `packages/shared/type-utils`     | 表单路径、深层变换等零运行时 TypeScript 工具类型         |
| `@skyroc/ui-types`   | `packages/shared/ui-types`       | Web / Native 组件共享的主题、尺寸、方向与 className 类型 |
| `@skyroc/hooks`      | `packages/hooks`                 | 平台无关 React Hooks，并以 `./web` 隔离浏览器 Hooks      |
| `@skyroc/form`       | `packages/primitives/filed-form` | 类型安全字段管理、路径级订阅与 Standard Schema 校验原语  |

### 🧩 Web 工程套件 — `packages/web/*`

| 包名                             | 职责                                                              |
| -------------------------------- | ----------------------------------------------------------------- |
| `@skyroc/web-admin-layouts`      | 后台应用壳，组合菜单、权限、路由页签、布局状态与全局搜索          |
| `@skyroc/materials`              | 插槽式 AdminLayout、PageTab 等后台物料                            |
| `@skyroc/web-admin-theme`        | 主题配置、预设、Hooks、CSS 变量以及暗色 / 系统主题同步            |
| `@skyroc/adapter-antd-theme`     | 将 Skyroc 的 OKLCH 色彩能力适配到 Ant Design 主题算法             |
| `@skyroc/web-admin-i18n`         | Admin 国际化运行时与语言切换 UI                                   |
| `@skyroc/web-admin-vite`         | Vite、React Compiler、TanStack Router、UnoCSS、自动导入等构建预设 |
| `@skyroc/web-admin-runtime`      | Admin 启动插件的运行时辅助                                        |
| `@skyroc/web-admin-notification` | 通知 Provider、Hooks、Header 入口与通知面板                       |
| `@skyroc/web-admin-devtools`     | 开发环境的 Router、Query、Jotai 调试面板                          |
| `@skyroc/web-admin-styles`       | Admin 应用共享的全局 CSS 资源                                     |

### 🎨 UI 组件库

| 包名                     | 位置                      | 职责                                                           |
| ------------------------ | ------------------------- | -------------------------------------------------------------- |
| `@skyroc/web-ui`         | `packages/web/ui/shadcn`  | 基于 Radix UI 与 Tailwind CSS 的 Web 基础组件和 primitives API |
| `@skyroc/web-ui-antd`    | `packages/web/ui/antd`    | 面向管理系统场景的 Ant Design 复合组件                         |
| `@skyroc/web-ui-compose` | `packages/web/ui/compose` | 无状态、高复用的 Web 组合组件                                  |
| `@skyroc/native-ui`      | `packages/native/ui`      | 基于 React Native、Expo 与 Uniwind 的 Native 组件库            |

### 🛠️ 内部工程配置 — `internal/*`

| 包名               | 职责                                           |
| ------------------ | ---------------------------------------------- |
| `@skyroc/config`   | Vitest、Oxlint 等共享开发配置                  |
| `@skyroc/tsconfig` | 各 workspace 复用的 TypeScript 基础配置        |
| `@sa/uno-config`   | Admin 主题、shortcuts 与设计变量的 UnoCSS 预设 |

</details>

## ⚡ 快速开始

### 环境要求

- Node.js 20 或更高版本
- pnpm 10.4.1，建议通过 Corepack 使用仓库锁定版本
- Native 开发还需要 Expo、iOS 或 Android 本地环境

```bash
git clone https://github.com/Ohh-889/skyroc-admin.git
cd skyroc-admin

corepack enable
pnpm install
pnpm --filter skyroc-admin dev
```

### 创建新的 Admin 应用

```bash
# 在当前 monorepo 的 apps/ 下创建应用
pnpm create:admin my-admin

# 创建可以脱离 monorepo 独立安装的工程
pnpm sa create-admin my-admin --target /path/to/projects/my-admin
```

更多参数见 [`@skyroc/scripts` 文档](./packages/@core/scripts/README.md#sa-create-admin)。

## 🗂️ 仓库结构

```text
skyroc-admin/
├── apps/
│   ├── admin/                  # 精简 Admin 模板
│   ├── admin-example/          # 完整功能示例
│   ├── ruoyi-plus-fast/        # RuoYi / FastAPI 管理端
│   ├── web-ui-playground/      # Web UI 演示场
│   └── native-ui-playground/   # Expo / Native UI 演示场
├── packages/
│   ├── @core/                  # 跨端运行时基础
│   ├── shared/                 # 共享类型与轻量能力
│   ├── hooks/                  # 跨端 React Hooks
│   ├── primitives/             # 平台无关原语
│   ├── web/                    # Web Kit 与 Web UI
│   └── native/                 # React Native UI
├── docs/                       # 六个独立文档站
├── design/                     # 产品设计、决策与原型
├── internal/                   # 内部共享配置
└── scripts/                    # 仓库级辅助脚本
```

## 🧰 主要技术栈

| 范围       | 技术                                                                   |
| ---------- | ---------------------------------------------------------------------- |
| **Web**    | React 19、Vite 8、TanStack Router、TanStack Query、Jotai、Ant Design 6 |
| **Native** | React Native、Expo SDK 57、Uniwind、Tailwind CSS 4                     |
| **UI**     | Radix UI、Ant Design、`@skyroc/web-ui`、`@skyroc/native-ui`            |
| **工程**   | TypeScript 6、pnpm workspace、Turborepo、oxlint、oxfmt                 |
| **测试**   | Vitest、Testing Library、Playwright                                    |
| **文档**   | Next.js、Fumadocs                                                      |

依赖版本以 [`package.json`](./package.json)、[`pnpm-workspace.yaml`](./pnpm-workspace.yaml) 和锁文件为准。

## 🛠️ 常用命令

| 命令                                | 用途                           |
| ----------------------------------- | ------------------------------ |
| `pnpm dev` / `pnpm build`           | Turborepo 编排全仓开发 / 构建  |
| `pnpm typecheck` / `pnpm lint`      | TypeScript 检查 / oxlint       |
| `pnpm format` / `pnpm format:check` | oxfmt 格式化 / 仅检查          |
| `pnpm test` / `pnpm test:e2e`       | Vitest / Playwright            |
| `pnpm create:admin <name>`          | 从内置模板创建 Admin 应用      |
| `pnpm sync:admin-template`          | 将 `apps/admin` 同步到内置模板 |
| `pnpm clean`                        | 清理 workspace 构建产物        |

开发单个 workspace 时优先使用 `pnpm --filter <workspace-name> <command>`，减少无关任务和输出。

## 🤝 参与项目

- 贡献流程：[`CONTRIBUTING.md`](./CONTRIBUTING.md)
- 仓库级开发约定：[`AGENTS.md`](./AGENTS.md)
- Web 专属约定：[`packages/web/AGENTS.md`](./packages/web/AGENTS.md)
- Native / Uniwind 约定：[`packages/native/AGENTS.md`](./packages/native/AGENTS.md)
- 问题反馈：[GitHub Issues](https://github.com/Ohh-889/skyroc-admin/issues)
- 代码贡献：[Pull Requests](https://github.com/Ohh-889/skyroc-admin/pulls)

提交遵循 [Conventional Commits](https://www.conventionalcommits.org/)，并保持单次提交职责清晰。

## 🙏 致谢

> Skyroc 由 [Soybean Admin](https://github.com/soybeanjs/soybean-admin) 演进而来。感谢原项目的优秀设计，也感谢所有提供基础能力的开源社区。

| 领域          | 开源生态                                                                                                        |
| ------------- | --------------------------------------------------------------------------------------------------------------- |
| 基础框架      | [React](https://react.dev/) · [TanStack](https://tanstack.com/) · [Jotai](https://jotai.org/)                   |
| UI 与设计     | [Ant Design](https://ant.design/) · [Radix UI](https://www.radix-ui.com/) · [shadcn/ui](https://ui.shadcn.com/) |
| Native 跨端   | [Expo](https://expo.dev/) · [Uniwind](https://docs.uniwind.dev/)                                                |
| Monorepo 工程 | [Turborepo](https://turbo.build/)                                                                               |

## 📄 License

基于 [MIT License](./LICENSE) 开源，可自由用于个人和商业项目。

<div align="center">

由 [Ohh-889](https://github.com/Ohh-889) 维护 · [GitHub](https://github.com/Ohh-889/skyroc-admin) · [Gitee](https://gitee.com/sjgk_dl/react-admin) · [admin.skyroc.me](https://admin.skyroc.me/)

如果这个项目对你有帮助，欢迎点一个 ⭐️

</div>

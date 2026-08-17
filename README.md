# Skyroc

<div align="center">

基于 React、React Native 与 TypeScript 的跨端 Monorepo，包含中后台应用、Web / Native UI、共享基础设施、演示场和文档站。

[GitHub](https://github.com/Ohh-889/skyroc-admin) · [项目文档](https://project-docs.skyroc.me/) · [Admin 文档](https://admin-docs.skyroc.me/) · [Web UI Playground](https://ui-play.skyroc.me/)

![React](https://img.shields.io/badge/React-19-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-6-blue.svg)
![pnpm](https://img.shields.io/badge/pnpm-10-orange.svg)
![Turborepo](https://img.shields.io/badge/Turborepo-2-red.svg)

</div>

## 项目定位

Skyroc 不只是一个后台管理模板，而是一套正在实际承载 Web Admin 与 React Native UI 的前端工程体系。

- `apps/` 放可独立运行的产品、模板和组件演示场。
- `packages/web/` 与 `packages/native/` 放平台相关能力。
- `packages/@core/`、`packages/shared/` 和 `packages/hooks/` 放跨端基础能力。
- `docs/` 为各层能力提供独立文档站。
- `internal/` 统一 TypeScript、代码检查和 UnoCSS 等工程配置。

应用负责组合能力和实现业务，共享包负责沉淀稳定边界。Web 与 Native 共享类型、设计令牌和基础设施，但不混用平台 API。

## 从哪里开始

根据你的目标选择入口，不需要先理解整个仓库。

| 目标                      | 入口                                                       | 说明                                   |
| ------------------------- | ---------------------------------------------------------- | -------------------------------------- |
| 基于干净骨架开发后台      | [`apps/admin`](./apps/admin)                               | 精简的 Skyroc Admin 起手应用           |
| 查看完整后台能力示例      | [`apps/admin-example`](./apps/admin-example)               | 页面、插件、主题和交互示例             |
| 开发 RuoYi Plus Fast 前端 | [`apps/ruoyi-plus-fast`](./apps/ruoyi-plus-fast)           | 面向 RuoYi / FastAPI 业务接口的管理端  |
| 开发或调试 Web UI         | [`apps/web-ui-playground`](./apps/web-ui-playground)       | `@skyroc/web-ui` 的交互式演示场        |
| 开发或调试 Native UI      | [`apps/native-ui-playground`](./apps/native-ui-playground) | Expo 驱动的 `@skyroc/native-ui` 演示场 |
| 了解整体架构              | [`docs/project-docs`](./docs/project-docs)                 | 项目分层、约定与开发指南               |

## 快速开始

### 环境要求

- Node.js 20 或更高版本
- pnpm 10.4.1；建议通过 Corepack 使用仓库锁定版本
- 开发 Native 应用时，还需要满足 Expo、iOS 或 Android 的本地环境要求

```bash
corepack enable
pnpm install
```

### 启动指定应用

```bash
# 干净的 Admin 模板
pnpm --filter skyroc-admin dev

# 完整 Admin 示例
pnpm --filter admin-example dev

# RuoYi Plus Fast 管理端
pnpm --filter ruoyi-plus-fast dev

# Web UI Playground
pnpm --filter skyroc-ui-playground dev

# Native UI Playground（启动 Expo）
pnpm --filter native-ui-playground start
```

也可以执行 `pnpm dev`，由 Turborepo 启动所有声明了 `dev` 任务的 workspace。日常开发更推荐使用 `--filter`，减少无关进程和输出。

## 仓库结构

```text
.
├── apps/
│   ├── admin/                  # 精简 Admin 模板
│   ├── admin-example/          # 完整 Admin 示例
│   ├── ruoyi-plus-fast/        # RuoYi Plus Fast 管理端
│   ├── web-ui-playground/      # Web UI 演示场
│   └── native-ui-playground/   # Expo / Native UI 演示场
├── packages/
│   ├── @core/                  # 请求、状态、日志、工具、类型等跨端基础设施
│   ├── shared/                 # UI types、TypeScript 工具类型
│   ├── hooks/                  # 跨端 Hooks 与 Web 子路径
│   ├── primitives/             # 平台无关或轻平台依赖的基础能力
│   ├── web/                    # Web Admin Kit 与 Web UI
│   └── native/                 # React Native UI
├── docs/                       # 项目、Admin、Core、Web Kit、Web UI、Native UI 文档
├── design/                     # 业务设计、决策记录与原型资料
├── internal/                   # 仓库内部共享配置
└── scripts/                    # 仓库级辅助脚本
```

完整的包布局、命名和依赖边界见 [`packages/ARCHITECTURE.md`](./packages/ARCHITECTURE.md)。

## 架构边界

```text
Applications
  ├─ Web apps ──────> packages/web/*
  └─ Native apps ───> packages/native/*
            │
            └───────> packages/@core/* · packages/shared/* · packages/hooks

internal/* ─────────> 为各 workspace 提供共享工程配置
```

仓库遵循以下原则：

1. 应用层负责业务与装配，不复制共享包已有能力。
2. Web 和 Native 的组件、主题及平台 API 分开维护。
3. 跨端共享层不依赖 DOM、React Native 或具体 UI 库。
4. 设计令牌和公共类型保持单一来源，由各平台完成适配。
5. 新增包或调整依赖方向前，先阅读 [`packages/ARCHITECTURE.md`](./packages/ARCHITECTURE.md)。

## 主要技术

| 范围   | 技术                                                                   |
| ------ | ---------------------------------------------------------------------- |
| Web    | React 19、Vite 8、TanStack Router、TanStack Query、Jotai、Ant Design 6 |
| Native | React Native、Expo、Uniwind、Tailwind CSS 4                            |
| UI     | Radix UI、Ant Design、`@skyroc/web-ui`、`@skyroc/native-ui`            |
| 工程   | TypeScript 6、pnpm workspace、Turborepo、oxlint、oxfmt                 |
| 测试   | Vitest、Testing Library、Playwright                                    |
| 文档   | Next.js、Fumadocs                                                      |

依赖版本以根目录 [`package.json`](./package.json)、[`pnpm-workspace.yaml`](./pnpm-workspace.yaml) 和锁文件为准。

## 常用命令

| 命令                       | 用途                             |
| -------------------------- | -------------------------------- |
| `pnpm dev`                 | 启动各 workspace 的开发任务      |
| `pnpm build`               | 构建全部可构建 workspace         |
| `pnpm typecheck`           | 运行全仓 TypeScript 检查         |
| `pnpm lint`                | 运行全仓代码检查                 |
| `pnpm format`              | 使用 oxfmt 格式化仓库            |
| `pnpm format:check`        | 检查格式但不改文件               |
| `pnpm test`                | 运行单元测试                     |
| `pnpm test:e2e`            | 运行端到端测试                   |
| `pnpm clean`               | 清理 workspace 构建产物          |
| `pnpm create:admin <name>` | 在 `apps/` 下创建新的 Admin 应用 |

对单个应用或包工作时，优先使用过滤命令：

```bash
pnpm --filter <workspace-name> typecheck
pnpm --filter <workspace-name> build
pnpm --filter <workspace-name> test
```

## 文档入口

| 内容           | 源码                                           | 在线地址                                                  |
| -------------- | ---------------------------------------------- | --------------------------------------------------------- |
| 项目总览与架构 | [`docs/project-docs`](./docs/project-docs)     | [project-docs.skyroc.me](https://project-docs.skyroc.me/) |
| Admin 开发     | [`docs/admin-docs`](./docs/admin-docs)         | [admin-docs.skyroc.me](https://admin-docs.skyroc.me/)     |
| Core 基础设施  | [`docs/core-docs`](./docs/core-docs)           | [core-docs.skyroc.me](https://core-docs.skyroc.me/)       |
| Web Kit        | [`docs/web-kit-docs`](./docs/web-kit-docs)     | [web-kit-docs.skyroc.me](https://web-kit-docs.skyroc.me/) |
| Web UI         | [`docs/web-ui-docs`](./docs/web-ui-docs)       | [web-ui-docs.skyroc.me](https://web-ui-docs.skyroc.me/)   |
| Native UI      | [`docs/native-ui-docs`](./docs/native-ui-docs) | 本地文档站                                                |

本地启动任一文档站：

```bash
pnpm --filter <docs-package-name> dev
```

## 开发约定

- 仓库级协作规则见 [`AGENTS.md`](./AGENTS.md)。
- Web 专属约定见 [`packages/web/AGENTS.md`](./packages/web/AGENTS.md)。
- Native / Uniwind 专属约定见 [`packages/native/AGENTS.md`](./packages/native/AGENTS.md)。
- 修改共享包时，应检查其直接消费方，优先做受影响 workspace 的定向验证。
- 提交遵循 Conventional Commits，并保持单次提交职责清晰。

## 致谢

Skyroc 由 [Soybean Admin](https://github.com/soybeanjs/soybean-admin) 演进而来。感谢 Soybean Admin 及 React、TanStack、Ant Design、Radix UI、Expo、Uniwind、Turborepo 等开源社区提供的基础能力。

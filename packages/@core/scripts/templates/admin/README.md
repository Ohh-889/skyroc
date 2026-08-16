<div align="center">
 <img src="./public/favicon.svg" width="160" />
 <h1>SkyrocAdmin</h1>
</div>

---

[![license](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

> [!NOTE]
> 如果您觉得 `React SkyrocAdmin` 对您有所帮助，或者您喜欢我们的项目，请在 GitHub 上给我们一个 ⭐️。您的支持是我们持续改进和增加新功能的动力！感谢您的支持！

## 特别鸣谢

本项目是基于 [Soybean](https://github.com/honghuangdc) 开发的优秀开源项目 [Soybean Admin](https://github.com/soybeanjs/soybean-admin) 的 React 版本实现。在此特别感谢 Soybean 的开源贡献，为中后台开发提供了优秀的解决方案。如果您喜欢本项目，也请给原作者的 [Soybean Admin](https://github.com/soybeanjs/soybean-admin) 点个 star ⭐️。

## 简介

[`SkyrocAdmin`](https://github.com/Ohh-889/skyroc-admin) 是一个与时俱进、功能强大、架构优雅的企业级跨端中后台管理模板。

**为什么选择 React SkyrocAdmin？**

- 🎯 **与时俱进**：采用 2026 年最新前端技术栈（React 19、Vite 8、TypeScript 6），持续紧跟技术潮流
- 💪 **功能强大**：集成 TanStack Router、TanStack Query、Jotai 等业界最佳实践，提供完整的企业级解决方案
- ✨ **架构优雅**：`Applications → Web Kit → Core` 三层分层架构，模块化设计，完善的类型系统，代码质量堪称典范
- 📐 **规范性强**：严格的 oxlint 代码规范、统一的项目结构、Turborepo 标准化开发流程，适合团队协作

项目采用了最新的前端技术栈：

### 核心技术栈

- 🚀 **React 19** - 最新的 React 版本，集成 React Compiler，享受最前沿的特性
- 🛤️ **TanStack Router** - 类型安全的文件式路由管理系统
- 🔄 **TanStack Query 5** - 强大的服务端状态管理方案
- 📦 **Jotai** - 轻量原子化的客户端状态管理
- 🎨 **Ant Design 6** - 企业级 UI 组件库
- ⚡️ **Vite 8** - 极速的开发构建工具
- 🎯 **TypeScript 6** - 完善的类型系统
- 🌈 **UnoCSS + Tailwind CSS 4** - 高性能的原子化 CSS 引擎
- 🏗️ **Turborepo + pnpm monorepo** - 高效的多包工程管理方案
- 🔧 **oxlint + oxfmt** - 现代化的超高速代码质量与格式化工具链

### 项目特点

- 💡 **代码质量**：代码规范严谨，架构清晰优雅，完善的 TypeScript 类型支持
- ⚡️ **开箱即用**：无需复杂配置，快速启动项目开发
- 🧱 **干净骨架**：精简的项目结构，作为开箱即用的中后台起手模板；完整 demo 页面参见 [`apps/admin-example`](../admin-example)
- 📋 **文件式路由**：基于 TanStack Router 的自动化文件路由系统，类型安全，开发体验极佳
- 🔄 **数据管理**：集成 TanStack Query，优雅的服务端状态管理，自动缓存、重新验证
- 🏗️ **架构设计**：`@skyroc/*` 分层包设计，UI、Service、Core 边界清晰，高度模块化
- 🎨 **主题系统**：基于 OKLCH 色彩算法，支持暗黑模式、多主题色、布局配置等
- 🌍 **国际化**：完整的 i18n 方案（i18next），支持多语言实时切换
- 🔐 **权限管理**：基于角色的权限控制系统（RBAC），支持动态菜单与路由
- 📱 **响应式设计**：完美适配移动端和桌面端
- 🎯 **错误边界**：自动错误捕获和友好的错误界面
- ⚙️ **Keep-Alive**：页面缓存功能，提升用户体验
- 🎭 **动画效果**：基于 Motion 的流畅动画系统
- 🔧 **CLI 工具**：内置命令行工具（Git 提交规范、代码清理、版本发布、创建 admin 等）

### Monorepo 架构

项目采用 pnpm workspace + Turborepo 管理，能力沉淀在数十个 `@skyroc/*` 包中，应用（`apps/*`）只是一层薄壳：

**基础设施层（`packages/@core/*`）**

- 🛠️ **@skyroc/utils** - 平台无关工具函数（日期/存储/加密/事件/并发去重等）
- 📡 **@skyroc/axios** - 类型安全的 Axios 客户端（重试/转换/取消/Token 刷新）
- 🔌 **@skyroc/service** - 请求与查询基础设施（适配器模式，接入 UI、鉴权、导航与 React Query）
- 📦 **@skyroc/core-state** - Jotai 状态管理封装，跨平台支持
- 📝 **@skyroc/logger** - 跨平台日志系统（基于 LogLayer）
- ⏱️ **@skyroc/scheduler** - 协作式任务调度器
- 🎨 **@skyroc/color** - 色彩工具与调色板生成（OKLCH）
- 📋 **@skyroc/types** - 全局类型定义
- 🔧 **@skyroc/type-utils** - 高级 TypeScript 工具类型
- 💻 **@skyroc/scripts** - 项目 CLI（changelog、release、git-commit 等）

**Web Kit 层（`packages/web/*`）**

- 🏠 **@skyroc/web-admin-layouts** - 后台应用壳（菜单/权限/路由页签/布局状态）
- 🧩 **@skyroc/materials** - 插槽式 AdminLayout 与多风格 PageTab
- 🌗 **@skyroc/web-admin-theme** - Ant Design 主题工具（暗黑/系统主题）
- 🎨 **@skyroc/adapter-antd-theme** - Ant Design OKLCH 主题适配
- 🌍 **@skyroc/web-admin-i18n** - 后台国际化运行时与语言 UI
- ⚡️ **@skyroc/web-admin-vite** - Vite 构建辅助与插件预设
- 🚀 **@skyroc/web-admin-runtime** - 启动插件运行时辅助
- 🔔 **@skyroc/web-admin-notification** - 通知 Provider / hooks / Header 动作
- 🛠️ **@skyroc/web-admin-devtools** - 仅开发态的 devtools 面板
- 🎨 **@skyroc/web-admin-styles** - 全局 CSS 资源
- 🌈 **@skyroc/web-ui** - 基于 Radix UI + Tailwind 的现代 React 组件库
- 🎯 **@skyroc/web-ui-antd** - Ant Design 复合组件
- 🔲 **@skyroc/web-ui-compose** - 基于 UI primitives 的无状态复合组件

**共享层**

- 🪝 **@skyroc/hooks** - 跨平台 React Hooks 集合（含 ./web 子路径）
- 📝 **@skyroc/form** - 类型安全的高级表单处理库（`@skyroc/filed-form`）
- 🎨 **@skyroc/ui-tokens** - 设计令牌（颜色/间距/圆角/字体，零运行时依赖）

**架构分层示意**

```text
┌───────────────────────────────────────────────────────┐
│  Applications     apps/admin · apps/admin-example       │  业务应用（薄壳）
└───────────────────────────────────────────────────────┘
                          ▲ 依赖
┌───────────────────────────────────────────────────────┐
│  Web Kit          packages/web/*（布局 / 主题 / UI）    │  界面工程层
└───────────────────────────────────────────────────────┘
                          ▲ 依赖
┌───────────────────────────────────────────────────────┐
│  Core             packages/@core/*（utils/axios/...）   │  基础设施层（平台无关）
└───────────────────────────────────────────────────────┘
```

无论是学习最新前端技术，还是开发企业级中后台项目，React SkyrocAdmin 都是您的不二之选。

## 版本信息

当前版本：**v3.0.0**

### 技术栈版本

| 技术 | 版本 | 说明 |
|------|------|------|
| React | 19.1.0 | 核心框架（含 React Compiler） |
| TanStack Router | ^1.140.0 | 文件式类型安全路由 |
| TanStack Query | ^5.90.12 | 数据获取和缓存 |
| Jotai | ^2.16.0 | 原子化状态管理 |
| Ant Design | ^6.1.0 | UI 组件库 |
| Vite | ^8.0.14 | 构建工具 |
| TypeScript | ^6.0.3 | 类型系统 |
| UnoCSS | ^66.5.10 | 原子化 CSS |
| Tailwind CSS | ^4.1.18 | 实用优先 CSS 框架 |
| Motion | ^12.23.26 | 动画库 |
| i18next | 25.7.2 | 国际化框架 |
| pnpm | 10.4.1 | 包管理器 |
| Turborepo | ^2.7.1 | Monorepo 任务编排 |

### 在线预览

- **React19（v3）版本:**
  - [预览地址](https://skyroc-admin.com/)
  - [Github 仓库](https://github.com/Ohh-889/skyroc-admin)
  - [Gitee 仓库](https://gitee.com/sjgk_dl/react-admin)

- **React19（v2）版本:**
  - [预览地址](https://admin-v2.skyroc.me/home)

- **React18 版本 (v1):**
  - [预览地址](https://admin-v1.skyroc.me/)

### 文档

- **v3 版本:**
  - [在线文档](https://admin-docs.skyroc.me) - 详尽的 Ant Design 风格文档
- **v2 版本:**
  - [在线文档](https://admin-v2-docs.skyroc.me) - v2 版本文档
- **v1 版本:**
  - [在线文档](https://admin-docsv1.skyroc.me) - v1 版本文档

## 示例图片

![](https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/soybean-admin-v1-01.png)
![](https://ohh-1321526050.cos.ap-nanjing.myqcloud.com/mobile.png)
![](https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/soybean-admin-v1-02.png)
![](https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/soybean-admin-v1-03.png)
![](https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/soybean-admin-v1-04.png)
![](https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/soybean-admin-v1-05.png)
![](https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/soybean-admin-v1-06.png)
![](https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/soybean-admin-v1-07.png)
![](https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/soybean-admin-v1-08.png)
![](https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/soybean-admin-v1-09.png)
![](https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/soybean-admin-v1-10.png)
![](https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/soybean-admin-v1-mobile.png)

## 项目结构

```
soybean-admin-react/                     # Monorepo 根目录
├── apps/
│   ├── admin/                           # 主后台应用 skyroc-admin（本应用）
│   │   ├── src/
│   │   │   ├── assets/                  # 静态资源
│   │   │   ├── components/              # 局部组件（SystemLogo 等）
│   │   │   ├── features/                # 功能模块
│   │   │   │   ├── antd/               # Antd 全局配置
│   │   │   │   ├── auth/               # 认证模块
│   │   │   │   ├── effects/            # 副作用（页面标题、更新检测等）
│   │   │   │   ├── menus/              # 菜单配置
│   │   │   │   └── router/             # 路由配置
│   │   │   ├── hooks/                   # 业务 Hooks
│   │   │   ├── locales/                 # 国际化语言包
│   │   │   ├── pages/                   # 页面（TanStack Router 文件式路由）
│   │   │   │   ├── (admin)/            # 后台布局页面
│   │   │   │   │   └── home/          # 首页仪表盘
│   │   │   │   ├── (auth)/            # 认证布局页面
│   │   │   │   │   └── login/         # 登录页
│   │   │   │   └── (errors)/          # 异常页（403 / 404 / 500）
│   │   │   ├── plugins/                 # 插件初始化（motion、nprogress 等）
│   │   │   ├── service/                 # API 服务层（分层架构）✨
│   │   │   │   ├── adapter.ts          # @skyroc/service 适配器（接入 UI/鉴权/导航）
│   │   │   │   ├── queryClient.ts      # TanStack Query 客户端配置
│   │   │   │   ├── api/                # API 请求函数
│   │   │   │   └── request/            # 请求配置和拦截器
│   │   │   ├── styles/                  # 全局样式
│   │   │   ├── types/                   # TypeScript 类型定义
│   │   │   └── utils/                   # 工具函数
│   │   ├── .env                         # 基础环境变量
│   │   ├── .env.prod                    # 生产环境变量
│   │   ├── .env.test                    # 测试环境变量
│   │   └── vite.config.ts               # Vite 配置（端口 9527）
│   ├── admin-example/                   # 含完整 demo 页面的示例应用
│   └── web-ui-playground/               # @skyroc/web-ui 组件库 playground
│
├── packages/
│   ├── @core/                           # 基础设施层（平台无关）
│   ├── web/                             # Web Kit 层（后台界面工程能力）
│   ├── shared/                          # 跨端共享（ui-tokens、ui-types）
│   ├── primitives/                      # 基础组件库（filed-form）
│   └── hooks/                           # 跨平台 React hooks
│
├── docs/                                # 文档站点（5 个，基于 Fumadocs）
│   ├── project-docs/                    # 项目总览
│   ├── admin-docs/                      # 应用文档
│   ├── core-docs/                       # @core 文档
│   ├── web-kit-docs/                    # Web Kit 文档
│   └── web-ui-docs/                     # UI 组件库文档
│
└── internal/                            # 内部共享配置
    ├── tsconfig/                         # 共享 TypeScript 配置
    ├── uno-config/                       # UnoCSS 预设配置
    └── config/                           # 共享开发配置
```

## 快速开始

### 环境准备

确保你的环境满足以下要求：

- **git**: 用于克隆和管理项目版本
- **Node.js**: >= 20，推荐 20.19.0 或更高
- **pnpm**: >= 8.7.0，推荐 10.4.1 或更高

### 安装步骤

1. **克隆项目**

```bash
git clone https://github.com/Ohh-889/skyroc-admin.git
cd skyroc-admin
```

2. **安装依赖**（在仓库根目录执行）

```bash
pnpm install
```

> ⚠️ 本项目采用 pnpm monorepo，请不要使用 npm 或 yarn 安装依赖。

3. **启动开发服务器**

```bash
# 方式一：在仓库根目录，仅启动主应用
pnpm --filter skyroc-admin dev

# 方式二：进入应用目录后启动
cd apps/admin
pnpm dev
```

开发服务器将在 `http://localhost:9527` 启动

4. **构建生产版本**

```bash
# 生产环境构建
pnpm build

# 测试环境构建
pnpm build:test
```

### 其他可用命令

```bash
# 以生产模式启动开发服务器
pnpm dev:prod

# 预览构建产物
pnpm preview

# 类型检查
pnpm typecheck

# 代码 Lint 修复（oxlint）
pnpm lint

# Git 提交（符合规范）
pnpm commit

# 清理缓存和依赖
pnpm cleanup

# 版本发布
pnpm release
```

### Turborepo 根目录脚本

在仓库根目录，Turborepo 提供统一的任务编排命令：

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动所有应用/包的开发模式 |
| `pnpm build` | 构建全部包与应用 |
| `pnpm lint` | 运行 oxlint 代码检查 |
| `pnpm format` | 使用 oxfmt 格式化代码 |
| `pnpm format:check` | 校验代码格式 |
| `pnpm typecheck` | 全量 TypeScript 类型检查 |
| `pnpm test` | 运行单元测试（Vitest） |
| `pnpm test:e2e` | 运行端到端测试（Playwright） |
| `pnpm test:ui` | 启动 Vitest UI |
| `pnpm clean` | 清理构建产物 |
| `pnpm create:admin` | 通过 CLI 创建新的 admin 项目 |

## 核心功能

### 🎨 主题系统

- **OKLCH 色彩**：基于 OKLCH 色彩算法生成感知均匀的调色板
- **多主题色**：内置多种主题颜色，支持自定义主题色
- **暗黑模式**：完整的暗黑模式支持，自动适配系统主题
- **布局模式**：支持垂直、水平、混合等多种布局模式
- **主题配置**：可视化的主题配置面板，实时预览
- **配置导出**：支持主题配置的导出和导入

### 🔐 权限管理

- **角色权限**：基于 RBAC 的角色权限控制
- **菜单权限**：根据用户角色动态生成菜单
- **按钮权限**：细粒度的按钮级权限控制
- **路由守卫**：完善的路由前置守卫和权限验证
- **动态路由**：支持根据权限动态添加路由

### 🛤️ 路由系统

- **文件式路由**：基于 TanStack Router 的自动文件路由，全程类型安全
- **动态路由**：支持动态参数路由 `[id]`、`[...slug]` 等
- **路由缓存**：Keep-Alive 页面缓存功能
- **路由动画**：页面切换动画效果
- **面包屑**：自动生成面包屑导航
- **路由元信息**：丰富的路由元数据配置

### 📱 标签页系统

- **多标签页**：Chrome 风格的多标签页管理
- **右键菜单**：关闭、刷新、固定等操作
- **标签拖拽**：支持标签页拖拽排序
- **标签缓存**：标签页状态持久化
- **快捷操作**：关闭其他、关闭左侧、关闭右侧等

### 🌍 国际化

- **多语言**：支持中文、英文等多语言
- **动态切换**：语言实时切换，无需刷新
- **Antd 集成**：完整的 Antd 组件国际化
- **Dayjs 集成**：日期时间国际化支持

### 🔄 数据管理

#### TanStack Query + @skyroc/service 集成

项目通过 `@skyroc/service` 适配器深度集成了 TanStack Query，采用分层设计：

**架构设计**

```
service/adapter.ts       → 接入 UI 层、鉴权、导航与 React Query
service/queryClient.ts   → TanStack QueryClient 配置
service/api/             → 原生 API 请求函数
service/request/         → 请求配置和拦截器
```

**使用示例**

```typescript
// 在组件中使用 @skyroc/service 提供的 hooks
import { useLogin, useUserInfo } from '@skyroc/service';

const LoginPage = () => {
  const { mutate: login, isPending } = useLogin();
  const { data: userInfo, isLoading } = useUserInfo();

  function handleLogin() {
    login({ userName: 'admin', password: '123456' }, {
      onSuccess: (data) => {
        // 登录成功后的处理
      }
    });
  }

  return <button onClick={handleLogin} disabled={isPending}>登录</button>;
};
```

**核心特性**

- ✨ **自动缓存**：智能缓存管理，减少不必要的网络请求
- 🔄 **自动重新验证**：数据过期自动重新获取，保持数据新鲜
- ⚡️ **并发请求**：自动去重和批处理并发请求
- 🎯 **乐观更新**：支持乐观 UI 更新，提升用户体验
- 🔌 **离线支持**：离线状态下的数据缓存和同步
- 📊 **DevTools**：强大的开发者工具，实时查看请求状态

### 📡 HTTP 请求

- **@skyroc/axios**：类型安全的 Axios 客户端，完善的请求拦截和响应处理
- **错误处理**：统一的错误处理机制
- **Token 刷新**：自动 Token 刷新机制
- **请求取消**：支持请求取消和重复请求过滤
- **请求重试**：内置 axios-retry，自动重试失败请求

### 🛠️ 开发工具

- **oxlint**：高性能 Rust 实现的 Linter，比 ESLint 快数十倍
- **oxfmt**：统一的代码格式化工具
- **TypeScript 6**：完整的类型检查
- **Git Hooks**：提交前自动检查（simple-git-hooks）
- **Conventional Commits**：规范的提交信息
- **CLI 工具**：内置命令行工具集
- **Turborepo**：任务缓存与并行执行

## 文档

项目提供多个独立文档站点（均位于 `docs/`，基于 Fumadocs 构建）：

| 文档站点 | 说明 |
|---------|------|
| **project-docs** | 项目总览与整体架构 |
| **admin-docs** | `apps/admin` 的启动、路由、菜单、权限与请求服务 |
| **core-docs** | `@core` 基础设施层各包的用途与边界 |
| **web-kit-docs** | 应用壳、主题、布局材料与 Ant Design 适配 |
| **web-ui-docs** | `@skyroc/web-ui` 组件库使用与设计系统 |

启动任一文档站点：

```bash
# 示例：启动 web-ui 文档
pnpm --filter web-ui-docs dev
```

## 如何贡献

我们热烈欢迎并感谢所有形式的贡献。如果您有任何想法或建议，欢迎通过提交 [pull requests](https://github.com/Ohh-889/skyroc-admin/pulls) 或创建 GitHub [issue](https://github.com/Ohh-889/skyroc-admin/issues) 来分享。

## 团队理念

- 欢迎各位小伙伴一起交流、讨论，彼此学习、共同进步。
- 项目采用 **MIT** 开源协议，永久免费使用，无需担忧版权问题。
- 任何关于功能扩展、Bug 修复、或文档纠正的贡献都十分欢迎，也鼓励你提交 **PR**，哪怕只是修正一个错别字。

## Git 提交规范

本项目已内置 `commit` 命令，您可以通过执行 `pnpm commit` 来生成符合 [Conventional Commits](https://www.conventionalcommits.org/) 规范的提交信息。在提交 PR 时，请务必使用 `commit` 命令来创建提交信息，以确保信息的规范性。

## 浏览器支持

推荐使用最新版的 Chrome 浏览器进行开发，以获得更好的体验。

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png" alt="IE" width="24px" height="24px"  />](http://godban.github.io/browsers-support-badges/) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/) |
| --- | --- | --- | --- | --- |
| not support | last 2 versions | last 2 versions | last 2 versions | last 2 versions |

## 开源作者

[Ohh-889](https://github.com/Ohh-889)

## 贡献者

感谢以下贡献者的贡献。如果您想为本项目做出贡献，请参考 [如何贡献](#如何贡献)。

<a href="https://github.com/mufeng889/react-soybean-admin/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=mufeng889/react-soybean-admin" />
</a>

## 交流

`React SkyrocAdmin` 是完全开源免费的项目，在帮助开发者更方便地进行中大型管理系统开发，同时也提供微信和 QQ 交流群，使用问题欢迎在群内提问。

  <div>
   <p>QQ交流群</p>
    <img src="https://assets.skyroc.me/qq-group01.jpg" style="width:200px" />
  </div>

 <div>
  <p>添加下面微信添加作者，邀请进微信群</p>
  <img src="https://assets.skyroc.me/wx-avatar.jpg" style="width:200px" />
 </div>

 <div>
  <p>微信群</p>
  <img src="https://assets.skyroc.me/wx-group01.jpg" style="width:200px" />
 </div>

## 开源协议

项目基于 [MIT © 2021 Skyroc](./LICENSE) 协议，仅供学习参考，商业使用请保留作者版权信息，作者不保证也不承担任何软件的使用风险。

## 祝福与展望

非常感谢你选择 **SkyrocAdmin**，愿它能在你的工作和学习中带来便利与收获。祝所有使用者在工作和生活中都能顺利进步、健康平安。欢迎大家积极参与、贡献代码，共同将 **SkyrocAdmin** 打造得更加完善与强大！

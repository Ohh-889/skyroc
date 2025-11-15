---
description: Skyroc Admin project overview and workspace expectations
globs:
  - "**/*"
alwaysApply: true
---
# 项目背景 Project Overview

Skyroc Admin 是一套基于 **React 19 + Vite 6 + TypeScript 5** 的中后台模板，整合了 Ant Design 5、Redux Toolkit、TanStack Query、UnoCSS 与 i18next 等能力。仓库采用 **pnpm monorepo**，根目录负责应用壳，`packages/` 存放可复用的工具包（`@sa/axios`、`@sa/utils`、`@sa/hooks`、`@sa/materials`、`@sa/scripts`、`@sa/uno-preset` 等）。

## 目录速览
- `src/`：前端应用主体。
  - `pages/`：文件系统路由，`(base)` 代表主布局，`(blank)` 用于登录等简化页面。
  - `features/`：领域模块（auth、menu、theme 等），内部包含 hooks、store、组件。
  - `layouts/`：布局骨架与全局模块（菜单、页签、主题抽屉）。
  - `components/`：跨业务复用的基础组件。
  - `router/`：路由初始化、鉴权与缓存控制。
  - `service/`：请求客户端、接口定义、业务 hooks。
  - `store/`：Redux store 配置与自定义 `createAppSlice`。
  - `theme/`、`styles/`：主题 token、CSS/SCSS 与 UnoCSS 变量。
- `packages/`：workspace 工具包，变更通用逻辑优先修改对应包后在 `src/` 中引用。
- `build/`、`public/`：打包脚本与静态资源。

## 运行与构建命令
- `pnpm dev` / `pnpm dev:prod`：启动本地开发，默认加载测试/生产配置。
- `pnpm build` / `pnpm build:test`：生产/测试环境构建。
- `pnpm preview`：本地预览构建产物。
- `pnpm lint`：使用 ESLint + Prettier 自动修正格式问题。
- `pnpm typecheck`：在 strict 模式下执行 TypeScript 类型检查。
- `pnpm gen-route`：基于 `src/pages` 结构重新生成路由声明。
- `pnpm commit`：通过内置脚本生成符合 Conventional Commits 的提交信息。

## 开发约定
1. **使用 pnpm**：不要混用 npm/yarn。workspace 依赖通过 `workspace:*` 管理。
2. **保持类型安全**：TS 配置开启 `strict` 与 `isolatedModules`，新增模块需提供类型。
3. **遵守文件组织**：新增业务逻辑时优先在对应 feature 内扩展，而非随意创建新顶级目录。
4. **国际化默认开启**：用户可选中英文，新增界面文本请落在 `src/locales` 中的语言包。
5. **环境变量**：通过 Vite 的 `import.meta.env` 获取，公共配置集中在 `src/config.ts`。
6. **脚手架脚本**：`packages/scripts` 内置常用 automation，新增脚本保持幂等并在 README 记录。

保持这些约定能确保 Cursor 在任意子目录下都有一致的上下文与期望。

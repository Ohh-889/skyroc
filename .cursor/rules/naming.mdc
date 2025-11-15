---
description: Naming conventions for files, symbols, and identifiers
globs:
  - "**/*"
alwaysApply: true
---
# 命名约定 Naming Conventions

## 文件与目录
- 目录使用 **kebab-case**：`user-center`, `global-header`, `theme-drawer`。
- React 组件文件：`ComponentName.tsx`（PascalCase）。页面目录使用 `index.tsx`、`layout.tsx`、`loading.tsx` 等约定命名。
- 工具、hooks、服务文件：`use-xxx.ts`, `storage.ts`, `auth.ts`，保持小写 + 连字符或驼峰，取决于仓库既有风格。
- 类型声明：放在 `src/types/*.d.ts` 或 `src/service/types/*.d.ts`，文件名采用领域名（`auth.d.ts`, `common.d.ts`）。

## 代码符号
- 组件、类、类型、接口：**PascalCase** (`SystemLogo`, `ThemeSettings`)。
- 函数、变量、hooks：**camelCase** (`getThemeSettings`, `useAppSelector`, `setupIconifyOffline`)。
- 常量：**SCREAMING_SNAKE_CASE** (`MAX_CACHE_COUNT`, `BACKEND_ERROR_CODE`)。
- 枚举或联合 key：若写在对象上，可与后端保持一致（通常为 SCREAMING_SNAKE_CASE）。

## 命名空间与类型
- 接口返回类型集中在 `Api.*` 命名空间（`src/service/types`），按模块嵌套子命名空间，如 `Api.Auth.LoginParams`。
- 前端全局类型定义在 `App.*` 命名空间（`src/types/app.d.ts`、`src/types/router.d.ts` 等）。
- UnoCSS 主题变量使用 `App.Theme.*` 类型，保持与 `themeVars` 中的 key 同步。

## 国际化 key
- 路由、菜单：`route.xxx`，与 `BaseChildrenRoutes` / 菜单 JSON 对齐。
- 页面文本：`page.xxx`、`common.xxx` 等。新增 key 时需同步更新所有语言文件。

## 其它约束
- API URL 枚举放在 `src/service/urls.ts`（或同目录文件）中，常量使用 `PascalCase` + `URLS` 后缀，例如 `AUTH_URLS`。
- Query key 常量集中在 `src/service/keys.ts`，以 `QUERY_KEYS` 根对象 + 模块命名。
- CSS 变量命名遵循 `--color-name`，UnoCSS shortcut 使用 `kebab-case`。

---
description: Skyroc Admin file-system routing and navigation rules
globs:
  - "src/router/**"
  - "src/pages/**"
alwaysApply: true
---
# 路由约定 Routing Guidelines

Skyroc Admin 依赖 `@soybean-react/vite-plugin-react-router` 生成的文件系统路由，再由 `src/router` 模块注入权限、缓存与内置页面。

## 生成流程
1. 在 `src/pages` 中新增页面或布局文件（`layout.tsx`、`page.tsx`、`loading.tsx` 等）。使用文件夹 + `index.tsx` 的结构组织复杂页面。
2. 运行 `pnpm gen-route` 触发脚本，自动产出 `src/router/elegant/routes` 下的路由声明。
3. `src/router/index.ts` 会读取生成的配置，合并 `BaseChildrenRoutes`、鉴权信息与缓存 key，最终注入到 React Router。

## 命名与布局
- 使用 **Segment 语法**：
  - `(base)`：主应用布局，挂载在 `/`，包含多级菜单与标签页。
  - `(blank)`：简化布局，例如登录等不需要主框架的页面。
  - `_builtin`：不会出现在菜单中，但可作为路由重用（异常页、iframe 页面等）。
- 动态参数使用 Next.js 风格：`[id].tsx`、`[...all].tsx`。
- 每个布局目录需要 `layout.tsx` 和 `loading.tsx`，视需要添加 `error.tsx`。

## 元数据 & 权限
- 在页面文件导出 `handle` 对象（由插件注入）来声明菜单文案、`i18nKey`、图标以及排序；生成的配置会被 `filterRoutes` 读取。
- 权限列表（角色/按钮）来自接口返回的 `buttons`、`roles`，在 `filterRoutes` 过程中与路由 `meta` 对比。
- KeepAlive 配置通过 `handle.keepAlive` 控制，缓存 key 会写入 Redux `cacheRoutes` 列表。

## 路由扩展
- 复用型基础路由（异常页、文档等）写在 `src/router/routes/builtin.ts`，采用 React Router 原生结构。
- 新增外链/iframe 页面时，复用 `_builtin/iframe-page` 组件，并在 `handle.url` 中提供地址。
- 若需要额外的 loader/action，请直接在页面文件内导出，同步遵循 React Router 的约定。

遵循以上约定可以保证自动生成的路由与菜单、权限、缓存机制协同工作。

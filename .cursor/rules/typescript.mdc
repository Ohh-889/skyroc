---
description: TypeScript usage and typing standards
globs:
  - "src/**/*.ts"
  - "src/**/*.tsx"
  - "packages/**/*.ts"
alwaysApply: true
---
# TypeScript 规范 Type System Rules

## 编译配置
- `tsconfig.json` 启用了 `strict`、`isolatedModules`、`forceConsistentCasingInFileNames`。不要关闭这些选项。
- 支持从 TypeScript 文件导入扩展名（`allowImportingTsExtensions: true`），保持与现有代码一致。
- 路径别名：`@/*` → `src/*`，`~/*` → 仓库根目录。新增文件时尽量使用别名避免深层相对路径。

## 类型声明
- 公共类型集中在 `src/types`，使用 `declare namespace App { ... }` 组织，如 `App.Theme`, `App.Page`。
- 接口类型放在 `src/service/types` 的 `Api.*` 命名空间；如果后端 schema 变更，先更新类型再改业务逻辑。
- Redux store 相关类型在 `src/store/index.ts` 推断，不需要手写 `RootState`。
- UnoCSS 自动导入的类型位于 `src/types/auto-imports.d.ts`，不要手动修改（由脚本生成）。

## 写法要求
- 禁止使用 `any`，改用 `unknown`、具体接口或泛型参数。
- 函数组件 props/返回值显式声明。对于简单组件可依赖 TS 推断，但导出类型需准确。
- Promise API 返回 `Promise<具体类型>`，避免 `Promise<any>`。
- TanStack Query hooks 通过泛型约束返回值，例如 `useQuery<Api.SystemManage.RoleList>`。
- 使用 `satisfies` 验证常量（如路由配置、主题 token），保持类型安全。

## d.ts 管理
- 若需要全局补充类型（如模块声明、自定义 window 属性），请在 `src/types/global.d.ts` 或新的 `.d.ts` 文件中声明，并确保被 `tsconfig` include。
- 自动生成的类型文件（如 `auto-imports.d.ts`）由脚本维护，禁止手动编辑；若需更新执行对应命令。

严格遵循上述约束有助于维持项目的类型可靠性与可维护性。

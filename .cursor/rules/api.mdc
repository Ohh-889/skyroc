---
description: API client conventions for Skyroc Admin
globs:
  - "src/service/**"
  - "packages/axios/**"
alwaysApply: true
---
# 接口规范 API Guidelines

## 请求封装
- 统一使用 `src/service/request` 导出的 `request`（基于 `@sa/axios`）发起请求，它内置：
  - 基础地址由 `globalConfig.serviceBaseURL` 控制。
  - `onRequest` 自动注入 `Authorization` 头（来自 `localStg`）。
  - `isBackendSuccess` 根据 `VITE_SERVICE_SUCCESS_CODE` 判定业务成功，并在失败时调用 `backEndFail`。
  - `transformBackendResponse` 默认返回 `response.data.data`。
- 特殊服务可以使用 `demoRequest` 或在同文件创建新的实例。

## 目录结构
- `src/service/api/*.ts`：每个文件聚焦一个后端模块（`auth.ts`, `system-manage.ts`, `route.ts`）。函数命名以 `fetch` 开头，例如 `fetchGetUserInfo`。
- `src/service/types/*.d.ts`：声明 `Api.<Module>` 命名空间中的请求/响应类型。新增接口先定义类型再实现函数。
- `src/service/hooks`：封装 TanStack Query hooks，例如 `useRoleList`，组合 `fetch` 函数与 `QUERY_KEYS`。
- `src/service/urls.ts` 或各模块内导出的常量维护接口路径。

## 返回值与错误
- 所有请求返回 `Promise<业务类型>`，不要在业务层解构 `response.data`。
- 需要自定义错误提示时使用 `window.$message` 或在 `backEndFail` 中扩展。
- 若接口需要 form-data、文件上传等特殊配置，请在调用前通过 `request` 的第二个参数或 axios config 调整。

## 示例
```ts
import { request } from '../request';
import { AUTH_URLS } from '../urls';

export function fetchLogin(params: Api.Auth.LoginParams) {
  return request<Api.Auth.LoginResponse>({
    url: AUTH_URLS.LOGIN,
    method: 'post',
    data: params
  });
}
```

## 接口变更流程
1. 更新 `src/service/types` 中的命名空间定义。
2. 调整 API 函数签名，确保泛型与返回类型一致。
3. 同步更新相关 Query hooks、组件调用处及国际化提示。
4. 运行 `pnpm typecheck` 与 `pnpm lint` 确认类型/格式无误。

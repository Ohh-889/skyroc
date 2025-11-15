---
description: State management practices for Skyroc Admin
globs:
  - "src/store/**"
  - "src/features/**"
  - "src/service/hooks/**"
alwaysApply: true
---
# 状态管理规范 State Management

Skyroc Admin 结合 **Redux Toolkit** 与 **TanStack Query** 构建数据层，遵循以下原则：

## Redux Toolkit
- Store 由 `src/store/index.ts` 通过 `combineSlices` 聚合，slice 建议放在对应 feature 下。
- 使用 `createAppSlice`（封装自 `buildCreateSlice`）创建 slice，并通过 `create.asyncThunk` 声明异步逻辑。这样可以获得 typed selectors。
- 导出 `selectors`、`actions` 与 `reducer`：
  ```ts
  export const themeSlice = createAppSlice({
    name: 'theme',
    initialState,
    reducers: create => ({
      setThemeColor: create.reducer((state, { payload }: PayloadAction<string>) => {
        state.themeColor = payload;
      })
    }),
    selectors: {
      getThemeSettings: state => state
    }
  });
  ```
- 统一使用 `useAppDispatch`、`useAppSelector`（位于 `src/hooks/business/useStore.ts`）获取类型安全的 dispatch/select。
- 当状态需要持久化时，复用 `src/utils/storage.ts` 封装的 `localStg`/`sessionStg` 或 `localforage` 工具，不要直接访问 `localStorage`。
- 缓存路由、标签页等全局状态集中在 `features/router`、`features/tab`，组件层不要重复存储相同信息。

## TanStack Query
- 接口请求封装在 `src/service/api`，Query hook 位于 `src/service/hooks`。遵循 `useResource` 命名，并在 `QUERY_KEYS` 中集中管理 key。
- 读取数据时使用 `useQuery`，突变使用 `useMutation`（可放在同一 hooks 文件）。对 Query 做缓存/刷新时通过 `queryClient`，必要时调用 `ensureQueryData` 预取。
- 将 Query 与 Redux 结合：例如登录后调用 `queryClient.invalidateQueries` 刷新用户信息，并同步更新 Redux token。

## 何时使用哪一种
- **本地 UI 或需要全局广播的同步状态**：使用 Redux slice。
- **服务端数据、分页列表、依赖缓存的请求**：使用 TanStack Query。
- 如果同一数据既需要请求又要在多个模块共享，可用 Query 负责远程数据、Redux 存储派生状态（如缓存 key、布局设置）。

## 其他注意事项
- 所有异步操作需处理异常，使用 `try/catch` 或 Query 的 `onError`，并调用 `window.$message?.error` 展示提示。
- 避免在组件中直接调用 `store.dispatch`，通过 `useAppDispatch()` 获取。
- 当新增 slice 时，别忘了在 `src/store/index.ts` 中组合，并在 `src/types` 更新对应的状态类型（若需要全局声明）。

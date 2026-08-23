# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

---

## 路由与页面分离（强制）

`src/app` 是**路由骨架**，`src/pages` 是**页面实现**，两者严格一一对应。

原因是 expo-router 会把 `src/app` 下的每个 `.tsx` 都注册成路由：`_ctx.ios.js` 的
`require.context` 只排除 `+api` / `+html` / `+middleware`，`build/getRoutesCore.js:508` 对缺少
default export 的文件也只 `console.warn` 不剔除。所以页面私有组件一旦写进 `src/app`，就会变成
幽灵路由，污染 `Href` 类型和 `/_sitemap`。

```text
src/app/(app)/order/[id].tsx        →  export { default } from '@/pages/(app)/order/[id]';
src/pages/(app)/order/[id]/
├── index.tsx                          页面主体
└── modules/OrderTimeline.tsx          页面私有组件，不会产生路由
```

### 规则

| 位置 | 只能放 |
| --- | --- |
| `src/app/**` | `_layout.tsx`、expo-router 特殊文件、一行转发文件 |
| `src/pages/**` | 页面主体、`modules/` 私有组件 |
| `src/feature/<域>/` | api、types、领域 hooks、跨分组复用的组件 |

- 页面默认是单文件 `src/pages/<同路径>.tsx`；需要私有组件时升级成目录 `<同路径>/index.tsx` + `modules/`。
- `modules/` 放在**使用它的所有页面的最近公共父目录**下。跨路由分组复用则上移到 `src/feature/<域>/components/`。
- 页面文件里不写请求定义，只调 `src/feature` 暴露的 hook 再排版。
- 转发文件默认只有 `export { default } from '@/pages/...'`；页面用到 `unstable_settings`、
  `ErrorBoundary`、`SuspenseFallback`、`getNavOptions` 时要显式补名（`export *` **不转发 default**）。

### 新增页面的四步

1. 建 `src/pages/<路径>.tsx`
2. 建 `src/app/<同路径>.tsx`，一行转发
3. 头部由页面自己拼，不写 `options.title`（见「页面头部」）
4. `pnpm check:routes` 验证对应关系

## 路由分组

| 分组 | 用途 | 守卫 |
| --- | --- | --- |
| `(auth)` | 登录流程 | 仅未登录可进 |
| `(app)` | 登录后的全部页面 | 仅已登录可进 |
| `(app)/demo/` | 组件与原生能力演示，真实路径段 | 跟随 `(app)`，仅已登录可进 |

守卫只在 `src/app/_layout.tsx` 写一次。**新增业务页面往 `(app)` 里加，不要动根 layout。**

二级页默认与 `(app)/(tabs)` 平级，push 时整页盖住 tab bar；只有必须保留 tab 上下文的流程才在
对应 tab 目录里再套一层 Stack。

## 页面头部（强制）

`(app)` 整组 `headerShown: false`，**头部一律由页面自己拼**——用 `@skyroc/native-ui` 的 `NavBar`，
或直接按需求排版。

```tsx
const OrderDetailScreen = () => (
  <View className="flex-1 bg-background">
    <NavBar
      leftArrow
      safeAreaTop
      title="订单详情"
      onLeftPress={router.back}
    />
    ...
  </View>
);
```

原生 header 的高度、背景和安全区都由系统算，沉浸式背景、渐变、搜索框、右侧多按钮全都嵌不进去。
一旦一半页面自定义、一半用原生，两套头部在高度和返回手势上永远对不齐，所以不留「默认用原生」这条路。

因此 `(app)/**` 的页面**不要**写 `options.title`、`headerShown`、`headerRight` 之类的 header 配置，
`_layout.tsx` 里也不用再为新页面补 `<Stack.Screen>`。

## 页面间传参

只传标量（id、status），不传对象。详情数据由详情页按 id 自己查，列表已缓存时靠 React Query 命中，
需要秒开就用 `placeholderData` 从列表缓存取。

## 网络层

目录结构和 web 端（`apps/admin-example/src/service`）保持一致：

| 文件 | 职责 |
| --- | --- |
| `src/service/config.ts` | baseURL、超时、后端业务码，全部读 `EXPO_PUBLIC_*` |
| `src/service/adapter.ts` | 平台差异：用什么弹提示、凭据存在哪、登录页怎么跳 |
| `src/service/request/index.ts` | 全局 `request` 实例 |
| `src/service/queryClient.ts` | 全局 `queryClient` |
| `src/service/api/<域>/urls.ts` | `MODULE_URLS` |
| `src/service/api/<域>/api.ts` | `fetchXxx`，一行 `request()` |
| `src/service/api/<域>/keys.ts` | `MODULE_QUERY_KEYS` / `MODULE_MUTATION_KEYS` |
| `src/service/api/<域>/hooks.ts` | `useXxxQuery` / `useXxxMutation` |
| `src/service/api/<域>/types.d.ts` | `Api.<域>` 的接口类型，就近放在模块里 |
| `src/service/api/<域>/index.ts` | 域内四个 ts 文件的 barrel，再由 `api/index.ts` 汇总 |
| `src/service/common.d.ts` | `Api.Service.*`：响应信封、分页这类公共类型 |

接口类型跟着接口走：每个域自己的 `types.d.ts`，公共的（响应信封、分页）放 `src/service/common.d.ts`，
都写成 `declare namespace Api { namespace <域> { ... } }`。它们是全局声明，不用也不该被 `index.ts` 再导出一遍。
字段一律 camelCase；后端返回 snake_case 就在 service 层转换，别把 snake_case 带进类型。

错误提示、令牌续签、并发去重、登出这些逻辑都在 `@skyroc/service` 里，和 web 端共用同一份；
本地只写 adapter。`src/service/api/auth` 是完整范例，照着抄即可。

登录状态本身在 `src/feature/auth`，不进 service：凭据是一个 jotai atom（`authAtom`），
和 web 端 `features/auth/use-auth.ts` 一个路子——请求拦截器在 React 之外用 `getAtomValue`
同步读 token，页面用 `useAtomValue` 跟着重渲染，一份状态两条出口。

持久化走 `src/store/secure-storage.ts` 注册进 core-state 的 SecureStore 适配器。它是**同步**读的，
所以冷启动第一帧就知道登没登录，没有 loading 态，也不会闪一下登录页。

> `<JotaiProvider>` 必须和 `getAtomValue` 用同一份 jotai。pnpm 的 peer 解析会给 app 和
> workspace 包各装一份，两份的 React context 互相看不见——`metro.config.js` 的 `SINGLETONS`
> 就是把它钉成一份（web 端对应 admin-vite 的 `resolve.dedupe`）。
> `RESET` 这类模块级 symbol 更要命，一律从 `@skyroc/core-state` 取，别直接引 `jotai/utils`。

### 加一个接口的四步

1. `urls.ts` 加地址，`types.d.ts` 加参数 / 响应类型
2. `api.ts` 写 `fetchXxx`——`request<T>()` 拿到的已经是拆过信封的业务数据，失败会 reject 且已经弹过提示
3. `keys.ts` 加 query key
4. `hooks.ts` 包成 hook

页面只 `import { useXxxQuery } from '@/service/api'`，**不写请求定义**。

### 几条必须知道的

- **服务端状态只放 TanStack Query**，不要把接口数据塞进全局 store —— 这是 RN 项目最常见的架构错误。
- 凭据存 SecureStore（不是 AsyncStorage，后者是明文文件），事实来源是 `feature/auth/auth-store`
  的 `authAtom`；别再另起一套 storage hook，两份状态必然对不齐。
- 登出必须走 `signOut()`：清凭据 + `queryClient.clear()`。少了后面那步，下一个账号会看到上一个账号的数据。
- 令牌过期由请求层自动续签后重发一次，并发的一批请求只会触发一次 refresh，业务代码不用管。
- 重试只对幂等请求生效（GET/HEAD/OPTIONS/PUT/DELETE 和 5xx），POST 永远不会被自动重发。
- 请求 id（`X-Request-Id`）默认关着：它依赖 `crypto.getRandomValues`，Hermes 没有这个全局，
  要开先装 `react-native-get-random-values`。
- `EXPO_PUBLIC_*` 会被编译期打进包里，任何人解包都能看到，**只放公开配置**；改了要 `expo start --clear`。

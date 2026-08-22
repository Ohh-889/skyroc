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

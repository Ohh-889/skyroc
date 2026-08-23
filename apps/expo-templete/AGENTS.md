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

| 位置                | 只能放                                            |
| ------------------- | ------------------------------------------------- |
| `src/app/**`        | `_layout.tsx`、expo-router 特殊文件、一行转发文件 |
| `src/pages/**`      | 页面主体、`modules/` 私有组件                     |
| `src/feature/<域>/` | api、types、领域 hooks、跨分组复用的组件          |

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

| 分组          | 用途                           | 守卫                       |
| ------------- | ------------------------------ | -------------------------- |
| `(auth)`      | 登录流程                       | 仅未登录可进               |
| `(app)`       | 登录后的全部页面               | 仅已登录可进               |
| `(app)/demo/` | 组件与原生能力演示，真实路径段 | 跟随 `(app)`，仅已登录可进 |

守卫只在 `src/app/_layout.tsx` 写一次。**新增业务页面往 `(app)` 里加，不要动根 layout。**

二级页默认与 `(app)/(tabs)` 平级，push 时整页盖住 tab bar；只有必须保留 tab 上下文的流程才在
对应 tab 目录里再套一层 Stack。

`(app)/demo/` 没有 index —— 演示页的入口清单是「发现」tab（`src/pages/(app)/(tabs)/explore`）。

## 底部 Tab

`(app)/(tabs)` 下四个页面，用 `expo-router/unstable-native-tabs` 的原生 tab bar：

| 路由        | 页面 | 立起来的骨架                                                   |
| ----------- | ---- | -------------------------------------------------------------- |
| `/`         | 首页 | 自定义头部 + 单个 ScrollView + 下拉刷新 + 首屏三态             |
| `/explore`  | 发现 | 模板的能力目录，本地关键词过滤                                 |
| `/messages` | 消息 | tab 内长列表 + mutation 乐观更新 + tab bar 角标                |
| `/profile`  | 我的 | 主题、缓存、登出这类**改一下影响整个 App**的开关               |

- 图标同时给 `sf`（iOS 的 SF Symbol，选中态自动换 fill 版）和 `src`（Android 的矢量图标），
  两端各用各的图标源，不用再维护两套 @2x/@3x 位图。
- **每个 tab 页的滚动容器必须套一层 `ScrollViewMarker`**（`react-native-screens/experimental`），
  并带上 `contentInsetAdjustmentBehavior="automatic"`。少了它 iOS 上有两个症状：内容底部被 tab bar
  整块盖住；tab bar 一直停在 scrollEdgeAppearance（透明、无模糊、无分隔线），看着就是一条死色带。
  根因是 UIKit 要拿到「内容滚动视图」才会算 contentInset、才会在贴边/非贴边两套 appearance 之间切换，
  而 expo-router 默认那套只沿 `subviews[0]` 找第一个 ScrollView（`RNSScrollViewFinder.mm`），
  tab 页的头部固定在滚动区之外，遍历第一步就断了。`ScrollViewMarker` 改走 `reactSuperview` 往上登记，
  和滚动容器摆在哪一层无关。**别用写死 `BottomTabInset` 数值的方式绕过去**——那样内容不再从 tab bar
  底下透出来，模糊质感也一起没了。
- 角标读 `useUnreadCountQuery()`，也就是消息页用的同一个 query。**别为了让角标跟着变就把未读数
  搬进全局 store**——那是服务端状态，两份必然对不齐（见「网络层」最后一节）。
- Tab 根页的头部用 `src/pages/(app)/(tabs)/modules/TabHeader`：左对齐大标题、没有返回箭头。
  二级页仍然用 `NavBar`，两者不通用。
- 新增 tab 要在 `(tabs)/_layout.tsx` 里加一个 `<NativeTabs.Trigger>`，`name` 与文件名一致。

## 深链（deep link / universal link）

外部进 App 的入口——自定义 scheme、Universal Link / App Links、以及项目自己接的推送点击——
都汇到 `src/feature/linking` 的 `resolveLink`：归一成路由路径 → 过白名单 → 未登录则暂存，
等登录后重放。路由决策只有这一处。

| 文件                                             | 职责                                                         |
| ------------------------------------------------ | ------------------------------------------------------------ |
| `src/app/+native-intent.ts`                      | 深链的原生入口，跑在导航器挂载**之前**，唯一能改写目标的地方 |
| `src/feature/linking/resolve-link.ts`            | URL → 路由的归一与白名单，怎么接推送也写在这份注释里         |
| `src/feature/linking/pending-link.ts`            | 未登录时暂存目标（只在内存里）                               |
| `src/feature/linking/use-pending-link-replay.ts` | 登录后重放，挂在根 `_layout`                                 |

同一个目标的三种写法：

```text
expotemplete.dev://demo/messages?from=link            自定义 scheme，按环境带后缀
https://<APP_LINK_HOST>/app/demo/messages?from=link   Universal Link，网页侧前缀 /app 会被切掉
/demo/messages?from=push                              推送 payload 里下发的站内路径
```

- **新增可被外部打开的页面，必须往 `resolve-link.ts` 的 `ALLOWED_PREFIXES` 里加一条**，
  否则链接会落到 `+not-found`。这个动作是故意做成显式的：深链和推送 payload 都来自 App 之外，
  放开任意路径等于「谁都能把用户送进任意页面」。
- 模板不预装推送 SDK。装了 `expo-notifications` 之后，把点击通知的回调接到 `resolveLink` 上即可，
  调用范例在 `resolve-link.ts` 顶部的注释里。
- `scheme` / `associatedDomains` / `intentFilters` 写进 Info.plist 与 AndroidManifest，
  **改了必须重新 build，OTA 覆盖不到**；`feature/linking` 全是纯 JS，可以 OTA。
- 域名侧还要放 `/.well-known/apple-app-site-association` 与 `/.well-known/assetlinks.json`
  （https、无重定向、`application/json`），这两份不在仓库里。

## 应用锁（生物识别）

「我的」页在验证身份之前不显示内容，但**不是每次进页面都验**。规则只有两条，都在
`src/feature/auth/use-app-lock.ts`：

1. **进程重开**要验 —— 已验证标记是个不落盘的内存 atom（`appUnlockedAtom`），App 被杀掉再打开
   它天然回到 `false`。别顺手给它加持久化，加了这条规则就没了；
2. **回前台且离开超过 `APP_LOCK_GRACE_MS`**（默认 3 分钟）要验。

反过来说：切 tab、push 二级页再返回、拉一下控制中心、被系统弹窗打断，都**不会**重新验证。
计时只认 `background` 不认 `inactive`——iOS 上来个电话、下拉通知栏都会进 `inactive`，
按它计时的话用户每划一次通知栏回来都要验一次。

几个必须知道的：

- 系统验证框本身会把 App 推进 `inactive`/`background`。验证期间的 AppState 变化要整段忽略
  （`skipAppStateRef`），否则验证成功回到前台的那一刻会被当成「刚从后台回来」再判一次超时。
- 生物识别不可用（没传感器、没录入）时**放行**，不是把人关在外面。应用锁是便利性的第二道门，
  防的是「登录态还在、手机换了个人拿」；真正的鉴权在服务端。同理，锁屏上必须留「退出登录」出口，
  传感器坏了才不至于只能卸载重装。
- `disableDeviceFallback` 保持默认的 `false`：戴口罩、手指有水都可能连着失败，得留设备密码这条路。
- 验证框**只在用户点「验证身份」时弹**，不要在页面出现时自动弹：系统验证框是模态的，一进来就糊上来
  一个夺焦点的框，用户连自己在哪都还没看清；取消之后再自动弹，就成了关不掉的东西。
- 锁用绝对定位的遮罩盖在页面上，不要做成 `/lock` 路由——锁是页面的一个状态，不是一个位置，
  走路由的话返回栈、tab 选中态、深链落点都要为它让路。
- 要保护整个 `(app)` 而不只是「我的」，把 `useAppLock()` 挪到 `(app)/_layout` 即可，规则不用改。
- iOS 的 `NSFaceIDUsageDescription` 由 `app.config.ts` 里的 `expo-local-authentication` 插件写入，
  缺了它第一次调用面容验证会直接崩。**改了必须重新 build，OTA 覆盖不到。**

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

| 文件                              | 职责                                                |
| --------------------------------- | --------------------------------------------------- |
| `src/service/config.ts`           | baseURL、超时、后端业务码，全部读 `EXPO_PUBLIC_*`   |
| `src/service/adapter.ts`          | 平台差异：用什么弹提示、凭据存在哪、登录页怎么跳    |
| `src/service/request/index.ts`    | 全局 `request` 实例                                 |
| `src/service/queryClient.ts`      | 全局 `queryClient`                                  |
| `src/service/api/<域>/urls.ts`    | `MODULE_URLS`                                       |
| `src/service/api/<域>/api.ts`     | `fetchXxx`，一行 `request()`                        |
| `src/service/api/<域>/keys.ts`    | `MODULE_QUERY_KEYS` / `MODULE_MUTATION_KEYS`        |
| `src/service/api/<域>/hooks.ts`   | `useXxxQuery` / `useXxxMutation`                    |
| `src/service/api/<域>/types.d.ts` | `Api.<域>` 的接口类型，就近放在模块里               |
| `src/service/api/<域>/index.ts`   | 域内四个 ts 文件的 barrel，再由 `api/index.ts` 汇总 |
| `src/service/common.d.ts`         | `Api.Service.*`：响应信封、分页这类公共类型         |

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

### 离线与断网提示

事实来源是 `src/feature/network`：`expo-network` 的监听写进 `isOnlineAtom`，React 外用 `getIsOnline()`
同步读，界面用 `useIsOnline()`。别再各处自己调 `getNetworkStateAsync`，那样每个页面拿到的都是一次快照。

接线只有三处，都已经接好：

- `feature/query/query-provider`：把在线状态喂给 `onlineManager`。RN 上不接这一段，TanStack 会
  **永远认为在线**——断网时查询照发不误只能干等超时，`refetchOnReconnect` 也永远等不到重连事件。
- `service/adapter`：断网时把 axios 那句英文 `Network Error` 换成能照做的中文提示。
  「断网」和「服务端挂了」必须分开，前者用户自己能解决且不该上报监控。
- `app/_layout`：挂 `<OfflineNotice />`，一条常驻横幅，恢复时报一句「网络已恢复」再自己消失。

几个容易踩的点：

- `isConnected` 为 true 只代表连上了路由器 / 基站，**不代表你的服务器能通**（酒店 WiFi 的门户劫持）。
  它适合做负向判断（没网就是没网），别拿它当「网络 OK 所以请求一定能成」的前提。
- 查询用默认的 `networkMode: 'online'`：断网时进 `paused`，网一回来自己接着跑。首屏还没数据就断网时，
  `useInfiniteList` 会把列表状态判成 `offline`，占位区显示「恢复后会自动加载」——不判这一下就是一个
  永远转圈的假 loading。
- mutation 反过来用 `networkMode: 'always'`（见 `service/queryClient`）：写操作被静默挂起，表现是
  用户点了按钮一直转圈却没有任何报错。要做离线队列再改回去，并配 `persistQueryClient`。
- `expo-network` 是原生模块，装完要重新出一个 dev build，`expo start --clear` 不够。

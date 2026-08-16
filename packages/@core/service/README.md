# @skyroc/service

平台无关的请求 & 查询基础设施 — 通过 Adapter 模式注入平台差异，使错误处理、token 刷新、QueryClient 等逻辑可跨端复用。

## 解决什么问题

典型中后台项目的请求层困境：

```
❌ 错误处理硬编码了 antd message / modal，React Native 无法复用
❌ token 刷新逻辑绑定了 jotai store + localStorage，换个状态库就得重写
❌ 登出跳转依赖 tanstack-router，换框架意味着改所有 catch 分支
❌ 独立测试需要 mock 大量平台 API，测试成本高
```

@skyroc/service 的答案：**一个 Adapter 接口 + 两个工厂函数**。

```
✅ 核心逻辑零平台依赖，纯函数可独立测试
✅ 各平台实现一个 Adapter 即可接入
✅ QueryClient 配置统一收口，跨项目一致
```

## 核心概念

### 架构总览

```
┌─────────────────────────────────────────────────────┐
│                   @skyroc/service                    │
│                                                     │
│  ┌──────────────────┐   ┌────────────────────────┐  │
│  │  createAppRequest │   │  createQueryClient     │  │
│  │                  │   │                        │  │
│  │  error-handler   │   │  默认 query / mutation  │  │
│  │  token refresh   │   │  配置                   │  │
│  │  错误消息去重     │   │  统一错误回调           │  │
│  └───────┬──────────┘   └────────────────────────┘  │
│          │                                          │
│          │  依赖                                     │
│          ▼                                          │
│  ┌──────────────┐                                   │
│  │ RequestAdapter│ ◄── 各平台实现                     │
│  └──────────────┘                                   │
└─────────────────────────────────────────────────────┘
          ▲                          ▲
          │                          │
    ┌─────┴──────┐            ┌──────┴───────┐
    │ antdAdapter │            │  rnAdapter   │
    │ (Web/antd)  │            │ (React Native)│
    └────────────┘            └──────────────┘
```

### RequestAdapter 接口

每个平台需要实现的 5 类能力：

| 能力       | 方法                                                     | 说明                             |
| ---------- | -------------------------------------------------------- | -------------------------------- |
| UI 反馈    | `showErrorMessage` / `showErrorModal`                    | 错误提示的展示方式               |
| Auth       | `getToken` / `getRefreshToken` / `setAuth` / `resetAuth` | 认证信息的存取，全部同步         |
| Token 刷新 | `fetchRefreshToken` / `refreshTokenUrl`                  | 换取新 token，以及它走的是哪个 url |
| 导航       | `getCurrentPath` / `redirectToLogin`                     | 路由跳转                         |
| i18n       | `t`                                                      | 国际化翻译                       |

`refreshTokenUrl` 用来识别「拿到过期码的是续签请求自己」。这种请求绝不能再去续签，否则它会
`await` 自己那次还没完成的刷新，把自己和所有等着刷新的请求一起永久挂起——不是报错，是转圈不动。
续签走的 url 跟它对不上时（网关重写、换域名），在续签请求上补 `isRefreshToken: true`。

`getToken` / `getRefreshToken` 必须是同步的。存储层是异步的平台（RN 的 `AsyncStorage`）要在
外面先读进内存，adapter 里只做取值。

### ServiceCodes 配置

声明后端业务状态码，不同环境可配置不同值：

```ts
interface ServiceCodes {
  success: string; // 成功码，如 '0000'
  logout: string[]; // 直接登出码
  modalLogout: string[]; // 弹窗确认后登出码
  expiredToken: string[]; // token 过期码（触发刷新）
}
```

## 安装

包已在 monorepo 内，直接引用：

```ts
import { createAppRequest } from '@skyroc/service';
import { createQueryClient } from '@skyroc/service/query';
```

## 快速上手

### 1. 实现平台 Adapter

以 antd + tanstack-router 为例：

```ts
// apps/admin/src/service/adapter.ts
import type { RequestAdapter } from '@skyroc/service';
import { router } from '@/features/router';
import { localStg } from '@/utils/storage';
import { setAuth } from '@/features/auth/use-auth';
import { $t } from '@/locales';
import { fetchRefreshToken } from './api';
import { AUTH_URLS } from './api/auth/urls';

export const antdAdapter: RequestAdapter = {
  // ---- UI 反馈 ----
  showErrorMessage(msg, onClose) {
    if (onClose) {
      showErrorMessage({ content: msg, onClose });
    } else {
      showErrorMessage(msg);
    }
  },
  showErrorModal(options) {
    showErrorModal({
      content: options.content,
      maskClosable: options.maskClosable ?? false,
      onOk: () => options.onConfirm(),
      onCancel: () => options.onConfirm(),
      title: options.title
    });
  },

  // ---- Auth ----
  getToken: () => localStg.get('token') || null,
  getRefreshToken: () => localStg.get('refreshToken') || null,
  setAuth: tokens => setAuth(tokens),
  resetAuth() {
    localStg.remove('token');
    localStg.remove('refreshToken');
  },
  async fetchRefreshToken(refreshToken) {
    const data = await fetchRefreshToken(refreshToken);
    return { token: data.token, refreshToken: data.refreshToken };
  },
  // 和上面这个函数请求的 url 必须是同一个，否则续签接口自己过期时会死等自己
  refreshTokenUrl: AUTH_URLS.REFRESH_TOKEN,

  // ---- 导航 ----
  getCurrentPath: () => router.state.location.href,
  redirectToLogin: path => router.navigate({ to: '/login-out', search: { redirect: path } }),

  // ---- i18n ----
  t: key => $t(key)
};
```

### 2. 创建请求实例

```ts
// apps/admin/src/service/request/index.ts
import { createAppRequest } from '@skyroc/service';
import { antdAdapter } from '../adapter';

export const request = createAppRequest({
  adapter: antdAdapter,
  codes: {
    success: '0000',
    logout: ['8888', '8889'],
    modalLogout: ['7777', '7778'],
    expiredToken: ['9999', '9998', '3333']
  },
  axiosConfig: {
    baseURL: '/api',
    headers: { 'X-Custom': 'value' }
  }
});
```

### 3. 创建 QueryClient

```ts
// apps/admin/src/service/queryClient.ts
import { createQueryClient } from '@skyroc/service/query';

export const queryClient = createQueryClient({
  queryCache: {
    onError: error => {
      if (import.meta.env.DEV) {
        console.error('Query error:', error);
      }
    }
  },
  mutationCache: {
    onError: error => {
      if (import.meta.env.DEV) {
        console.error('Mutation error:', error);
      }
    }
  }
});
```

### 4. 像往常一样使用

```ts
// 业务代码无需改变
const userInfo = await request<Api.Auth.UserInfo>({ url: '/user/info' });
```

## API

### `createAppRequest(options)`

创建平台无关的请求实例。

```ts
interface CreateRequestOptions {
  adapter: RequestAdapter; // 平台适配器
  codes: ServiceCodes; // 后端业务状态码
  axiosConfig?: CreateAxiosDefaults; // axios 基础配置
  crypto?: ApiCryptoOptions; // 接口传输加密
  isBackendSuccess?: (response) => boolean; // 自定义成功判断
  transform?: (response) => any; // 自定义响应转换
}
```

返回值与 `@skyroc/axios` 的 `createRequest` 一致，是一个可直接调用的函数：

```ts
const request = createAppRequest({ ... });

// 直接调用
const data = await request<UserInfo>({ url: '/user/info' });

// 取消所有请求
request.cancelAllRequest();

// 访问内部状态（调试用）
request.state.errMsgStack;
```

#### 默认行为

| 行为     | 默认实现                                        | 可覆盖             |
| -------- | ----------------------------------------------- | ------------------ |
| 成功判断 | `response.data.code === codes.success`          | `isBackendSuccess` |
| 数据转换 | `response.data.data`                            | `transform`        |
| 请求拦截 | 自动注入 `Bearer {token}`                       | —                  |
| 错误处理 | 根据 `codes` 分流（登出 / 弹窗 / 刷新 / toast） | —                  |

#### 错误处理流程

```
后端返回非成功码
    │
    ├─ logout codes     → showErrorMessage + resetAuth + 跳转登录页
    ├─ modalLogout codes → showErrorModal + 确认后 resetAuth + 登出
    ├─ expiredToken codes → 自动刷新 token + 重试原请求（重试的响应交回调用方）
    └─ 其他              → 抛出 AxiosError（由 onError 兜底展示 toast）
```

登出和续签失败都由本包调 `adapter.resetAuth()` 清凭据，`redirectToLogin` 只负责「跳到哪」——
平台不必在路由里再清一遍（清了也无妨，`resetAuth` 是幂等的）。

### 接口传输加密

给个别接口（登录、改密码、实名信息提交）加一层传输加密，让密码这类内容不以明文出现在
浏览器 devtools、网关访问日志和抓包里。

装配一次：

```ts
export const request = createAppRequest({
  adapter,
  codes,
  crypto: {
    header: import.meta.env.VITE_API_CRYPTO_HEADER,
    publicKey: import.meta.env.VITE_API_CRYPTO_PUBLIC_KEY
  }
});
```

之后每个要加密的接口加一行 `encrypt: true`，没加的接口不进这段逻辑：

```ts
export function fetchLogin(params: Api.Auth.LoginParams) {
  return request<Api.Auth.LoginResponse>({
    data: params,
    encrypt: true,
    method: 'post',
    url: '/auth/login'
  });
}
```

#### 报文格式

两层信封，RSA 只用来传一次性 AES 密钥：

```
密钥头  base64( RSA-OAEP-SHA256(服务端公钥, aesKey) )        ← 头的名字由 crypto.header 配
请求体  base64( nonce(12B) ‖ AES-256-GCM(aesKey, 明文 JSON) ‖ tag(16B) )
```

和后端 `app/core/crypto/envelope.py` 是同一份契约。请求体会被声明成 `text/plain`——它现在是
一段 base64，标成 `application/json` 会让网关和 WAF 按 JSON 去解析它。

公钥从 PEM 载入，换行可以写成字面量 `\n`（环境变量装不下多行）。

#### 为什么是 node-forge 而不是 WebCrypto

`crypto.subtle` 只在安全上下文里存在。用 `http://192.168.x.x:5173` 访问开发服务器时浏览器不提供
它，整条加密链路直接不可用——手机和同事的电脑都进不来。forge 是纯 JS 实现，不挑上下文，代价是
约 90KB gzip 和慢一些的 RSA（一次登录几十毫秒）。

#### 边界

- **先想清楚它挡的是什么。** 公钥在前端 JS 里，AES 密钥也是前端生成的，攻击者照样构造得出
  合法密文。它挡的是明文落到日志和抓包里，不是主动攻击，别把它当成认证或授权的替代。
- **只加密请求，不解密响应。** 单纯是还没做：forge 是同步的，接 `isBackendSuccess` 这种同步钩子
  没有障碍，缺的是实现和后端对应的响应信封格式。
- **没配 `publicKey` 时不会退化成明文**：标了 `encrypt: true` 的请求直接抛错。没有加密需求的
  部署不用配，但配了一半的部署不会安静地把密码明文发出去。
- **FormData / 二进制请求体不支持**，上传文件的接口去掉 `encrypt: true`。
- **forge 目前是静态依赖**，没开加密的部署也会把它打进包里。

### `createQueryClient(options?)`

创建带统一默认配置的 QueryClient 实例。

```ts
interface CreateQueryClientOptions {
  /** 覆盖默认 defaultOptions（会与内置默认值浅合并） */
  defaultOptions?: DefaultOptions;
  /** MutationCache 配置（onError / onSuccess / onSettled / onMutate） */
  mutationCache?: MutationCacheConfig;
  /** QueryCache 配置（onError / onSuccess / onSettled） */
  queryCache?: QueryCacheConfig;
}
```

可通过 `defaultOptions` 覆盖任意配置项：

```ts
const queryClient = createQueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, retry: 3 },
    mutations: { retry: 2 },
  },
  queryCache: {
    onError: (error) => console.error('Query error:', error),
  },
});
```

#### 默认 Query 配置

| 配置项                 | 默认值 | 说明 |
| ---------------------- | ------ | ---- |
| `gcTime`               | `600000`（10 分钟） | 垃圾回收时间 |
| `staleTime`            | `30000`（30 秒） | 数据过期时间 |
| `retry`                | `2` | 失败重试次数 |
| `retryDelay`           | 指数退避，上限 30 秒 | `min(1000 × 2^n, 30000)` |
| `refetchOnMount`       | `true` | 组件挂载时重新获取 |
| `refetchOnReconnect`   | `true` | 网络恢复时重新获取 |
| `refetchOnWindowFocus` | `false` | 窗口聚焦时不重新获取 |
| `throwOnError`         | `false` | 不向上抛出错误 |
| `networkMode`          | `'online'` | 仅在线时发起请求 |

#### 默认 Mutation 配置

| 配置项       | 默认值 | 说明 |
| ------------ | ------ | ---- |
| `gcTime`     | `60000`（1 分钟） | 垃圾回收时间 |
| `retry`      | `1` | 失败重试次数 |
| `retryDelay` | 指数退避，上限 10 秒 | `min(1000 × 2^n, 10000)` |
| `throwOnError` | `false` | 不向上抛出错误 |
| `networkMode` | `'online'` | 仅在线时发起请求 |

### 公开导出

```ts
import {
  createAppRequest, // 创建请求实例
  createQueryClient, // 创建 QueryClient（也可从 '@skyroc/service/query' 引）
  importPublicKey, // 载入加密用的 RSA 公钥
  refreshToken, // 并发安全的 token 刷新，各传输共用一次
  resetTokenRefresh, // 清掉在途刷新状态，测试用
  seal // 加密一段明文，返回密钥头和 body 两段密文
} from '@skyroc/service';
```

`refreshToken` 是给 HTTP 之外的传输用的：WebSocket、SSE 拿到「令牌过期」都该调它，不要自己去调
`adapter.fetchRefreshToken`——那样各传输之间没有去重，第二个刷新会拿着已经轮换掉的 refresh token
去换，必定失败。

`backEndFail` / `handleError` / `showErrorMsg` / `getAuthorization` / `isRefreshTokenRequest` 只从
`src/request` 内部导出，没有挂到包入口上。它们全部接收 `adapter` 参数、不依赖任何全局状态，包内
的测试直接引源码路径调用。

这些函数全部接收 `adapter` 参数，不依赖任何全局状态，可独立调用和测试。

## Token 刷新机制

并发的 Token 过期请求只触发一次 `fetchRefreshToken`，其余请求等待同一个 Promise 的结果后重试：

```
请求 A ─┐                      ┌─ 带新 Token 重试 A
请求 B ─┤  共享同一个            ├─ 带新 Token 重试 B
请求 C ─┤  refreshTokenPromise  ├─ 带新 Token 重试 C
        └──────────────────────┘
                  │
     1 秒后清除 promise，下次过期重新刷新
```

刷新成功后 1 秒清除缓存的 Promise，避免长时间持有过期引用。

## 错误消息去重

`showErrorMsg` 维护一个消息栈，同一条消息在展示期间不会重复弹出：

```
showErrorMsg("网络异常")  → 展示 ✅
showErrorMsg("网络异常")  → 跳过（栈中已存在）
       ↓ 用户关闭消息（onClose）
showErrorMsg("网络异常")  → 展示 ✅（已从栈移除）
```

每条消息只管自己那一个去重位，关掉一条不影响其他还在展示的消息。

`onClose` 是可选的，平台可以不回调（RN 的 `Alert.alert` 就没有）。这种情况下 5 秒后自动释放去重位——
否则那条消息会永远占着栈，此后再也弹不出来。

## 适用场景

### 场景一：Web 中后台（antd）

当前项目的主要使用方式。adapter 对接 antd message/modal + jotai + tanstack-router。

### 场景二：React Native App

```ts
// adapters/rn-adapter.ts
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const rnAdapter: RequestAdapter = {
  // 把 onClose 接到按钮上，去重位关掉消息就释放，不用等 5 秒的兜底
  showErrorMessage: (msg, onClose) => Alert.alert('Error', msg, [{ text: 'OK', onPress: onClose }]),
  showErrorModal: opts => Alert.alert(opts.title, opts.content, [{ text: 'OK', onPress: opts.onConfirm }]),
  // AsyncStorage 是异步的，getToken 必须同步返回 —— 启动时读进内存，这里只取值
  getToken: () => tokenCache.token,
  getRefreshToken: () => tokenCache.refreshToken,
  refreshTokenUrl: '/auth/refreshToken',
  redirectToLogin: () => navigation.navigate('Login'),
  t: key => i18n.t(key)
  // ...
};
```

### 场景三：Next.js SSR/SSG

```ts
// adapters/next-adapter.ts
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export const nextAdapter: RequestAdapter = {
  getToken: () => cookies().get('token')?.value ?? null,
  redirectToLogin: path => redirect(`/login?redirect=${path}`),
  showErrorMessage: msg => toast.error(msg) // sonner / react-hot-toast
  // ...
};
```

### 场景四：独立测试

核心逻辑不依赖任何平台 API，mock adapter 即可测试所有分支：

```ts
const mockAdapter: RequestAdapter = {
  showErrorMessage: vi.fn(),
  showErrorModal: vi.fn(),
  getToken: vi.fn(() => 'test-token'),
  refreshTokenUrl: '/auth/refreshToken',
  redirectToLogin: vi.fn(),
  t: vi.fn(key => key)
  // ...
};

// 直接测试错误处理逻辑
backEndFail(response, instance, request, mockAdapter, codes);
expect(mockAdapter.redirectToLogin).toHaveBeenCalled();
```

## 与改造前对比

| 改造前                                              | 改造后                                               |
| --------------------------------------------------- | ---------------------------------------------------- |
| error.ts 硬编码 `showErrorMessage`（antd 全局方法） | adapter.showErrorMessage — 平台自己决定怎么展示      |
| shared.ts 硬编码 `localStg.get('token')`            | adapter.getToken — 存储方式由平台决定                |
| shared.ts 硬编码 `router.navigate`                  | adapter.redirectToLogin — 路由框架由平台决定         |
| error.ts 从 `import.meta.env` 读取 codes            | 显式传入 `ServiceCodes` — 可来自 env、配置文件或远程 |
| queryClient.ts 直接 `new QueryClient`               | `createQueryClient` 工厂 — 默认配置统一收口          |
| 测试需要 mock antd + jotai + router + localStorage  | mock 一个 adapter 对象即可                           |

## 设计原则

- **零平台依赖** — 只依赖 `@skyroc/axios`、`@tanstack/react-query` 和 `node-forge`，不依赖任何 UI 库 / 路由 / 状态管理
- **Adapter 模式** — 平台差异通过接口注入，而非条件分支
- **纯函数优先** — error-handler、shared 中的每个函数都接收全部依赖作为参数
- **约定优于配置** — 默认假设 `{ code, data, msg }` 响应格式，可通过 `isBackendSuccess` / `transform` 覆盖

## 测试

```bash
# 从 monorepo 根目录
npx vitest run packages/@core/service/__tests__

# 或在包目录内
cd packages/@core/service && pnpm test

# 含覆盖率报告
pnpm test --coverage
```

81 个测试用例，覆盖率：Statements 98% / Branches 93% / Functions 100% / Lines 98%，覆盖：请求实例创建与默认回调、业务状态码（登出 / 弹窗登出 / Token 过期）处理、续签请求的自我识别、Token 刷新与并发共享、续签后重试结果的回传、错误消息去重、请求体加密、QueryClient 配置合并、指数退避重试延迟。

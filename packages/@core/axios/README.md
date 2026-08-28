# @skyroc/axios

基于 [Axios](https://axios-http.com/) 的请求客户端工厂，提供类型安全的请求实例、业务错误处理、Token 刷新、请求取消等能力。

## 特性

- **两种请求风格**：`createRequest`（抛异常）和 `createFlatRequest`（Result 风格，不抛异常）
- **业务错误与 HTTP 错误的统一处理**
- **请求/响应拦截器钩子**（`onRequest`、`isBackendSuccess`、`onBackendFail`、`onError`、`transform`）
- **自动请求 ID**（每个请求携带唯一的 `X-Request-Id`）
- **请求取消管理**（`cancelAllRequest`）
- **可选的 axios-retry 重试机制**
- **响应类型推导**（`json`、`blob`、`text`、`arrayBuffer` 等）

## 安装

```bash
npm install @skyroc/axios
```

## 架构

```
用户调用 request(config)
    │
    ▼
┌─────────────────────────┐
│   请求拦截器             │
│  • 生成 X-Request-Id    │
│  • 挂载 AbortController │
│  • 调用 onRequest 钩子   │
└────────────┬────────────┘
             ▼
      Axios 发送请求
             │
             ▼
┌─────────────────────────┐
│   响应拦截器             │
│  • transformResponse    │
│  • 非 JSON 或业务成功    │──► 返回 response
│  • 业务失败              │
│    → onBackendFail      │
│    → onError → reject   │
└────────────┬────────────┘
             ▼
┌─────────────────────────┐
│ createRequest:           │
│   JSON → transform(res) │
│   其他 → response.data   │
├─────────────────────────┤
│ createFlatRequest:       │
│   成功 → { data, error: null }  │
│   失败 → { data: null, error }  │
└─────────────────────────┘
```

## 推荐用法

**推荐使用 `createRequest`**（抛异常风格），搭配 [TanStack Query](https://tanstack.com/query) 使用效果最佳：

```ts
// 1. 定义请求函数 —— 只关心「发请求 + 拿数据」
export function fetchUserList(params: Api.UserListParams) {
  return request<Api.UserList>({
    url: '/api/users',
    params
  });
}

// 2. 封装 Query Hook —— TanStack Query 接管状态
export function useUserListQuery(params: Api.UserListParams) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => fetchUserList(params)
  });
}

// 3. 封装 Mutation Hook —— 写操作同理
export function useCreateUserMutation() {
  return useMutation({
    mutationFn: (data: Api.CreateUserParams) => request<Api.User>({ url: '/api/users', method: 'post', data })
  });
}

// 4. 在组件中使用
const UserList = () => {
  const { data, isLoading, error } = useUserListQuery({ page: 1 });
  const { mutate: createUser, isPending } = useCreateUserMutation();
  // ...
};
```

`createFlatRequest` 适合不使用 TanStack Query、需要手动控制错误流程的场景。

## API

### `createRequest`

创建一个**抛异常风格**的请求实例。业务失败或 HTTP 错误会抛出 `AxiosError`。

```ts
function createRequest<
  ResponseData,
  ApiData = unknown,
  State extends Record<string, unknown> = Record<string, unknown>
>(
  axiosConfig?: CreateAxiosDefaults,
  options?: Partial<RequestOption<ResponseData, ApiData, State>>
): RequestInstance<ApiData, State>;
```

**类型参数：**

| 参数           | 说明                                                              | 默认值                    |
| -------------- | ----------------------------------------------------------------- | ------------------------- |
| `ResponseData` | 后端原始响应体类型，如 `{ code: number; data: any; msg: string }` | 必填                      |
| `ApiData`      | `transform` 转换后的业务数据类型                                  | `unknown`                 |
| `State`        | 挂载在实例上的自定义状态类型                                      | `Record<string, unknown>` |

`ApiData` 默认 `unknown` 而不是 `any`：请求实例的调用签名是 `<T extends ApiData>`，`ApiData` 一旦
是具体类型，`request<Api.UserInfo>({ url })` 就会因为 `Api.UserInfo` 不满足约束而报错——信封式后端
里每个接口的 `T` 本来就互不相同。`unknown` 解开这条约束，同时保证不写 `T` 时拿到的是 `unknown`，
必须显式标注，而不是像 `any` 一样一路默默滑过去。

**示例：**

```ts
interface BackendResponse<T = any> {
  code: number;
  data: T;
  msg: string;
}

const request = createRequest<BackendResponse>(
  { baseURL: 'https://api.example.com' },
  {
    isBackendSuccess: response => response.data.code === 200,
    transform: response => response.data.data,
    onRequest: async config => {
      config.headers.set('Authorization', `Bearer ${getToken()}`);
      return config;
    },
    onError: error => console.error(error.message)
  }
);

const userInfo = await request<Api.UserInfo>({ url: '/api/user' });
```

### `createFlatRequest`

创建一个 **Result 风格**的请求实例，永远不抛异常。

```ts
function createFlatRequest<
  ResponseData,
  ApiData = unknown,
  State extends Record<string, unknown> = Record<string, unknown>
>(
  axiosConfig?: CreateAxiosDefaults,
  options?: Partial<RequestOption<ResponseData, ApiData, State>>
): FlatRequestInstance<ResponseData, ApiData, State>;
```

**返回值：**

```ts
// 成功
{ data: ApiData; error: null; response: AxiosResponse }
// 失败
{ data: null; error: AxiosError; response?: AxiosResponse }
```

失败时 `response` 是**可选**的：网络错误、超时、请求被取消，以及请求拦截器里就抛出的场景都拿不到
响应，读它之前必须先判空。`error` 一定是 `AxiosError`——即使异常来自 `transform` 或某个钩子里抛出的
普通 `Error`，也会被包装成 `code` 为 `ERR_BAD_RESPONSE` 的 `AxiosError`。

**示例：**

```ts
const flatRequest = createFlatRequest<BackendResponse, BackendResponse['data']>(
  { baseURL: 'https://api.example.com' },
  {
    isBackendSuccess: response => response.data.code === 200,
    transform: response => response.data.data
  }
);

const { data, error } = await flatRequest({ url: '/api/users' });
if (error) {
  console.error(error.message);
  return;
}
console.log(data);
```

## 配置项

### Axios 默认配置

通过第一个参数传入，会与以下默认值合并：

| 配置                   | 默认值             |
| ---------------------- | ------------------ |
| `headers.Content-Type` | `application/json` |
| `timeout`              | `10000`（10 秒）   |
| `paramsSerializer`     | `qs.stringify`     |
| `validateStatus`       | `200-299` 或 `304` |

### RequestOption

| 选项               | 说明                                                         |
| ------------------ | ------------------------------------------------------------ |
| `isBackendSuccess` | HTTP 成功后判断业务是否成功（仅 JSON）                       |
| `transform`        | 将原始响应转换为业务数据（仅 JSON 且业务成功）               |
| `onRequest`        | 请求前修改配置（注入 Token 等），**必须返回 config**         |
| `onBackendFail`    | 业务失败处理，可返回新响应实现重试                           |
| `onError`          | 所有错误的统一回调                                           |
| `defaultState`     | 初始化实例的 `state`                                         |
| `requestIdKey`     | 请求 id 的 header 名，默认 `'X-Request-Id'`，传 `false` 关闭 |
| `retry`            | axios-retry 配置，默认 `{ retries: 0 }`（不重试）            |

`onRequest` 返回空值不会被兜底成原始 config——那样「忘记 return」会变成一个能跑但少了认证头的请求，
只能从后端 401 反推。这里直接抛出 `code` 为 `ERR_BAD_OPTION` 的 `AxiosError`。

### 重试

```ts
createRequest<BackendResponse>(axiosConfig, {
  retry: {
    retries: 2,
    retryDelay: attempt => attempt * 500
  }
});
```

重试配置独立成一项而不是混在 axiosConfig 里：`CreateAxiosDefaults` 没有 `retries` 字段，塞在那里
只能靠类型断言绕过检查。

### 请求 id

每个请求默认带一个 `X-Request-Id`。自定义 header 会让跨域请求多一次 OPTIONS 预检，不需要链路追踪时
可以关掉，或换成网关认识的名字：

```ts
createRequest<BackendResponse>(axiosConfig, { requestIdKey: false });
createRequest<BackendResponse>(axiosConfig, { requestIdKey: 'X-Trace-Id' });
```

## 错误处理

| 场景                   | `createRequest`                        | `createFlatRequest`                                  |
| ---------------------- | -------------------------------------- | ---------------------------------------------------- |
| HTTP 错误 (4xx/5xx)    | `onError` → 抛出异常                   | `{ data: null, error, response }`                    |
| 业务错误               | `onBackendFail` → `onError` → 抛出异常 | `{ data: null, error, response }`                    |
| 请求取消               | `onError`（`ERR_CANCELED`）→ 抛出      | `{ data: null, error, response: undefined }`         |
| 网络错误 / 超时        | `onError` → 抛出                       | `{ data: null, error, response: undefined }`         |
| `transform` 内部抛异常 | 原样抛出                               | `{ data: null, error }`（包装成 `ERR_BAD_RESPONSE`） |

通过 `BACKEND_ERROR_CODE` 区分业务错误与 HTTP 错误：

```ts
import { BACKEND_ERROR_CODE } from '@skyroc/axios';

if (error.code === BACKEND_ERROR_CODE) {
  // 业务错误：HTTP 成功但 code 不正确
} else {
  // HTTP 错误或网络错误
}
```

## Token 刷新重试

通过 `onBackendFail` 实现：

```ts
createRequest<BackendResponse>(axiosConfig, {
  async onBackendFail(response, instance) {
    if (String(response.data.code) === '401') {
      const success = await refreshToken();
      if (success) {
        response.config.headers.Authorization = `Bearer ${getNewToken()}`;
        return instance.request(response.config);
      }
    }
    return null;
  }
});
```

## 请求取消

```ts
// cancelAllRequest 取消所有由包管理的请求
request.cancelAllRequest();

// 取消之后新发起的请求不受影响，照常发送
await request({ url: '/api/data' });

// 自定义 signal 的请求不受 cancelAllRequest 影响
const controller = new AbortController();
request({ url: '/api/data', signal: controller.signal });
request.cancelAllRequest(); // 不会取消上面的请求
controller.abort(); // 手动取消
```

托管的请求共用一个 `AbortController`，`cancelAllRequest` 把它 abort 掉再换一个新的。不按请求 id
存表是因为那张表在请求正常结束时没人回收，长驻页面下只增不减。

## 响应类型

`responseType` 的取值与 axios 完全一致（全小写）：`json`、`text`、`blob`、`arraybuffer`、
`document`、`stream`、`formdata`。TypeScript 会据此推导返回值类型：

```ts
const data = await request<Api.User>({ url: '/user' }); // → Api.User
const blob = await request({ url: '/file', responseType: 'blob' }); // → Blob
const text = await request({ url: '/text', responseType: 'text' }); // → string
const buf = await request({ url: '/bin', responseType: 'arraybuffer' }); // → ArrayBuffer
```

非 JSON 响应不经过 `transform`，直接返回 `response.data`。但如果 `blob` / `arraybuffer` 请求失败、
后端回的其实是 JSON 错误信封，本包会先把它解出来再交给 `isBackendSuccess` / `onBackendFail`。

## 实例状态

请求实例的 `state` 属性用于在请求生命周期中共享状态：

```ts
const request = createFlatRequest<BackendResponse, any, { token: string }>(axiosConfig, {
  defaultState: { token: '' }
});

request.state.token = 'new-token';
```

## 常量与类型导出

**常量：**

| 常量                 | 值                | 说明                       |
| -------------------- | ----------------- | -------------------------- |
| `BACKEND_ERROR_CODE` | `'BACKEND_ERROR'` | 业务失败的 AxiosError code |
| `REQUEST_ID_KEY`     | `'X-Request-Id'`  | 请求 ID header key         |

**类型：**

| 类型                       | 说明                               |
| -------------------------- | ---------------------------------- |
| `RequestOption`            | 请求选项                           |
| `RequestInstance`          | `createRequest` 返回类型           |
| `FlatRequestInstance`      | `createFlatRequest` 返回类型       |
| `FlatResponseData`         | Flat 请求的联合返回类型            |
| `CustomAxiosRequestConfig` | 请求配置（支持 responseType 推导） |
| `MappedType`               | 响应类型映射                       |
| `ResponseType`             | 响应类型字面量                     |
| `ContentType`              | Content-Type 字面量                |

## 相关包

在实际项目中，通常不直接使用 `@skyroc/axios`，而是通过 `@skyroc/service` 进行上层封装。它基于本包提供了**平台适配器模式**、**业务状态码管理**、**Token 自动刷新**、**错误消息去重**等开箱即用的能力。

## License

MIT

# @skyroc/core-state

基于 Jotai 的状态管理封装 — 存储解耦、跨平台、支持 React 组件外访问。

## 架构

```
应用层                             @core/state
─────────────────────────          ──────────────────────────────────
registerStorage('local', ...)  ──► StorageRegistry (Map<name, adapter>)
registerStorage('session', ...)    │
                                   ▼
<JotaiProvider>                    globalStore (createStore)
  └─ <Provider store={globalStore}>
                                   ▼
createAtomWithStorage(key, val) ─► 首次访问时 getStorage(name) ─► jotaiAtomWithStorage
atomWithPartial(initialValue)  ─► baseAtom + 派生读写原子（合并 + no-op 检测）

getAtomValue / setAtomValue    ─► globalStore.get / globalStore.set
```

## 设计原则

1. **存储注册表** — `registerStorage` / `getStorage` 解耦存储实现，`@core/state` 不依赖任何具体平台 API
2. **应用层注册** — 应用层在入口注册 `'local'`、`'session'` 等适配器，库代码通过名称引用
3. **惰性解析** — atom 通常是模块级常量，ESM 会在应用入口之前求值，因此存储在**首次访问**时才解析（详见下方「注册时机」）
4. **直传逃生舱** — `options.storage` 允许直传适配器，跳过注册表
5. **非 Hook 访问** — `globalStore` + `getAtomValue` / `setAtomValue` 用于 axios 拦截器等非组件场景
6. **无操作跳过** — `atomWithPartial` 在补丁字段全部 `Object.is` 相等时跳过写入，不触发订阅者
7. **存储故障不外溢** — 读失败回退初始值、写失败只影响持久化不影响 atom，每类故障只告警一次

## 使用方式

### 1. 注册存储适配器（应用入口）

```ts
import { registerStorage } from '@skyroc/core-state';
import { storage } from '@skyroc/storage';

// localStorage 适配器
registerStorage('local', {
  getItem: key => storage.get(key),
  setItem: (key, value) => storage.set(key, value),
  removeItem: key => storage.remove(key),
});

// sessionStorage 适配器
registerStorage('session', {
  getItem: key => {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  },
  setItem: (key, value) => sessionStorage.setItem(key, JSON.stringify(value)),
  removeItem: key => sessionStorage.removeItem(key),
});
```

#### 注册时机

存储在 atom **首次被读写**时解析，而不是 `createAtomWithStorage()` 调用时。因此下面这种最常见的写法是安全的：

```ts
// atoms.ts —— ESM 求值顺序上早于 main.tsx
export const themeAtom = createAtomWithStorage('theme', { mode: 'light' });

// main.tsx
registerStorage('local', adapter);   // ✅ 只要在第一次读 themeAtom 之前执行即可
render(<App />);
```

若首次访问时仍未注册，atom 会回退到 `initialValue` 并在控制台告警一次，不会抛错中断模块。

### 2. 挂载 Provider

```tsx
import { JotaiProvider } from '@skyroc/core-state';

const App = () => (
  <JotaiProvider>
    <YourApp />
  </JotaiProvider>
);
```

> **注意**：`JotaiProvider` 将 `<Provider>` 绑定到 `globalStore`，组件内直接 `useAtom(someAtom)` 即可，
> **不要**再逐个传 `{ store: globalStore }` —— 那样会绕过 Provider，子树再也无法被隔离到另一个 store（测试、多实例场景直接失效）。

### 3. 创建持久化原子

```ts
import { createAtomWithStorage } from '@skyroc/core-state';

// 默认使用 'local' 存储
const themeAtom = createAtomWithStorage('theme', { mode: 'light' });

// 使用 session 存储
const tabAtom = createAtomWithStorage('activeTab', 'home', { storageName: 'session' });

// 直传适配器，绕过注册表
const customAtom = createAtomWithStorage('key', defaultVal, { storage: myAdapter });

// SSR：禁用挂载前的同步读取，避免 hydration 不一致
const ssrAtom = createAtomWithStorage('key', val, { getOnInit: false });

// RESET 清除持久化条目并回到初始值
import { RESET } from 'jotai/utils';
setAtomValue(themeAtom, RESET);
```

#### 结构漂移与 `validate`

适配器返回的是 `unknown`，默认会直接当作 `T` 使用。当 localStorage 里可能躺着**旧版本结构**时，用 `validate` 拒绝它：

```ts
const userAtom = createAtomWithStorage<User>('user', defaultUser, {
  validate: raw => (isUser(raw) ? raw : undefined), // 返回 undefined → 回退 defaultUser
});
```

不传 `validate` 时，持久化数据的 schema 由调用方自己负责。

#### 故障行为

| 场景                          | 行为                                            |
| ----------------------------- | ----------------------------------------------- |
| storage 未注册                | 回退 `initialValue`，告警一次                   |
| `getItem` 抛错（数据损坏等）  | 回退 `initialValue`，告警一次                   |
| `setItem` 抛错（配额、无痕）  | atom 正常更新，仅未持久化，告警一次             |
| `removeItem` 抛错             | atom 正常回到初始值，告警一次                   |
| 同一 storage 下 key 重复绑定  | 告警一次（两个 atom 会互相覆盖）                |

### 4. 部分更新原子

```ts
import { atomWithPartial } from '@skyroc/core-state';

const uiAtom = atomWithPartial({ siderCollapse: false, mixSiderFixed: false });

// 在组件中使用
const [ui, setUi] = useAtom(uiAtom);
setUi({ siderCollapse: true });                          // 补丁形式
setUi(prev => ({ siderCollapse: !prev.siderCollapse })); // updater 函数形式
setUi({ siderCollapse: true }); // 值未变 → 无操作，不触发重渲染
```

### 5. 非 Hook 访问

```ts
import { getAtomValue, setAtomValue } from '@skyroc/core-state';

// 如 axios 拦截器中读取 token
const token = getAtomValue(authAtom);

// 直接写入
setAtomValue(authAtom, newAuthState);

// 函数式更新走同一个入口
setAtomValue(counterAtom, prev => prev + 1);

// 同样支持 atomWithPartial 这类自定义写签名
setAtomValue(uiAtom, { siderCollapse: true });
```

> **不要用于 SSR**：`globalStore` 是模块级单例，Node 服务端会跨请求共享同一个 store，
> A 用户的状态会漏进 B 用户的渲染。服务端渲染需要每请求 `createStore()` 并传给 jotai 原生 `<Provider>`。

### 6. 跨标签页同步（可选）

实现 `AtomStorage.subscribe` 可将浏览器 `storage` 事件推送到原子：

```ts
registerStorage('local', {
  getItem: key => JSON.parse(localStorage.getItem(key) ?? 'null'),
  setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
  removeItem: key => localStorage.removeItem(key),
  subscribe: (key, callback) => {
    const handler = (e: StorageEvent) => {
      if (e.key === key) callback(e.newValue ? JSON.parse(e.newValue) : null);
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  },
});
```

## API

### Provider（Provider 组件）

| 导出            | 说明                              |
| --------------- | --------------------------------- |
| `JotaiProvider` | Provider 组件，内置 `globalStore` |

### Store（全局 Store）

| 导出                          | 说明                                          |
| ----------------------------- | --------------------------------------------- |
| `globalStore`                 | 全局 Jotai store 实例（非 SSR 场景）          |
| `getAtomValue(atom)`          | 非 Hook 环境读取 atom                         |
| `setAtomValue(atom, ...args)` | 非 Hook 环境写入 atom（任意写签名，含函数式） |

### Utils（工具函数）

| 导出                                      | 说明                                          |
| ----------------------------------------- | --------------------------------------------- |
| `createAtomWithStorage(key, init, opts?)` | 创建持久化 atom（惰性解析存储，故障不外溢）   |
| `atomWithPartial(init)`                   | 创建支持部分更新的 atom（内置无操作跳过）     |
| `registerStorage(name, adapter)`          | 注册命名存储适配器                            |
| `getStorage(name)`                        | 获取已注册的存储适配器（未注册时抛出）        |
| `hasStorage(name)`                        | 检查名称是否已注册（不抛出）                  |
| `unregisterStorage(name)`                 | 移除注册，返回是否存在                        |

### Types（类型导出）

| 导出                              | 说明                                                                 |
| --------------------------------- | -------------------------------------------------------------------- |
| `AtomStorage`                     | 存储适配器接口（`getItem` / `setItem` / `removeItem` / `subscribe?`） |
| `PartialUpdater<T>`               | `atomWithPartial` 的写参数类型（对象补丁或 updater 函数）            |
| `CreateAtomWithStorageOptions<T>` | `createAtomWithStorage` 的 options 类型                              |
| `StorageAtomUpdate<T>`            | 持久化 atom 的写参数类型（值 / updater / `RESET`）                   |
| `JotaiProviderProps`              | `JotaiProvider` 的 props 类型                                        |

## 许可证

MIT

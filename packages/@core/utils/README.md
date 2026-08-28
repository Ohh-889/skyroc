# @skyroc/utils

平台无关的通用工具函数集，提供日期处理、路径读写、事件总线、优先级队列、并发合并、任务调度等基础能力，并通过独立子路径暴露浏览器专用工具。

## 入口一览

| 入口     | 导入路径                  | 适用环境                     | 说明                                                      |
| -------- | ------------------------- | ---------------------------- | --------------------------------------------------------- |
| 主入口   | `@skyroc/utils`           | Node / 浏览器 / React Native | 平台无关核心                                              |
| 样式合并 | `@skyroc/utils/cn`        | 同上                         | 只要 `cn` 时用它，避免拉进整个 barrel                     |
| 加密     | `@skyroc/utils/crypto`    | 同上                         | 单独出口，crypto-js 体积较大                              |
| 路径读写 | `@skyroc/utils/path`      | 同上                         | `deepGet` / `deepSet` / 路径归一                          |
| 任务调度 | `@skyroc/utils/scheduler` | 同上                         | `TaskHub`：单心跳统一管理 init / periodic / listener 任务 |
| 类型工具 | `@skyroc/utils/type`      | 同上                         | 零运行时的 TS 工具类型，深度路径推导等                    |
| 浏览器   | `@skyroc/utils/web`       | **仅浏览器**                 | 下载、BOM、Storage、UA 探测、表单元素类型                 |

### 平台边界是编译器强制的，不是靠自觉

主入口所在的 TS 项目（`tsconfig.json`）只加载 `lib: ["ESNext"]`，**没有 DOM、没有 @types/node**。
任何在主入口下写 `window` / `document` / `navigator` / `localStorage` 的代码都会直接编译失败：

```
src/foo.ts(9,28): error TS2584: Cannot find name 'document'.
```

浏览器代码放在 `src/web/`，由 `tsconfig.web.json` 单独检查（`pnpm typecheck` 两个项目都跑）。
需要用到「三端都有」的宿主全局（如 `console`）时，在 `types/neutral.d.ts` 里显式补声明。

## 安装

包已在 monorepo 内，直接引用：

```ts
import { cn, nanoid, isNil, formatDate } from '@skyroc/utils';
import { downloadFileFromUrl, openWindow, createStorage } from '@skyroc/utils/web';
```

## 模块一览

| 模块             | 入口           | 主要导出                                       | 说明                                         |
| ---------------- | -------------- | ---------------------------------------------- | -------------------------------------------- |
| `cn`             | `.` / `./cn`   | `cn`                                           | Tailwind class 合并（clsx + tailwind-merge） |
| `crypto`         | `./crypto`     | `AesCrypto`                                    | AES 对称加密/解密类                          |
| `nanoid`         | `.`            | `nanoid`                                       | URL 安全唯一 ID 生成                         |
| `klona`          | `.`            | `jsonClone`                                    | JSON 安全深拷贝                              |
| `date`           | `.`            | `formatDate`、`addDate` 等 30+ 函数            | 分层日期工具（格式化/运算/边界/比较）        |
| `path`           | `.` / `./path` | `deepGet`、`deepSet`、`deepUnset`、`unflatten` | 不可变深路径读写                             |
| `array`          | `.`            | `toArray`、`arraysEqual`                       | 数组规范化与无序等价比较                     |
| `reg`            | `.`            | `REG_USER_NAME` 等 8 个正则                    | 常用表单校验正则常量                         |
| `object`         | `.`            | `shallowEqual`、`diffObject` 等                | 对象浅比较与递归 diff                        |
| `utils`          | `.`            | `isNil`、`microtask` 等                        | 基础类型守卫与微任务调度                     |
| `emitter`        | `.`            | `Emitter`                                      | 轻量级类型安全事件总线                       |
| `createSubject`  | `.`            | `createSubject`                                | 轻量 RxJS Subject 实现                       |
| `priority-queue` | `.`            | `PriorityQueue`                                | 有序集合（ID 去重 + 变更订阅）               |
| `singleflight`   | `.`            | `Singleflight`、`createSingleflight`           | 合并同 key 的并发请求                        |
| `query`          | `.`            | `parseQuery`、`stringifyQuery`                 | Query string 解析/序列化                     |
| `radash`         | `.`            | 类型守卫族 + `assign`                          | radash 白名单转出，**非全量**                |
| `scheduler`      | `./scheduler`  | `TaskHub`                                      | 协作式任务调度中枢（零运行时依赖）           |
| `web/download`   | `./web`        | `downloadFileFromUrl` 等                       | 多策略文件下载                               |
| `web/storage`    | `./web`        | `createStorage`、`createLocalforage`           | 类型安全存储封装                             |
| `web/env`        | `./web`        | `isMacOs`、`isPC` 等                           | UA 环境探测                                  |
| `web/window`     | `./web`        | `openWindow`                                   | 安全新窗口打开                               |
| `web/class`      | `./web`        | `toggleHtmlClass`                              | HTML class 切换                              |
| `web/form`       | `./web`        | `FieldElement`、`CustomElement`                | 表单元素类型（依赖 DOM lib）                 |
| `type/path`      | `./type`       | `LeafPaths`、`AllPaths`、`PathValue` 等        | 深度路径类型推导                             |
| `type/object`    | `./type`       | `DeepPartial`、`Prettify`、`MergeUnion` 等     | 对象与联合类型变换                           |
| `type/fn`        | `./type`       | `Fn`、`Noop`、`FunctionKeys` 等                | 函数类型提取                                 |
| `type/primitive` | `./type`       | `Primitive`、`Atomic`、`IsAny`、`IsTuple`      | 原始类型与判定                               |
| `type/misc`      | `./type`       | `MaybeArray`                                   | 零散工具类型                                 |

---

## cn — Tailwind class 合并

组合 [clsx](https://github.com/lukeed/clsx) 与 [tailwind-merge](https://github.com/dcastil/tailwind-merge)：先条件组合，再解决 Tailwind 工具类冲突。

```ts
import { cn } from '@skyroc/utils';
// 或者只要 cn 时（推荐给 React Native，Metro 不做 tree-shaking）：
import { cn } from '@skyroc/utils/cn';

cn('px-4 py-2', 'px-6');
// 'py-2 px-6'（px-4 被 px-6 覆盖）

cn('text-red-500', { 'font-bold': true, 'text-blue-500': false });
// 'text-red-500 font-bold'
```

---

## AesCrypto — AES 加密

泛型加密类，基于 [crypto-js](https://github.com/brix/crypto-js) AES 实现。

```ts
import { AesCrypto } from '@skyroc/utils/crypto';

type TokenPayload = { accessToken: string; expiresAt: number };

const box = new AesCrypto<TokenPayload>(import.meta.env.VITE_CRYPTO_SECRET);

const cipher = box.encrypt({ accessToken: 'eyJ...', expiresAt: Date.now() + 3600_000 });
const payload = box.decrypt(cipher); // TokenPayload | null
```

**工作原理：** `T → JSON.stringify → AES.encrypt(key) → 密文字符串`，解密反向执行，失败返回 `null`（不抛异常）。

需要区分失败原因时用 `tryDecrypt`：

```ts
const result = box.tryDecrypt(cipher);

if (result.ok) {
  console.log(result.data);
} else {
  console.log(result.reason); // 'decrypt'（密钥错/密文损坏） | 'parse'（明文不是合法 JSON）
}
```

> ⚠️ **安全边界：** passphrase 模式走 OpenSSL `EVP_BytesToKey`（MD5 单轮派生），密钥强度取决于口令本身，
> **不适合**作为真正的安全边界。它的合理用途是本地存储混淆。需要真实加密强度请用 Web Crypto (`crypto.subtle`) 或服务端加密。
> 密钥应从环境变量读取，不要硬编码在源码里。

---

## nanoid — 唯一 ID 生成

直接 re-export 自 [nanoid](https://github.com/ai/nanoid)，生成 URL 安全的随机唯一字符串。

```ts
import { nanoid } from '@skyroc/utils';

nanoid(); // 'V1StGXR8_Z5jdHi6B-myT'（默认 21 位）
nanoid(10); // 'IRFa-VaY2b'（指定长度）
```

---

## jsonClone — JSON 安全深拷贝

来自 [klona/json](https://github.com/lukeed/klona)，基于 JSON 序列化的快速深拷贝。

```ts
import { jsonClone } from '@skyroc/utils';

const original = { a: 1, b: { c: [2, 3] } };
const clone = jsonClone(original);

clone.b.c.push(4);
console.log(original.b.c); // [2, 3]（不受影响）
```

**限制：** `Date`、`Map`、`Set`、`Function`、`undefined` 等非 JSON 可序列化类型会丢失或变形。

---

## path — 不可变深路径读写

```ts
import { deepGet, deepSet, deepUnset, unflatten } from '@skyroc/utils';
// 或独立子路径：import { ... } from '@skyroc/utils/path';
```

路径支持三种写法，统一由 `toSegments` 归一：

```ts
'user.addresses[0].city'[('user', 'addresses', 0)]; // 点号 + 方括号，数字段自动转 number // 元组
('name'); // 单段
undefined; // → []（表示"没有路径"，所有操作原样返回）
```

### deepGet(obj, path, def?)

```ts
deepGet({ user: { name: 'Alex' } }, 'user.name'); // 'Alex'
deepGet({ user: {} }, 'user.name', 'fallback'); // 'fallback'
deepGet({ list: [{ id: 1 }] }, 'list[0].id'); // 1
```

返回 `unknown`，调用方自行断言 —— 路径是运行期字符串，类型系统无从推导实际值的类型。

### deepSet / deepUnset — 永不改原对象

```ts
deepSet({ a: { b: 1 } }, 'a.c', 2); // { a: { b: 1, c: 2 } }，原对象不变
deepSet({}, 'list[0].name', 'x'); // { list: [{ name: 'x' }] }，容器按段类型自动创建
deepUnset({ list: [1, 2, 3] }, 'list.1'); // { list: [1, 3] }，数组用 splice 收缩
```

**穿过非 plain object 时保留原型：**

```ts
class User {
  name = 'alex';
}

const next = deepSet({ user: new User() }, 'user.age', 30);
next.user.name; // 'alex'（不会被丢掉）
next.user instanceof User; // true
```

**原型污染防护默认开启：**

```ts
deepSet({}, '__proto__.polluted', 1); // 原样返回，不写入
deepSet({}, '__proto__.x', 1, { safeKeys: false }); // 显式关闭才会写
```

拦截的键：`__proto__`、`constructor`、`prototype`。

### unflatten — 扁平记录还原成嵌套结构

```ts
unflatten({ 'a.b': 1, 'a.c': 2, 'list[0]': 'x' });
// { a: { b: 1, c: 2 }, list: ['x'] }
```

### 路径工具

| 函数                                             | 说明                                                 |
| ------------------------------------------------ | ---------------------------------------------------- |
| `toSegments(path)`                               | 归一成段数组，`undefined` → `[]`                     |
| `toPathArray(str)`                               | 解析点号/方括号字符串，数字段转 `number`             |
| `keyOfName(path)`                                | 归一成点号形式的字符串 key                           |
| `toArrayIndex(key)`                              | 解析合法数组下标，非法返回 `null`                    |
| `isUnderPrefix(key, prefix)`                     | 判断 key 是否在 prefix 之下（`''` / `'*'` 匹配一切） |
| `collectDeepKeys(obj)`                           | 递归收集全部叶子路径                                 |
| `isPlainObject` / `isObjectLike` / `isUnsafeKey` | 形状与安全键判定                                     |

---

## Storage — 类型安全存储

> 位于 `@skyroc/utils/web`：依赖 `window.localStorage` / `IndexedDB`，不能在 RN / SSR 环境使用。

### createStorage

类型安全的 `localStorage` / `sessionStorage` 封装，支持泛型约束与 key 前缀。

```ts
import { createStorage } from '@skyroc/utils/web';

type AppStorage = {
  token: string;
  userInfo: { id: number; name: string };
  theme: 'light' | 'dark';
};

const storage = createStorage<AppStorage>('local', 'app__');

storage.set('token', 'eyJ...');
const token = storage.get('token'); // string | null
storage.remove('token');
storage.clear();
```

`get()` 在 JSON 解析失败时自动删除该 key 并返回 `null`，支持 `false`、`0` 等 falsy 值的正确读取。

### createLocalforage

基于 [localforage](https://localforage.github.io/localForage/) 的异步存储封装，支持 IndexedDB / WebSQL / localStorage。

```ts
import { createLocalforage } from '@skyroc/utils/web';

type CacheStorage = {
  dashboardData: { charts: unknown[]; updatedAt: number };
};

const cache = createLocalforage<CacheStorage>('indexedDB');

await cache.setItem('dashboardData', { charts: [], updatedAt: Date.now() });
const data = await cache.getItem('dashboardData'); // CacheStorage['dashboardData'] | null
```

**选型建议：**

| 场景                | 推荐                             |
| ------------------- | -------------------------------- |
| 同步读写，数据量小  | `createStorage('local', ...)`    |
| 仅当前 tab 生命周期 | `createStorage('session', ...)`  |
| 大体积数据（> 5MB） | `createLocalforage('indexedDB')` |

---

## Date — 分层日期工具

基于 [dayjs](https://day.js.org/)，注册了 `duration` 与 `relativeTime` 插件。所有函数接受 `DateInput` 类型：

```ts
type DateInput = string | number | Date | dayjs.Dayjs | null | undefined;
```

函数按**操作意图**分四个职责层：

```
format.ts   → 返回 string，结果用于 UI 渲染
calc.ts     → 返回 Dayjs / number，结果用于后续计算
boundary.ts → 返回 Dayjs / [Dayjs, Dayjs]，表示时间区间
compare.ts  → 返回 boolean，用于条件判断
```

> `date/dayjs.ts` 在模块顶层调用 `dayjs.extend()`，是对共享 dayjs 单例的全局副作用。
> 因此 `package.json` 的 `sideEffects` 是白名单而不是 `false`，避免打包器把插件注册摇掉。

### DATE_FORMAT 常量

```ts
import { DATE_FORMAT } from '@skyroc/utils';

DATE_FORMAT.DATE; // 'YYYY-MM-DD'
DATE_FORMAT.DATE_TIME; // 'YYYY-MM-DD HH:mm:ss'
DATE_FORMAT.DATE_TIME_MINUTE; // 'YYYY-MM-DD HH:mm'
DATE_FORMAT.TIME; // 'HH:mm:ss'
DATE_FORMAT.DATE_CN; // 'YYYY年MM月DD日'
```

### format — 格式化

```ts
import { formatDate, formatDateTime, formatTime, fromTimestamp, formatDuration, humanizeDuration } from '@skyroc/utils';

formatDate(new Date()); // '2026-04-22'
formatDateTime(new Date()); // '2026-04-22 14:30:00'
formatTime(new Date()); // '14:30:00'
fromTimestamp(1745000000); // 秒级自动转毫秒
fromTimestamp(1745000000000); // 毫秒级直接使用
formatDuration(3661000); // '01:01:01'
humanizeDuration(86400000); // 'a day'
```

### calc — 运算

```ts
import { toTimestamp, toUnixTimestamp, addDate, subtractDate, diffDate, fromNow, toNow } from '@skyroc/utils';

toTimestamp('2026-04-22'); // 毫秒级时间戳
toUnixTimestamp('2026-04-22'); // 秒级时间戳
addDate('2026-04-22', 7).format('YYYY-MM-DD'); // '2026-04-29'
subtractDate('2026-04-22', 1, 'month'); // 上个月同日
diffDate('2026-04-22', '2026-04-01'); // 21（天）
fromNow('2026-04-19'); // '3 days ago'
```

### boundary — 边界与范围

```ts
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  getTodayRange,
  getYesterdayRange,
  getThisWeekRange,
  getThisMonthRange,
  getThisYearRange,
  getLastDaysRange
} from '@skyroc/utils';

const [start, end] = getThisMonthRange(); // 本月起止
const [from, to] = getLastDaysRange(7); // 最近 7 天
```

### compare — 比较

```ts
import { isValidDate, isBefore, isAfter, isSame, isToday, isYesterday, isTomorrow } from '@skyroc/utils';

isValidDate('2026-04-22'); // true
isBefore('2026-04-01', '2026-04-22'); // true
isSame('2026-04-22 10:00', '2026-04-22 15:00', 'day'); // true
isToday(new Date()); // true
```

---

## Array — 数组工具

### toArray

将"单值 / 数组 / null / undefined"三种形态统一规范化为数组。

```ts
import { toArray } from '@skyroc/utils';

toArray('hello'); // ['hello']
toArray(['a', 'b']); // ['a', 'b']
toArray(null); // []
toArray(undefined); // []
toArray(0); // [0]（非 nil 的 falsy 值也会被包裹）
```

### arraysEqual

无序判断两个数组的元素集合是否等价（基于 Map 计数，`O(n)` 时间复杂度，浅比较）。

```ts
import { arraysEqual } from '@skyroc/utils';

arraysEqual([1, 2, 3], [3, 2, 1]); // true（顺序无关）
arraysEqual([1, 1, 2], [1, 2, 2]); // false（计数不同）
arraysEqual([], []); // true
```

---

## Regex — 校验正则

8 个预定义正则常量，均为非全局模式（无 `g` 标志），可安全复用于 `test()`。

```ts
import {
  REG_USER_NAME,
  REG_PHONE,
  REG_PWD,
  REG_PWD_STRONG,
  REG_EMAIL,
  REG_CODE_SIX,
  REG_CODE_FOUR,
  REG_URL
} from '@skyroc/utils';
```

| 常量             | 规则                                       | 合法示例                       |
| ---------------- | ------------------------------------------ | ------------------------------ |
| `REG_USER_NAME`  | 4-16 位：中文/英文/数字/`_`/`-`            | `alice_01`、`张三`             |
| `REG_PHONE`      | 中国大陆手机号 `1[3-9]` + 9 位             | `13812345678`                  |
| `REG_PWD`        | 6-18 位：字母/数字/`_`（宽松，**禁符号**） | `pass_123`                     |
| `REG_PWD_STRONG` | 8-32 位，需含大小写字母+数字，允许符号     | `Abcdef12!`                    |
| `REG_EMAIL`      | 标准邮箱格式                               | `user@example.com`             |
| `REG_CODE_SIX`   | 恰好 6 位纯数字                            | `123456`                       |
| `REG_CODE_FOUR`  | 恰好 4 位纯数字                            | `1234`                         |
| `REG_URL`        | HTTP(S) / 协议相对 URL                     | `https://example.com/path?q=1` |

**几点说明：**

- `REG_PHONE` 不再枚举运营商号段白名单 —— 枚举式正则在放新号段时会立刻失效，
  而放宽到 `1[3-9]` 的漏判成本远低于误杀真实用户。号码是否真实交给短信验证码。
- `REG_PWD` 是**偏弱的口令策略**（不允许符号），保留它只为兼容存量账号体系。
  新项目请用 `REG_PWD_STRONG`。
- `REG_URL` 各段字符集互不重叠、量词不嵌套，失配时不会灾难性回溯。

```ts
// 与 Zod 配合使用
const loginSchema = z.object({
  phone: z.string().regex(REG_PHONE, '手机号格式不正确'),
  password: z.string().regex(REG_PWD_STRONG, '密码需 8-32 位且包含大小写字母与数字')
});
```

---

## object — 对象工具

```ts
import { shallowEqual, diffObject, isObjectType, isEventObject } from '@skyroc/utils';
```

### shallowEqual(a, b) → boolean

浅比较：先用 `Object.is` 判断引用，再逐键用 `Object.is` 比较一级属性值。

```ts
shallowEqual({ a: 1, b: 2 }, { a: 1, b: 2 }); // true
shallowEqual({ a: 1, b: { c: 3 } }, { a: 1, b: { c: 3 } }); // false（嵌套对象引用不同）
```

### diffObject\<T\>(obj1, obj2) → Partial\<T\>

递归计算两个对象的差异，返回 `obj2` 中与 `obj1` 不同的部分。命名为 `diffObject` 以与 radash 的数组 `diff` 区分。

```ts
diffObject({ name: 'Alice', age: 30 }, { name: 'Alice', age: 31 });
// { age: 31 }
```

### isObjectType / isEventObject

```ts
isObjectType({}); // true
isObjectType([]); // true
isObjectType(null); // false —— 类型谓词必须排除 null，否则下游属性访问会炸

isEventObject({ target: input }); // true（表单取值：区分「事件」与「裸值」）
isEventObject(new Date()); // false
isEventObject([1, 2]); // false
```

---

## utils — 基础工具

```ts
import { noop, isNil, isHttpUrl, omitUndefined, microtask } from '@skyroc/utils';
```

| 函数                 | 说明                                                   |
| -------------------- | ------------------------------------------------------ |
| `noop()`             | 空函数，用作可选回调的默认值                           |
| `isNil(val)`         | 类型守卫：`null \| undefined`                          |
| `isHttpUrl(url)`     | 判断是否以 `http://` 或 `https://` 开头                |
| `omitUndefined(obj)` | 浅层过滤值为 `undefined` 的字段                        |
| `microtask(cb)`      | 排入微任务队列，宿主无 `queueMicrotask` 时回退 Promise |

> UA / 环境探测（`isWindow`、`isMacOs`、`isWindowsOs`、`isPC`）在 `@skyroc/utils/web`。

---

## Emitter — 事件总线

轻量级发布/订阅实现，支持泛型事件映射、通配符监听、粘性事件与键控隔离。

```ts
import { Emitter } from '@skyroc/utils';

type AppEvents = {
  login: [user: string, timestamp: number];
  logout: [];
};

const bus = new Emitter<AppEvents>();

const off = bus.on('login', (user, timestamp) => {
  console.log(`${user} 登录于 ${timestamp}`);
});

bus.emit('login', 'alice', Date.now());
off(); // 取消订阅
```

### 核心特性

**通配符监听：** `bus.on('*', (eventName, ...args) => {})` 接收所有事件，适合日志调试。
通配符是**旁路观察者**，不影响粘性事件 —— 有人 `on('*')` 不代表这个事件被消费了。

**粘性事件：** 触发时若该事件没有具体监听器，参数会被暂存；晚注册的监听器调用 `on()` 时会立即收到积压的调用。
每个事件名默认最多缓存 32 条，超出丢弃最早的：

```ts
const bus = new Emitter<AppEvents>({ stickyLimit: 100 }); // 调整上限
const bus = new Emitter<AppEvents>({ stickyLimit: 0 }); // 完全关闭粘性

bus.clearSticky('login'); // 只清某个事件的粘性缓存
bus.clearSticky(); // 清空全部粘性缓存，保留监听器
```

> 上限存在的意义：粘性缓存只增不减会变成内存泄漏 —— 一个从没人订阅的事件持续 `emit`，缓存就会无限增长。

**键控事件（Map 模式）：** `onMap / emitMap` 在事件名之外再加一层 `key` 隔离，适合同一事件按实例区分的场景。

```ts
bus.onMap('update', 'panel-A', data => {});
bus.emitMap('update', 'panel-A', { value: 1 }); // 只触发 panel-A
```

### API 汇总

| 方法                           | 说明                                             |
| ------------------------------ | ------------------------------------------------ |
| `emit(event, ...args)`         | 触发事件                                         |
| `emitMap(event, key, ...args)` | 触发键控事件                                     |
| `on(event, fn)`                | 注册监听器，返回取消订阅函数                     |
| `onMap(event, key, fn)`        | 注册键控监听器                                   |
| `off(event, fn?)`              | 移除指定监听器；不传 `fn` 则移除该事件全部监听器 |
| `offMap(event, key, fn)`       | 移除键控监听器                                   |
| `offAll()`                     | 清除所有监听器和粘性事件缓存                     |
| `clearSticky(event?)`          | 只清粘性缓存，保留监听器                         |

`off` / `offMap` 传入 `fn` 时严格按引用匹配 —— 传一个没注册过的函数不会误删任何东西。

---

## createSubject — 轻量 Subject

简化版 [RxJS Subject](https://rxjs.dev/guide/subject)，用于多播值推送与模块间单向数据流。Subject 既是生产者（可 `next` 推送值），也是消费者（可被 `subscribe` 订阅）。

```ts
import { createSubject } from '@skyroc/utils';

const subject = createSubject<string>();

const sub = subject.subscribe(value => console.log(value));
subject.next('hello'); // 推送给所有订阅者
sub.unsubscribe();

subject.complete(); // 关闭，之后 next() 无效
```

| 方法                        | 说明                               |
| --------------------------- | ---------------------------------- |
| `next(value)`               | 向所有活跃订阅者推送值             |
| `subscribe(fn \| observer)` | 注册订阅者，返回 `{ unsubscribe }` |
| `unsubscribe()`             | 移除所有订阅者（不关闭）           |
| `complete()`                | 关闭 Subject                       |
| `hasObservers()`            | 是否有活跃订阅者                   |
| `closed`                    | 是否已关闭（只读）                 |
| `size`                      | 当前订阅者数量（只读）             |

**与 Emitter 的选择：** 需要多个不同具名事件 → `Emitter`；只需一条单类型数据流 → `createSubject`。

---

## PriorityQueue — 有序集合

泛型有序集合，核心能力：**ID 去重**、**外部排序策略**、**变更订阅**、**容量上限**。

```ts
import { PriorityQueue } from '@skyroc/utils';

type Task = { taskId: string; priority: number; createdAt: number };

const queue = new PriorityQueue<Task>({
  getId: t => t.taskId,
  compare: (a, b) => a.priority - b.priority || a.createdAt - b.createdAt
});

queue.enqueue({ taskId: '1', priority: 2, createdAt: 1000 });
queue.enqueue({ taskId: '2', priority: 1, createdAt: 2000 });
queue.enqueue({ taskId: '1', priority: 2, createdAt: 1000 }); // 重复，被忽略

queue.peek()?.taskId; // '2'（priority 1 优先）
queue.dequeue(); // 取出 taskId='2'
```

> ⚠️ **复杂度：它不是二叉堆。** 内部是 `Map` + 有序数组缓存，每次写操作都会**全量重排**：
>
> | 操作                                        | 复杂度                     |
> | ------------------------------------------- | -------------------------- |
> | `enqueue` / `remove` / `update`             | `O(n log n)`               |
> | `enqueueMany` / `removeBy` / `updateBy`     | 整批只排一次，`O(n log n)` |
> | `peek` / `get` / `has` / `toArray` / `size` | `O(1)`                     |
>
> 逐条插入 n 个元素是 `O(n² log n)`。适用场景是**读多写少、n 较小**（通知中心、Banner 队列这类几十条量级）。
> 高频入队请用 `enqueueMany` 批量提交，或换成真正的堆实现。

### 写操作

| 方法                           | 说明                                     | 返回                   |
| ------------------------------ | ---------------------------------------- | ---------------------- |
| `enqueue(item)`                | 单条入队（幂等，id 存在则跳过）          | `boolean`              |
| `enqueueMany(items)`           | 批量入队，触发一次排序                   | `number`（实际入队数） |
| `dequeue()`                    | 移除并返回队首                           | `T \| undefined`       |
| `remove(id)`                   | 按 id 移除                               | `boolean`              |
| `removeBy(predicate)`          | 按条件批量移除                           | `number`（实际移除数） |
| `update(id, updater)`          | 原地更新，`updater` 原样返回入参则不通知 | `boolean`              |
| `updateBy(predicate, updater)` | 按条件批量更新                           | `number`               |
| `setCapacity(n)`               | 改容量上限，调小时立即裁剪并通知         | `void`                 |
| `clear()`                      | 清空队列                                 | `void`                 |

### 读操作与订阅

```ts
queue.peek(); // 查看队首，不移除
queue.has('id'); // 是否存在
queue.get('id'); // 按 id 获取
queue.toArray(); // 完整有序快照（readonly）
queue.size; // 数量
queue.isEmpty; // 是否为空

// 变更订阅（适配 Jotai / Zustand）
const unsub = queue.subscribe(sorted => {
  store.set(queueAtom, [...sorted]);
});
unsub(); // 取消
```

支持 `for...of` 按优先级顺序遍历。

---

## Singleflight — 并发请求合并

合并同 key 的并发请求，保证相同 key 在飞行期间只有一个 Promise，结果共享给所有调用方。来自 Go 标准库的同名模式。

### 类形式 — 在 Service 中组合

```ts
import { Singleflight } from '@skyroc/utils';

class UserService {
  private sf = new Singleflight();

  fetchProfile(id: string) {
    return this.sf.do(`profile:${id}`, () => fetch(`/api/users/${id}/profile`).then(r => r.json()));
  }
}

// 三次并发调用只实际发出一次请求
const [a, b, c] = await Promise.all([
  service.fetchProfile('alice'),
  service.fetchProfile('alice'),
  service.fetchProfile('alice')
]);
```

### 工厂函数形式 — 模块级

```ts
import { createSingleflight } from '@skyroc/utils';

const sf = createSingleflight();

async function fetchConfig() {
  return sf('app-config', () => fetch('/api/config').then(r => r.json()));
}
```

### API

| 方法             | 说明                                                       |
| ---------------- | ---------------------------------------------------------- |
| `sf.do(key, fn)` | 执行 fn，相同 key 飞行期间共享 Promise，落定后缓存自动清除 |
| `sf.forget(key)` | 手动清除某 key 的缓存，强制下次重新执行                    |
| `sf.reset()`     | 清除所有缓存                                               |

---

## query — Query string 解析

移植自 vue-router 的 `query.ts`（MIT License, Copyright © 2019 Eduardo San Martin Morote）。

```ts
import { parseQuery, stringifyQuery } from '@skyroc/utils';

parseQuery('?a=1&b=2&b=3'); // { a: '1', b: ['2', '3'] }
parseQuery('?flag'); // { flag: null }（无 = 的键值为 null）

stringifyQuery({ a: 1, b: ['2', '3'] }); // '?a=1&b=2&b=3'
stringifyQuery({ a: undefined }); // ''（undefined 被跳过）
```

编码策略与 vue-router 一致：空格编码为 `+`、字面 `+` 转 `%2B`、`[]{}|^\`` 保持不编码。
解析结果基于 `Object.create(null)`且用`Object.hasOwn` 判重，不存在原型污染风险。

---

## radash — 白名单转出

**本包不再 `export * from 'radash'`。** 只转出 radash 的**类型守卫族 + `assign`**：

```ts
import {
  assign,
  isArray,
  isDate,
  isEmpty,
  isEqual,
  isFloat,
  isFunction,
  isInt,
  isNumber,
  isObject,
  isPrimitive,
  isPromise,
  isString,
  isSymbol
} from '@skyroc/utils';
```

其余 radash 函数请直接引入：

```ts
import { group, unique, omit, pick, sleep, retry } from 'radash';
```

**为什么收窄：**

1. 星号转出等于把第三方的全部 API 变成本包的公开契约，radash 发个 minor 就可能改动本包的 API 面；
2. 上游一旦新增与本包同名的导出（如 `isNil` / `toArray`），ESM 会把歧义名从导出中剔除，直接变成构建期错误；
3. radash 自带 `get` / `set` / `crush` / `construct`，与本包的 `deepGet` / `deepSet` / `unflatten` 语义重叠，
   全量转出会让调用方不知道该用哪个。

> radash 的 `diff` 是**数组差集**工具，本包的对象递归比较函数名为 `diffObject`。

---

## @skyroc/utils/web — 浏览器专用工具

通过独立子路径导入，避免在 Node.js / SSR / React Native 环境中意外引入 BOM API。

```ts
import { downloadFileFromUrl, openWindow, toggleHtmlClass, createStorage, isMacOs } from '@skyroc/utils/web';
```

### 文件下载

不同来源选择对应函数：

```
文件来源？
  ├─ 普通 URL（http/https）    → downloadFileFromUrl      （异步）
  ├─ 图片 URL（需转 base64）   → downloadFileFromImageUrl （异步）
  ├─ Base64 / DataURL          → downloadFileFromBase64   （同步）
  ├─ Blob 对象                 → downloadFileFromBlob     （同步）
  ├─ BlobPart（ArrayBuffer 等）→ downloadFileFromBlobPart （同步）
  └─ 自定义 href               → triggerDownload          （底层，同步）
```

#### downloadFileFromUrl — 内置跨平台兼容策略

1. iOS / iPadOS → 直接 `openWindow`（`a[download]` 在 iOS 上不可靠）
2. 桌面端，CORS 允许 → `fetch → blob → a[download]`（可自定义文件名）
3. 桌面端，CORS 不允许 → 回退 `openWindow`

文件名优先级：`Content-Disposition` 响应头 → 参数 `fileName` → URL 路径文件名。

```ts
await downloadFileFromUrl({ source: 'https://example.com/report.pdf' });

await downloadFileFromUrl({
  source: 'https://example.com/export?id=123',
  fileName: '月度报表.xlsx'
});
```

#### 其他下载函数

```ts
// Base64 / DataURL
downloadFileFromBase64({
  source: 'data:application/pdf;base64,JVBERi0x...',
  fileName: 'document.pdf'
});

// Blob（配合 axios responseType: 'blob'）
const response = await axios.get('/api/export', { responseType: 'blob' });
downloadFileFromBlob({ source: response.data, fileName: '数据导出.xlsx' });

// BlobPart（自构造内容）
downloadFileFromBlobPart({ source: 'name,age\nAlice,30', fileName: 'users.csv' });

// 图片 URL（Canvas 转 Base64，需服务端允许 CORS）
await downloadFileFromImageUrl({ source: 'https://cdn.example.com/avatar.png', fileName: 'avatar.png' });
```

### openWindow — 安全新窗口

```ts
openWindow('https://docs.example.com'); // 新 tab（默认）
openWindow('/settings', { target: '_self' }); // 当前 tab
openWindow('https://external.com', { secure: false }); // 关闭安全策略
```

默认开启 `noopener,noreferrer` 防止 opener 劫持。

### toggleHtmlClass — HTML class 切换

常用于主题切换（暗色模式）。

```ts
const dark = toggleHtmlClass('dark');

dark.add(); // <html class="dark">
dark.remove(); // <html class="">
```

### env — 环境探测

```ts
import { isWindow, isMacOs, isWindowsOs, isPC } from '@skyroc/utils/web';

const modKey = isMacOs() ? e.metaKey : e.ctrlKey; // 快捷键按系统区分
```

> 都是 UA 嗅探，本质不可靠。能用特性检测就不要用它们。

### mergeProps / withClassName — 组件 props 合并

```ts
import { mergeProps, withClassName } from '@skyroc/utils/web';

// 合并 slot 与 child 的 props：事件处理器串联、style 浅合并、className 拼接
const props = mergeProps(slotProps, childProps);

// 给已有元素追加 className（用 cn 解决 Tailwind 冲突）
withClassName(<Icon className="size-4" />, 'text-red-500');
```

### getEventValue — 表单取值

```ts
import { getEventValue } from '@skyroc/utils/web';

getEventValue('value', event); // checkbox 取 checked，其余取 target[valuePropName]
getEventValue('value', 'raw-value'); // 非事件对象原样返回
```

---

## @skyroc/utils/type — 类型工具

一组零运行时的 TypeScript 工具类型：深度路径推导、递归可选化、联合类型变换、函数类型提取。
所有深度工具都停在 `Atomic`（见下），并受 `Depth` 参数约束，自引用类型不会把编译器撑爆。

```ts
import type { LeafPaths, PathValue, DeepPartial } from '@skyroc/utils/type';
```

### 入口

| 导入路径             | 内容                            | 需要 DOM lib |
| -------------------- | ------------------------------- | ------------ |
| `@skyroc/utils/type` | 除 web 表格外的全部类型         | 否           |
| `@skyroc/utils/web`  | `CustomElement`、`FieldElement` | 是           |

这个拆分是必要的：React Native 侧会导入 `./type`，那里只要出现一处 DOM 全局类型，
无 DOM lib 的环境就编译不过。这条边界和运行时代码走的是同一套 tsconfig 强制（见开头）。

### 原始类型与判定

| 类型         | 说明                                                                                                                                      |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `Primitive`  | 真正的 JS 原始类型：`string \| number \| boolean \| bigint \| symbol \| null \| undefined`。                                              |
| `Atomic`     | 递归终止集合：`Primitive` 加上 `Date`、`RegExp`、`Error`、`Map`、`Set`、`WeakMap`、`WeakSet` 以及任意函数。本入口所有深度工具都停在这里。 |
| `IsAny<T>`   | 只有 `any` 为 `true`。                                                                                                                    |
| `IsTuple<T>` | 定长元组为 `true`，变长数组为 `false`。                                                                                                   |

`Primitive` 刻意保持狭义。想表达「不要再往里递归」的，用 `Atomic`。

### 对象变换

#### `DeepPartial<T>`

递归可选化。停在 `Atomic`，保留元组形状，保留数组可变性；并且——不同于朴素的同态映射
——**不会**把数组元素污染成 `T | undefined`。

```typescript
type Cfg = { when: Date; list: { id: number }[]; pair: [{ a: number }, string] };

type T = DeepPartial<Cfg>;
// { when?: Date; list?: { id?: number }[]; pair?: [{ a?: number }, string] }
```

#### `ShallowPartial<T>`

同样的语义，但只作用一层。`Atomic` 类型与数组原样返回。

#### `Prettify<T>` / `MergeUnion<U>` / `UnionToIntersection<U>` / `Wrap<K, V>`

```typescript
type A = Prettify<{ a: number } & { b: string }>; // { a: number; b: string }
type B = UnionToIntersection<{ a: 1 } | { b: 2 }>; // { a: 1 } & { b: 2 }
type C = MergeUnion<{ a: 1 } | { b: 2 }>; // { a: 1; b: 2 }
type D = Wrap<'a' | 'b', number>; // { a: number; b: number }
```

`MergeUnion` 只展平顶层，嵌套层的同名字段仍保留为交叉类型。

### 路径类型

所有路径工具共享同一套规则：

- 递归停在 `Atomic`，因此 `Date` 不会贡献出 `when.getTime` 这种路径
- 数组下标统一写作 `` `${number}` ``，字面量 `number` 作为「任意下标」的通配写法
- 可选字段只贡献键名，不会带出 `undefined`
- 递归受 `Depth` 参数约束（默认 `6`），自引用类型可以正常编译

#### `LeafPaths<T, P?, Depth?>` / `AllPaths<T, P?, Depth?>`

`LeafPaths` 只给叶子路径，`AllPaths` 额外包含中间的对象与数组本身。

```typescript
type FormValues = { age: number; info: { city: string }; list: { id: number }[] };

type L = LeafPaths<FormValues>;
// 'age' | 'info.city' | `list.${number}.id`

type A = AllPaths<FormValues>;
// 'age' | 'info' | 'info.city' | 'list' | `list.${number}` | `list.${number}.id`
```

#### `AllPathsKeys<T>` / `AllPathsShape<T>`

`AllPathsKeys` 是 `AllPaths` 的语义别名，表单代码里通常用它。
`AllPathsShape` 把同样的信息表示成 `Record<path, true>`。

#### `PathValue<T, P>`

解析点分路径。非法路径为 `never`；`T` 为 `any` 时整体短路成 `any`，
这样把 `Values` 默认成 `any` 的泛型表单代码不会被卡住。

```typescript
type FormValues = { number: { x: string }; list: { id: number }[] };

type A = PathValue<FormValues, 'list.0.id'>; // number
type B = PathValue<FormValues, 'list.number.id'>; // number  （下标通配）
type C = PathValue<FormValues, 'number.x'>; // string  （真实字段名为 number 时优先命中字段）
type D = PathValue<FormValues, 'nope'>; // never
```

#### `PathToType<T, P>` / `PathToDeepType<T, P>`

分别是 `PathValue` 再套一层 `ShallowPartial` / `DeepPartial`。
表单值用 `PathToDeepType`——嵌套对象在填写过程中往往只填了一半。

```typescript
type FormValues = { info: { city: string; pl: { deep: string } } };

type A = PathToType<FormValues, 'info'>; // { city?: string; pl?: { deep: string } }
type B = PathToDeepType<FormValues, 'info'>; // { city?: string; pl?: { deep?: string } }
```

#### `ShapeFromPaths<T, Ps>`

由一组路径反推出覆盖它们的最小对象。路径列表为空时返回 `T` 本身。

```typescript
type FormValues = { age: number; info: { city: string }; list: { id: number; tag: string }[] };

type A = ShapeFromPaths<FormValues, ['age', 'info']>;
// { age: number; info: { city?: string } }

type B = ShapeFromPaths<FormValues, ['list.2.tag']>;
// { list: { tag: string }[] }

type C = ShapeFromPaths<FormValues, ['list.0']>;
// { list: { id?: number; tag?: string }[] }   ← 以下标结尾的路径给出完整元素
```

#### `ArrayKeys<T>` / `ArrayElementValue<T, K>`

```typescript
type Inputs = { name: string; tags: readonly string[]; users?: { id: number }[] };

type K = ArrayKeys<Inputs>; // 'tags' | 'users'
type E = ArrayElementValue<Inputs, 'tags'>; // string
type F = ArrayElementValue<Inputs, 'name'>; // never
```

两者对 `readonly` 数组和可选字段的处理是一致的；类型里没有任何数组字段时结果是 `never`，
以 `ArrayKeys` 为键的组件会直接变成不可用，而不是静默退化成 `any`。

#### `Join<P, K>`

路径段拼接器，对外导出以便自建兼容的路径类型。

```typescript
type A = Join<'', 'user'>; // 'user'
type B = Join<'user', 'name'>; // 'user.name'
type C = Join<'list', number>; // `list.${number}`
```

### 函数类型

| 类型               | 说明                                                   |
| ------------------ | ------------------------------------------------------ |
| `Fn`               | `(...args: any[]) => any`，「是不是函数」的判定基准。  |
| `Noop`             | `() => void`。                                         |
| `OnlyFunctions<T>` | 只保留函数属性，保留其可选性。                         |
| `FunctionKeys<T>`  | 函数属性的键名。可选成员只贡献键名，不带 `undefined`。 |
| `FunctionUnion<T>` | 函数属性的类型联合，已去掉 `undefined`。               |

```typescript
interface Api {
  data: string;
  fetch(): Promise<void>;
  update?: (id: number) => void;
}

type K = FunctionKeys<Api>; // 'fetch' | 'update'
type U = FunctionUnion<Api>; // (() => Promise<void>) | ((id: number) => void)
```

### Web 类型（`@skyroc/utils/web`）

```typescript
import type { CustomElement, FieldElement } from '@skyroc/utils/web';
```

`FieldElement` 是表单收集器能接受的元素：`HTMLInputElement | HTMLSelectElement |
HTMLTextAreaElement | CustomElement<T>`。`CustomElement<T = unknown>` 描述第三方控件
至少要暴露的结构（`value`、`type`、`checked`、`files`、`options`、`focus`）。

泛型默认值是 `unknown` 而不是 `any`——交叉类型里出现 `any` 会把整个类型塌成 `any`，
那样 `FieldElement` 就完全失去约束力了。

### 递归深度

所有路径工具末尾都有一个 `Depth` 参数，默认 `6`：

```typescript
interface TreeNode {
  children: TreeNode[];
  name: string;
}

type P = AllPathsKeys<TreeNode>; // 正常编译，展开到 6 层
type Q = AllPaths<TreeNode, '', 3>; // 更浅，编译更快
```

没有这个上限时，自引用类型会直接触发
`TS2589: Type instantiation is excessively deep and possibly infinite`。
表单类型很大导致编译变慢时，可以把深度调小。

---

## 从 3.x 迁移到 4.0

4.0 把 `@skyroc/type-utils` 整包并了进来。该包唯一的两个消费者（`@skyroc/form` 与本包）
都已经依赖 `@skyroc/utils`，独立发包只是在重复付版本、README、构建与发布的成本；
并入后 `@skyroc/utils` 的 dev 出口直接指向 `src`，下游也不必再预构建它才能跑 typecheck。

`@skyroc/type-utils` 已废弃，不再发布新版本。

### 导入路径变更

| 3.x                                                          | 4.0                         |
| ------------------------------------------------------------ | --------------------------- |
| `import type { LeafPaths } from '@skyroc/type-utils'`        | `from '@skyroc/utils/type'` |
| `import type { FieldElement } from '@skyroc/type-utils/web'` | `from '@skyroc/utils/web'`  |

类型本身的名字、签名、语义都没有变，只换导入路径。

### 新增

| 类型            | 入口     | 来源                                                             |
| --------------- | -------- | ---------------------------------------------------------------- |
| `MaybeArray<T>` | `./type` | 原 `@skyroc/ui-types`，它和 `DeepPartial` 是同类，归到类型工具下 |

---

## 从 2.x 迁移到 3.0

3.0 是一次破坏性整改，核心是**让平台边界由编译器强制**，并收窄失控的 API 面。

### 导入路径变更

| 2.x                                                                    | 3.0                                                | 原因                       |
| ---------------------------------------------------------------------- | -------------------------------------------------- | -------------------------- |
| `import { createStorage } from '@skyroc/utils'`                        | `from '@skyroc/utils/web'`                         | 依赖 `window.localStorage` |
| `import { createLocalforage } from '@skyroc/utils'`                    | `from '@skyroc/utils/web'`                         | 依赖 IndexedDB             |
| `import { isWindow, isMacOs, isWindowsOs, isPC } from '@skyroc/utils'` | `from '@skyroc/utils/web'`                         | 依赖 `navigator`           |
| `import { Crypto } from '@skyroc/utils'`                               | `import { AesCrypto } from '@skyroc/utils/crypto'` | 见下                       |
| `import { group, unique, ... } from '@skyroc/utils'`                   | `from 'radash'`                                    | 不再全量转出               |

### 重命名与移除

| 变更                                                   | 说明                                                                        |
| ------------------------------------------------------ | --------------------------------------------------------------------------- |
| `Crypto` → `AesCrypto`                                 | 原名遮蔽全局 DOM `Crypto` 类型；`secret` 字段改为 `private readonly`        |
| `deepGet<T, D>(...)` → `deepGet(obj, path, def?)`      | 原签名返回 `unknown \| D` 会塌缩成 `unknown`，泛型 `D` 从未生效             |
| 移除 `flagOn` / `flagOff` / `isOn` / `anyOn` / `allOn` | 表单状态簿记，已下沉到 `@skyroc/form` 的 `form-core/flag-set`               |
| 移除 `collectChangedLeafPaths` / `unionPaths`          | 全仓库无调用方，且前者会把数组下标转成字符串，与 `deepSet` 的容器推断不一致 |
| `microtask` 从 `path-utils` 移到 `utils`               | 它是通用调度工具，与路径无关                                                |
| 新增 `REG_PWD_STRONG`                                  | `REG_PWD` 保留但标注为宽松策略                                              |

### 行为变更（无需改代码，但语义变了）

| 位置                             | 2.x                                      | 3.0                                    |
| -------------------------------- | ---------------------------------------- | -------------------------------------- |
| `Emitter.off(event, fn)`         | 只有一个监听器时**无视 `fn` 直接整条删** | 严格按引用匹配，不会误删               |
| `Emitter.offMap(event, key, fn)` | 同上                                     | 同上                                   |
| `Emitter` 粘性事件               | 存在任意 `on('*')` 就不再产生粘性事件    | 通配符不影响粘性；每事件默认上限 32 条 |
| `deepSet(obj, undefined, v)`     | 写出字面量 `"undefined"` 键              | 原样返回                               |
| `deepSet` 穿过类实例             | 节点被替换成 `{}`，原有字段静默丢失      | 保留原型浅拷贝                         |
| `deepUnset(arr, '非法下标')`     | `splice(NaN, 1)` 删掉第一个元素          | 原样返回                               |
| `isObjectType(null)`             | `true`（把 `null` 收窄成 `object`）      | `false`                                |
| `REG_PHONE`                      | 枚举运营商号段白名单                     | `/^1[3-9]\d{9}$/`                      |
| `REG_URL`                        | 相邻字符类重叠，失配时可能灾难性回溯     | 重写为非回溯形状                       |
| `sideEffects`                    | `false`（对 `date/dayjs.ts` 是错的）     | 白名单，保护 dayjs 插件注册            |

---

## 开发

```bash
pnpm test           # 跑测试
pnpm test:coverage  # 含覆盖率报告
pnpm typecheck      # 中立项目 + web 项目各跑一遍
pnpm build          # tsdown 构建
pnpm lint           # oxlint --fix
```

### 目录约定

```
src/
├── index.ts        # 平台无关主入口（无 DOM）
├── cn.ts           # 也通过 ./cn 单独导出
├── crypto.ts       # 只通过 ./crypto 导出
├── path.ts         # 只通过 . 与 ./path 导出
├── radash.ts       # radash 白名单
├── date/
└── web/            # 浏览器专用，由 tsconfig.web.json 检查
types/
└── neutral.d.ts    # 中立项目的宿主全局声明（console 等）
```

新增平台无关工具时直接放 `src/` 下并在 `index.ts` 转出；
新增浏览器工具放 `src/web/`。**如果一个文件在 `src/` 下用到了 `window`，`pnpm typecheck` 会直接失败** —— 那说明它该搬去 `src/web/`。

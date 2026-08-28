# Store — Class 管逻辑，Hook 管渲染

## 核心思想

```
Store<S> 基类（纯逻辑）  +  useStore hook（React 桥接）
         ↓                          ↓
   状态 / 订阅 / 通知           useSyncExternalStore
         ↓                          ↓
   业务 Store（继承）           驱动组件渲染
```

- **Store（class）** 负责：状态保存、订阅通知、业务方法
- **useStore（hook）** 负责：将 Store 连接到 React 渲染周期，本身不包含任何业务逻辑
- 两者分工明确，hook 尽可能薄

---

## API

### `Store<S>` — 基类

| 成员                      | 访问级别    | 说明                                            |
| ------------------------- | ----------- | ----------------------------------------------- |
| `state`                   | `protected` | 当前状态，子类可读可写（但必须通过 `setState`） |
| `subscribe`               | `public`    | 订阅状态变化，返回取消函数                      |
| `getSnapshot`             | `public`    | 获取当前状态快照                                |
| `setState(nextOrUpdater)` | `protected` | 统一状态更新入口，支持直接传值或 updater 函数   |
| `patchState(patch)`       | `protected` | 局部更新（仅对象状态），自动与当前状态合并      |
| `clearListeners()`        | `protected` | 清空所有订阅者，一次性实例 destroy 时用         |

### `useStore(store, selector?)` — Hook

| 参数               | 说明                                   |
| ------------------ | -------------------------------------- |
| `store`            | 任何满足 `Subscribable` 接口的对象     |
| `selector`（可选） | 状态切片选择器，应返回原始值或稳定引用 |

### `Subscribable<S>` — 接口

鸭子类型约束，任何提供 `subscribe` + `getSnapshot` 的对象都可以被 `useStore` 消费，不强制继承 `Store`。

---

## 编写规则

### 1. 继承 Store，定义业务 class

```ts
class MyStore extends Store<MyState> {
  // 业务方法通过 this.setState 更新状态
}
```

### 2. 公开方法必须用箭头函数

```ts
// 正确 — 箭头函数，解构后 this 不会丢失
increment = () => {
  this.setState(prev => ({ ...prev, count: prev.count + 1 }));
};

// 错误 — 普通方法，解构后 this 丢失
increment() {
  this.setState(prev => ({ ...prev, count: prev.count + 1 }));
}
```

**为什么？** 消费方可能解构 store 的方法：

```ts
const { increment } = store; // 普通方法 → this 丢失 → TypeError
increment(); // 箭头函数 → 正常工作
```

### 3. 禁止直接操作 state

```ts
// 错误
this.state = newState;

// 正确
this.setState(newState);
this.setState(prev => computeNext(prev));
```

### 4. Hook 只做桥接

```ts
export function useXxx() {
  const store = useCreation(() => new XxxStore(), []);
  const state = useStore(store);
  return [state, store];
}
```

Hook 内部不应该有业务逻辑，只做三件事：**创建实例 → 订阅 → 返回**。

---

## 实际案例

### 案例一：useArray — 数组状态管理

**场景**：管理一个带唯一 key 的数组，支持增删改排序等操作。

#### Store 定义

```ts
class ArrayStore<T, K extends keyof T> extends Store<T[]> {
  private readonly initialState: T[];
  private readonly resolvedKey: K;

  constructor(initState: T[], key?: K) {
    super(initState);
    this.initialState = initState;
    this.resolvedKey = (key ?? 'id') as K;
  }

  push = (...newItems: T[]) => {
    this.setState(prev => {
      const merged = [...prev, ...newItems];
      return merged.filter(
        (item, index, self) => index === self.findIndex(t => t[this.resolvedKey] === item[this.resolvedKey])
      );
    });
  };

  remove = (itemKey: T[K]) => {
    this.setState(prev => prev.filter(i => i[this.resolvedKey] !== itemKey));
  };

  up = (itemKey: T[K]) => {
    this.setState(prev => {
      const index = prev.findIndex(i => i[this.resolvedKey] === itemKey);
      if (index <= 0) return prev;
      const next = [...prev];
      [next[index], next[index - 1]] = [next[index - 1], next[index]];
      return next;
    });
  };

  clear = () => {
    this.setState([]);
  };
  reset = () => {
    this.setState(this.initialState);
  };
  findItem = (key: T[K]) => this.state.find(item => item[this.resolvedKey] === key);

  // ... 更多方法：unshift, down, pop, shift, reverse, sort, splice
}
```

#### Hook 定义

```ts
export default function useArray<T, K extends keyof T>(initState: T[], key?: K): [T[], ArrayStore<T, K>] {
  const store = useCreation(() => new ArrayStore(initState, key), []);
  const state = useStore(store);
  return [state, store];
}
```

#### 组件中使用

```tsx
const TodoList = () => {
  const [items, store] = useArray(
    [
      { id: 1, title: 'Learn React' },
      { id: 2, title: 'Learn Store' }
    ],
    'id'
  );

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          <span>{item.title}</span>
          <button onClick={() => store.up(item.id)}>上移</button>
          <button onClick={() => store.down(item.id)}>下移</button>
          <button onClick={() => store.remove(item.id)}>删除</button>
        </div>
      ))}
      <button onClick={() => store.push({ id: Date.now(), title: 'New' })}>添加</button>
      <button onClick={() => store.reset()}>重置</button>
    </div>
  );
};
```

---

### 案例二：useNow — 当前时间

**场景**：按指定间隔更新当前时间，支持暂停 / 恢复。

#### Store 定义

```ts
class NowStore extends Store<Date> {
  private timerId: ReturnType<typeof setInterval> | null = null;
  private readonly interval: number;

  constructor(interval: number) {
    super(new Date());
    this.interval = interval;
  }

  pause = () => {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  };

  resume = () => {
    if (!this.timerId) {
      this.timerId = setInterval(() => {
        this.setState(new Date());
      }, this.interval);
    }
  };
}
```

#### Hook 定义

```ts
export function useNow(interval = 1000) {
  const store = useCreation(() => new NowStore(interval), []);
  const now = useStore(store);
  return { now, pause: store.pause, resume: store.resume };
}
```

#### 组件中使用

```tsx
const Clock = () => {
  const { now, pause, resume } = useNow(1000);

  return (
    <div>
      <p>{now.toLocaleTimeString()}</p>
      <button onClick={pause}>暂停</button>
      <button onClick={resume}>继续</button>
    </div>
  );
};
```

---

## 自定义 Store 模板

当你需要创建一个新的 Store + Hook，按照这个模板：

```ts
import { useCreation } from 'ahooks';
import { Store, useStore } from './store';

// 1. 定义状态类型
type MyState = {
  // ...
};

// 2. 定义 Store（所有逻辑在这里）
class MyStore extends Store<MyState> {
  constructor() {
    super({/* 初始状态 */});
  }

  // 公开方法必须用箭头函数
  doSomething = () => {
    this.setState(prev => ({ ...prev /* 更新 */ }));
  };
}

// 3. 定义 Hook（只做桥接）
export function useMyStore() {
  const store = useCreation(() => new MyStore(), []);
  const state = useStore(store);
  return { ...state, doSomething: store.doSomething };
}
```

---

## 使用 selector 优化渲染

当状态是复杂对象，组件只关心其中一部分时，可以用 selector 减少不必要的重渲染：

```ts
type DashboardState = {
  users: User[];
  count: number;
  loading: boolean;
};

class DashboardStore extends Store<DashboardState> {
  /* ... */
}

// 只订阅 count，users 和 loading 变化不会触发重渲染
const count = useStore(dashboardStore, s => s.count);
```

> **注意**：selector 应返回原始值（number / string / boolean）或稳定引用。
> 如果返回新对象（如 `s => ({ a: s.a })`），每次都是新引用，会导致每次通知都重渲染。

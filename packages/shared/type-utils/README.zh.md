# Skyroc Type Utils

[English](./README.md) | 简体中文

零运行时的 TypeScript 类型工具：点分路径、表单类型变换、深层类型操作。

## ✨ 特性

- 🛤️ **点分路径** —— 枚举嵌套类型的全部路径，也能由路径反查值类型
- 📝 **表单向变换** —— 深度可选化、由路径列表反推最小对象骨架
- 🔧 **函数类型助手** —— 从对象里挑出函数属性的键名与类型
- 🎯 **默认严格** —— 非法路径解析为 `never`，绝不退化成 `any`
- 🧱 **平台中立** —— 根出口不依赖 DOM，浏览器专属类型放在 `/web` 子路径
- ⚡ **零运行时** —— 纯类型，不进产物

## 📦 安装

```bash
pnpm add -D @skyroc/type-utils
```

## 🚀 快速上手

```typescript
import type { AllPathsKeys, DeepPartial, PathValue, ShapeFromPaths } from '@skyroc/type-utils';

type FormValues = {
  age: number;
  info: { city: string; pl: { deep: string } };
  list: { id: number; tag: string }[];
};

// 全部路径，含中间节点
type Paths = AllPathsKeys<FormValues>;
// 'age' | 'info' | 'info.city' | 'info.pl' | 'info.pl.deep'
//   | 'list' | `list.${number}` | `list.${number}.id` | `list.${number}.tag`

// 由路径反查类型 —— 写错的路径是 never，不是 any
type City = PathValue<FormValues, 'info.city'>; // string
type Typo = PathValue<FormValues, 'info.citty'>; // never

// 深度可选化，且不会破坏 Date / Map / 数组
type Draft = DeepPartial<FormValues>;
// { age?: number; info?: { city?: string; pl?: { deep?: string } }; list?: { id?: number; tag?: string }[] }

// 覆盖一组路径的最小对象
type Watched = ShapeFromPaths<FormValues, ['age', 'list.0.tag']>;
// { age: number; list: { tag: string }[] }
```

## 📚 API

### 入口

| 导入路径                 | 内容                            | 需要 DOM lib |
| ------------------------ | ------------------------------- | ------------ |
| `@skyroc/type-utils`     | 除 web 表格外的全部类型         | 否           |
| `@skyroc/type-utils/web` | `CustomElement`、`FieldElement` | 是           |

这个拆分是必要的：React Native 侧会导入根出口，根出口里只要出现一处 `HTMLElement`，
无 DOM lib 的环境就编译不过。

### 原始类型与判定

| 类型         | 说明                                                                                                                                    |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| `Primitive`  | 真正的 JS 原始类型：`string \| number \| boolean \| bigint \| symbol \| null \| undefined`。                                            |
| `Atomic`     | 递归终止集合：`Primitive` 加上 `Date`、`RegExp`、`Error`、`Map`、`Set`、`WeakMap`、`WeakSet` 以及任意函数。本包所有深度工具都停在这里。 |
| `IsAny<T>`   | 只有 `any` 为 `true`。                                                                                                                  |
| `IsTuple<T>` | 定长元组为 `true`，变长数组为 `false`。                                                                                                 |

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

### Web 类型（`@skyroc/type-utils/web`）

```typescript
import type { CustomElement, FieldElement } from '@skyroc/type-utils/web';
```

`FieldElement` 是表单收集器能接受的元素：`HTMLInputElement | HTMLSelectElement |
HTMLTextAreaElement | CustomElement<T>`。`CustomElement<T = unknown>` 描述第三方控件
至少要暴露的结构（`value`、`type`、`checked`、`files`、`options`、`focus`）。

泛型默认值是 `unknown` 而不是 `any`——交叉类型里出现 `any` 会把整个类型塌成 `any`，
那样 `FieldElement` 就完全失去约束力了。

## 🎯 递归深度

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

## 📖 TypeScript 支持

需要 TypeScript 4.7+。每个导出类型都带 JSDoc 与可运行的示例，
包内附有类型级回归测试（`__tests__/*.test-d.ts`，通过 `vitest --typecheck` 运行）。

## 📄 许可

MIT License

## 🔗 链接

- [GitHub 仓库](https://github.com/Ohh-889/skyroc-admin)
- [问题反馈](https://github.com/Ohh-889/skyroc-admin/issues)

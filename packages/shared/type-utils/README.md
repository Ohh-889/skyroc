# Skyroc Type Utils

English | [简体中文](./README.zh.md)

Zero-runtime TypeScript utility types for form handling, dotted-path manipulation and deep type transformations.

## ✨ Features

- 🛤️ **Dotted paths** — enumerate every path in a nested type, resolve a path back to its value type
- 📝 **Form-shaped transforms** — deep-partial values, minimal shapes derived from a path list
- 🔧 **Function helpers** — extract function-valued keys and types out of an object
- 🎯 **Strict by default** — invalid paths resolve to `never`, never to `any`
- 🧱 **Platform neutral** — the root entry has no DOM dependency; browser-only types live under `/web`
- ⚡ **Zero runtime** — types only, nothing ships to the bundle

## 📦 Installation

```bash
pnpm add -D @skyroc/type-utils
```

## 🚀 Quick Start

```typescript
import type { AllPathsKeys, DeepPartial, PathValue, ShapeFromPaths } from '@skyroc/type-utils';

type FormValues = {
  age: number;
  info: { city: string; pl: { deep: string } };
  list: { id: number; tag: string }[];
};

// Every path, including intermediate nodes
type Paths = AllPathsKeys<FormValues>;
// 'age' | 'info' | 'info.city' | 'info.pl' | 'info.pl.deep'
//   | 'list' | `list.${number}` | `list.${number}.id` | `list.${number}.tag`

// Resolve a path back to its type — typos are `never`, not `any`
type City = PathValue<FormValues, 'info.city'>; // string
type Typo = PathValue<FormValues, 'info.citty'>; // never

// Deep-partial, without wrecking Date / Map / arrays
type Draft = DeepPartial<FormValues>;
// { age?: number; info?: { city?: string; pl?: { deep?: string } }; list?: { id?: number; tag?: string }[] }

// The minimal shape covering a set of paths
type Watched = ShapeFromPaths<FormValues, ['age', 'list.0.tag']>;
// { age: number; list: { tag: string }[] }
```

## 📚 API Reference

### Entry points

| Import                   | Contents                                | Requires DOM lib |
| ------------------------ | --------------------------------------- | ---------------- |
| `@skyroc/type-utils`     | everything below except the `web` table | no               |
| `@skyroc/type-utils/web` | `CustomElement`, `FieldElement`         | yes              |

The split matters: React Native consumers import the root entry, and a stray `HTMLElement`
reference in it would fail to compile against a DOM-less `lib`.

### Primitives & predicates

| Type         | Description                                                                                                                                                         |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Primitive`  | The real JS primitives: `string \| number \| boolean \| bigint \| symbol \| null \| undefined`.                                                                     |
| `Atomic`     | The recursion stop-set: `Primitive` plus `Date`, `RegExp`, `Error`, `Map`, `Set`, `WeakMap`, `WeakSet` and any function. Every deep utility here stops at `Atomic`. |
| `IsAny<T>`   | `true` only for `any`.                                                                                                                                              |
| `IsTuple<T>` | `true` for fixed-length tuples, `false` for variable-length arrays.                                                                                                 |

`Primitive` is deliberately narrow. If you want "don't recurse into this", you want `Atomic`.

### Object transforms

#### `DeepPartial<T>`

Recursively optional. Stops at `Atomic`, preserves tuple shape, preserves array mutability,
and — unlike a naive homomorphic mapped type — does **not** turn array elements into `T | undefined`.

```typescript
type Cfg = { when: Date; list: { id: number }[]; pair: [{ a: number }, string] };

type T = DeepPartial<Cfg>;
// { when?: Date; list?: { id?: number }[]; pair?: [{ a?: number }, string] }
```

#### `ShallowPartial<T>`

Same idea, one level deep only. `Atomic` types and arrays pass through untouched.

#### `Prettify<T>` / `MergeUnion<U>` / `UnionToIntersection<U>` / `Wrap<K, V>`

```typescript
type A = Prettify<{ a: number } & { b: string }>; // { a: number; b: string }
type B = UnionToIntersection<{ a: 1 } | { b: 2 }>; // { a: 1 } & { b: 2 }
type C = MergeUnion<{ a: 1 } | { b: 2 }>; // { a: 1; b: 2 }
type D = Wrap<'a' | 'b', number>; // { a: number; b: number }
```

`MergeUnion` flattens the top level only; nested collisions stay as intersections.

### Path types

All path utilities share the same rules:

- recursion stops at `Atomic`, so `Date` never contributes `when.getTime` as a path
- arrays are addressed with `` `${number}` ``; the literal segment `number` is accepted as a wildcard
- optional properties contribute their key, never `undefined`
- recursion is bounded by a `Depth` parameter (default `6`) so self-referential types compile

#### `LeafPaths<T, P?, Depth?>` / `AllPaths<T, P?, Depth?>`

`LeafPaths` yields only terminal paths; `AllPaths` also yields the intermediate objects and arrays.

```typescript
type FormValues = { age: number; info: { city: string }; list: { id: number }[] };

type L = LeafPaths<FormValues>;
// 'age' | 'info.city' | `list.${number}.id`

type A = AllPaths<FormValues>;
// 'age' | 'info' | 'info.city' | 'list' | `list.${number}` | `list.${number}.id`
```

#### `AllPathsKeys<T>` / `AllPathsShape<T>`

`AllPathsKeys` is the semantic alias of `AllPaths` and the one you normally want in form code.
`AllPathsShape` presents the same information as `Record<path, true>`.

#### `PathValue<T, P>`

Resolves a dotted path. Invalid paths are `never`. `T = any` short-circuits to `any`, so
generic form code that defaults `Values = any` stays usable.

```typescript
type FormValues = { number: { x: string }; list: { id: number }[] };

type A = PathValue<FormValues, 'list.0.id'>; // number
type B = PathValue<FormValues, 'list.number.id'>; // number  (wildcard index)
type C = PathValue<FormValues, 'number.x'>; // string  (a real key named `number` wins)
type D = PathValue<FormValues, 'nope'>; // never
```

#### `PathToType<T, P>` / `PathToDeepType<T, P>`

`PathValue` plus `ShallowPartial` / `DeepPartial` respectively. `PathToDeepType` is the right
choice for form values, where nested objects are usually only half-filled.

```typescript
type FormValues = { info: { city: string; pl: { deep: string } } };

type A = PathToType<FormValues, 'info'>; // { city?: string; pl?: { deep: string } }
type B = PathToDeepType<FormValues, 'info'>; // { city?: string; pl?: { deep?: string } }
```

#### `ShapeFromPaths<T, Ps>`

Reconstructs the minimal object covering a list of paths. An empty list returns `T`.

```typescript
type FormValues = { age: number; info: { city: string }; list: { id: number; tag: string }[] };

type A = ShapeFromPaths<FormValues, ['age', 'info']>;
// { age: number; info: { city?: string } }

type B = ShapeFromPaths<FormValues, ['list.2.tag']>;
// { list: { tag: string }[] }

type C = ShapeFromPaths<FormValues, ['list.0']>;
// { list: { id?: number; tag?: string }[] }   ← index-terminated path yields the whole element
```

#### `ArrayKeys<T>` / `ArrayElementValue<T, K>`

```typescript
type Inputs = { name: string; tags: readonly string[]; users?: { id: number }[] };

type K = ArrayKeys<Inputs>; // 'tags' | 'users'
type E = ArrayElementValue<Inputs, 'tags'>; // string
type F = ArrayElementValue<Inputs, 'name'>; // never
```

Both handle `readonly` arrays and optional fields consistently; a type with no array fields
gives `never`, so a component keyed on `ArrayKeys` simply becomes unusable rather than
silently degrading to `any`.

#### `Join<P, K>`

The path-segment joiner, exported so you can build compatible path types of your own.

```typescript
type A = Join<'', 'user'>; // 'user'
type B = Join<'user', 'name'>; // 'user.name'
type C = Join<'list', number>; // `list.${number}`
```

### Function types

| Type               | Description                                                                  |
| ------------------ | ---------------------------------------------------------------------------- |
| `Fn`               | `(...args: any[]) => any` — the "is this a function" yardstick.              |
| `Noop`             | `() => void`.                                                                |
| `OnlyFunctions<T>` | Keeps only function-valued properties, preserving optionality.               |
| `FunctionKeys<T>`  | Their key names. Optional members contribute the key alone, not `undefined`. |
| `FunctionUnion<T>` | Their types, with `undefined` stripped.                                      |

```typescript
interface Api {
  data: string;
  fetch(): Promise<void>;
  update?: (id: number) => void;
}

type K = FunctionKeys<Api>; // 'fetch' | 'update'
type U = FunctionUnion<Api>; // (() => Promise<void>) | ((id: number) => void)
```

### Web types (`@skyroc/type-utils/web`)

```typescript
import type { CustomElement, FieldElement } from '@skyroc/type-utils/web';
```

`FieldElement` is what a form collector accepts: `HTMLInputElement | HTMLSelectElement |
HTMLTextAreaElement | CustomElement<T>`. `CustomElement<T = unknown>` describes the minimal
shape a third-party control must expose (`value`, `type`, `checked`, `files`, `options`, `focus`).

The generic defaults to `unknown` rather than `any` on purpose — `any` inside an intersection
collapses the whole type and would make `FieldElement` enforce nothing.

## 🎯 Depth and recursive types

Every path utility takes a trailing `Depth` parameter, default `6`:

```typescript
interface TreeNode {
  children: TreeNode[];
  name: string;
}

type P = AllPathsKeys<TreeNode>; // compiles; enumerated down to 6 levels
type Q = AllPaths<TreeNode, '', 3>; // shallower, cheaper to compute
```

Without the bound, a self-referential type raises `TS2589: Type instantiation is excessively
deep and possibly infinite`. Lower the depth if a large form type makes compilation slow.

## 📖 TypeScript support

Requires TypeScript 4.7+. Every exported type carries JSDoc with a worked example, and the
package ships type-level regression tests (`__tests__/*.test-d.ts`, run via `vitest --typecheck`).

## 📄 License

MIT License

## 🔗 Links

- [GitHub Repository](https://github.com/Ohh-889/skyroc-admin)
- [Issue Tracker](https://github.com/Ohh-889/skyroc-admin/issues)

# Changelog

## 0.2.0

一次以正确性为目标的整体重构。类型级回归测试（`__tests__/*.test-d.ts`）随本次一并加入，
下面每条修复都有对应断言守着。

### 破坏性变更

- **`Primitive` 收窄**：不再包含 `Date` 与 `Function`，只保留真正的 JS 原始类型。
  「递归时不要再往里展开」的语义改由新增的 `Atomic` 承担（含 `Date` / `RegExp` /
  `Error` / `Map` / `Set` / `WeakMap` / `WeakSet` / 函数）。
- **非法路径返回 `never`**：`PathValue`（原 `PathToType` 内部实现）、`ArrayKeys`、
  `ArrayElementValue` 的所有兜底分支由 `any` 改为 `never`。写错的路径、没有数组字段的类型
  会在编译期暴露，而不是静默放行。`T` 为 `any` 时仍整体短路成 `any`。
- **`PathToDeepType` 真正深度可选化**：此前内部映射漏了 `?` 修饰符，实际等价于
  `PathValue`，没有任何可选化效果。
- **Web 类型移至子路径**：`CustomElement`、`FieldElement` 从 `@skyroc/type-utils` 移到
  `@skyroc/type-utils/web`。根出口现在完全不依赖 DOM，可安全用于 React Native。
- **`CustomElement` / `FieldElement` 泛型默认值改为 `unknown`**：原先默认 `any`，
  交叉类型里的 `any` 会把整个类型塌成 `any`，使这两个类型形同虚设。
- **`AllPaths` 移除无用的 `Index` 泛型参数**：签名由
  `AllPaths<T, Index, P, Depth>` 变为 `AllPaths<T, P, Depth>`。该参数从未被传过非默认值。
- **移除 `Merge<T>`**：与 `Prettify<T>` 完全重复。
- **移除 `KeyToNestedObject<K, V>`**：与 `Wrap` + `ShapeFromPaths` 的能力重叠，无使用方。

### 修复

- `FunctionKeys<T>` 的映射写成了 `[K in keyof T]?:`，导致结果里混入 `undefined`
  （文档声称是 `'c' | 'd' | 'e'`，实际是 `'c' | 'd' | 'e' | undefined`）。
  `ArrayKeys` 存在同类问题，一并修正。
- `DeepPartial<T>` 用 `T[K] extends object` 判定，会把 `Date` 拆成一堆可选方法；
  数组则因同态映射把 `?` 施加到下标上，元素被污染成 `T | undefined`。
  现在停在 `Atomic`、保留元组形状与数组可变性、只对元素类型递归。
- `LeafPaths` 缺少深度守卫，递归类型（树形菜单等）直接触发 `TS2589`。
  现在与 `AllPaths` 一致，默认深度 6。
- 路径枚举遇到可选字段时会带出 `undefined`，现已通过 `-?` + `NonNullable` 消除。
- `ArrayKeys` 用 `readonly any[]` 判定而 `ArrayElementValue` 用 `(infer U)[]` 推断，
  对 `readonly` 数组两者不自洽（前者认可、后者返回 `any`）。
- 路径段 `'number'` 曾无条件当作数组下标，导致对象上真实存在的 `number` 字段被吞掉。
  现在真实字段优先，通配语义只在目标确实是数组时生效。
- `ShapeFromPaths` 对以下标结尾的路径（如 `'list.0'`）会产出 `never[]`，
  现在给出完整的元素类型。
- 全量修正 JSDoc 示例——原示例存在与实现不符的情况（如 `PathToType` 的示例字段与
  示例类型对不上）。

### 新增

- `Atomic`、`IsAny`、`IsTuple`、`ShallowPartial`、`UnionToIntersection`、`Join`、
  `PathValue` 转为公开导出，便于在外部组合出兼容的路径类型。
- 类型级回归测试与源码静态的平台边界守卫，通过 `pnpm test`（`vitest --typecheck`）运行。

### 内部

- `AllPathsKeys` 不再经由 `AllPathsShape` 的交叉类型绕一圈，直接等价于 `AllPaths`，
  少一套等价递归实现，编译开销减半。`AllPathsShape` 保留为 `AllPaths` 的派生别名。
- 源码按职责拆分为 `primitive.ts` / `object.ts` / `path.ts` / `fn.ts` / `web/form.ts`，
  取代原先名不副实的 `utility-types.ts`（只有 1 个类型）与 `utils.ts`（塞了 20 个类型）。
- `tsconfig.json` 改为继承 `@skyroc/tsconfig/library.json`，移除遗留的
  `jsxImportSource: "vue"` 与多余的 `types: ["node"]`。
- 构建改为双入口（根 + `web`）；移除无意义的 `shims`。产物 JS 仍为空文件，
  保留 esm/cjs 双格式仅为拿到配套的 `.d.ts` / `.d.cts`。

## 0.1.0

首个版本。

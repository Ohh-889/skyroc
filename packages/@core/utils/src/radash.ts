/**
 * Radash 转出白名单。
 *
 * 规则：**只转出 radash 的类型守卫族 + `assign`**，其余请直接 `import { ... } from 'radash'`。
 *
 * 之所以不再 `export * from 'radash'`：
 *
 * 1. 星号转出等于把第三方的全部 API 变成本包的公开契约，radash 发个 minor 就可能改动本包的 API 面；
 * 2. 上游一旦新增与本包同名的导出（如 `isNil` / `toArray`），ESM 会把歧义名从导出中剔除，直接变成构建期错误；
 * 3. Radash 自带 `get` / `set` / `crush` / `construct`，与本包的 `deepGet` / `deepSet` / `unflatten` 语义重叠，全量转出会让调用方不知道该用哪个。
 *
 * 类型守卫是例外：它们高频、零依赖、语义稳定，且散落在各处按需 import 反而更吵。
 */
export {
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
} from 'radash';

import { type NamePath, keyOfName } from '@skyroc/utils';

/**
 * 字段标记集合。
 *
 * 表单的 touched / dirty / validating / validated 这些「某个字段是否处于某状态」的记录， 统一用 `Set<string>` 存路径 key。这里是读侧的两个判定。
 *
 * 曾经放在 `@skyroc/utils` 的 path-utils 里，但它们是表单状态簿记而非通用路径工具 —— 通用包不该知道「touched」这种概念，所以下沉到 form-core。
 */

/** 指定字段是否已置位 */
export const isOn = (set: Set<string>, name: NamePath) => set.has(keyOfName(name));

/**
 * 任意一个字段是否已置位。
 *
 * `names` 缺省或为空数组时语义是「整个集合里有没有任何置位」，用于 `isFieldsTouched()` 这类无参调用。
 */
export const anyOn = (set: Set<string>, names?: NamePath[]) =>
  !names || names.length === 0 ? set.size > 0 : names.some(name => set.has(keyOfName(name)));

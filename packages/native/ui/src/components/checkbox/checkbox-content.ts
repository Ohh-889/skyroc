import { isNil } from '@skyroc/utils';
import type { ReactNode } from 'react';

/**
 * 判断一段 label / description 是否什么都不渲染。
 *
 * React 把 `null` / `undefined` / 布尔当作「不渲染」，`{cond && 'label'}` 落空时给的是 `false`；
 * 而 `0` 和 `''` 是合法文案，用 `!content` 判空会把它们一起吞掉，所以必须按取值类型区分。
 *
 * 调用方需要在渲染包裹层（Pressable、gap 容器）之前先问一次，否则会留下一个撑开 gap 的空节点。
 */
export function isEmptyContent(content: ReactNode): boolean {
  return isNil(content) || typeof content === 'boolean';
}

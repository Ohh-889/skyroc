import { getAtomValue, setAtomValue } from '@skyroc/core-state';
import type { Href } from 'expo-router';
import { atom } from 'jotai';

/**
 * 未登录时被拦下的深链目标，登录成功后重放。
 *
 * 刻意只放内存不落盘：它表达的是「用户刚刚点了这条链接」，冷启动后再重放一条上周的推送很怪。
 *
 * 用 atom 而不是模块级变量，是为了和 authAtom 一样能在 React 之外同步读写—— `+native-intent.ts` 在导航器挂载之前就跑了，那里没有 React。
 */
const pendingLinkAtom = atom<Href | null>(null);

export function setPendingLink(href: Href) {
  setAtomValue(pendingLinkAtom, href);
}

/** 取一次就清空，否则下次登录还会再跳一遍 */
export function consumePendingLink() {
  const href = getAtomValue(pendingLinkAtom);

  if (href) setAtomValue(pendingLinkAtom, null);

  return href;
}

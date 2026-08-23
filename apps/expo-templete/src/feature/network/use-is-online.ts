import { useAtomValue } from 'jotai';

import { isOnlineAtom } from './network-store';

/**
 * 当前是否有可用网络。
 *
 * 只用来做提示和降级（禁用提交按钮、把列表空态换成「等网络」），**不要**用它给请求加前置判断：
 * 它为 true 只代表连上了路由器 / 基站，不代表你的服务器能通。请求能不能成，最终只有请求本身说了算。
 */
export function useIsOnline() {
  return useAtomValue(isOnlineAtom);
}

import { getAtomValue, globalStore, setAtomValue } from '@skyroc/core-state';
import { addNetworkStateListener, getNetworkStateAsync } from 'expo-network';
import type { NetworkState } from 'expo-network';
import { atom } from 'jotai';

/**
 * 断网时的统一文案。
 *
 * 提示条和请求失败的 toast 共用一份：同一件事在两个地方换两种说法，用户会以为撞上了两个毛病。
 */
export const OFFLINE_MESSAGE = '网络连接已断开，请检查 WiFi 或蜂窝数据';

/**
 * 当前是否有可用网络。
 *
 * 初值给 `true` 而不是 `false`：冷启动时真实状态还没读回来，先当在线，最坏是多发一个立刻失败的请求； 反过来先当断网，会在每次启动时闪一条断网提示，还会让首屏的查询被 `onlineManager` 直接暂停。
 *
 * 和 `authAtom` 一个路子：请求层在 React 之外用 `getIsOnline()` 同步读，界面用 `useIsOnline()` 跟着重渲染，一份状态两条出口。
 */
export const isOnlineAtom = atom(true);

/**
 * 由系统上报的网络状态判断能不能发请求。
 *
 * 两个字段都用 `!== false` 而不是真值判断：它们都是可选的，某些设备 / 平台上会是 `undefined`， 那种「不知道」的情况必须当成在线——把未知判成断网，会让整个 App 在这些设备上彻底发不出请求。
 *
 * `isInternetReachable` 也一起看，是为了认出酒店 / 机场那种要先点同意才放行的 WiFi： 连是连上了（`isConnected` 为 true），但所有请求都会被网关劫持。安卓上它要求链路真的通过了
 * 校验（`NET_CAPABILITY_VALIDATED`），iOS 上它恒等于 `isConnected`。
 *
 * 万一你们的用户网络环境让这个字段误判太多（内网、特殊 APN），去掉后半段只看 `isConnected` 即可。
 */
function resolveIsOnline(state: NetworkState) {
  return state.isConnected !== false && state.isInternetReachable !== false;
}

/** React 之外同步读，请求层用它区分「断网」和「服务端挂了」 */
export function getIsOnline() {
  return getAtomValue(isOnlineAtom);
}

/** 订阅在线状态，返回退订函数。给 React 之外的消费者用（`onlineManager`），组件请用 `useIsOnline()`。 */
export function subscribeIsOnline(listener: (isOnline: boolean) => void) {
  return globalStore.sub(isOnlineAtom, () => listener(getIsOnline()));
}

/** 已经开始监听。根 layout 被重复求值（多入口、重挂）时不重复挂监听 */
let started = false;

/**
 * 开始监听网络状态，在根 layout 的模块顶层调一次。
 *
 * 监听器只在状态**变化**时回调，所以还要主动读一次当前状态打底，否则「一启动就没网」这种最该提示的 情况反而一条提示都不会有。
 */
export function startNetworkWatch() {
  if (started) return;

  started = true;

  // 事件比首次读取先到时，就别再用那个更旧的结果盖回去了
  let receivedEvent = false;

  function apply(state: NetworkState) {
    // 值没变时 jotai 自己就不会通知订阅者，这里不用再比一次
    setAtomValue(isOnlineAtom, resolveIsOnline(state));
  }

  addNetworkStateListener(state => {
    receivedEvent = true;

    apply(state);
  });

  getNetworkStateAsync()
    .then(state => {
      if (receivedEvent) return;

      apply(state);
    })
    .catch(() => {
      // 读不出来就维持「在线」这个乐观初值，别因为探测本身失败把 App 锁成离线
    });
}

import { QueryClientProvider, focusManager, onlineManager } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { PropsWithChildren } from 'react';
import { AppState } from 'react-native';
import type { AppStateStatus } from 'react-native';

import { getIsOnline, subscribeIsOnline } from '@/feature/network';
import { queryClient } from '@/service/queryClient';

/**
 * RN 里没有 window 的 focus 事件，`refetchOnWindowFocus` 默认永远不会触发。
 *
 * 把 AppState 喂给 focusManager，从后台切回前台时过期数据才会自己重新验证。
 */
function handleAppStateChange(status: AppStateStatus) {
  focusManager.setFocused(status === 'active');
}

/**
 * 同理，`onlineManager` 默认监听的是 `window.addEventListener('online')`——RN 的 window 上压根没有 addEventListener，那段 setup 直接返回
 * undefined，于是 onlineManager 永远认为在线。后果有两个， 而且都是静默的：断网时查询照发不误，只能干等到超时；`refetchOnReconnect` 也永远等不到重连事件。
 *
 * 接上真实网络状态后，这些是白拿的：
 *
 * - 断网时查询不再发出去，直接进 `paused`，用户点一下立刻有反馈，不用等十秒超时
 * - 恢复联网时暂停的查询自己接着跑，`refetchOnReconnect` 也跟着生效，不用手写「重连后刷新」
 *
 * 写在模块顶层而不是 useEffect 里：effect 要等首帧渲染完才跑，那时首屏的查询早就发出去了。
 */
onlineManager.setEventListener(setOnline => {
  // setup 时先同步一次当前值：订阅只在**变化**时回调，启动即断网的话不补这一下就永远是初值 true
  setOnline(getIsOnline());

  return subscribeIsOnline(setOnline);
});

/**
 * TanStack Query 根容器。
 *
 * QueryClient 本身在 `src/service/queryClient`：登出要清缓存，那件事发生在 React 之外。
 *
 * 网络状态的事实来源是 `feature/network`，这里只负责把它接到 onlineManager 上。
 */
export function QueryProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => subscription.remove();
  }, []);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

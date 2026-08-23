import { QueryClientProvider, focusManager } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { PropsWithChildren } from 'react';
import { AppState } from 'react-native';
import type { AppStateStatus } from 'react-native';

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
 * TanStack Query 根容器。
 *
 * QueryClient 本身在 `src/service/queryClient`：登出要清缓存，那件事发生在 React 之外。
 *
 * 断网重连后自动重试还需要把 `@react-native-community/netinfo` 接到 `onlineManager` 上，
 * 这个模板暂时没装该依赖，装了之后在这里补一段 `onlineManager.setEventListener` 即可。
 */
export function QueryProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => subscription.remove();
  }, []);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

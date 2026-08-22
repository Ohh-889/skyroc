import { QueryClient, QueryClientProvider, focusManager } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { PropsWithChildren } from 'react';
import { AppState } from 'react-native';
import type { AppStateStatus } from 'react-native';

/** 数据在 30 秒内视为新鲜，这段时间里重复挂载同一个列表不会重新发请求 */
const STALE_TIME = 30_000;

/**
 * RN 里没有 window 的 focus 事件，`refetchOnWindowFocus` 默认永远不会触发。
 *
 * 把 AppState 喂给 focusManager，从后台切回前台时过期数据才会自己重新验证。
 */
function handleAppStateChange(status: AppStateStatus) {
  focusManager.setFocused(status === 'active');
}

// RN 没有 SSR，不存在多个请求共用一份缓存的问题，模块级单例即可；
// 放进组件里反而会因为 Fast Refresh 重建实例，把已有缓存整个丢掉
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: STALE_TIME
    }
  }
});

/**
 * TanStack Query 根容器。
 *
 * 断网重连后自动重试还需要把 `@react-native-community/netinfo` 接到 `onlineManager` 上， 这个模板暂时没装该依赖，装了之后在这里补一段
 * `onlineManager.setEventListener` 即可。
 */
export function QueryProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => subscription.remove();
  }, []);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

import { createQueryClient } from '@skyroc/service/query';

function handleError(error: unknown) {
  if (__DEV__) {
    // oxlint-disable-next-line no-console
    console.warn('Query/Mutation error:', error);
  }
}

/**
 * 全局 QueryClient。
 *
 * 模块级单例：RN 没有 SSR，不存在多个请求共用一份缓存的问题；放进组件里反而会因为
 * Fast Refresh 重建实例，把已有缓存整个丢掉。
 *
 * 登出时必须 `queryClient.clear()`（见 `feature/auth/auth-store`），否则下一个账号会看到
 * 上一个账号的数据。
 */
export const queryClient = createQueryClient({
  defaultOptions: {
    queries: {
      // 从后台切回前台时重新验证过期数据。`focusManager` 的 AppState 接线在
      // feature/query/query-provider 里，缺了那一段这个开关不会生效
      refetchOnWindowFocus: true
    }
  },
  mutationCache: { onError: handleError },
  queryCache: { onError: handleError }
});

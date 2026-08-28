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
 * 模块级单例：RN 没有 SSR，不存在多个请求共用一份缓存的问题；放进组件里反而会因为 Fast Refresh 重建实例，把已有缓存整个丢掉。
 *
 * 登出时必须 `queryClient.clear()`（见 `feature/auth/auth-store`），否则下一个账号会看到 上一个账号的数据。
 */
export const queryClient = createQueryClient({
  defaultOptions: {
    mutations: {
      /**
       * 断网时 mutation 照发不误，让它当场失败。
       *
       * 默认的 `'online'` 会把 mutation 挂成 `paused` 等重连——查询这么做是对的（用户只是看不到新数据）， 但写操作这么做很坑：用户点了「登录」，按钮转着圈，没报错也没反应，因为请求根本没发出去。
       * 而 RN 上没网时请求是立刻失败的（不会耗满超时），当场弹一句「网络连接已断开」比无声挂起清楚得多。
       *
       * 要做「离线下单、恢复后自动补发」那种队列，再把这里改回 `'online'`，并配上 `persistQueryClient` —— 否则暂停中的 mutation 会随着 App 被杀一起消失。
       */
      networkMode: 'always'
    },
    queries: {
      // 从后台切回前台时重新验证过期数据。`focusManager` 的 AppState 接线在
      // feature/query/query-provider 里，缺了那一段这个开关不会生效
      refetchOnWindowFocus: true
    }
  },
  mutationCache: { onError: handleError },
  queryCache: { onError: handleError }
});

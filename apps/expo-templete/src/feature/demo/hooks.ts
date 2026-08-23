import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { InfiniteData, QueryClient } from '@tanstack/react-query';

import type { PageResult } from '@/feature/list';

import type { Message } from './mock-api';
import { fetchHomeSummary, fetchProfile, fetchUnreadCount, markAllMessagesRead, markMessagesRead } from './mock-api';

/**
 * 演示数据的 query key。
 *
 * 接上真后端之后，这些 key 跟着接口走、放 `src/service/api/<域>/keys.ts`；模板没有后端， 所以和 mock 一起收在 feature/demo 下，整份目录删掉就干净了。
 */
export const DEMO_QUERY_KEYS = {
  homeSummary: ['demo', 'home-summary'],
  messages: ['demo', 'messages'],
  profile: ['demo', 'profile'],
  unreadCount: ['demo', 'unread-count']
} as const;

/** 消息列表的缓存形态。`useInfiniteList` 把每一页原样存进 InfiniteData，改缓存时要照着这个结构走 */
type MessagePages = InfiniteData<PageResult<Message>, number>;

/** 首页首屏数据 */
export function useHomeSummaryQuery() {
  return useQuery({ queryFn: fetchHomeSummary, queryKey: DEMO_QUERY_KEYS.homeSummary });
}

/**
 * 未读数。tab 角标和消息页读的是同一个 query。
 *
 * 这是「服务端状态只放 TanStack Query」最直观的收益：标记已读后动一次缓存，tab bar 上的角标和 消息页的概览一起更新，两个页面之间不需要任何通信，也不存在第二份可能对不齐的状态。
 */
export function useUnreadCountQuery() {
  return useQuery({ queryFn: fetchUnreadCount, queryKey: DEMO_QUERY_KEYS.unreadCount });
}

/** 当前用户概览 */
export function useProfileQuery() {
  return useQuery({ queryFn: fetchProfile, queryKey: DEMO_QUERY_KEYS.profile });
}

/**
 * 把已读状态直接改进所有消息列表缓存里。
 *
 * 用 `setQueriesData` 而不是 `setQueryData`：列表的完整 key 还带着 `{ pageSize, params }`， 「全部 / 评论 / 赞 /
 * 系统」四个筛选各是一份缓存，只改当前那份的话，切个筛选就又变回未读了。
 */
function patchReadState(queryClient: QueryClient, match: (message: Message) => boolean) {
  queryClient.setQueriesData<MessagePages>({ queryKey: DEMO_QUERY_KEYS.messages }, previous => {
    if (!previous) return previous;

    return {
      ...previous,
      pages: previous.pages.map(page => ({
        ...page,
        items: page.items.map(item => (match(item) ? { ...item, read: true } : item))
      }))
    };
  });
}

/** 乐观更新的现场快照，出错时按原样放回去 */
function snapshotMessages(queryClient: QueryClient) {
  return {
    lists: queryClient.getQueriesData<MessagePages>({ queryKey: DEMO_QUERY_KEYS.messages }),
    unread: queryClient.getQueryData<number>(DEMO_QUERY_KEYS.unreadCount)
  };
}

/** 还原快照 */
function restoreMessages(queryClient: QueryClient, snapshot: ReturnType<typeof snapshotMessages>) {
  snapshot.lists.forEach(([key, data]) => queryClient.setQueryData(key, data));

  queryClient.setQueryData(DEMO_QUERY_KEYS.unreadCount, snapshot.unread);
}

/**
 * 标记已读。
 *
 * 走乐观更新而不是「等接口回来再 invalidate」：重拉一页要一个网络往返，那段时间里用户点下去 是没有任何反馈的，会以为没点上而反复点。失败时用 onMutate 存下的快照整体回滚。
 *
 * `onSettled` 里再 invalidate 一次是必须的——乐观更新只是把客户端猜的结果先画上去，最终以服务端为准。
 */
export function useMarkMessagesReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markMessagesRead,
    onError: (_error, _ids, context) => {
      if (context) restoreMessages(queryClient, context);
    },
    onMutate: async (ids: string[]) => {
      // 先停掉在途的重拉，否则它带着旧数据后到，会把刚画上去的已读盖回去
      await queryClient.cancelQueries({ queryKey: DEMO_QUERY_KEYS.messages });

      const snapshot = snapshotMessages(queryClient);

      const target = new Set(ids);

      patchReadState(queryClient, message => target.has(message.id) && !message.read);

      queryClient.setQueryData<number>(DEMO_QUERY_KEYS.unreadCount, previous =>
        previous === undefined ? previous : Math.max(0, previous - ids.length)
      );

      return snapshot;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: DEMO_QUERY_KEYS.messages });
      queryClient.invalidateQueries({ queryKey: DEMO_QUERY_KEYS.unreadCount });
    }
  });
}

/** 全部标为已读。同样先乐观更新，失败回滚 */
export function useMarkAllMessagesReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllMessagesRead,
    onError: (_error, _variables, context) => {
      if (context) restoreMessages(queryClient, context);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: DEMO_QUERY_KEYS.messages });

      const snapshot = snapshotMessages(queryClient);

      patchReadState(queryClient, message => !message.read);

      queryClient.setQueryData<number>(DEMO_QUERY_KEYS.unreadCount, 0);

      return snapshot;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: DEMO_QUERY_KEYS.messages });
      queryClient.invalidateQueries({ queryKey: DEMO_QUERY_KEYS.unreadCount });
    }
  });
}

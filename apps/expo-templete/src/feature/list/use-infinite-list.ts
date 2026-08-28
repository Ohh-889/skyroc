import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import type { InfiniteData, QueryKey } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import type { ListProps, ListStatus, PageParams, PageResult } from './types';

const DEFAULT_PAGE_SIZE = 10;

/** UseInfiniteList 配置 */
export interface UseInfiniteListOptions<TItem, TParams extends object> {
  /** 是否发起请求，false 时挂起；依赖别的数据才能查询时用 */
  enabled?: boolean;

  /** 每页条数，默认 10 */
  pageSize?: number;

  /** 业务查询参数。它会并进 queryKey，所以筛选条件一变就会自动重新从第一页拉 */
  params?: TParams;

  /** 缓存 key 前缀，最终 key 是 `[...queryKey, { pageSize, params }]` */
  queryKey: QueryKey;

  /** 分页请求。失败必须 throw —— 把错误塞在返回值字段里的封装要在这里转成异常，否则错误态永远不会出现 */
  request: (params: PageParams & TParams) => Promise<PageResult<TItem>>;
}

/** 可直接展开给 `<List>` 的属性 */
export type InfiniteListProps<TItem> = Required<
  Pick<ListProps<TItem>, 'data' | 'isEnd' | 'isFetchingMore' | 'onLoadMore' | 'onRefresh' | 'onRetry' | 'status'>
> & {
  /** 下拉刷新中 */
  refreshing: boolean;
};

/**
 * 分页列表数据源。
 *
 * 相比手写的 pageNum + items 累加，这里几件事是白拿的：
 *
 * - 是否还有下一页由 `getNextPageParam` 决定，不再有「总页数还没回来就把 isEnd 判成 true」
 * - Params 进 queryKey，切筛选条件自动重置到第一页，也不会出现旧参数的响应后到覆盖新数据
 * - 页数据由缓存持有，不需要手写 `[...state.items, ...data.items]`，重复追加和竞态一起消失
 * - 请求状态由库维护，不存在某个错误分支忘了关 loading 就把整个列表卡死
 */
export function useInfiniteList<TItem, TParams extends object = Record<string, never>>(
  options: UseInfiniteListOptions<TItem, TParams>
) {
  const { enabled = true, pageSize = DEFAULT_PAGE_SIZE, params, queryKey, request } = options;

  const queryClient = useQueryClient();

  // queryKey / params 多半是调用处的内联字面量，每次渲染都是新引用。
  // TanStack 内部对 key 做结构化哈希不受影响，但下面几个 useCallback 会跟着抖，所以用序列化结果做依赖。
  const serializedKey = JSON.stringify([queryKey, params, pageSize]);

  const listQueryKey = useMemo(() => [...queryKey, { pageSize, params }], [serializedKey]);

  // 显式写全泛型：queryKey 是 QueryKey 这种宽类型时，TS 推不出 TQueryFnData，lastPage / page 会退化成 unknown
  const query = useInfiniteQuery<PageResult<TItem>, Error, InfiniteData<PageResult<TItem>, number>, QueryKey, number>({
    enabled,
    // 返回 undefined 即代表没有下一页，hasNextPage 随之为 false
    getNextPageParam: lastPage => (lastPage.pageNum < lastPage.pages ? lastPage.pageNum + 1 : undefined),
    initialPageParam: 1,
    queryFn: ({ pageParam }) => request({ ...params, pageNum: pageParam, pageSize } as PageParams & TParams),
    queryKey: listQueryKey
  });

  const { fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = query;

  const items = useMemo(() => query.data?.pages.flatMap(page => page.items) ?? [], [query.data]);

  const total = query.data?.pages.at(-1)?.total ?? 0;

  /**
   * 下拉刷新。
   *
   * V5 拿掉了 `refetch({ refetchPage })`，直接 refetch 会把已加载的每一页都重拉一遍 —— 翻到第 8 页再下拉就是 8 个并发请求。 这里先把缓存截断到第一页再
   * refetch：只发一个请求，且第一页数据全程可见，不会闪一下空列表。
   *
   * 不用 `maxPages` 限制页数，那个选项会在往下翻时把最前面的页丢掉，列表顶部的数据会凭空消失。
   */
  const refresh = useCallback(async () => {
    queryClient.setQueryData<InfiniteData<PageResult<TItem>, number>>(listQueryKey, previous =>
      previous ? { pageParams: previous.pageParams.slice(0, 1), pages: previous.pages.slice(0, 1) } : previous
    );

    await refetch();
  }, [listQueryKey, queryClient, refetch]);

  const loadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const retry = useCallback(() => {
    refetch();
  }, [refetch]);

  /** 局部改某几条数据，用于点赞、已读这类不必重拉整页的场景 */
  const updateItem = useCallback(
    (match: (item: TItem) => boolean, updater: (item: TItem) => TItem) => {
      queryClient.setQueryData<InfiniteData<PageResult<TItem>, number>>(listQueryKey, previous => {
        if (!previous) return previous;

        // previous.pages 是「已加载的分页数组」，page.pages 是「后端返回的总页数」，同名不同义
        return {
          ...previous,
          pages: previous.pages.map(page => ({
            ...page,
            items: page.items.map(item => (match(item) ? updater(item) : item))
          }))
        };
      });
    },
    [listQueryKey, queryClient]
  );

  function resolveStatus(): ListStatus {
    // 必须排在 loading 前面：断网时 status 也是 pending（请求压根没发出去，谈不上成功失败），
    // 只有 fetchStatus 会告诉你它是被 onlineManager 按住了，不判这一下就是一个永远转圈的 loading。
    // 已经有数据时 status 是 success，落不到这里——后台刷新被暂停不该把整页替换成断网提示
    if (query.status === 'pending' && query.fetchStatus === 'paused') return 'offline';

    if (query.status === 'pending') return 'loading';

    if (query.status === 'error') return 'error';

    return 'success';
  }

  const listProps: InfiniteListProps<TItem> = {
    data: items,
    isEnd: !hasNextPage,
    isFetchingMore: isFetchingNextPage,
    onLoadMore: loadMore,
    onRefresh: refresh,
    onRetry: retry,
    // isRefetching 在加载下一页时同样为 true，不排掉的话往下翻页会把下拉刷新的转圈也带出来
    refreshing: query.isRefetching && !isFetchingNextPage,
    status: resolveStatus()
  };

  return {
    /** 拍平后的全部条目 */
    items,
    /** 直接展开给 `<List>` */
    listProps,
    /** 加载下一页；已到底或正在加载时是空操作 */
    loadMore,
    /** 原始 query，需要 isStale / dataUpdatedAt 之类的细节时用 */
    query,
    /** 等价于下拉刷新：截断到第一页再重拉 */
    refresh,
    /** 失败后重试 */
    retry,
    /** 总条数，来自最后一页响应的 total 字段，不是已加载条数 */
    total,
    updateItem
  };
}

/** UseInfiniteList 返回值 */
export type UseInfiniteListResult<TItem> = ReturnType<typeof useInfiniteList<TItem>>;

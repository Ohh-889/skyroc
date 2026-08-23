import type { FlashListRef } from '@shopify/flash-list';
import { useImperativeHandle, useRef } from 'react';
import type { Ref } from 'react';

import { List } from './List';
import type { ListProps } from './types';
import { useInfiniteList } from './use-infinite-list';
import type { UseInfiniteListOptions, UseInfiniteListResult } from './use-infinite-list';

/** 由 useInfiniteList 接管、不再由外部传入的属性 */
type ManagedListProps =
  | 'data'
  | 'isEnd'
  | 'isFetchingMore'
  | 'onLoadMore'
  | 'onRefresh'
  | 'onRetry'
  | 'ref'
  | 'refreshing'
  | 'status';

/**
 * QueryList 通过 ref 抛出的句柄。
 *
 * 数据在组件内部，页面拿不到；抛出来之后头部的刷新按钮、编辑弹窗回来改一条、提交筛选后回到顶部这些事， 都不用把整页降级成 `useInfiniteList` + `List`。
 */
export interface QueryListHandle<TItem> {
  /** 已加载的全部条目 */
  readonly items: TItem[];

  /** 底层 FlashList，scrollToIndex / scrollToOffset 这些命令式方法从这里拿 */
  readonly list: FlashListRef<TItem> | null;

  /** 加载下一页；已到底或正在加载时是空操作 */
  loadMore: () => void;

  /** 原始 query，需要 isStale / dataUpdatedAt 之类的细节时用 */
  readonly query: UseInfiniteListResult<TItem>['query'];

  /** 等价于下拉刷新：截断到第一页再重拉，只发一个请求 */
  refresh: () => Promise<void>;

  /** 失败后重试 */
  retry: () => void;

  /** 滚回顶部，换筛选条件后常用 */
  scrollToTop: (animated?: boolean) => void;

  /** 总条数，来自最后一页响应的 total 字段，不是已加载条数 */
  readonly total: number;

  /** 局部改已加载的数据，不重新请求 */
  updateItem: (match: (item: TItem) => boolean, updater: (item: TItem) => TItem) => void;
}

/** QueryList 组件属性 */
export interface QueryListProps<TItem, TParams extends object>
  extends Omit<ListProps<TItem>, ManagedListProps>,
    UseInfiniteListOptions<TItem, TParams> {
  /** 命令式句柄，见 `QueryListHandle` */
  ref?: Ref<QueryListHandle<TItem>>;
}

/**
 * 全托管分页列表：`useInfiniteList` + `<List>`，只关心「怎么请求」和「怎么渲染一条」。
 *
 * ```tsx
 * const listRef = useRef<QueryListHandle<Order>>(null);
 *
 * <Button onPress={() => listRef.current?.refresh()}>刷新</Button>
 *
 * <QueryList
 *   ref={listRef}
 *   separator
 *   params={{ status }}
 *   queryKey={['order', 'list']}
 *   request={fetchOrderList}
 *   renderItem={({ item }) => <OrderCard data={item} />}
 * />
 * ```
 *
 * 页面要把列表数据参与渲染（头部显示总数、和别的数据联动）时，ref 就不够了 —— 那是渲染期的依赖， 换成 `useInfiniteList` + `<List
 * {...listProps} />`，UI 一行都不用重写。
 */
export const QueryList = <TItem, TParams extends object = Record<string, never>>(
  props: QueryListProps<TItem, TParams>
) => {
  const { enabled, pageSize, params, queryKey, ref, request, ...rest } = props;

  const result = useInfiniteList<TItem, TParams>({ enabled, pageSize, params, queryKey, request });

  const listRef = useRef<FlashListRef<TItem>>(null);

  /**
   * 句柄本身保持同一个对象，值通过 ref 现取。
   *
   * 不写依赖数组的话每次渲染都换一个新句柄，父组件把它存进 state 或塞进别的 ref 就会拿到过期快照； 依赖写全了又等于每次渲染都重建，一样的问题。所以这里让方法和 getter
   * 都走 latest.current，句柄只建一次。
   */
  const latest = useRef(result);

  latest.current = result;

  useImperativeHandle(
    ref,
    () => ({
      get items() {
        return latest.current.items;
      },
      get list() {
        return listRef.current;
      },
      loadMore: () => latest.current.loadMore(),
      get query() {
        return latest.current.query;
      },
      refresh: () => latest.current.refresh(),
      retry: () => latest.current.retry(),
      scrollToTop: (animated = true) => listRef.current?.scrollToTop({ animated }),
      get total() {
        return latest.current.total;
      },
      updateItem: (match, updater) => latest.current.updateItem(match, updater)
    }),
    []
  );

  return (
    <List<TItem>
      {...result.listProps}
      {...rest}
      ref={listRef}
    />
  );
};

import { List } from './List';
import type { ListProps } from './types';
import { useInfiniteList } from './use-infinite-list';
import type { UseInfiniteListOptions } from './use-infinite-list';

/** 由 useInfiniteList 接管、不再由外部传入的属性 */
type ManagedListProps = 'data' | 'isEnd' | 'isFetchingMore' | 'onLoadMore' | 'onRefresh' | 'onRetry' | 'refreshing' | 'status';

/** QueryList 组件属性 */
export interface QueryListProps<TItem, TParams extends object>
  extends Omit<ListProps<TItem>, ManagedListProps>,
    UseInfiniteListOptions<TItem, TParams> {}

/**
 * 全托管分页列表：`useInfiniteList` + `<List>`，只关心「怎么请求」和「怎么渲染一条」。
 *
 * ```tsx
 * <QueryList
 *   separator
 *   params={{ status }}
 *   queryKey={['order', 'list']}
 *   request={fetchOrderList}
 *   renderItem={({ item }) => <OrderCard data={item} />}
 * />
 * ```
 *
 * 需要拿到列表数据本身（头部显示总数、外部按钮改某一条、和别的数据联动）就别用它， 换成 `useInfiniteList` + `<List {...listProps}
 * />`，UI 一行都不用重写。
 */
export const QueryList = <TItem, TParams extends object = Record<string, never>>(
  props: QueryListProps<TItem, TParams>
) => {
  const { enabled, pageSize, params, queryKey, request, ...rest } = props;

  const { listProps } = useInfiniteList<TItem, TParams>({ enabled, pageSize, params, queryKey, request });

  return (
    <List<TItem>
      {...listProps}
      {...rest}
    />
  );
};

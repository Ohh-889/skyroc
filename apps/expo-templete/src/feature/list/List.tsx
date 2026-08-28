import { FlashList } from '@shopify/flash-list';
import type { FlashListProps, FlashListRef } from '@shopify/flash-list';
import { Divider } from '@skyroc/native-ui';
import { cn } from '@skyroc/utils';
import type { ReactNode, Ref } from 'react';
import { useCallback } from 'react';
import { withUniwind } from 'uniwind';

import { listVariants } from './list-variants';
import { ListFooter } from './ListFooter';
import { ListPlaceholder } from './ListPlaceholder';
import type { ListProps } from './types';

/** 触底阈值：留出接近一屏的余量，慢速滚动也来得及把下一页补上 */
const END_REACHED_THRESHOLD = 0.4;

const DEFAULT_KEY_FIELD = 'id';

/**
 * FlashList 不认 className，用 uniwind 的 HOC 把 className / contentContainerClassName 翻成 style / contentContainerStyle。
 *
 * 用手动映射而不是自动模式（`withUniwind(FlashList)`），差别在结果的引用稳定性：自动模式每次渲染都把 解析结果重新包一层数组（`style: [styles]`），引用每次都变；手动模式在没有同名 style
 * 时直接把 uniwind 缓存里的那个对象交出去，className 字符串不变就一直是同一个引用。 FlashList v2 的条目是回收复用的，官方明确要求传进去的属性尽量 memo，能少抖一个是一个。
 *
 * （v2.0.x 时这里还是必须的：那会儿 FlashList 用对象展开吃 style，喂数组会静默丢掉整份样式。 2.1 起改成了数组写法，所以现在只是取舍，不再是硬约束。）
 */
const UniwindFlashList = withUniwind(FlashList, {
  contentContainerStyle: { fromClassName: 'contentContainerClassName' },
  style: { fromClassName: 'className' }
}) as unknown as <TItem>(props: FlashListProps<TItem> & { ref?: Ref<FlashListRef<TItem>> }) => ReactNode;

/**
 * 受控列表底座，本身不认识分页 —— 它只认 status / isEnd / isFetchingMore 这几个标志位。
 *
 * 数据从哪来都行：静态数组直接传 data 即可；接分页用 `useInfiniteList` 把 `listProps` 展开进来， 全托管场景直接用 `QueryList`。
 *
 * 空态、错误态、首屏加载都走 ListEmptyComponent 而不是提前 return，所以下拉刷新和滚动位置在任何状态下都还在。
 *
 * 底层是 FlashList v2：只跑在新架构上，纯 JS 没有原生模块（装完不用重新出 dev build）， 也不再需要 v1 的 `estimatedItemSize` —— 尺寸它自己量。代价是条目会被回收复用， 条目内部的
 * `useState` 要按需换成 `useRecyclingState` / `useLayoutState`，否则滚过去再滚回来会看到别人的状态。
 */
export const List = <TItem,>(props: ListProps<TItem>) => {
  const {
    className,
    classNames,
    collapsed = false,
    contentContainerClassName,
    data,
    emptyText,
    errorText,
    isEnd = false,
    isFetchingMore = false,
    keyField = DEFAULT_KEY_FIELD as keyof TItem,
    offlineText,
    onExpand,
    onLoadMore,
    onRetry,
    renderFooter,
    renderPlaceholder,
    separator = false,
    status = 'success',
    ...rest
  } = props;

  const count = data?.length ?? 0;

  const variantSlots = listVariants({ empty: count === 0 });

  const separatorClassName = cn(variantSlots.separator(), classNames?.separator);

  /**
   * 分割线组件必须保持引用稳定。
   *
   * 写成内联箭头的话每次渲染都是一个新组件类型，React 会把所有分割线卸载重建。
   */
  const renderSeparator = useCallback(() => <Divider className={separatorClassName} />, [separatorClassName]);

  function getItemKey(item: TItem, index: number) {
    const key = (item as Record<string, unknown> | null)?.[keyField as string];

    // 只在真的取不到时才回退到下标：id 为 0 或空字符串也是合法 key，用 falsy 判断会把它们误判成缺失
    return key === undefined || key === null ? String(index) : String(key);
  }

  /** 触底加载的唯一入口，守卫集中在这里，调用方不需要在 onLoadMore 里再判一次 */
  function handleEndReached() {
    if (collapsed || isEnd || isFetchingMore || count === 0 || status !== 'success') return;

    onLoadMore?.();
  }

  function renderFooterContent() {
    const context = { collapsed, count, isEnd, isFetchingMore };

    if (renderFooter) return renderFooter(context);

    return (
      <ListFooter
        {...context}
        className={cn(variantSlots.footer(), classNames?.footer)}
        onExpand={onExpand}
      />
    );
  }

  function renderPlaceholderContent() {
    const context = { emptyText, errorText, offlineText, onRetry, status };

    if (renderPlaceholder) return renderPlaceholder(context);

    return (
      <ListPlaceholder
        {...context}
        className={cn(variantSlots.placeholder(), classNames?.placeholder)}
      />
    );
  }

  return (
    <UniwindFlashList<TItem>
      {...rest}
      data={data}
      keyExtractor={getItemKey}
      ListEmptyComponent={renderPlaceholderContent()}
      ListFooterComponent={renderFooterContent()}
      onEndReached={handleEndReached}
      onEndReachedThreshold={END_REACHED_THRESHOLD}
      className={cn(variantSlots.root(), classNames?.root, className)}
      contentContainerClassName={cn(variantSlots.content(), classNames?.content, contentContainerClassName)}
      ItemSeparatorComponent={separator ? renderSeparator : null}
    />
  );
};

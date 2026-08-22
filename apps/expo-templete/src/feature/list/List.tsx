import { Divider } from '@skyroc/native-ui';
import { cn } from '@skyroc/utils';
import { useCallback } from 'react';
import { FlatList } from 'react-native';

import { listVariants } from './list-variants';
import { ListFooter } from './ListFooter';
import { ListPlaceholder } from './ListPlaceholder';
import type { ListProps } from './types';

/** 触底阈值：留出接近一屏的余量，慢速滚动也来得及把下一页补上 */
const END_REACHED_THRESHOLD = 0.4;

const DEFAULT_KEY_FIELD = 'id';

/**
 * 受控列表底座，本身不认识分页 —— 它只认 status / isEnd / isFetchingMore 这几个标志位。
 *
 * 数据从哪来都行：静态数组直接传 data 即可；接分页用 `useInfiniteList` 把 `listProps` 展开进来， 全托管场景直接用 `QueryList`。
 *
 * 空态、错误态、首屏加载都走 ListEmptyComponent 而不是提前 return，所以下拉刷新和滚动位置在任何状态下都还在。
 *
 * 底层用 RN 自带的 FlatList，模板不引入原生依赖。数据量大到需要 FlashList 时，把这里的 import 换掉即可 —— 对外的属性名（data / renderItem / ListEmptyComponent /
 * ListFooterComponent）两边是一致的。
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
    const context = { emptyText, errorText, onRetry, status };

    if (renderPlaceholder) return renderPlaceholder(context);

    return (
      <ListPlaceholder
        {...context}
        className={cn(variantSlots.placeholder(), classNames?.placeholder)}
      />
    );
  }

  return (
    <FlatList
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

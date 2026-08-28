import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cn } from '@skyroc/utils';
import { View } from 'react-native';
import { Button } from '../button/Button';
import { Text } from '../text/Typography';
import { paginationVariants } from './pagination-variants';
import type { PaginationPageItem, PaginationProps } from './types';
import { getPageCount, getPageItems } from './utils';

/**
 * 分页组件。
 *
 * 页码由 `totalItems / itemsPerPage` 推出，组件只持有当前页；受控用法传 `page` + `onPageChange`， 非受控传 `defaultPage`。
 *
 * 页码列表的折叠规则见 `getPageItems`。`mode="simple"` 只保留「当前页/总页数」文本， 此时不计算页码列表。
 *
 * @example
 *   ```tsx
 *   <Pagination totalItems={120} itemsPerPage={10} showEdges />
 *
 *   <Pagination mode="simple" page={page} totalItems={120} onPageChange={setPage} />
 *   ```;
 */
const Pagination = (props: PaginationProps) => {
  const {
    className,
    classNames,
    defaultPage = 1,
    disabled = false,
    itemsPerPage = 10,
    mode = 'multi',
    next = 'Next',
    onPageChange,
    page: pageProp,
    prev = 'Prev',
    ref,
    showEdges = false,
    siblingCount = 1,
    totalItems = 0,
    ...rest
  } = props;

  const [page, setPage] = useControllableState({
    caller: 'Pagination',
    defaultProp: defaultPage,
    onChange: onPageChange,
    prop: pageProp
  });

  const variantSlots = paginationVariants();

  const pageCount = getPageCount(totalItems, itemsPerPage);

  /**
   * 数据量变小（改筛选条件是最常见的情形）会让外部持有的页码越界，渲染前先夹回合法区间。
   *
   * 只夹显示值、不回写状态：受控用法里组件写回去、调用方又传回来，两边会来回打架。
   */
  const currentPage = Math.min(Math.max(page, 1), pageCount);

  const isFirst = currentPage <= 1;
  const isLast = currentPage >= pageCount;

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      content: cn(variantSlots.content(), classNames?.content),
      desc: cn(variantSlots.desc(), classNames?.desc),
      ellipsis: cn(variantSlots.ellipsis(), classNames?.ellipsis),
      navButton: cn(variantSlots.navButton(), classNames?.navButton),
      root: cn(variantSlots.root(), className, classNames?.root),
      simple: cn(variantSlots.simple(), classNames?.simple)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  const pages = mode === 'simple' ? [] : getPageItems(currentPage, { pageCount, showEdges, siblingCount });

  function handlePrev() {
    if (isFirst || disabled) return;

    setPage(currentPage - 1);
  }

  function handleNext() {
    if (isLast || disabled) return;

    setPage(currentPage + 1);
  }

  function handlePagePress(value: number) {
    if (disabled) return;

    setPage(value);
  }

  function renderPageItem(item: PaginationPageItem, index: number) {
    if (item.type === 'ellipsis') {
      return (
        <View
          key={`ellipsis-${index}`}
          className={slotClassNames.ellipsis}
        >
          <Text className={slotClassNames.desc}>...</Text>
        </View>
      );
    }

    const isActive = item.value === currentPage;
    const itemSlots = paginationVariants({ active: isActive });

    return (
      <Button
        key={item.value}
        // Button 自己只给 busy / disabled，当前页这层身份得在这里补，否则读屏念不出「第几页是当前页」
        accessibilityState={{ disabled, selected: isActive }}
        className={cn(itemSlots.item(), classNames?.item)}
        classNames={{ text: cn(itemSlots.itemText(), classNames?.itemText) }}
        color={isActive ? 'primary' : 'muted'}
        disabled={disabled}
        size="sm"
        variant={isActive ? 'solid' : 'ghost'}
        onPress={() => handlePagePress(item.value)}
      >
        {item.value}
      </Button>
    );
  }

  return (
    <View
      ref={ref}
      className={slotClassNames.root}
      {...rest}
    >
      <View className={slotClassNames.content}>
        <Button
          className={slotClassNames.navButton}
          color="muted"
          disabled={isFirst || disabled}
          size="sm"
          variant="ghost"
          onPress={handlePrev}
        >
          {prev}
        </Button>

        {mode === 'simple' ? (
          <View className={slotClassNames.simple}>
            <Text className={slotClassNames.desc}>
              {currentPage}/{pageCount}
            </Text>
          </View>
        ) : (
          pages.map((item, index) => renderPageItem(item, index))
        )}

        <Button
          className={slotClassNames.navButton}
          color="muted"
          disabled={isLast || disabled}
          size="sm"
          variant="ghost"
          onPress={handleNext}
        >
          {next}
        </Button>
      </View>
    </View>
  );
};

export { Pagination };

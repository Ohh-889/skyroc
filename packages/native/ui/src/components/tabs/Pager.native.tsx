import { cn } from '@skyroc/utils';
import { useEffect, useRef } from 'react';
import { View } from 'react-native';
import PagerView from 'react-native-pager-view';
import type { PagerViewOnPageSelectedEvent } from 'react-native-pager-view';
import { PanelStack } from './PanelStack';
import { tabsVariants } from './tabs-variants';
import type { PagerProps } from './types';
import { useLazyPanels } from './use-lazy-panels';

/**
 * 原生实现 —— 开启 `swipeable` 时使用 PagerView 提供手势翻页。
 *
 * 注意：`swipeable` 会在 PagerView 与 PanelStack 两棵树之间切换，导致面板整体重挂载。该 prop 应视为初始化配置，不要在运行时来回切。
 */
const Pager = (props: PagerProps) => {
  const { activeIndex, classNames, items, lazy, lazyPreloadDistance, onPageChange, renderLazyPlaceholder, swipeable } =
    props;

  const pagerRef = useRef<PagerView>(null);

  const renderPanel = useLazyPanels({
    activeIndex,
    lazy,
    lazyPreloadDistance,
    renderLazyPlaceholder,
    total: items.length
  });

  const variantSlots = tabsVariants();

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      content: cn(variantSlots.content(), classNames?.content)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  useEffect(() => {
    if (!swipeable) return;

    pagerRef.current?.setPage(activeIndex);
  }, [activeIndex, swipeable]);

  /** 从 target 起沿 direction 找到第一个可用 tab，找不到则退回当前索引 */
  function findNearestEnabled(target: number, direction: number): number {
    let index = target;

    while (index >= 0 && index < items.length) {
      if (!items[index]?.disabled) return index;

      index += direction;
    }

    return activeIndex;
  }

  function handlePageSelected(event: PagerViewOnPageSelectedEvent) {
    const { position } = event.nativeEvent;

    if (!items[position]?.disabled) {
      onPageChange(position);
      return;
    }

    // 落到 disabled 页：沿滑动方向回弹到最近的可用页。
    // 此处只调 setPage，回弹本身会再触发一次 onPageSelected 并走上面的正常分支，
    // 避免同一次回弹重复通知外部。
    const direction = position > activeIndex ? 1 : -1;

    pagerRef.current?.setPage(findNearestEnabled(position + direction, direction));
  }

  if (!swipeable) {
    return (
      <PanelStack
        activeIndex={activeIndex}
        classNames={classNames}
        items={items}
        renderPanel={renderPanel}
      />
    );
  }

  return (
    <PagerView
      ref={pagerRef}
      initialPage={activeIndex}
      onPageSelected={handlePageSelected}
      style={{ flex: 1 }}
    >
      {items.map((item, index) => (
        <View
          key={item.key}
          className={slotClassNames.content}
        >
          {renderPanel(index, item.children)}
        </View>
      ))}
    </PagerView>
  );
};

export { Pager };

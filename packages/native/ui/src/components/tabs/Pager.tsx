import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { cn } from '@skyroc/utils';
import { tabsVariants } from './tabs-variants';
import type { PagerProps } from './types';

/** 计算预加载范围内的索引集合 */
function getPreloadRange(activeIndex: number, distance: number, total: number): Set<number> {
  const set = new Set<number>();
  const lo = Math.max(0, activeIndex - distance);
  const hi = Math.min(total - 1, activeIndex + distance);
  for (let i = lo; i <= hi; i += 1) {
    set.add(i);
  }
  return set;
}

/** Web fallback — no PagerView, uses display switching only */
const Pager = (props: PagerProps) => {
  const {
    activeIndex,
    classNames,
    items,
    lazy,
    lazyPreloadDistance,
    onPageChange: _onPageChange,
    renderLazyPlaceholder,
    swipeable: _swipeable
  } = props;

  const [loadedIndices, setLoadedIndices] = useState<Set<number>>(() =>
    lazy ? getPreloadRange(activeIndex, lazyPreloadDistance, items.length) : new Set<number>()
  );

  const slots = tabsVariants();

  useEffect(() => {
    if (!lazy) return;

    setLoadedIndices(prev => {
      const range = getPreloadRange(activeIndex, lazyPreloadDistance, items.length);
      let hasNew = false;

      range.forEach(i => {
        if (!prev.has(i)) hasNew = true;
      });

      if (!hasNew) return prev;

      const next = new Set(prev);
      range.forEach(i => next.add(i));
      return next;
    });
  }, [activeIndex, lazy, lazyPreloadDistance, items.length]);

  function renderScene(index: number, children: React.ReactNode) {
    if (!lazy) return children;
    if (loadedIndices.has(index)) return children;
    return renderLazyPlaceholder();
  }

  return (
    <View
      className={cn(slots.pager(), classNames?.pager)}
      style={{ flex: 1 }}
    >
      {items.map((item, index) => (
        <View
          key={item.key}
          className={cn(slots.content(), classNames?.content)}
          style={{ display: index === activeIndex ? 'flex' : 'none', flex: 1 }}
        >
          {renderScene(index, item.children)}
        </View>
      ))}
    </View>
  );
};

export { Pager };

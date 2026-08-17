import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { LazyPanelsOptions, RenderPanel } from './types';

/** 计算预加载范围内的索引集合 */
function getPreloadRange(activeIndex: number, distance: number, total: number): Set<number> {
  const range = new Set<number>();
  const start = Math.max(0, activeIndex - distance);
  const end = Math.min(total - 1, activeIndex + distance);

  for (let index = start; index <= end; index += 1) {
    range.add(index);
  }

  return range;
}

/**
 * 面板懒加载渲染器。
 *
 * 索引一旦进入预加载范围就被标记为已加载，此后**常驻不卸载**（keep-alive 语义）：切走的面板只是被外层容器隐藏，其内部 state 与滚动位置得以保留。
 */
const useLazyPanels = (options: LazyPanelsOptions): RenderPanel => {
  const { activeIndex, lazy, lazyPreloadDistance, renderLazyPlaceholder, total } = options;

  const [loadedIndices, setLoadedIndices] = useState<Set<number>>(() =>
    lazy ? getPreloadRange(activeIndex, lazyPreloadDistance, total) : new Set<number>()
  );

  useEffect(() => {
    if (!lazy) return;

    setLoadedIndices(prev => {
      const range = getPreloadRange(activeIndex, lazyPreloadDistance, total);
      const hasNew = [...range].some(index => !prev.has(index));

      if (!hasNew) return prev;

      return new Set([...prev, ...range]);
    });
  }, [activeIndex, lazy, lazyPreloadDistance, total]);

  return function renderPanel(index: number, children: ReactNode) {
    if (!lazy || loadedIndices.has(index)) return children;

    return renderLazyPlaceholder();
  };
};

export { useLazyPanels };

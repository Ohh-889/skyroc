import { PanelStack } from './PanelStack';
import type { PagerProps } from './types';
import { useLazyPanels } from './use-lazy-panels';

/**
 * Web 回退实现 —— 不依赖 PagerView，仅做 display 切换。
 *
 * `swipeable` 与 `onPageChange` 在此实现中是 no-op：web 上没有手势翻页，激活索引只能由 TabBar 点击驱动。原生实现见 `Pager.native.tsx`。
 */
const Pager = (props: PagerProps) => {
  const { activeIndex, classNames, items, lazy, lazyPreloadDistance, renderLazyPlaceholder } = props;

  const renderPanel = useLazyPanels({
    activeIndex,
    lazy,
    lazyPreloadDistance,
    renderLazyPlaceholder,
    total: items.length
  });

  return (
    <PanelStack
      activeIndex={activeIndex}
      classNames={classNames}
      items={items}
      renderPanel={renderPanel}
    />
  );
};

export { Pager };

/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { List } from '@radix-ui/react-tabs';
import { cn } from '@skyroc/utils';
import type { CSSProperties, ComponentRef } from 'react';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { tabsVariants } from './tabs-variants';
import type { IndicatorStyle, TabsListProps } from './types';

const TabsList = forwardRef<ComponentRef<typeof List>, TabsListProps>((props, ref) => {
  const { children, className, classNames, dir, enableIndicator, orientation, shape, size, type, value, ...rest } =
    props;

  const tabsListRef = useRef<HTMLDivElement>(null);

  const [indicatorStyle, setIndicatorStyle] = useState<IndicatorStyle>({
    position: null,
    size: null
  });

  const mergedRef = useComposedRefs(ref, tabsListRef);

  const { indicator, indicatorRoot, list } = tabsVariants({ orientation, size, shape, type });

  const mergedCls = cn(list(), className);

  const mergedRootCls = cn(indicatorRoot(), classNames?.indicatorRoot);

  const mergedIndicatorCls = cn(indicator(), classNames?.indicator);

  function updateIndicatorStyle() {
    const activeTab = tabsListRef.current?.querySelector<HTMLButtonElement>('[role="tab"][data-state="active"]');

    if (!activeTab) return;

    if (orientation === 'horizontal') {
      setIndicatorStyle({
        position: activeTab.offsetLeft,
        size: activeTab.offsetWidth
      });
    } else {
      setIndicatorStyle({
        position: activeTab.offsetTop,
        size: activeTab.offsetHeight
      });
    }
  }

  // Indicator measurement is intentionally tied to active value and direction changes.
  useEffect(() => {
    updateIndicatorStyle();
  }, [value, dir]);
  return (
    <List className={mergedCls} dir={dir} {...rest} ref={mergedRef}>
      {children}

      {enableIndicator ? (
        <div
          className={mergedRootCls}
          style={
            {
              '--skyroc-tabs-indicator-position': `${indicatorStyle.position}px`,
              '--skyroc-tabs-indicator-size': `${indicatorStyle.size}px`
            } as CSSProperties
          }
        >
          <div className={mergedIndicatorCls} />
        </div>
      ) : null}
    </List>
  );
});

TabsList.displayName = 'TabsList';

export default TabsList;

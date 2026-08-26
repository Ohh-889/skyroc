'use client';

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { useComponentConfig } from '../config-provider/context';
import type TabsRoot from '../../components/tabs/TabsRoot';
import TabsUI from '../../components/tabs/TabsUI';
import type { TabsOptionData, TabsProps } from '../../components/tabs/types';

const Tabs = forwardRef<ComponentRef<typeof TabsRoot>, TabsProps<TabsOptionData>>((props, ref) => {
  const config = useComponentConfig('tabs');

  const mergedProps = {
    ...config,
    ...props
  };

  return (
    <TabsUI
      {...mergedProps}
      ref={ref}
    />
  );
});

Tabs.displayName = 'Tabs';

export default Tabs;

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { Trigger } from '@radix-ui/react-tabs';
import { cn } from '@skyroc/utils';
import { tabsVariants } from './tabs-variants';
import type { TabsTriggerProps } from './types';

const TabsTrigger = forwardRef<ComponentRef<typeof Trigger>, TabsTriggerProps>((props, ref) => {
  const { className, enableIndicator = true, size, type, ...rest } = props;

  const { trigger } = tabsVariants({ enableIndicator, size, type });

  const mergedCls = cn(trigger(), className);

  return (
    <Trigger
      className={mergedCls}
      {...rest}
      ref={ref}
    />
  );
});

TabsTrigger.displayName = 'TabsTrigger';

export default TabsTrigger;

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { Root } from '@radix-ui/react-tabs';
import { cn } from '@skyroc/utils';
import { tabsVariants } from './tabs-variants';
import type { TabsRootProps } from './types';

const TabRoot = forwardRef<ComponentRef<typeof Root>, TabsRootProps>((props, ref) => {
  const { className, fill, orientation, size, ...rest } = props;

  const { root } = tabsVariants({ fill, orientation, size });

  const mergedCls = cn(root(), className);

  return (
    <Root
      className={mergedCls}
      orientation={orientation}
      {...rest}
      ref={ref}
    />
  );
});

TabRoot.displayName = 'TabRoot';

export default TabRoot;

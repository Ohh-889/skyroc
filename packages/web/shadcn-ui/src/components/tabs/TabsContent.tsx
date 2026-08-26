import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { TabsContent as Content } from '@radix-ui/react-tabs';
import { cn } from '@skyroc/utils';
import { tabsVariants } from './tabs-variants';
import type { TabsContentProps } from './types';

const TabsContent = forwardRef<ComponentRef<typeof Content>, TabsContentProps>((props, ref) => {
  const { className, orientation, size, ...rest } = props;

  const { content } = tabsVariants({ orientation, size });

  const mergedCls = cn(content(), className);

  return (
    <Content
      className={mergedCls}
      {...rest}
      ref={ref}
    />
  );
});

TabsContent.displayName = 'TabsContent';

export default TabsContent;

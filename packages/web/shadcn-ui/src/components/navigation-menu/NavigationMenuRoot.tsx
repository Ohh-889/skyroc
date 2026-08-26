import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { Root } from '@radix-ui/react-navigation-menu';
import { cn } from '@skyroc/utils';
import { navigationMenuVariants } from './navigation-menu';
import type { NavigationMenuRootProps } from './types';

const NavigationMenuRoot = forwardRef<ComponentRef<typeof Root>, NavigationMenuRootProps>((props, ref) => {
  const { className, ...rest } = props;

  const { root } = navigationMenuVariants();

  const mergedCls = cn(root(), className);

  return (
    <Root
      className={mergedCls}
      data-slot="navigation-menu-root"
      ref={ref}
      {...rest}
    />
  );
});

NavigationMenuRoot.displayName = 'NavigationMenuRoot';

export default NavigationMenuRoot;

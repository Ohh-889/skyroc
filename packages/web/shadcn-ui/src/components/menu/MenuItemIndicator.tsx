import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { ItemIndicator as _ItemIndicator } from '@radix-ui/react-menu';
import { cn } from '@skyroc/utils';
import { menuVariants } from './menu-variants';
import type { MenuItemIndicatorProps } from './types';

const MenuItemIndicator = forwardRef<ComponentRef<typeof _ItemIndicator>, MenuItemIndicatorProps>((props, ref) => {
  const { className, component: ItemIndicator = _ItemIndicator, size, ...rest } = props;

  const { itemIndicator } = menuVariants({ size });

  const mergedCls = cn(itemIndicator(), className);

  return (
    <ItemIndicator
      className={mergedCls}
      ref={ref}
      {...rest}
    />
  );
});

MenuItemIndicator.displayName = 'MenuItemIndicator';

export default MenuItemIndicator;

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { Arrow as _Arrow } from '@radix-ui/react-menu';
import { cn } from '@skyroc/utils';
import { menuVariants } from './menu-variants';
import type { MenuArrowProps } from './types';

const MenuArrow = forwardRef<ComponentRef<typeof _Arrow>, MenuArrowProps>((props, ref) => {
  const { className, component: Arrow = _Arrow, ...rest } = props;

  const { arrow } = menuVariants();

  const mergedCls = cn(arrow(), className);

  return (
    <Arrow
      className={mergedCls}
      ref={ref}
      {...rest}
    />
  );
});

MenuArrow.displayName = 'MenuArrow';

export default MenuArrow;

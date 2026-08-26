import type { ComponentRef } from 'react';
import { forwardRef, isValidElement } from 'react';
import { Label as _Label } from '@radix-ui/react-menu';
import { cn } from '@skyroc/utils';
import { withClassName } from '@skyroc/utils/web';
import { menuVariants } from './menu-variants';
import type { MenuLabelProps } from './types';

const MenuLabel = forwardRef<ComponentRef<typeof _Label>, MenuLabelProps>((props, ref) => {
  const { children, className, classNames, component: Label = _Label, leading, size, trailing, ...rest } = props;

  const { itemIcon, label } = menuVariants({ size });

  const mergedCls = cn(label(), className || classNames?.label);

  return (
    <Label
      className={mergedCls}
      ref={ref}
      {...rest}
    >
      {isValidElement(leading) ? withClassName(leading, itemIcon()) : leading}
      {children}
      {trailing}
    </Label>
  );
});

MenuLabel.displayName = 'MenuLabel';

export default MenuLabel;

import type { ComponentRef } from 'react';
import { forwardRef, isValidElement } from 'react';
import { Item as _Item } from '@radix-ui/react-menu';
import { cn } from '@skyroc/utils';
import { withClassName } from '@skyroc/utils/web';
import MenuShortcut from './MenuShortcut';
import { menuVariants } from './menu-variants';
import type { MenuItemProps } from './types';

const MenuItem = forwardRef<ComponentRef<typeof _Item>, MenuItemProps>((props, ref) => {
  const {
    children,
    className,
    classNames,
    component: Item = _Item,
    leading,
    shortcut,
    size,
    trailing,
    ...rest
  } = props;

  const { item, itemIcon } = menuVariants({ size });

  const mergedCls = cn(item(), className || classNames?.item);

  return (
    <Item
      className={mergedCls}
      ref={ref}
      {...rest}
    >
      {isValidElement(leading) ? withClassName(leading, itemIcon()) : leading}
      <span>{children}</span>
      {trailing}

      {shortcut
        ? (
          <MenuShortcut
            className={classNames?.shortcut}
            size={size}
            value={shortcut}
          />
        )
        : null}
    </Item>
  );
});

MenuItem.displayName = 'MenuItem';

export default MenuItem;

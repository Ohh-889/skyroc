import type { ComponentRef } from 'react';
import { forwardRef, isValidElement } from 'react';
import { Trigger } from '@radix-ui/react-menubar';
import { cn } from '@skyroc/utils';
import { withClassName } from '@skyroc/utils/web';
import MenuShortcut from '../menu/MenuShortcut';
import { menuVariants } from '../menu/menu-variants';
import type { MenubarTriggerProps } from './types';

const MenubarTrigger = forwardRef<ComponentRef<typeof Trigger>, MenubarTriggerProps>((props, ref) => {
  const { children, className, classNames, leading, shortcut, size, trailing, ...rest } = props;

  const { item, itemIcon } = menuVariants({ size });

  const mergedCls = cn(item(), className || classNames?.trigger);

  return (
    <Trigger
      className={mergedCls}
      ref={ref}
      {...rest}
    >
      {isValidElement(leading) ? withClassName(leading, itemIcon()) : leading}
      {children}
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
    </Trigger>
  );
});

MenubarTrigger.displayName = 'MenubarTrigger';

export default MenubarTrigger;

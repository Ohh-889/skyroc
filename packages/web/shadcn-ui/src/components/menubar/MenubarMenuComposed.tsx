import { Content, Menu, Portal } from '@radix-ui/react-menubar';
import { cn } from '@skyroc/utils';
import { menuVariants } from '../menu/menu-variants';
import MenubarTrigger from './MenubarTrigger';
import type { MenubarMenuComposedProps } from './types';

/**
 * MenubarMenuComposed - Composed menu with built-in trigger and content
 * Used internally by MenubarUI for data-driven rendering
 */
const MenubarMenuComposed = (props: MenubarMenuComposedProps) => {
  const { children, className, classNames, size, trigger, value, ...rest } = props;

  const { content } = menuVariants({ size });

  const mergedCls = cn(content(), className, classNames?.content);

  return (
    <Menu value={value}>
      <MenubarTrigger
        {...rest}
        classNames={classNames}
      >
        {trigger}
      </MenubarTrigger>

      <Portal>
        <Content className={mergedCls}>{children}</Content>
      </Portal>
    </Menu>
  );
};

MenubarMenuComposed.displayName = 'MenubarMenuComposed';

export default MenubarMenuComposed;

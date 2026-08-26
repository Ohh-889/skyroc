import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { Content, Portal } from '@radix-ui/react-menubar';
import { cn } from '@skyroc/utils';
import { menuVariants } from '../menu/menu-variants';
import type { MenubarContentProps } from './types';

const MenubarContent = forwardRef<ComponentRef<typeof Content>, MenubarContentProps>((props, ref) => {
  const {
    align = 'start',
    alignOffset = -4,
    children,
    className,
    sideOffset = 8,
    size,
    ...rest
  } = props;

  const { content } = menuVariants({ size });

  const mergedCls = cn(content(), className);

  return (
    <Portal>
      <Content
        align={align}
        alignOffset={alignOffset}
        className={mergedCls}
        ref={ref}
        sideOffset={sideOffset}
        {...rest}
      >
        {children}
      </Content>
    </Portal>
  );
});

MenubarContent.displayName = 'MenubarContent';

export default MenubarContent;

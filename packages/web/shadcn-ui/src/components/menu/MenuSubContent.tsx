import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { Group as _Group, Portal as _Portal, SubContent as _SubContent } from '@radix-ui/react-menu';
import { cn } from '@skyroc/utils';
import { menuVariants } from './menu-variants';
import type { MenuSubContentProps } from './types';

const MenuSubContent = forwardRef<ComponentRef<typeof _SubContent>, MenuSubContentProps>((props, ref) => {
  const {
    className,
    component: SubContent = _SubContent,
    groupComponent: Group = _Group,
    portalComponent: Portal = _Portal,
    size,
    ...rest
  } = props;

  const { content } = menuVariants({ size });

  const mergedCls = cn(content(), className);

  return (
    <Group>
      <Portal>
        <SubContent
          className={mergedCls}
          ref={ref}
          {...rest}
        />
      </Portal>
    </Group>
  );
});

MenuSubContent.displayName = 'MenuSubContent';

export default MenuSubContent;

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { Group } from '@radix-ui/react-menubar';
import type { MenubarGroupProps } from './types';

const MenubarGroup = forwardRef<ComponentRef<typeof Group>, MenubarGroupProps>((props, ref) => {
  return (
    <Group
      ref={ref}
      {...props}
    />
  );
});

MenubarGroup.displayName = 'MenubarGroup';

export default MenubarGroup;

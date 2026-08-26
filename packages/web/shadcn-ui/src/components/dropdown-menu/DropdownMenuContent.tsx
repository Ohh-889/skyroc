import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { Content, Portal } from '@radix-ui/react-dropdown-menu';
import MenuContent from '../menu/MenuContent';
import DropdownMenuArrow from './DropdownMenuArrow';
import type { DropdownMenuContentProps } from './types';

const DropdownMenuContent = forwardRef<ComponentRef<typeof Content>, DropdownMenuContentProps>((props, ref) => {
  return (
    <MenuContent
      arrowComponent={DropdownMenuArrow}
      component={Content as typeof MenuContent}
      portalComponent={Portal}
      ref={ref}
      {...props}
    />
  );
});

DropdownMenuContent.displayName = 'DropdownMenuContent';

export default DropdownMenuContent;

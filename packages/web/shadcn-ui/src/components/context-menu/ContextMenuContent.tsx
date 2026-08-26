import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { Content, Portal } from '@radix-ui/react-context-menu';
import MenuContent from '../menu/MenuContent';
import ContextMenuArrow from './ContextMenuArrow';
import type { ContextMenuContentProps } from './types';

const ContextMenuContent = forwardRef<ComponentRef<typeof Content>, ContextMenuContentProps>((props, ref) => {
  return (
    <MenuContent
      arrowComponent={ContextMenuArrow}
      component={Content as typeof MenuContent}
      portalComponent={Portal}
      ref={ref}
      {...props}
    />
  );
});

ContextMenuContent.displayName = 'ContextMenuContent';

export default ContextMenuContent;

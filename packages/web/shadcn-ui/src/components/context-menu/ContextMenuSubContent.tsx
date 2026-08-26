import { Group, Portal, SubContent } from '@radix-ui/react-context-menu';
import MenuSubContent from '../menu/MenuSubContent';
import type { ContextMenuSubContentProps } from './types';

const ContextMenuSubContent = (props: ContextMenuSubContentProps) => {
  return (
    <MenuSubContent
      component={SubContent as typeof MenuSubContent}
      groupComponent={Group as typeof MenuSubContent}
      portalComponent={Portal}
      {...props}
    />
  );
};

export default ContextMenuSubContent;

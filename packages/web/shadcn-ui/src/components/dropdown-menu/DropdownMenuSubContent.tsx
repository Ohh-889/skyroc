import { Group, Portal, SubContent } from '@radix-ui/react-dropdown-menu';
import MenuSubContent from '../menu/MenuSubContent';
import type { DropdownMenuSubContentProps } from './types';

const DropdownMenuSubContent = (props: DropdownMenuSubContentProps) => {
  return (
    <MenuSubContent
      component={SubContent as typeof MenuSubContent}
      groupComponent={Group as typeof MenuSubContent}
      portalComponent={Portal}
      {...props}
    />
  );
};

export default DropdownMenuSubContent;

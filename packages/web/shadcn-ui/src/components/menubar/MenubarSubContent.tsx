import { Group, Portal, SubContent } from '@radix-ui/react-menubar';
import MenuSubContent from '../menu/MenuSubContent';
import type { MenubarSubContentProps } from './types';

const MenubarSubContent = (props: MenubarSubContentProps) => {
  return (
    <MenuSubContent
      component={SubContent as typeof MenuSubContent}
      groupComponent={Group as typeof MenuSubContent}
      portalComponent={Portal}
      {...props}
    />
  );
};

export default MenubarSubContent;

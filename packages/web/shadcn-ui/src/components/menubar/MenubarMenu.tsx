import { Menu } from '@radix-ui/react-menubar';
import type { MenubarMenuPrimitiveProps } from './types';

/**
 * MenubarMenu - Simple wrapper for composable usage (shadcn style)
 */
const MenubarMenu = (props: MenubarMenuPrimitiveProps) => {
  return <Menu {...props} />;
};

MenubarMenu.displayName = 'MenubarMenu';

export default MenubarMenu;

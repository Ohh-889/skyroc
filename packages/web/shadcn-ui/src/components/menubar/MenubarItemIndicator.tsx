import { ItemIndicator } from '@radix-ui/react-menubar';
import MenuItemIndicator from '../menu/MenuItemIndicator';
import type { MenubarItemIndicatorProps } from './types';

const MenubarItemIndicator = (props: MenubarItemIndicatorProps) => {
  return (
    <MenuItemIndicator
      component={ItemIndicator as typeof MenuItemIndicator}
      {...props}
    />
  );
};

MenubarItemIndicator.displayName = 'MenubarItemIndicator';

export default MenubarItemIndicator;

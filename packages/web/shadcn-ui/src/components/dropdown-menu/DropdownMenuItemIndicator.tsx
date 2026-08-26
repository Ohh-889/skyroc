import { ItemIndicator } from '@radix-ui/react-dropdown-menu';
import MenuItemIndicator from '../menu/MenuItemIndicator';
import type { DropdownMenuItemIndicatorProps } from './types';

const DropdownMenuItemIndicator = (props: DropdownMenuItemIndicatorProps) => {
  return (
    <MenuItemIndicator
      component={ItemIndicator as typeof MenuItemIndicator}
      {...props}
    />
  );
};

export default DropdownMenuItemIndicator;

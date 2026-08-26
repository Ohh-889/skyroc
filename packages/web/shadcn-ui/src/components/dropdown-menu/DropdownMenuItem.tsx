import { Item } from '@radix-ui/react-dropdown-menu';
import MenuItem from '../menu/MenuItem';
import type { DropdownMenuItemProps } from './types';

const DropdownMenuItem = (props: DropdownMenuItemProps) => {
  return (
    <MenuItem
      {...props}
      component={Item as typeof MenuItem}
    />
  );
};

export default DropdownMenuItem;

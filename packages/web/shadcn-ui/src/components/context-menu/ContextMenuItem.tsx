import { Item } from '@radix-ui/react-context-menu';
import MenuItem from '../menu/MenuItem';
import type { ContextMenuItemProps } from './types';

const ContextMenuItem = (props: ContextMenuItemProps) => {
  return (
    <MenuItem
      {...props}
      component={Item as typeof MenuItem}
    />
  );
};

export default ContextMenuItem;

import { Item } from '@radix-ui/react-menubar';
import { cn } from '@skyroc/utils';
import MenuItem from '../menu/MenuItem';
import type { MenubarItemProps } from './types';

const MenubarItem = (props: MenubarItemProps) => {
  const { className, inset, ...rest } = props;

  return (
    <MenuItem
      {...rest}
      className={cn(inset && 'pl-8', className)}
      component={Item as typeof MenuItem}
    />
  );
};

MenubarItem.displayName = 'MenubarItem';

export default MenubarItem;

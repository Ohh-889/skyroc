import { RadioItem } from '@radix-ui/react-menubar';
import MenuRadioItem from '../menu/MenuRadioItem';
import MenubarItemIndicator from './MenubarItemIndicator';
import type { MenubarRadioItemProps } from './types';

const MenubarRadioItem = (props: MenubarRadioItemProps) => {
  return (
    <MenuRadioItem
      component={RadioItem}
      indicatorComponent={MenubarItemIndicator}
      {...props}
    />
  );
};

MenubarRadioItem.displayName = 'MenubarRadioItem';

export default MenubarRadioItem;

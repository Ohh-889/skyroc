import { CheckboxItem } from '@radix-ui/react-menubar';
import MenuCheckboxItem from '../menu/MenuCheckboxItem';
import MenubarItemIndicator from './MenubarItemIndicator';
import type { MenubarCheckboxItemProps } from './types';

const MenubarCheckboxItem = (props: MenubarCheckboxItemProps) => {
  return (
    <MenuCheckboxItem
      component={CheckboxItem as typeof MenuCheckboxItem}
      indicatorComponent={MenubarItemIndicator}
      {...props}
    />
  );
};

MenubarCheckboxItem.displayName = 'MenubarCheckboxItem';

export default MenubarCheckboxItem;

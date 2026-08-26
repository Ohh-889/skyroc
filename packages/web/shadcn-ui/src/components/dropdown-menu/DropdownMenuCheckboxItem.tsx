import { CheckboxItem } from '@radix-ui/react-dropdown-menu';
import MenuCheckboxItem from '../menu/MenuCheckboxItem';
import DropdownMenuItemIndicator from './DropdownMenuItemIndicator';
import type { DropdownMenuCheckboxItemProps } from './types';

const DropdownMenuCheckboxItem = (props: DropdownMenuCheckboxItemProps) => {
  return (
    <MenuCheckboxItem
      component={CheckboxItem as typeof MenuCheckboxItem}
      indicatorComponent={DropdownMenuItemIndicator}
      {...props}
    />
  );
};

export default DropdownMenuCheckboxItem;

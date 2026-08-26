import { RadioItem } from '@radix-ui/react-dropdown-menu';
import MenuRadioItem from '../menu/MenuRadioItem';
import DropdownMenuItemIndicator from './DropdownMenuItemIndicator';
import type { DropdownMenuRadioItemProps } from './types';

const DropdownMenuRadioItem = (props: DropdownMenuRadioItemProps) => {
  return (
    <MenuRadioItem
      component={RadioItem}
      indicatorComponent={DropdownMenuItemIndicator}
      {...props}
    />
  );
};

export default DropdownMenuRadioItem;

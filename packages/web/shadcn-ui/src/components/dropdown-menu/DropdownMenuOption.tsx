import { Sub } from '@radix-ui/react-dropdown-menu';
import MenuOption from '../menu/MenuOption';
import DropdownMenuItem from './DropdownMenuItem';
import DropdownMenuLabel from './DropdownMenuLabel';
import DropdownMenuSeparator from './DropdownMenuSeparator';
import DropdownMenuSubContent from './DropdownMenuSubContent';
import DropdownMenuSubTrigger from './DropdownMenuSubTrigger';
import type { DropdownMenuOptionProps } from './types';

const DropdownMenuOption = (props: DropdownMenuOptionProps) => {
  return (
    <MenuOption
      {...props}
      component={DropdownMenuItem}
      labelComponent={DropdownMenuLabel}
      separatorComponent={DropdownMenuSeparator}
      subComponent={Sub}
      subContentComponent={DropdownMenuSubContent}
      subTriggerComponent={DropdownMenuSubTrigger}
    />
  );
};

DropdownMenuOption.displayName = 'DropdownMenuOption';

export default DropdownMenuOption;

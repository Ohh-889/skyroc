import { Separator } from '@radix-ui/react-dropdown-menu';
import MenuSeparator from '../menu/MenuSeparator';
import type { DropdownMenuSeparatorProps } from './types';

const DropdownMenuSeparator = (props: DropdownMenuSeparatorProps) => {
  return (
    <MenuSeparator
      component={Separator as typeof MenuSeparator}
      {...props}
    />
  );
};

export default DropdownMenuSeparator;

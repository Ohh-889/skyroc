import { Label } from '@radix-ui/react-dropdown-menu';
import MenuLabel from '../menu/MenuLabel';
import type { DropdownMenuLabelProps } from './types';

const DropdownMenuLabel = (props: DropdownMenuLabelProps) => {
  return (
    <MenuLabel
      component={Label as typeof MenuLabel}
      {...props}
    />
  );
};

export default DropdownMenuLabel;

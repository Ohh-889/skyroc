import { Arrow } from '@radix-ui/react-dropdown-menu';
import MenuArrow from '../menu/MenuArrow';
import type { DropdownMenuArrowProps } from './types';

const DropdownMenuArrow = (props: DropdownMenuArrowProps) => {
  return (
    <MenuArrow
      {...props}
      component={Arrow as typeof MenuArrow}
    />
  );
};

export default DropdownMenuArrow;

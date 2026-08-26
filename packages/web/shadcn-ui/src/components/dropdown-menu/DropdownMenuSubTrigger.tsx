import { SubTrigger } from '@radix-ui/react-dropdown-menu';
import MenuSubTrigger from '../menu/MenuSubTrigger';
import type { DropdownMenuSubTriggerProps } from './types';

const DropdownMenuSubTrigger = (props: DropdownMenuSubTriggerProps) => {
  return (
    <MenuSubTrigger
      component={SubTrigger as typeof MenuSubTrigger}
      {...props}
    />
  );
};

export default DropdownMenuSubTrigger;

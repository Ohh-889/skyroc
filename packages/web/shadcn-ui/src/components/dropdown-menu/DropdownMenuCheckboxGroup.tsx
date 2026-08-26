'use client';

import { Group } from '@radix-ui/react-dropdown-menu';
import MenuCheckboxGroup from '../menu/MenuCheckboxGroup';
import DropdownMenuCheckboxItem from './DropdownMenuCheckboxItem';
import DropdownMenuLabel from './DropdownMenuLabel';
import DropdownMenuSeparator from './DropdownMenuSeparator';
import type { DropdownMenuCheckboxGroupProps } from './types';

const DropdownMenuCheckboxGroup = (props: DropdownMenuCheckboxGroupProps) => {
  return (
    <MenuCheckboxGroup
      component={DropdownMenuCheckboxItem}
      groupComponent={Group}
      labelComponent={DropdownMenuLabel}
      separatorComponent={DropdownMenuSeparator}
      {...props}
    />
  );
};

export default DropdownMenuCheckboxGroup;

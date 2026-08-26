'use client';

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { RadioGroup } from '@radix-ui/react-dropdown-menu';
import MenuRadioGroup from '../menu/MenuRadioGroup';
import DropdownMenuLabel from './DropdownMenuLabel';
import DropdownMenuRadioItem from './DropdownMenuRadioItem';
import DropdownMenuSeparator from './DropdownMenuSeparator';
import type { DropdownMenuRadioGroupProps } from './types';

const DropdownMenuRadioGroup = forwardRef<ComponentRef<typeof RadioGroup>, DropdownMenuRadioGroupProps>(
  (props, ref) => {
    return (
      <MenuRadioGroup
        component={DropdownMenuRadioItem}
        groupComponent={RadioGroup}
        labelComponent={DropdownMenuLabel}
        ref={ref}
        separatorComponent={DropdownMenuSeparator}
        {...props}
      />
    );
  }
);

DropdownMenuRadioGroup.displayName = 'DropdownMenuRadioGroup';

export default DropdownMenuRadioGroup;

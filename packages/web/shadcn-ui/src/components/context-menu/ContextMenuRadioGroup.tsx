import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { RadioGroup } from '@radix-ui/react-context-menu';
import MenuRadioGroup from '../menu/MenuRadioGroup';
import ContextMenuLabel from './ContextMenuLabel';
import ContextMenuRadioItem from './ContextMenuRadioItem';
import ContextMenuSeparator from './ContextMenuSeparator';
import type { ContextMenuRadioGroupProps } from './types';

const ContextMenuRadioGroup = forwardRef<ComponentRef<typeof RadioGroup>, ContextMenuRadioGroupProps>((props, ref) => {
  return (
    <MenuRadioGroup
      component={ContextMenuRadioItem}
      groupComponent={RadioGroup}
      labelComponent={ContextMenuLabel}
      ref={ref}
      separatorComponent={ContextMenuSeparator}
      {...props}
    />
  );
});

ContextMenuRadioGroup.displayName = 'ContextMenuRadioGroup';

export default ContextMenuRadioGroup;

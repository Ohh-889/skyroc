import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { RadioGroup } from '@radix-ui/react-menubar';
import MenuRadioGroup from '../menu/MenuRadioGroup';
import MenubarLabel from './MenubarLabel';
import MenubarRadioItem from './MenubarRadioItem';
import MenubarSeparator from './MenubarSeparator';
import type { MenubarRadioGroupProps } from './types';

const MenubarRadioGroup = forwardRef<ComponentRef<typeof RadioGroup>, MenubarRadioGroupProps>((props, ref) => {
  return (
    <MenuRadioGroup
      component={MenubarRadioItem}
      groupComponent={RadioGroup}
      labelComponent={MenubarLabel}
      ref={ref}
      separatorComponent={MenubarSeparator}
      {...props}
    />
  );
});

MenubarRadioGroup.displayName = 'MenubarRadioGroup';

export default MenubarRadioGroup;

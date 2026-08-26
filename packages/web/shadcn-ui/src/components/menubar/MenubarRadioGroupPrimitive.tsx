import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { RadioGroup } from '@radix-ui/react-menubar';
import type { MenubarRadioGroupPrimitiveProps } from './types';

/**
 * MenubarRadioGroupPrimitive - Simple wrapper for composable usage (shadcn style)
 */
const MenubarRadioGroupPrimitive = forwardRef<ComponentRef<typeof RadioGroup>, MenubarRadioGroupPrimitiveProps>(
  (props, ref) => {
    return (
      <RadioGroup
        ref={ref}
        {...props}
      />
    );
  }
);

MenubarRadioGroupPrimitive.displayName = 'MenubarRadioGroupPrimitive';

export default MenubarRadioGroupPrimitive;

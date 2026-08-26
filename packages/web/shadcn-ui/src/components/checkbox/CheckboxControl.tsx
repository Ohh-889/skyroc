import type { ComponentRef } from 'react';
import React from 'react';
import { Root } from '@radix-ui/react-checkbox';
import { cn } from '@skyroc/utils';
import { checkboxVariants } from './checkbox-variants';
import type { CheckboxControlProps } from './types';

const CheckboxControl = React.forwardRef<ComponentRef<typeof Root>, CheckboxControlProps>((props, ref) => {
  const { className, color, shape, size, ...rest } = props;

  const { control } = checkboxVariants({ color, shape, size });

  const mergedCls = cn(control(), className);

  return (
    <Root
      className={mergedCls}
      data-slot="checkbox-control"
      {...rest}
      ref={ref}
    />
  );
});

CheckboxControl.displayName = 'CheckboxControl';

export default CheckboxControl;

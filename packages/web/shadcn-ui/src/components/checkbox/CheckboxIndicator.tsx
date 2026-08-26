import type { ComponentRef } from 'react';
import React from 'react';
import { Indicator } from '@radix-ui/react-checkbox';
import { cn } from '@skyroc/utils';
import { checkboxVariants } from './checkbox-variants';
import type { CheckboxIndicatorProps } from './types';

const CheckboxIndicator = React.forwardRef<ComponentRef<typeof Indicator>, CheckboxIndicatorProps>(
  (props, ref) => {
    const { className, ...rest } = props;

    const { indicator } = checkboxVariants();

    const mergedCls = cn(indicator(), className);

    return (
      <Indicator
        className={mergedCls}
        data-slot="checkbox-indicator"
        {...rest}
        ref={ref}
      />
    );
  }
);

CheckboxIndicator.displayName = 'CheckboxIndicator';

export default CheckboxIndicator;

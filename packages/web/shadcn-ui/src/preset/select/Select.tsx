'use client';

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { useComponentConfig } from '../config-provider/context';
import type SelectContent from '../../components/select/SelectContent';
import SelectUI from '../../components/select/SelectUI';
import type { SelectProps } from '../../components/select/types';

const Select = forwardRef<ComponentRef<typeof SelectContent>, SelectProps>((props, ref) => {
  const config = useComponentConfig('select');

  const mergedProps = {
    ...config,
    ...props
  };

  return (
    <SelectUI
      {...mergedProps}
      ref={ref}
    />
  );
});

Select.displayName = 'Select';

export default Select;

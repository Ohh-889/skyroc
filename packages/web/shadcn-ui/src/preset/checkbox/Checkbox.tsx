'use client';

import { forwardRef } from 'react';
import { useComponentConfig } from '../config-provider/context';
import CheckboxUI from '../../components/checkbox/CheckboxUI';
import type { CheckboxProps } from '../../components/checkbox/types';

const Checkbox = forwardRef<HTMLDivElement, CheckboxProps>((props, ref) => {
  const config = useComponentConfig('checkbox');

  const mergedProps = {
    ...config,
    ...props
  };

  return (
    <CheckboxUI
      {...mergedProps}
      ref={ref}
    />
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;

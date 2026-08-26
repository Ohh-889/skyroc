'use client';

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { useComponentConfig } from '../config-provider/context';
import DividerUI from '../../components/divider/DividerUI';
import type { DividerProps } from '../../components/divider/types';

const Divider = forwardRef<ComponentRef<typeof DividerUI>, DividerProps>((props, ref) => {
  const config = useComponentConfig('divider');

  const mergedProps = {
    ...config,
    ...props
  };

  return (
    <DividerUI
      {...mergedProps}
      ref={ref}
    />
  );
});

Divider.displayName = 'Divider';

export default Divider;

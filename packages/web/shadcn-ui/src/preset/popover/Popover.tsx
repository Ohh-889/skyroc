'use client';

import type { Content } from '@radix-ui/react-popover';
import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import PopoverUI from '../../components/popover/PopoverUI';
import type { PopoverProps } from '../../components/popover/types';
import { useComponentConfig } from '../config-provider/context';

const Popover = forwardRef<ComponentRef<typeof Content>, PopoverProps>((props, ref) => {
  const config = useComponentConfig('popover');

  const mergedProps = {
    ...config,
    ...props
  };

  return (
    <PopoverUI
      {...mergedProps}
      ref={ref}
    />
  );
});

Popover.displayName = 'Popover';

export default Popover;

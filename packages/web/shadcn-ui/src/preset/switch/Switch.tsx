'use client';

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { useComponentConfig } from '../config-provider/context';
import SwitchUI from '../../components/switch/SwitchUI';
import type SwitchRoot from '../../components/switch/SwitchRoot';
import type { SwitchProps } from '../../components/switch/types';

const Switch = forwardRef<ComponentRef<typeof SwitchRoot>, SwitchProps>((props, ref) => {
  const config = useComponentConfig('switch');

  const mergedProps = {
    ...config,
    ...props
  };

  return (
    <SwitchUI
      {...mergedProps}
      ref={ref}
    />
  );
});

Switch.displayName = 'Switch';

export default Switch;

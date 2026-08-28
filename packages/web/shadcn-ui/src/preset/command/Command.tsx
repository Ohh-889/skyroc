'use client';

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import CommandUI from '../../components/command/CommandUI';
import type { CommandProps } from '../../components/command/types';
import { useComponentConfig } from '../config-provider/context';

const Command = forwardRef<ComponentRef<typeof CommandUI>, CommandProps>((props, ref) => {
  const config = useComponentConfig('command');

  const mergedProps = {
    ...config,
    ...props
  };

  return (
    <CommandUI
      {...mergedProps}
      ref={ref}
    />
  );
});

Command.displayName = 'Command';

export default Command;

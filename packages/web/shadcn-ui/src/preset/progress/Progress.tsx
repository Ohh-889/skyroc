'use client';

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import type { Root } from '@radix-ui/react-progress';
import { useComponentConfig } from '../config-provider/context';
import ProgressUI from '../../components/progress/ProgressUI';
import type { ProgressProps } from '../../components/progress/types';

const Progress = forwardRef<ComponentRef<typeof Root>, ProgressProps>((props, ref) => {
  const config = useComponentConfig('progress');

  const mergedProps = {
    ...config,
    ...props
  };

  return (
    <ProgressUI
      {...mergedProps}
      ref={ref}
    />
  );
});

Progress.displayName = 'Progress';

export default Progress;

'use client';

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { Indicator, Root } from '@radix-ui/react-progress';
import { cn } from '@skyroc/utils';
import { progressVariants } from './progress-variants';
import type { ProgressProps } from './types';

const Progress = forwardRef<ComponentRef<typeof Root>, ProgressProps>((props, ref) => {
  const { className, classNames, color, max = 100, size, value, ...rest } = props;

  const { indicator, root } = progressVariants({ color, size });

  const progressValue = value ?? 0;
  const progressMax = max > 0 ? max : 100;
  const percentage = Math.min(Math.max(progressValue / progressMax, 0), 1) * 100;

  const mergedCls = {
    indicator: cn(indicator(), classNames?.indicator),
    root: cn(root(), className, classNames?.root)
  };

  return (
    <Root
      className={mergedCls.root}
      data-slot="progress-root"
      max={max}
      ref={ref}
      value={value}
      {...rest}
    >
      <Indicator
        className={mergedCls.indicator}
        data-slot="progress-indicator"
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </Root>
  );
});

Progress.displayName = 'ProgressUI';

export default Progress;

'use client';

import React from 'react';
import { Root } from '@radix-ui/react-aspect-ratio';
import { cn } from '@skyroc/utils';
import type { AspectRatioProps } from './types';

const AspectRatioUI = React.forwardRef<HTMLDivElement, AspectRatioProps>((props, ref) => {
  const { className, ...rest } = props;

  const mergedCls = cn(className);

  return (
    <Root
      className={mergedCls}
      data-slot="aspect-ratio"
      {...rest}
      ref={ref}
    />
  );
});

AspectRatioUI.displayName = 'AspectRatioUI';

export default AspectRatioUI;
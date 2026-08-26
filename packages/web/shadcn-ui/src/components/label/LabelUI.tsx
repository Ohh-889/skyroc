'use client';

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { Root } from '@radix-ui/react-label';
import { cn } from '@skyroc/utils';
import { labelVariants } from './label-variants';
import type { LabelProps } from './types';

const LabelUI = forwardRef<ComponentRef<typeof Root>, LabelProps>((props, ref) => {
  const { className, size, ...rest } = props;

  const mergedCls = cn(labelVariants({ size }), className);

  return (
    <Root
      className={mergedCls}
      ref={ref}
      {...rest}
    />
  );
});

LabelUI.displayName = 'LabelUI';

export default LabelUI;
import React from 'react';
import { cn } from '@skyroc/utils';
import { cardVariants } from './card-variants';
import type { CardRootProps } from './types';

export const CardRoot = React.forwardRef<HTMLDivElement, CardRootProps>((props, ref) => {
  const { className, size, split, ...rest } = props;

  const { root } = cardVariants({ size, split });

  const mergedCls = cn(root(), className);

  return (
    <div
      className={mergedCls}
      data-slot="card-root"
      {...rest}
      ref={ref}
    />
  );
});

CardRoot.displayName = 'CardRoot';

import React from 'react';
import { cn } from '@skyroc/utils';
import { cardVariants } from './card-variants';
import type { CardFooterProps } from './types';

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>((props, ref) => {
  const { className, size, ...rest } = props;

  const { footer } = cardVariants({ size });

  const mergedCls = cn(footer(), className);

  return (
    <div
      className={mergedCls}
      data-slot="card-footer"
      {...rest}
      ref={ref}
    />
  );
});

CardFooter.displayName = 'CardFooter';

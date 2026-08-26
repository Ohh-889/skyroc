import React from 'react';
import { cn } from '@skyroc/utils';
import { cardVariants } from './card-variants';
import type { CardTitleProps } from './types';

export const CardTitle = React.forwardRef<HTMLDivElement, CardTitleProps>((props, ref) => {
  const { className, size, ...rest } = props;

  const { title } = cardVariants({ size });

  const mergedCls = cn(title(), className);

  return (
    <div
      className={mergedCls}
      data-slot="card-title"
      {...rest}
      ref={ref}
    />
  );
});

CardTitle.displayName = 'CardTitle';

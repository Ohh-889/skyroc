import React from 'react';
import { cn } from '@skyroc/utils';
import { cardVariants } from './card-variants';
import type { CardContentProps } from './types';

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>((props, ref) => {
  const { className, scrollable, size, ...rest } = props;

  const { content } = cardVariants({ scrollable, size });

  const mergedCls = cn(content(), className);

  return (
    <div
      className={mergedCls}
      data-slot="card-content"
      {...rest}
      ref={ref}
    />
  );
});

CardContent.displayName = 'CardContent';

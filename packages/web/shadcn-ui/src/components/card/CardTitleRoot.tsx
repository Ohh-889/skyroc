import React from 'react';
import { cn } from '@skyroc/utils';
import { cardVariants } from './card-variants';
import type { CardTitleRootProps } from './types';

export const CardTitleRoot = React.forwardRef<HTMLDivElement, CardTitleRootProps>((props, ref) => {
  const { children, className, leading, size, trailing, ...rest } = props;

  const { titleRoot } = cardVariants({ size });

  const mergedCls = cn(titleRoot(), className);

  return (
    <div
      className={mergedCls}
      data-slot="card-title-root"
      {...rest}
      ref={ref}
    >
      {leading}
      {children}
      {trailing}
    </div>
  );
});

CardTitleRoot.displayName = 'CardTitleRoot';

import React from 'react';
import { cn } from '@skyroc/utils';
import { listVariants } from './list-variants';
import type { ListRootProps } from './types';

export const ListRoot = React.forwardRef<HTMLUListElement, ListRootProps>(
  (props, ref) => {
    const { children, className, size, ...rest } = props;

    const { root } = listVariants({ size });

    return (
      <ul
        className={cn(root(), className)}
        data-slot="list-root"
        ref={ref}
        {...rest}
      >
        {children}
      </ul>
    );
  }
);

ListRoot.displayName = 'ListRoot';

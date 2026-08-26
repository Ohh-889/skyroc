import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { cn } from '@skyroc/utils';
import { paginationVariants } from './pagination-variants';
import type { PaginationRootProps } from './types';

const PaginationRoot = forwardRef<ComponentRef<'nav'>, PaginationRootProps>((props, ref) => {
  const { children, className, size, ...rest } = props;

  const { root } = paginationVariants({ size });

  const mergedCls = cn(root(), className);

  return (
    <nav
      aria-label="pagination"
      className={mergedCls}
      data-slot="pagination-root"
      ref={ref}
      role="navigation"
      {...rest}
    >
      {children}
    </nav>
  );
});

PaginationRoot.displayName = 'PaginationRoot';

export default PaginationRoot;

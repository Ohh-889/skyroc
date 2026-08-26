import { EllipsisIcon } from 'lucide-react';
import { cn } from '@skyroc/utils';
import { paginationVariants } from './pagination-variants';
import type { PaginationEllipsisProps } from './types';

const PaginationEllipsis = (props: PaginationEllipsisProps) => {
  const { children, className, icon, size, ...rest } = props;

  const { ellipsis } = paginationVariants({ size });

  const mergedCls = cn(ellipsis(), className);

  return (
    <div
      aria-hidden
      className={mergedCls}
      data-slot="pagination-ellipsis"
      {...rest}
    >
      {children ?? icon ?? <EllipsisIcon />}
      <span className="sr-only">More pages</span>
    </div>
  );
};

export default PaginationEllipsis;

import { cn } from '@skyroc/utils';
import { paginationVariants } from './pagination-variants';
import type { PaginationContentProps } from './types';

const PaginationContent = (props: PaginationContentProps) => {
  const { children, className, size, ...rest } = props;

  const { list } = paginationVariants({ size });

  const mergedCls = cn(list(), className);

  return (
    <div
      className={mergedCls}
      data-slot="pagination-content"
      {...rest}
    >
      {children}
    </div>
  );
};

export default PaginationContent;

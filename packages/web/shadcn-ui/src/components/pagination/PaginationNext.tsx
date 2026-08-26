import { isValidElement } from 'react';
import { ChevronRightIcon } from 'lucide-react';
import { cn } from '@skyroc/utils';
import { paginationVariants } from './pagination-variants';
import type { PaginationNextProps } from './types';
const PaginationNext = (props: PaginationNextProps) => {
  const {
    actionAsSelected,
    children,
    className,
    icon,
    label,
    shape,
    size,
    variant,
    ...rest
  } = props;

  const { navigationButton } = paginationVariants({ size, variant, shape, actionAsSelected });

  const mergedCls = cn(navigationButton(), className);

  return (
    <button
      aria-label="Go to next page"
      className={mergedCls}
      data-selected={actionAsSelected ? '' : undefined}
      data-slot="pagination-next"
      type="button"
      {...rest}
    >
      {children ?? (
        <>
          {isValidElement(label) ? label : (Boolean(label) && <span className="hidden sm:block">{label}</span>)}
          {icon ?? <ChevronRightIcon />}
        </>
      )}
    </button>
  );
};

export default PaginationNext;

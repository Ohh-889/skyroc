import { isValidElement } from 'react';
import { ChevronLeftIcon } from 'lucide-react';
import { cn } from '@skyroc/utils';
import { paginationVariants } from './pagination-variants';
import type { PaginationPreviousProps } from './types';

const PaginationPrevious = (props: PaginationPreviousProps) => {
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
      aria-label="Go to previous page"
      className={mergedCls}
      data-selected={actionAsSelected ? '' : undefined}
      data-slot="pagination-previous"
      type="button"
      {...rest}
    >
      {children ?? (
        <>
          {icon ?? <ChevronLeftIcon />}
          {isValidElement(label) ? label : (Boolean(label) && <span className="hidden sm:block">{label}</span>)}
        </>
      )}
    </button>
  );
};

PaginationPrevious.displayName = 'PaginationPrevious';

export default PaginationPrevious;

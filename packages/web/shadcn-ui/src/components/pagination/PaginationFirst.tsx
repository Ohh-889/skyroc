import { isValidElement } from 'react';
import { ChevronsLeftIcon } from 'lucide-react';
import { cn } from '@skyroc/utils';
import { paginationVariants } from './pagination-variants';
import type { PaginationFirstProps } from './types';

const PaginationFirst = (props: PaginationFirstProps) => {
  const {
    actionAsSelected,
    children,
    className,
    disabled,
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
      aria-label="Go to first page"
      className={mergedCls}
      data-disabled={disabled ? '' : undefined}
      data-selected={actionAsSelected ? '' : undefined}
      data-slot="pagination-first"
      disabled={disabled}
      type="button"
      {...rest}
    >
      {children ?? (
        <>
          {icon ?? <ChevronsLeftIcon />}
          {isValidElement(label) ? label : (Boolean(label) && <span className="hidden sm:block">{label}</span>)}
        </>
      )}
    </button>
  );
};

export default PaginationFirst;

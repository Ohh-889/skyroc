import { cn } from '@skyroc/utils';
import { ChevronRight } from 'lucide-react';
import { forwardRef } from 'react';
import { breadcrumbVariants } from './breadcrumb-variants';
import type { BreadcrumbSeparatorProps } from './types';

const BreadcrumbSeparator = forwardRef<HTMLLIElement, BreadcrumbSeparatorProps>((props, ref) => {
  const { children, className, ...rest } = props;

  const { separator } = breadcrumbVariants();

  const mergedCls = cn(separator(), className);

  return (
    <li
      className={mergedCls}
      data-slot="breadcrumb-separator"
      ref={ref}
      {...rest}
    >
      {children ?? <ChevronRight />}
    </li>
  );
});

BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

export default BreadcrumbSeparator;

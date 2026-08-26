import { Ellipsis } from 'lucide-react';
import { cn } from '@skyroc/utils';
import { breadcrumbVariants } from './breadcrumb-variants';
import type { BreadcrumbEllipsisProps } from './types';

const BreadcrumbEllipsis = (props: BreadcrumbEllipsisProps) => {
  const { children, className, ...rest } = props;

  const { ellipsis } = breadcrumbVariants();

  const mergedCls = cn(ellipsis, className);
  return (
    <span
      aria-hidden="true"
      className={mergedCls}
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      {...rest}
    >
      {children || <Ellipsis className="cursor-pointer" />}
      <span className="sr-only">More</span>
    </span>
  );
};

BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis';

export default BreadcrumbEllipsis;

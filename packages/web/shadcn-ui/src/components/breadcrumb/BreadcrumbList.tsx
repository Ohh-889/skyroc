import { forwardRef } from 'react';
import { cn } from '@skyroc/utils';
import { breadcrumbVariants } from './breadcrumb-variants';
import type { BreadcrumbListProps } from './types';

const BreadcrumbList = forwardRef<HTMLOListElement, BreadcrumbListProps>((props, ref) => {
  const { className, size, ...rest } = props;

  const { list } = breadcrumbVariants({ size });

  const mergedCls = cn(list(), className);

  return (
    <ol
      className={mergedCls}
      data-slot="breadcrumb-list"
      ref={ref}
      {...rest}
    />
  );
});

BreadcrumbList.displayName = 'BreadcrumbList';

export default BreadcrumbList;

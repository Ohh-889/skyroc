import { forwardRef } from 'react';
import { cn } from '@skyroc/utils';
import { breadcrumbVariants } from './breadcrumb-variants';
import type { BreadcrumbRootProps } from './types';

const BreadcrumbRoot = forwardRef<HTMLElement, BreadcrumbRootProps>((props, ref) => {
  const { className, size, ...rest } = props;

  const { root } = breadcrumbVariants({ size });

  const mergedCls = cn(root(), className);

  return (
    <nav
      aria-label="breadcrumb"
      className={mergedCls}
      data-slot="breadcrumb-root"
      ref={ref}
      {...rest}
    />
  );
});

BreadcrumbRoot.displayName = 'BreadcrumbRoot';

export default BreadcrumbRoot;

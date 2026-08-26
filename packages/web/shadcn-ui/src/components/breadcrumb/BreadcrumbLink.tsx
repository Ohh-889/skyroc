import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@skyroc/utils';
import { breadcrumbVariants } from './breadcrumb-variants';
import type { BreadcrumbLinkProps } from './types';

const BreadcrumbLink = forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>((props, ref) => {
  const { asChild, className, ...rest } = props;

  const Comp = asChild ? Slot : 'a';

  const { link } = breadcrumbVariants();

  const mergedCls = cn(link(), className);

  return (
    <Comp
      className={mergedCls}
      data-slot="breadcrumb-link"
      ref={ref}
      {...rest}
    />
  );
});

BreadcrumbLink.displayName = 'BreadcrumbLink';

export default BreadcrumbLink;

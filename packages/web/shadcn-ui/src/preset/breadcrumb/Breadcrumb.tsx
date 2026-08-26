'use client';

import type { Ref } from 'react';
import { forwardRef } from 'react';
import { useComponentConfig } from '../config-provider/context';
import BreadcrumbUI from '../../components/breadcrumb/BreadcrumbUI';
import type { BreadcrumbItem, BreadcrumbProps } from '../../components/breadcrumb/types';

const BreadcrumbInner = <T extends BreadcrumbItem>(props: BreadcrumbProps<T>, ref: Ref<HTMLElement>) => {
  const config = useComponentConfig('breadcrumb');

  const mergedProps = {
    ...config,
    ...props
  } as BreadcrumbProps<T>;

  return (
    <BreadcrumbUI<T>
      {...mergedProps}
      ref={ref}
    />
  );
};

BreadcrumbInner.displayName = 'Breadcrumb';

const Breadcrumb = forwardRef(BreadcrumbInner) as <T extends BreadcrumbItem>(
  props: BreadcrumbProps<T> & { ref?: Ref<HTMLElement> }
) => React.ReactElement;

export default Breadcrumb;

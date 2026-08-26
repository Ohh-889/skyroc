'use client';

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { useComponentConfig } from '../config-provider/context';
import PaginationUI from '../../components/pagination/PaginationUI';
import type { PaginationProps } from '../../components/pagination/types';

const Pagination = forwardRef<ComponentRef<'nav'>, PaginationProps>((props, ref) => {
  const config = useComponentConfig('pagination');

  const mergedProps = {
    ...config,
    ...props
  };

  return (
    <PaginationUI
      {...mergedProps}
      ref={ref}
    />
  );
});

Pagination.displayName = 'Pagination';

export default Pagination;

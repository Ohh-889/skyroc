'use client';

import { forwardRef } from 'react';
import { useComponentConfig } from '../config-provider/context';
import { ListUI } from '../../components/list/ListUI';
import type { ListProps } from '../../components/list/types';

const List = forwardRef<HTMLUListElement, ListProps>((props, ref) => {
  const config = useComponentConfig('list');

  const mergedProps = {
    ...config,
    ...props
  };

  return (
    <ListUI
      {...mergedProps}
      ref={ref}
    />
  );
});

List.displayName = 'List';

export default List;

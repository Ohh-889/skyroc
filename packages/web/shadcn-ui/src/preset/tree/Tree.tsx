'use client';

import TreeUI from '../../components/tree/TreeUI';
import type { TreeItemData, TreeProps } from '../../components/tree/types';
import { useComponentConfig } from '../config-provider/context';

const Tree = <T extends TreeItemData = TreeItemData>({ ref, ...props }: TreeProps<T>) => {
  const config = useComponentConfig('tree');

  const mergedProps = { ...config, ...props };

  return (
    <TreeUI
      ref={ref}
      {...mergedProps}
    />
  );
};

export default Tree;

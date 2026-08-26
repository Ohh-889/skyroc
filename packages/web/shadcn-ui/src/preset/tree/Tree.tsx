'use client';

import { useComponentConfig } from '../config-provider/context';
import TreeUI from '../../components/tree/TreeUI';
import type { TreeItemData, TreeProps } from '../../components/tree/types';

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

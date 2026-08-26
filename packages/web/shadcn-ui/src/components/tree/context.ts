'use client';

import { createContext, useContext } from 'react';
import type { TreeItemData, TreeRootContextValue } from './types';

export const TreeRootContext = createContext<TreeRootContextValue<TreeItemData> | null>(null);

TreeRootContext.displayName = 'TreeRootContext';

export function useTreeRootContext<T extends TreeItemData = TreeItemData>(
  componentName: string = 'TreeItem'
): TreeRootContextValue<T> {
  const context = useContext(TreeRootContext);

  if (!context) {
    throw new Error(`\`${componentName}\` must be used within a \`TreeRoot\` component.`);
  }

  return context as TreeRootContextValue<T>;
}

export const TreeRootProvider = TreeRootContext.Provider;

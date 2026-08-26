'use client';

import { useComponentConfig } from '../config-provider/context';
import ContextMenuUI from '../../components/context-menu/ContextMenuUI';
import type { ContextMenuProps } from '../../components/context-menu/types';

const ContextMenu = (props: ContextMenuProps) => {
  const config = useComponentConfig('contextMenu');

  const mergedProps = {
    ...config,
    ...props
  };

  return (
    <ContextMenuUI
      {...mergedProps}
    />
  );
};

ContextMenu.displayName = 'ContextMenu';

export default ContextMenu;

'use client';

import { useComponentConfig } from '../config-provider/context';
import DrawerUI from '../../components/drawer/DrawerUI';
import type { DrawerProps } from '../../components/drawer/types';

const Drawer = (props: DrawerProps) => {
  const config = useComponentConfig('drawer');

  const mergedProps = {
    ...config,
    ...props
  };

  return (
    <DrawerUI
      {...mergedProps}
    />
  );
};

Drawer.displayName = 'Drawer';

export default Drawer;

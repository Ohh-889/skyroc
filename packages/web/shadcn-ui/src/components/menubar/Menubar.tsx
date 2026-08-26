'use client';

import MenubarUI from './MenubarUI';
import type { MenubarProps } from './types';

const Menubar = (props: MenubarProps) => {
  return (
    <MenubarUI
      {...props}
    />
  );
};

Menubar.displayName = 'Menubar';

export default Menubar;

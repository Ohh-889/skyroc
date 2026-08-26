'use client';

import NavigationMenuUI from './NavigationMenuUI';
import type { NavigationMenuProps } from './types';

const NavigationMenu = (props: NavigationMenuProps) => {
  return (
    <NavigationMenuUI
      {...props}
    />
  );
};

NavigationMenu.displayName = 'NavigationMenu';

export default NavigationMenu;

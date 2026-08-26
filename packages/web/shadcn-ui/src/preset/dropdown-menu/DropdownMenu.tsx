'use client';

import { useComponentConfig } from '../config-provider/context';
import DropdownMenuUI from '../../components/dropdown-menu/DropdownMenuUI';
import type { DropdownMenuProps } from '../../components/dropdown-menu/types';

const DropdownMenu = (props: DropdownMenuProps) => {
  const config = useComponentConfig('dropdownMenu');

  const mergedProps = {
    ...config,
    ...props
  };

  return (
    <DropdownMenuUI
      {...mergedProps}
    />
  );
};

DropdownMenu.displayName = 'DropdownMenu';

export default DropdownMenu;

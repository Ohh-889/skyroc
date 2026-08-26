import { Separator } from '@radix-ui/react-menubar';
import MenuSeparator from '../menu/MenuSeparator';
import type { MenubarSeparatorProps } from './types';

const MenubarSeparator = (props: MenubarSeparatorProps) => {
  return (
    <MenuSeparator
      component={Separator as typeof MenuSeparator}
      {...props}
    />
  );
};

export default MenubarSeparator;

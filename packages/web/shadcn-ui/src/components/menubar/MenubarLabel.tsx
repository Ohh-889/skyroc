import { Label } from '@radix-ui/react-menubar';
import MenuLabel from '../menu/MenuLabel';
import type { MenubarLabelProps } from './types';

const MenubarLabel = (props: MenubarLabelProps) => {
  return (
    <MenuLabel
      component={Label as typeof MenuLabel}
      {...props}
    />
  );
};

MenubarLabel.displayName = 'MenubarLabel';

export default MenubarLabel;

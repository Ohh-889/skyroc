import { SubTrigger } from '@radix-ui/react-menubar';
import MenuSubTrigger from '../menu/MenuSubTrigger';
import type { MenubarSubTriggerProps } from './types';

const MenubarSubTrigger = (props: MenubarSubTriggerProps) => {
  return (
    <MenuSubTrigger
      component={SubTrigger as typeof MenuSubTrigger}
      {...props}
    />
  );
};

MenubarSubTrigger.displayName = 'MenubarSubTrigger';

export default MenubarSubTrigger;

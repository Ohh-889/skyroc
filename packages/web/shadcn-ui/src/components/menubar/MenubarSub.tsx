import { Sub } from '@radix-ui/react-menubar';
import type { MenubarSubProps } from './types';

const MenubarSub = (props: MenubarSubProps) => {
  return <Sub {...props} />;
};

MenubarSub.displayName = 'MenubarSub';

export default MenubarSub;

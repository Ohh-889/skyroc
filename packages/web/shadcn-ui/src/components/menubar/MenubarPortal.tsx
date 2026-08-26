import { Portal } from '@radix-ui/react-menubar';
import type { MenubarPortalProps } from './types';

const MenubarPortal = (props: MenubarPortalProps) => {
  return <Portal {...props} />;
};

MenubarPortal.displayName = 'MenubarPortal';

export default MenubarPortal;

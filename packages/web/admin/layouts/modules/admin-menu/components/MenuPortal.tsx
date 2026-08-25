import type { ReactNode } from 'react';
import { Portal } from '@shell/ui/compose';

import { useAdminState } from '../../../state/use-admin-state';

interface MenuPortalProps {
  /** 跟随布局容器重新挂载的菜单内容。 */
  children: ReactNode;
  /** 菜单内容需要挂载到的布局容器。 */
  container: string | HTMLElement;
}

const MenuPortal = (props: MenuPortalProps) => {
  const { children, container } = props;

  const { isMobile } = useAdminState();

  const containerKey = typeof container === 'string' ? container : container.id || 'element';
  const deviceKey = isMobile ? 'mobile' : 'desktop';

  return (
    <Portal container={container} key={`${deviceKey}:${containerKey}`}>
      {children}
    </Portal>
  );
};

export default MenuPortal;

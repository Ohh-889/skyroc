import type { CSSProperties } from 'react';
import { cn } from '@skyroc/utils';
import { DialogOverlay, DialogPortal, DialogRoot } from '../dialog';
import { DrawerContent } from '../drawer';
import { useLayoutContext } from './context';
import { layoutVariants } from './layout-variants';
import type { LayoutMobileProps } from './types';

const LayoutMobile = (props: LayoutMobileProps) => {
  const { children, className, rootClassName, side } = props;
  const { mobile, mobileRoot } = layoutVariants();
  const mergedCls = {
    cls: cn(mobile(), className),
    root: cn(mobileRoot(), rootClassName)
  };
  const { onOpenMobileChange, openMobile } = useLayoutContext();

  return (
    <DialogRoot
      open={openMobile}
      onOpenChange={onOpenMobileChange}
    >
      <DialogPortal>
        <DialogOverlay />

        <DrawerContent
          className={mergedCls.root}
          side={side}
          style={{ '--skyroc-sidebar-width': '18rem' } as CSSProperties}
        >
          <div
            className={mergedCls.cls}
            data-mobile="true"
            data-sidebar="sidebar"
          >
            {children}
          </div>
        </DrawerContent>
      </DialogPortal>
    </DialogRoot>
  );
};

export default LayoutMobile;

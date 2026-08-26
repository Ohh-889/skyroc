import { cn } from '@skyroc/utils';
import LayoutMobile from './LayoutMobile';
import { useLayoutContext } from './context';
import { layoutVariants } from './layout-variants';
import type { LayoutSidebarProps } from './types';

const LayoutSidebar = ({
  children,
  collapsible = 'offcanvas',
  side = 'left',
  size,
  variant = 'sidebar',
  ...rest
}: LayoutSidebarProps) => {
  const { className, ui } = rest;
  const { collapsedSidebarWidth, isMobile, open } = useLayoutContext();
  const { sidebar, sidebarGapHandler, sidebarRoot, sidebarWrapper } = layoutVariants({ collapsible, side, variant });
  const mergedCls = {
    cls: cn(sidebar(), className || ui?.sidebar),
    gapHandler: cn(sidebarGapHandler(), ui?.sidebarGapHandler),
    root: cn(sidebarRoot(), ui?.sidebarRoot),
    wrapper: cn(sidebarWrapper(), ui?.sidebarWrapper)
  };

  const childrenProps = {
    collapsed: !open,
    collapsedWidth: collapsedSidebarWidth,
    size
  };

  const renderChildren = typeof children === 'function' ? children(childrenProps) : children;

  return isMobile
    ? (
      <LayoutMobile
        className={className}
        rootClassName={ui?.mobileRoot}
        side={side}
      >
        {renderChildren}
      </LayoutMobile>
    )
    : (
      <div className={mergedCls.root}>
        <div className={mergedCls.gapHandler} />

        <div className={mergedCls.wrapper}>
          <div
            className={mergedCls.cls}
            data-sidebar="sidebar"
          >
            {renderChildren}
          </div>
        </div>
      </div>
    );
};

export default LayoutSidebar;

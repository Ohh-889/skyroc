'use client';

import LayoutFooter from './LayoutFooter';
import LayoutHeader from './LayoutHeader';
import LayoutMain from './LayoutMain';
import LayoutRail from './LayoutRail';
import LayoutRoot from './LayoutRoot';
import LayoutSidebar from './LayoutSidebar';
import LayoutTab from './LayoutTab';
import type { LayoutProps } from './types';

const LayoutUI = ({
  children,
  collapsedSidebarWidth,
  collapsible = 'offcanvas',
  defaultOpen,
  footer,
  header,
  onOpenChange,
  open,
  side = 'left',
  sidebar,
  sidebarWidth,
  size = 'md',
  tab,
  ui,
  variant = 'sidebar'
}: LayoutProps) => {
  return (
    <LayoutRoot
      className={ui?.root}
      collapsedSidebarWidth={collapsedSidebarWidth}
      collapsible={collapsible}
      defaultOpen={defaultOpen}
      open={open}
      side={side}
      sidebarWidth={sidebarWidth}
      size={size}
      variant={variant}
      onOpenChange={onOpenChange}
    >
      <LayoutSidebar
        collapsible={collapsible}
        side={side}
        size={size}
        ui={ui}
        variant={variant}
      >
        {typeof sidebar === 'function'
          ? props => (
            <>
              {sidebar(props)}

              <LayoutRail
                className={ui?.rail}
                collapsible={collapsible}
                side={side}
                variant={variant}
              />
            </>
          )
          : (
            <>
              {sidebar}

              <LayoutRail
                className={ui?.rail}
                collapsible={collapsible}
                side={side}
                variant={variant}
              />
            </>
          )}
      </LayoutSidebar>

      <LayoutMain
        className={ui?.main}
        collapsible={collapsible}
        variant={variant}
      >
        <LayoutHeader className={ui?.header}>{header}</LayoutHeader>
        {tab ? <LayoutTab className={ui?.tab}>{tab}</LayoutTab> : null}
        {children}
        {footer ? <LayoutFooter className={ui?.footer}>{footer}</LayoutFooter> : null}
      </LayoutMain>
    </LayoutRoot>
  );
};

LayoutUI.displayName = 'LayoutUI';

export default LayoutUI;
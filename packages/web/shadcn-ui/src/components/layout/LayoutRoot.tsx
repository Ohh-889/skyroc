'use client';

import type { CSSProperties } from 'react';
import { useMemo, useState } from 'react';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { themeSizeRatio } from '../../constants/theme';
import { useMediaQuery } from '../../hooks/use-media-query';
import { cn } from '@skyroc/utils';
import { LayoutContext } from './context';
import { layoutVariants } from './layout-variants';
import type { LayoutRootProps } from './types';

const LayoutRoot = ({
  children,
  collapsedSidebarWidth = 50,
  collapsible,
  defaultOpen = false,
  onOpenChange,
  open: controlledOpen,
  side,
  sidebarWidth = 240,
  size = 'md',
  variant,
  ...props
}: LayoutRootProps) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [openMobile, setOpenMobile] = useState(false);
  // const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [open, setOpen] = useControllableState({
    caller: 'layout',
    defaultProp: defaultOpen,
    onChange: onOpenChange,
    prop: controlledOpen
  });

  // Support controlled and uncontrolled mode
  // const open = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const handleOpenChange = (value: boolean) => {
    if (controlledOpen === undefined) {
      setOpen(value);
    }
    onOpenChange?.(value);
  };

  const state = useMemo(() => {
    return open ? 'expanded' : 'collapsed';
  }, [open]);

  const { root } = layoutVariants({ size, variant });
  const mergedCls = cn(root(), props.className);

  const style = useMemo(() => {
    const sidebarWidthValue = (sidebarWidth * themeSizeRatio[size]) / 16;
    const collapsedSidebarWidthValue = (collapsedSidebarWidth * themeSizeRatio[size]) / 16;
    return {
      '--skyroc-sidebar-width': `${sidebarWidthValue}rem`,
      '--skyroc-collapsed-sidebar-width': `${collapsedSidebarWidthValue}rem`
    } as CSSProperties;
  }, [sidebarWidth, collapsedSidebarWidth, size]);

  const dataCollapsible = useMemo(() => {
    return state === 'collapsed' ? collapsible : '';
  }, [collapsible, state]);

  const renderChildren = typeof children === 'function' ? children({ open }) : children;

  return (
    <LayoutContext.Provider
      value={{
        collapsedSidebarWidth,
        isMobile,
        onOpenChange: handleOpenChange,
        onOpenMobileChange: (value: boolean) => {
          setOpenMobile(value);
        },
        open,
        openMobile,
        sidebarWidth,
        state,
        toggleSidebar: () => {
          if (isMobile) {
            setOpenMobile(!openMobile);
          }
          else {
            handleOpenChange(!open);
          }
        }
      }}
    >
      <div
        className={mergedCls}
        data-collapsible={dataCollapsible}
        data-side={side}
        data-state={state}
        data-variant={variant}
        style={style}
      >
        {renderChildren}
      </div>
    </LayoutContext.Provider>
  );
};

export default LayoutRoot;

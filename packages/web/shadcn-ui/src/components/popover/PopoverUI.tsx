'use client';

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import type { Content } from '@radix-ui/react-popover';
import { Close, Portal, Root, Trigger } from '@radix-ui/react-popover';
import PopoverAnchor from './PopoverAnchor';
import PopoverArrow from './PopoverArrow';
import PopoverContent from './PopoverContent';
import type { PopoverProps } from './types';

const PopoverUI = forwardRef<ComponentRef<typeof Content>, PopoverProps>((props, ref) => {
  const {
    anchorProps,
    arrowHeight,
    arrowProps,
    arrowWidth,
    children,
    className,
    classNames,
    closeIcon,
    container,
    contentProps,
    defaultOpen,
    disabledPortal,
    forceMount,
    forceMountPortal,
    modal,
    onOpenChange,
    open,
    showArrow,
    size,
    trigger,
    ...rest
  } = props;

  const content = (
    <PopoverContent
      {...rest}
      {...contentProps}
      className={className || classNames?.content || contentProps?.className}
      ref={ref}
      size={size}
    >
      {children}
      {closeIcon ? <Close asChild>{closeIcon}</Close> : null}

      {showArrow
        ? (
          <PopoverArrow
            className={classNames?.arrow}
            height={arrowHeight}
            size={size}
            width={arrowWidth}
            {...arrowProps}
          />
        )
        : null}
    </PopoverContent>
  );

  return (
    <Root
      defaultOpen={defaultOpen}
      modal={modal}
      open={open}
      onOpenChange={onOpenChange}
    >
      {anchorProps ? <PopoverAnchor {...anchorProps} /> : null}

      <Trigger asChild>{trigger}</Trigger>

      {disabledPortal
        ? content
        : (
          <Portal
            container={container}
            data-slot="popover-portal"
            forceMount={forceMountPortal || forceMount}
          >
            {content}
          </Portal>
        )}
    </Root>
  );
});

PopoverUI.displayName = 'PopoverUI';

export default PopoverUI;

'use client';

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { Root, Trigger } from '@radix-ui/react-hover-card';
import HoverCardArrow from './HoverCardArrow';
import HoverCardContent from './HoverCardContent';
import type { HoverCardProps } from './types';

const HoverCardUI = forwardRef<ComponentRef<typeof HoverCardContent>, HoverCardProps>((props, ref) => {
  const { arrowProps, children, className, classNames, contentProps, showArrow, trigger, ...rest } = props;

  return (
    <Root
      data-slot="hover-card-root"
      {...rest}
    >
      <Trigger
        asChild
        data-slot="hover-card-trigger"
      >
        {trigger}
      </Trigger>

      <HoverCardContent
        className={className || classNames?.content}
        ref={ref}
        {...contentProps}
      >
        {children}

        {showArrow
          ? (
            <HoverCardArrow
              className={classNames?.arrow}
              {...arrowProps}
            />
          )
          : null}
      </HoverCardContent>
    </Root>
  );
});

HoverCardUI.displayName = 'HoverCardUI';

export default HoverCardUI;
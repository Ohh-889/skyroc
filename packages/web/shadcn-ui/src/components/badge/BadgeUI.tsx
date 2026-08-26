'use client';

import { forwardRef } from 'react';
import BadgeContent from './BadgeContent';
import BadgeRoot from './BadgeRoot';
import type { BadgeProps } from './types';

const BadgeUI = forwardRef<HTMLDivElement, BadgeProps>((props, ref) => {
  const { children, className, classNames, color, content, open = true, position, size, ...rest } = props;

  return (
    <BadgeRoot
      className={className || classNames?.root}
      ref={ref}
      {...rest}
    >
      {children}

      {open
        ? (
          <BadgeContent
            className={classNames?.content}
            color={color}
            position={position}
            size={size}
          >
            {content}
          </BadgeContent>
        )
        : null}
    </BadgeRoot>
  );
});

BadgeUI.displayName = 'BadgeUI';

export default BadgeUI;
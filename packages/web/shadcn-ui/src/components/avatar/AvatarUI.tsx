'use client';

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import type { Image } from '@radix-ui/react-avatar';
import AvatarFallback from './AvatarFallback';
import AvatarImage from './AvatarImage';
import AvatarRoot from './AvatarRoot';
import type { AvatarProps } from './types';

const Avatar = forwardRef<ComponentRef<typeof Image>, AvatarProps>((props, ref) => {
  const { className, classNames, delayMs, fallback, fallbackProps, rootProps, size, ...rest } = props;

  return (
    <AvatarRoot
      className={classNames?.root}
      size={size}
      {...rootProps}
    >
      <AvatarImage
        className={className || classNames?.image}
        ref={ref}
        {...rest}
      />

      <AvatarFallback
        className={classNames?.fallback}
        delayMs={delayMs}
        {...fallbackProps}
      >
        {fallback}
      </AvatarFallback>
    </AvatarRoot>
  );
});

Avatar.displayName = 'AvatarUI';

export default Avatar;
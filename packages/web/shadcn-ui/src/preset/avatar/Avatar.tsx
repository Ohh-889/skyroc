'use client';

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import type { Image } from '@radix-ui/react-avatar';
import { useComponentConfig } from '../config-provider/context';
import AvatarUI from '../../components/avatar/AvatarUI';
import type { AvatarProps } from '../../components/avatar/types';

const Avatar = forwardRef<ComponentRef<typeof Image>, AvatarProps>((props, ref) => {
  const config = useComponentConfig('avatar');

  const mergedProps = {
    ...config,
    ...props
  };

  return (
    <AvatarUI
      {...mergedProps}
      ref={ref}
    />
  );
});

Avatar.displayName = 'Avatar';

export default Avatar;

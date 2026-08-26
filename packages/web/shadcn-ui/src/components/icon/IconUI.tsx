'use client';

import { Icon as IconifyIcon } from '@iconify/react';
import type { IconProps } from './types';

const IconUI = (props: IconProps) => {
  const { height = '1.25em', width = '1.25em', ...rest } = props;

  return (
    <IconifyIcon
      height={height}
      width={width}
      {...rest}
    />
  );
};

IconUI.displayName = 'IconUI';

export default IconUI;

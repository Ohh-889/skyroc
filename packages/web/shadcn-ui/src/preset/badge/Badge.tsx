'use client';

import { forwardRef } from 'react';
import { useComponentConfig } from '../config-provider/context';
import BadgeUI from '../../components/badge/BadgeUI';
import type { BadgeProps } from '../../components/badge/types';

const Badge = forwardRef<HTMLDivElement, BadgeProps>((props, ref) => {
  const config = useComponentConfig('badge');

  const mergedProps = {
    ...config,
    ...props
  };

  return (
    <BadgeUI
      {...mergedProps}
      ref={ref}
    />
  );
});

Badge.displayName = 'Badge';

export default Badge;

'use client';

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { useComponentConfig } from '../config-provider/context';
import HoverCardUI from '../../components/hover-card/HoverCardUI';
import type { HoverCardProps } from '../../components/hover-card/types';

const HoverCard = forwardRef<ComponentRef<typeof HoverCardUI>, HoverCardProps>((props, ref) => {
  const config = useComponentConfig('hoverCard');

  const mergedProps = {
    ...config,
    ...props
  };

  return (
    <HoverCardUI
      {...mergedProps}
      ref={ref}
    />
  );
});

HoverCard.displayName = 'HoverCard';

export default HoverCard;

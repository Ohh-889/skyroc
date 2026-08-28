'use client';

import { forwardRef } from 'react';
import { CardUI } from '../../components/card/CardUI';
import type { CardProps } from '../../components/card/types';
import { useComponentConfig } from '../config-provider/context';

const Card = forwardRef<HTMLDivElement, CardProps>((props, ref) => {
  const config = useComponentConfig('card');

  const mergedProps = {
    ...config,
    ...props
  };

  return (
    <CardUI
      {...mergedProps}
      ref={ref}
    />
  );
});

Card.displayName = 'Card';

export default Card;

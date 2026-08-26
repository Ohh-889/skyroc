'use client';

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import AspectRatioUI from '../../components/aspect-ratio/AspectRatioUI';
import type { AspectRatioProps } from '../../components/aspect-ratio/types';
import { useComponentConfig } from '../config-provider/context';

const AspectRatio = forwardRef<ComponentRef<typeof AspectRatioUI>, AspectRatioProps>((props, ref) => {
  const config = useComponentConfig('aspectRatio');

  const mergedProps = {
    ...config,
    ...props
  };

  return (
    <AspectRatioUI
      {...mergedProps}
      ref={ref}
    />
  );
});

AspectRatio.displayName = 'AspectRatio';

export default AspectRatio;

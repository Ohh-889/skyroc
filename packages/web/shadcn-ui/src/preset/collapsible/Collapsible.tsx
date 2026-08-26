'use client';

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { useComponentConfig } from '../config-provider/context';
import CollapsibleUI from '../../components/collapsible/CollapsibleUI';
import type { CollapsibleProps } from '../../components/collapsible/types';

const Collapsible = forwardRef<ComponentRef<typeof CollapsibleUI>, CollapsibleProps>((props, ref) => {
  const config = useComponentConfig('collapsible');

  const mergedProps = {
    ...config,
    ...props
  };

  return (
    <CollapsibleUI
      {...mergedProps}
      ref={ref}
    />
  );
});

Collapsible.displayName = 'Collapsible';

export default Collapsible;

'use client';

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import type { Root } from '@radix-ui/react-tabs';
import { useComponentConfig } from '../config-provider/context';
import SegmentUI from '../../components/segment/SegmentUI';
import type { SegmentOptionData, SegmentProps } from '../../components/segment/types';

const Segment = forwardRef<ComponentRef<typeof Root>, SegmentProps<SegmentOptionData>>((props, ref) => {
  const config = useComponentConfig('segment');

  const mergedProps = {
    ...config,
    ...props
  };

  return (
    <SegmentUI
      {...mergedProps}
      ref={ref}
    />
  );
});

Segment.displayName = 'Segment';

export default Segment;

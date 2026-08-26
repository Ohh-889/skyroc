'use client';

import { Group as PanelGroup } from 'react-resizable-panels';
import { cn } from '@skyroc/utils';
import { resizableVariants } from './resizable-variants';
import type { ResizablePanelGroupProps } from './types';

const ResizablePanelGroup = (props: ResizablePanelGroupProps) => {
  const { className, size, ...rest } = props;

  const { panelGroup } = resizableVariants({ size });

  const mergedCls = cn(panelGroup(), className);

  return (
    <PanelGroup
      className={mergedCls}
      {...rest}
    />
  );
};

export default ResizablePanelGroup;

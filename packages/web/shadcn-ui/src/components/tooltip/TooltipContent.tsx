import { Content, Portal } from '@radix-ui/react-tooltip';
import { cn } from '@skyroc/utils';
import type { ComponentRef } from 'react';
import { forwardRef } from 'react';

import { tooltipVariants } from './tooltip-variants';
import type { TooltipContentProps } from './types';

const TooltipContent = forwardRef<ComponentRef<typeof Content>, TooltipContentProps>((props, ref) => {
  const { avoidCollisions = true, className, sideOffset = 8, size, ...rest } = props;

  const { content } = tooltipVariants({ size });

  const mergedCls = cn(content(), className);

  return (
    <Portal>
      <Content avoidCollisions={avoidCollisions} className={mergedCls} ref={ref} sideOffset={sideOffset} {...rest} />
    </Portal>
  );
});

TooltipContent.displayName = 'TooltipContent';

export default TooltipContent;

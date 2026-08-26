import { Arrow } from '@radix-ui/react-tooltip';
import { cn } from '@skyroc/utils';

import { tooltipVariants } from './tooltip-variants';
import type { TooltipArrowProps } from './types';

const TooltipArrow = (props: TooltipArrowProps) => {
  const { className, size, ...rest } = props;

  const { arrow } = tooltipVariants({ size });

  const mergedCls = cn(arrow(), className);

  return <Arrow className={mergedCls} {...rest} />;
};

export default TooltipArrow;

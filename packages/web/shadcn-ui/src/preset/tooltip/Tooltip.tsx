'use client';

import TooltipUI from '../../components/tooltip/TooltipUI';
import type { TooltipProps } from '../../components/tooltip/types';
import { useComponentConfig } from '../config-provider/context';

const Tooltip = (props: TooltipProps) => {
  const config = useComponentConfig('tooltip');

  const mergedProps = {
    ...config,
    ...props
  };

  return <TooltipUI {...mergedProps} />;
};

Tooltip.displayName = 'Tooltip';

export default Tooltip;

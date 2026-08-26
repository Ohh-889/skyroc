'use client';

import { Root, Trigger } from '@radix-ui/react-tooltip';

import TooltipArrow from './TooltipArrow';
import TooltipContent from './TooltipContent';
import type { TooltipProps } from './types';

const TooltipUI = (props: TooltipProps) => {
  const { arrowProps, children, className, classNames, content, contentProps, showArrow, size, ...rest } = props;

  return (
    <Root {...rest}>
      <Trigger asChild>{children}</Trigger>

      <TooltipContent className={className || classNames?.content} size={size} {...contentProps}>
        {content}

        {showArrow ? <TooltipArrow className={classNames?.arrow} size={size} {...arrowProps} /> : null}
      </TooltipContent>
    </Root>
  );
};

TooltipUI.displayName = 'TooltipUI';

export default TooltipUI;
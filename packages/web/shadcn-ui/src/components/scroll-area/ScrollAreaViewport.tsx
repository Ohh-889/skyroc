import { Viewport } from '@radix-ui/react-scroll-area';
import { cn } from '@skyroc/utils';

import { scrollAreaVariants } from './scroll-area-variants';
import type { ScrollAreaViewportProps } from './types';

const ScrollAreaViewport = (props: ScrollAreaViewportProps) => {
  const { className, ...rest } = props;

  const { viewport } = scrollAreaVariants();

  const mergedCls = cn(viewport(), className);

  return <Viewport className={mergedCls} data-slot="scroll-area-viewport" {...rest} />;
};

ScrollAreaViewport.displayName = 'ScrollAreaViewport';

export default ScrollAreaViewport;

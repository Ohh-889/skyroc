import { Thumb } from '@radix-ui/react-scroll-area';
import { cn } from '@skyroc/utils';

import { scrollAreaVariants } from './scroll-area-variants';
import type { ScrollAreaThumbProps } from './types';

const ScrollAreaScrollbar = (props: ScrollAreaThumbProps) => {
  const { className, ...rest } = props;

  const { thumb } = scrollAreaVariants();

  const mergedCls = cn(thumb(), className);

  return <Thumb className={mergedCls} data-slot="scroll-area-thumb" {...rest} />;
};

ScrollAreaScrollbar.displayName = 'ScrollAreaScrollbar';

export default ScrollAreaScrollbar;

import { Scrollbar } from '@radix-ui/react-scroll-area';
import { cn } from '@skyroc/utils';

import { scrollAreaVariants } from './scroll-area-variants';
import type { ScrollAreaScrollbarProps } from './types';

const ScrollAreaScrollbar = (props: ScrollAreaScrollbarProps) => {
  const { className, orientation, size, ...rest } = props;

  const { scrollbar } = scrollAreaVariants({ orientation, size });

  const mergedCls = cn(scrollbar(), className);

  return <Scrollbar className={mergedCls} data-slot="scroll-area-scrollbar" orientation={orientation} {...rest} />;
};

ScrollAreaScrollbar.displayName = 'ScrollAreaScrollbar';

export default ScrollAreaScrollbar;

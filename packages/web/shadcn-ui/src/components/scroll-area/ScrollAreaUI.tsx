'use client';

import { ScrollAreaCorner } from '@radix-ui/react-scroll-area';
import { cn } from '@skyroc/utils';

import ScrollAreaRoot from './ScrollAreaRoot';
import ScrollAreaScrollbar from './ScrollAreaScrollbar';
import ScrollAreaThumb from './ScrollAreaThumb';
import ScrollAreaViewport from './ScrollAreaViewport';
import type { ScrollAreaProps } from './types';

const ScrollAreaUI = (props: ScrollAreaProps) => {
  const {
    children,
    className,
    classNames,
    nonce,
    orientation,
    scrollbarProps,
    size,
    thumbProps,
    viewportProps,
    ...rest
  } = props;

  return (
    <ScrollAreaRoot className={className || classNames?.root} {...rest}>
      <ScrollAreaViewport className={classNames?.viewport} nonce={nonce} {...viewportProps}>
        {children}
      </ScrollAreaViewport>

      <ScrollAreaScrollbar className={classNames?.scrollbar} orientation={orientation} size={size} {...scrollbarProps}>
        <ScrollAreaThumb className={classNames?.thumb} {...thumbProps} />
      </ScrollAreaScrollbar>

      <ScrollAreaCorner className={cn(classNames?.corner)} data-slot="scroll-area-corner" />
    </ScrollAreaRoot>
  );
};

ScrollAreaUI.displayName = 'ScrollAreaUI';

export default ScrollAreaUI;

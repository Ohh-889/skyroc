'use client';

import ScrollAreaUI from '../../components/scroll-area/ScrollAreaUI';
import type { ScrollAreaProps } from '../../components/scroll-area/types';
import { useComponentConfig } from '../config-provider/context';

const ScrollArea = (props: ScrollAreaProps) => {
  const config = useComponentConfig('scrollArea');

  const mergedProps = {
    ...config,
    ...props
  };

  return <ScrollAreaUI {...mergedProps} />;
};

ScrollArea.displayName = 'ScrollArea';

export default ScrollArea;

'use client';

import { useComponentConfig } from '../config-provider/context';
import ScrollAreaUI from '../../components/scroll-area/ScrollAreaUI';
import type { ScrollAreaProps } from '../../components/scroll-area/types';

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

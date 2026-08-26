import { Root } from '@radix-ui/react-scroll-area';
import { cn } from '@skyroc/utils';

import { scrollAreaVariants } from './scroll-area-variants';
import type { ScrollAreaRootProps } from './types';

const ScrollAreaRoot = (props: ScrollAreaRootProps) => {
  const { className, ...rest } = props;

  const { root } = scrollAreaVariants();

  const mergedCls = cn(root(), className);

  return <Root className={mergedCls} data-slot="scroll-area-root" {...rest} />;
};

export default ScrollAreaRoot;

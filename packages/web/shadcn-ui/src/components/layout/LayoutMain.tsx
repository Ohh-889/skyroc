import { cn } from '@skyroc/utils';
import { layoutVariants } from './layout-variants';
import type { LayoutMainProps } from './types';

const LayoutMain = (props: LayoutMainProps) => {
  const { className, collapsible, variant, ...rest } = props;

  const { main } = layoutVariants({ collapsible, variant });

  const mergedClass = cn(main(), className);

  return (
    <main
      className={mergedClass}
      {...rest}
    />
  );
};

export default LayoutMain;

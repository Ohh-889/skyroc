import { cn } from '@skyroc/utils';
import { layoutVariants } from './layout-variants';
import type { LayoutFooterProps } from './types';

const LayoutFooter = (props: LayoutFooterProps) => {
  const { className, ...rest } = props;

  const { footer } = layoutVariants();

  const mergedClass = cn(footer(), className);

  return (
    <footer
      className={mergedClass}
      {...rest}
    />
  );
};

export default LayoutFooter;

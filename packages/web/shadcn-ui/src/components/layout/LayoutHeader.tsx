import { cn } from '@skyroc/utils';
import { layoutVariants } from './layout-variants';
import type { LayoutHeaderProps } from './types';

const LayoutHeader = (props: LayoutHeaderProps) => {
  const { className, ...rest } = props;

  const { header } = layoutVariants();

  const mergedClass = cn(header(), className);

  return (
    <header
      className={mergedClass}
      {...rest}
    />
  );
};

export default LayoutHeader;

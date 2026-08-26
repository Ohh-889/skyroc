import { cn } from '@skyroc/utils';
import { layoutVariants } from './layout-variants';
import type { LayoutTabProps } from './types';

const LayoutTab = (props: LayoutTabProps) => {
  const { className, ...rest } = props;

  const { tab } = layoutVariants();

  const mergedClass = cn(tab(), className);

  return (
    <div
      className={mergedClass}
      {...rest}
    />
  );
};

export default LayoutTab;

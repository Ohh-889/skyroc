import { cn } from '@skyroc/utils';
import { skeletonVariants } from './skeleton-variants';
import type { SkeletonProps } from './types';

const SkeletonUI = (props: SkeletonProps) => {
  const { children, className, loading, ...rest } = props;

  const mergedCls = cn(skeletonVariants(), className);

  return (
    <div
      className={mergedCls}
      data-slot="skeleton"
      {...rest}
    >
      {loading ? children : null}
    </div>
  );
};

export default SkeletonUI;

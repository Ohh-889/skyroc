import { cn } from '@skyroc/utils';
import { useLayoutContext } from './context';
import { layoutVariants } from './layout-variants';
import type { LayoutRailProps } from './types';

const LayoutRail = (props: LayoutRailProps) => {
  const { className, collapsible, side, variant } = props;
  const { rail } = layoutVariants({ collapsible, side, variant });
  const mergedCls = cn(rail(), className);
  const { toggleSidebar } = useLayoutContext();
  return (
    <div
      className={mergedCls}
      title="Toggle sidebar"
      onClick={toggleSidebar}
    />
  );
};

export default LayoutRail;

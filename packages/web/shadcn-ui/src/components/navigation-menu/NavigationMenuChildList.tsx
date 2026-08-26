import { cn } from '@skyroc/utils';
import { navigationMenuVariants } from './navigation-menu';
import type { NavigationMenuChildListProps } from './types';

const NavigationMenuChildList = (props: NavigationMenuChildListProps) => {
  const { className, size, ...rest } = props;

  const { subList } = navigationMenuVariants({ size });

  const mergedCls = cn(subList(), className);

  return (
    <ul
      className={mergedCls}
      data-slot="navigation-menu-child-list"
      {...rest}
    />
  );
};

export default NavigationMenuChildList;

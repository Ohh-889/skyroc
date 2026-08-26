import { List } from '@radix-ui/react-navigation-menu';
import { cn } from '@skyroc/utils';
import { navigationMenuVariants } from './navigation-menu';
import type { NavigationMenuListProps } from './types';

const NavigationMenuList = (props: NavigationMenuListProps) => {
  const { className, size, ...rest } = props;

  const { list } = navigationMenuVariants({ size });

  const mergedCls = cn(list(), className);

  return (
    <List
      {...rest}
      className={mergedCls}
      data-size={size}
      data-slot="navigation-menu-list"
    />
  );
};

export default NavigationMenuList;

import { cn } from '@skyroc/utils';
import { navigationMenuVariants } from './navigation-menu';
import type { NavigationMenuChildListItemProps } from './types';

const NavigationMenuChildListItem = (props: NavigationMenuChildListItemProps) => {
  const { className, ...rest } = props;

  const { subItem } = navigationMenuVariants();

  const mergedCls = cn(subItem(), className);

  return (
    <li
      className={mergedCls}
      data-slot="navigation-menu-child-list-item"
      {...rest}
    />
  );
};

export default NavigationMenuChildListItem;

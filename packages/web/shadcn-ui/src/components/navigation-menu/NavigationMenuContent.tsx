import { Content } from '@radix-ui/react-navigation-menu';
import { cn } from '@skyroc/utils';
import { navigationMenuVariants } from './navigation-menu';
import type { NavigationMenuContentProps } from './types';

const NavigationMenuContent = (props: NavigationMenuContentProps) => {
  const { className, ...rest } = props;

  const { content } = navigationMenuVariants();

  const mergedCls = cn(content(), className);

  return (
    <Content
      className={mergedCls}
      data-slot="navigation-menu-content"
      {...rest}
    />
  );
};

export default NavigationMenuContent;

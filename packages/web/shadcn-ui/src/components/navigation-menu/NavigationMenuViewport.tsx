import { Viewport } from '@radix-ui/react-navigation-menu';
import { cn } from '@skyroc/utils';
import { navigationMenuVariants } from './navigation-menu';
import type { NavigationMenuViewportProps } from './types';

const NavigationMenuViewport = (props: NavigationMenuViewportProps) => {
  const { className, classNames, size, ...rest } = props;

  const { viewport, viewportRoot } = navigationMenuVariants({ size });

  const mergedCls = {
    cls: cn(viewport(), className || classNames?.viewport),
    root: cn(viewportRoot(), classNames?.viewportRoot)
  };

  return (
    <div
      className={mergedCls.root}
      data-slot="navigation-menu-viewport-root"
    >

      <Viewport
        className={mergedCls.cls}
        data-slot="navigation-menu-viewport"
        {...rest}
      />
    </div>
  );
};

export default NavigationMenuViewport;

import { Trigger } from '@radix-ui/react-navigation-menu';
import { ChevronDown } from 'lucide-react';
import { cn } from '@skyroc/utils';
import { navigationMenuVariants } from './navigation-menu';
import type { NavigationMenuTriggerProps } from './types';

const NavigationMenuTrigger = (props: NavigationMenuTriggerProps) => {
  const { children, className, classNames, leading, size, trailing, ...rest } = props;

  const { trigger, triggerIcon } = navigationMenuVariants({ size });

  const mergedCls = {
    cls: cn(trigger(), className || classNames?.trigger),
    triggerIcon: cn(triggerIcon(), classNames?.triggerIcon)
  };

  return (
    <Trigger
      {...rest}
      className={mergedCls.cls}
      data-slot="navigation-menu-trigger"
    >
      {leading}
      <span data-slot="navigation-menu-trigger-labe">{children}</span>

      {trailing || (
        <ChevronDown
          aria-hidden="true"
          className={mergedCls.triggerIcon}
        />
      )}
    </Trigger>
  );
};

export default NavigationMenuTrigger;

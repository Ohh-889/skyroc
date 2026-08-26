import { isValidElement } from 'react';
import { NavigationMenuLink } from '@radix-ui/react-navigation-menu';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@skyroc/utils';
import { withClassName } from '@skyroc/utils/web';
import { navigationMenuVariants } from './navigation-menu';
import type { NavigationMenuChildLinkProps } from './types';

const NavigationMenuChildLink = (props: NavigationMenuChildLinkProps) => {
  const { children, className, classNames, component: Component = 'a', description, disabled, leading, size, trailing, ...rest } = props;

  const { itemIcon, linkIcon, subLink, subLinkContent, subLinkDescription, subLinkLabel } = navigationMenuVariants({
    size
  });

  const mergedCls = {
    cls: cn(subLink(), className || classNames?.subLink),
    content: cn(subLinkContent(), classNames?.subLinkContent),
    description: cn(subLinkDescription(), classNames?.subLinkDescription),
    icon: cn(itemIcon(), classNames?.itemIcon),
    linkIcon: cn(linkIcon(), classNames?.linkIcon),
    label: cn(subLinkLabel(), classNames?.subLinkLabel)
  };

  return (
    <NavigationMenuLink
      asChild
      className={mergedCls.cls}
      data-disabled={disabled ? '' : undefined}
      data-slot="navigation-menu-child-link"
      {...rest}
    >
      <Component>
        {isValidElement(leading) ? withClassName(leading, mergedCls.icon) : leading}

        <div className={mergedCls.content}>
          <span className={mergedCls.label}>{children}</span>
          {description ? <p className={mergedCls.description}>{description}</p> : null}
        </div>

        {trailing || <ArrowUpRight className={mergedCls.icon} />}
      </Component>
    </NavigationMenuLink>
  );
};

export default NavigationMenuChildLink;

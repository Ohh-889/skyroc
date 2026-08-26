import type { ComponentRef } from 'react';
import { forwardRef, isValidElement } from 'react';
import { SubTrigger as _SubTrigger } from '@radix-ui/react-menu';
import { ChevronRight } from 'lucide-react';
import { cn } from '@skyroc/utils';
import { withClassName } from '@skyroc/utils/web';
import { menuVariants } from './menu-variants';
import type { MenuSubTriggerProps } from './types';

const MenuSubTrigger = forwardRef<ComponentRef<typeof _SubTrigger>, MenuSubTriggerProps>((props, ref) => {
  const {
    children,
    className,
    classNames,
    component: SubTrigger = _SubTrigger,
    leading,
    size,
    trailing,
    triggerIcon,
    ...rest
  } = props;

  const { itemIcon, subTrigger, subTriggerIcon } = menuVariants({ size });

  const mergedCls = cn(subTrigger(), className);

  const mergedTrailingIconCls = cn(subTriggerIcon(), classNames?.subTriggerIcon);

  return (
    <SubTrigger
      className={mergedCls}
      ref={ref}
      {...rest}
    >
      {isValidElement(leading) ? withClassName(leading, itemIcon()) : leading}
      {children}
      {trailing}
      {triggerIcon || <ChevronRight className={mergedTrailingIconCls} />}
    </SubTrigger>
  );
});

MenuSubTrigger.displayName = 'MenuSubTrigger';

export default MenuSubTrigger;

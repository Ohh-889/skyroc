import type { ComponentRef } from 'react';
import { forwardRef, isValidElement } from 'react';
import { CheckboxItem as _CheckboxItem } from '@radix-ui/react-menu';
import { Check } from 'lucide-react';
import { cn } from '@skyroc/utils';
import { withClassName } from '@skyroc/utils/web';
import MenuShortcut from '../menu/MenuShortcut';
import MenuItemIndicator from './MenuItemIndicator';
import { menuVariants } from './menu-variants';
import type { MenuCheckboxItemProps } from './types';

const MenuCheckboxItem = forwardRef<ComponentRef<typeof _CheckboxItem>, MenuCheckboxItemProps>((props, ref) => {
  const {
    children,
    className,
    classNames,
    component: CheckboxItem = _CheckboxItem,
    indicatorComponent: IndicatorComponent = MenuItemIndicator,
    indicatorIcon,
    leading,
    shortcut,
    size,
    trailing,
    ...rest
  } = props;

  const { checkboxItem, itemIcon } = menuVariants({ size });

  const mergedCls = cn(checkboxItem(), className || classNames?.item);

  return (
    <CheckboxItem
      className={mergedCls}
      ref={ref}
      {...rest}
    >
      <IndicatorComponent
        className={classNames?.itemIndicator}
        size={size}
      >
        {indicatorIcon || <Check />}
      </IndicatorComponent>

      {isValidElement(leading) ? withClassName(leading, itemIcon()) : leading}
      {children}
      {trailing}

      {shortcut
        ? (
          <MenuShortcut
            className={classNames?.shortcut}
            size={size}
            value={shortcut}
          />
        )
        : null}
    </CheckboxItem>
  );
});

MenuCheckboxItem.displayName = 'MenuCheckboxItem';

export default MenuCheckboxItem;

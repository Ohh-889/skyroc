import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { Item, ItemIndicator, ItemText } from '@radix-ui/react-select';
import { Check } from 'lucide-react';
import { cn } from '@skyroc/utils';
import { selectVariants } from './select-variants';
import type { SelectItemProps } from './types';

const SelectItem = forwardRef<ComponentRef<typeof Item>, SelectItemProps>((props, ref) => {
  const { children, className, classNames, indicatorIcon, leading, size, trailing, ...rest } = props;

  const { item, itemIndicator, itemText } = selectVariants({ size });

  const mergedCls = {
    itemCls: cn(item(), className || classNames?.item),
    itemIndicatorCls: cn(itemIndicator(), classNames?.itemIndicator),
    itemTextCls: cn(itemText(), classNames?.itemText)
  };

  return (
    <Item
      {...rest}
      className={mergedCls.itemCls}
      data-slot="select-item"
      ref={ref}
    >
      {leading}
      <ItemText className={mergedCls.itemTextCls} data-slot="select-item-text">{children}</ItemText>
      {trailing}

      <ItemIndicator
        asChild
        className={mergedCls.itemIndicatorCls}
        data-slot="select-item-indicator"
      >
        {indicatorIcon || <Check />}
      </ItemIndicator>
    </Item>
  );
});

SelectItem.displayName = 'SelectItem';

export default SelectItem;

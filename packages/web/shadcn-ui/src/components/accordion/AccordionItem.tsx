import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { Item } from '@radix-ui/react-accordion';
import { cn } from '@skyroc/utils';
import { accordionVariants } from './accordion-variants';
import type { AccordionItemProps } from './types';

const AccordionItem = forwardRef<ComponentRef<typeof Item>, AccordionItemProps>((props, ref) => {
  const { className, ...rest } = props;

  const { item } = accordionVariants();

  const mergedCls = cn(item(), className);

  return (
    <Item
      className={mergedCls}
      data-slot="accordion-item"
      ref={ref}
      {...rest}
    />
  );
});
AccordionItem.displayName = Item.displayName;

export default AccordionItem;

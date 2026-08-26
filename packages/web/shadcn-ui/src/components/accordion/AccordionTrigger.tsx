import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { Trigger } from '@radix-ui/react-accordion';
import { Slot } from '@radix-ui/react-slot';
import { ChevronDown } from 'lucide-react';
import { cn } from '@skyroc/utils';
import { accordionVariants } from './accordion-variants';
import type { AccordionTriggerProps } from './types';

const AccordionTrigger = forwardRef<ComponentRef<typeof Trigger>, AccordionTriggerProps>((props, ref) => {
  const { children, className, classNames, icon, leading, size, trailing, ...rest } = props;

  const { trigger, triggerIcon, triggerLeadingIcon } = accordionVariants({ size });

  const mergedCls = cn(trigger(), className);

  const leadingIcon = cn(triggerLeadingIcon(), classNames?.triggerLeadingIcon);

  const iconCls = cn(triggerIcon(), classNames?.triggerIcon);

  return (
    <Trigger
      className={mergedCls}
      data-slot="accordion-trigger"
      ref={ref}
      {...rest}
    >
      <Slot className={leadingIcon}>{leading}</Slot>
      {children}
      {trailing}
      <Slot className={iconCls}>{icon || <ChevronDown />}</Slot>
    </Trigger>
  );
});
AccordionTrigger.displayName = Trigger.displayName;

export default AccordionTrigger;

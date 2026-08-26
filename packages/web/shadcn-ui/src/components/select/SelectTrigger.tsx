import { Icon, Trigger, Value } from '@radix-ui/react-select';
import { ChevronsUpDown } from 'lucide-react';
import { cn } from '@skyroc/utils';
import { selectVariants } from './select-variants';
import type { SelectTriggerProps } from './types';

const SelectTrigger = (props: SelectTriggerProps) => {
  const { children, className, classNames, leading, placeholder, size, trailing, triggerIcon, ...rest } = props;

  const { trigger, triggerIcon: triggerIconCls } = selectVariants({ size });

  const mergedCls = {
    triggerCls: cn(trigger(), className || classNames?.trigger),
    triggerIconCls: cn(triggerIconCls(), classNames?.triggerIcon)
  };

  return (
    <Trigger
      {...rest}
      className={mergedCls.triggerCls}
      data-slot="select-trigger"
    >
      {leading}

      <Value
        asChild={Boolean(children)}
        className={cn(classNames?.selectedValue)}
        data-slot="select-trigger-value"
        placeholder={placeholder}
      >
        {children}
      </Value>

      {trailing}

      <Icon
        asChild
        className={mergedCls.triggerIconCls}
        data-slot="select-trigger-icon"
      >
        {triggerIcon || <ChevronsUpDown />}
      </Icon>
    </Trigger>
  );
};

export default SelectTrigger;

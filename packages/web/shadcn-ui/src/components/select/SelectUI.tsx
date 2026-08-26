'use client';

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { Root } from '@radix-ui/react-select';
import SelectContent from './SelectContent';
import SelectOption from './SelectOption';
import SelectTrigger from './SelectTrigger';
import type { SelectProps } from './types';

const SelectUI = forwardRef<ComponentRef<typeof SelectContent>, SelectProps>((props, ref) => {
  const { classNames, contentProps, indicatorIcon, items, size, triggerProps, ...rest } = props;
  const { classNames: contentClassNames, size: contentSize, ...restContentProps } = contentProps ?? {};
  const { classNames: triggerClassNames, size: triggerSize, ...restTriggerProps } = triggerProps ?? {};

  return (
    <Root
      data-slot="select-root"
      {...rest}
    >
      <SelectTrigger
        classNames={{
          selectedValue: classNames?.selectedValue,
          trigger: classNames?.trigger,
          triggerIcon: classNames?.triggerIcon,
          ...triggerClassNames
        }}
        size={triggerSize || size}
        {...restTriggerProps}
      />

      <SelectContent
        classNames={{
          content: classNames?.content,
          scrollDownButton: classNames?.scrollDownButton,
          scrollUpButton: classNames?.scrollUpButton,
          viewport: classNames?.viewport,
          ...contentClassNames
        }}
        ref={ref}
        size={contentSize || size}
        {...restContentProps}
      >
        {items.map((item, index) => (
          <SelectOption
            classNames={classNames}
            indicatorIcon={indicatorIcon}
            item={item}
            key={String(index)}
            size={size}
          />
        ))}
      </SelectContent>
    </Root>
  );
});

SelectUI.displayName = 'SelectUI';

export default SelectUI;

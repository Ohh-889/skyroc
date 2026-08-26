'use client';

import { Root } from '@radix-ui/react-radio-group';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cn } from '@skyroc/utils';
import { radioVariants } from './radio-variants';
import RadioCard from './RadioCard';
import type { RadioCardGroupProps } from './types';

const RadioCardGroup = (props: RadioCardGroupProps) => {
  const {
    className,
    classNames,
    color,
    defaultValue,
    disabled,
    items,
    onValueChange,
    orientation = 'horizontal',
    radioPosition = 'right',
    size,
    value,
    variant,
    ...rest
  } = props;

  const { group } = radioVariants({ orientation, size });

  const mergedCls = cn(group(), className || classNames?.group);

  const [currentValue, setCurrentValue] = useControllableState({
    defaultProp: defaultValue ?? '',
    onChange: onValueChange,
    prop: value ?? undefined
  });

  return (
    <Root
      className={mergedCls}
      disabled={disabled}
      value={currentValue}
      onValueChange={setCurrentValue}
      {...rest}
    >
      {items.map((item) => {
        const isChecked = currentValue === item.value;
        const isDisabled = disabled || item.disabled;

        return (
          <RadioCard
            checked={isChecked}
            classNames={classNames}
            color={color}
            disabled={isDisabled}
            key={item.value}
            radioPosition={radioPosition}
            size={size}
            variant={variant}
            {...item}
          />
        );
      })}
    </Root>
  );
};

RadioCardGroup.displayName = 'RadioCardGroup';

export default RadioCardGroup;

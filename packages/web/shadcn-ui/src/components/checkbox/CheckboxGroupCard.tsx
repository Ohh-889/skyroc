'use client';

import { useCallback, useMemo } from 'react';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cn } from '@skyroc/utils';
import { checkboxVariants } from './checkbox-variants';
import { CheckboxGroupProvider } from './CheckboxGroupContext';
import type { CheckboxGroupCardProps } from './types';
import CheckboxCard from './CheckboxCard';

const CheckboxGroupCard = (props: CheckboxGroupCardProps) => {
  const {
    checkboxPosition = 'right',
    checkedIcon,
    className,
    classNames,
    color,
    defaultValue,
    disabled,
    indeterminateIcon,
    items,
    onValueChange,
    orientation = 'horizontal',
    shape = 'rounded',
    size,
    value: controlledValue
  } = props;

  const [uncontrolledValue, setUncontrolledValue] = useControllableState({
    caller: 'checkbox-group-card',
    defaultProp: defaultValue || [],
    onChange: onValueChange,
    prop: controlledValue
  });

  const isControlled = controlledValue !== undefined;

  const value = isControlled ? controlledValue : uncontrolledValue;

  const { groupRoot } = checkboxVariants({ orientation, size });

  const mergedCls = cn(
    groupRoot(),
    className || classNames?.groupRoot
  );

  const handleValueChange = useCallback(
    (itemValue: string, checked: boolean) => {
      const newValue = checked
        ? [...value, itemValue]
        : value.filter(v => v !== itemValue);

      if (!isControlled) {
        setUncontrolledValue(newValue);
      }

      onValueChange?.(newValue);
    },
    [value, isControlled, onValueChange, setUncontrolledValue]
  );

  const contextValue = useMemo(
    () => ({
      color,
      disabled,
      onValueChange: handleValueChange,
      size,
      value
    }),
    [color, disabled, handleValueChange, size, value]
  );

  return (
    <CheckboxGroupProvider value={contextValue}>
      <div
        className={mergedCls}
        data-slot="checkbox-group-card"
        role="group"
      >
        {items.map((item) => {
          const isChecked = value.includes(item.value);
          const isDisabled = disabled || item.disabled;

          return (
            <CheckboxCard
              checkboxPosition={checkboxPosition}
              checked={isChecked}
              checkedIcon={checkedIcon}
              color={color}
              disabled={isDisabled}
              indeterminateIcon={indeterminateIcon}
              key={item.value}
              shape={shape}
              size={size}
              onCheckedChange={(checked) => {
                if (checked !== 'indeterminate') {
                  handleValueChange(item.value, checked);
                }
              }}
              {...item}
            />
          );
        })}
      </div>
    </CheckboxGroupProvider>
  );
};

CheckboxGroupCard.displayName = 'CheckboxGroupCard';

export default CheckboxGroupCard;

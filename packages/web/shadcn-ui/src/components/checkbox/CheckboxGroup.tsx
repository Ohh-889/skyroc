'use client';

import { useCallback, useMemo } from 'react';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cn } from '@skyroc/utils';
import type { Value } from '../../types/shared';
import Checkbox from './CheckboxUI';
import { CheckboxGroupProvider } from './CheckboxGroupContext';
import type { CheckboxGroupProps } from './types';
import { checkboxVariants } from './checkbox-variants';

const CheckboxGroup = (props: CheckboxGroupProps) => {
  const {
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
    size,
    value: controlledValue
  } = props;

  const [uncontrolledValue, setUncontrolledValue] = useControllableState({
    caller: 'checkbox-group',
    defaultProp: defaultValue || [],
    onChange: onValueChange,
    prop: controlledValue
  });

  const isControlled = controlledValue !== undefined;

  const { groupRoot } = checkboxVariants({ orientation, size });

  const mergedCls = cn(groupRoot(), className || classNames?.groupRoot);

  const value = isControlled ? controlledValue : uncontrolledValue;

  const handleValueChange = useCallback(
    (itemValue: Value, checked: boolean) => {
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
        data-slot="checkbox-group"
        role="group"
      >
        {items.map((item) => {
          const isChecked = value.includes(item.value || '');
          const isDisabled = disabled || item.disabled;

          return (
            <Checkbox
              checked={isChecked}
              checkedIcon={checkedIcon}
              classNames={classNames}
              color={color}
              disabled={isDisabled}
              indeterminateIcon={indeterminateIcon}
              key={item.value}
              size={size}
              onCheckedChange={(checked) => {
                if (checked !== 'indeterminate') {
                  handleValueChange(item.value, checked);
                }
              }}
              {...item}
            >
              {item.label}
            </Checkbox>
          );
        })}
      </div>
    </CheckboxGroupProvider>
  );
};

CheckboxGroup.displayName = 'CheckboxGroup';

export default CheckboxGroup;

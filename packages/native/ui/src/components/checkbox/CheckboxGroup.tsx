import { useMemo } from 'react';
import { View } from 'react-native';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cn } from '@skyroc/utils';
import { CheckboxGroupContext } from './CheckboxGroupContext';
import { checkboxGroupVariants } from './checkbox-variants';
import type { CheckboxGroupContextValue, CheckboxGroupProps } from './types';

const CheckboxGroup = (props: CheckboxGroupProps) => {
  const {
    checkedIcon,
    children,
    className,
    color,
    defaultValue = [],
    direction = 'vertical',
    disabled = false,
    iconSize,
    indeterminateIcon,
    max,
    onChange,
    shape,
    size,
    value: valueProp
  } = props;

  const [value, setValue] = useControllableState({
    caller: 'checkbox-group',
    defaultProp: defaultValue,
    onChange,
    prop: valueProp
  });

  const contextValue = useMemo<CheckboxGroupContextValue>(() => {
    function isChecked(name: string): boolean {
      return value.includes(name);
    }

    function isMaxReached(): boolean {
      if (max === undefined || max <= 0) return false;
      return value.length >= max;
    }

    function toggle(name: string, checked: boolean) {
      const next = checked ? [...value, name] : value.filter(v => v !== name);
      setValue(next);
    }

    return {
      checkedIcon,
      color,
      disabled,
      iconSize,
      indeterminateIcon,
      isChecked,
      isMaxReached,
      shape,
      size,
      toggle
    };
  }, [value, setValue, checkedIcon, color, disabled, iconSize, indeterminateIcon, max, shape, size]);

  return (
    <CheckboxGroupContext.Provider value={contextValue}>
      <View className={cn(checkboxGroupVariants({ direction, size }), className)}>{children}</View>
    </CheckboxGroupContext.Provider>
  );
};

export { CheckboxGroup };

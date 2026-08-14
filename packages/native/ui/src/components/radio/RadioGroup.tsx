import { useMemo } from 'react';
import { View } from 'react-native';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cn } from '@skyroc/utils';
import { RadioGroupContext } from './RadioGroupContext';
import { radioGroupVariants } from './radio-variants';
import type { RadioGroupContextValue, RadioGroupProps } from './types';

const RadioGroup = (props: RadioGroupProps) => {
  const {
    checkedIcon,
    children,
    className,
    color,
    defaultValue = '',
    direction = 'vertical',
    disabled = false,
    iconSize,
    onChange,
    shape,
    size,
    value: valueProp
  } = props;

  const [value, setValue] = useControllableState({
    caller: 'radio-group',
    defaultProp: defaultValue,
    onChange,
    prop: valueProp
  });

  const contextValue = useMemo<RadioGroupContextValue>(() => {
    function isChecked(name: string): boolean {
      return value === name;
    }

    function select(name: string) {
      setValue(name);
    }

    return {
      checkedIcon,
      color,
      disabled,
      iconSize,
      isChecked,
      select,
      shape,
      size
    };
  }, [value, setValue, checkedIcon, color, disabled, iconSize, shape, size]);

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <View className={cn(radioGroupVariants({ direction, size }), className)}>{children}</View>
    </RadioGroupContext.Provider>
  );
};

export { RadioGroup };

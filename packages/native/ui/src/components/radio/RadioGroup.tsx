import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cn } from '@skyroc/utils';
import { useMemo } from 'react';
import { View } from 'react-native';
import { radioGroupVariants } from './radio-variants';
import { RadioGroupContext } from './RadioGroupContext';
import type { RadioGroupContextValue, RadioGroupProps, RadioValue } from './types';

const RadioGroup = <T extends RadioValue = RadioValue>(props: RadioGroupProps<T>) => {
  const {
    checkedIcon,
    children,
    className,
    color,
    defaultValue,
    direction = 'vertical',
    disabled = false,
    iconSize,
    labelPosition,
    onChange,
    ref,
    shape,
    size,
    value: valueProp
  } = props;

  // Context 内部统一按 RadioValue 流转，只在回传给使用方时收窄回 T
  function handleChange(next: RadioValue | undefined) {
    if (next === undefined) return;

    onChange?.(next as T);
  }

  // 未选中用 undefined 表示，空串是合法 value 不能兼作哨兵
  const [value, setValue] = useControllableState<RadioValue | undefined>({
    caller: 'RadioGroup',
    defaultProp: defaultValue,
    onChange: handleChange,
    prop: valueProp
  });

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      root: cn(radioGroupVariants({ direction, size }), className)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  const contextValue = useMemo<RadioGroupContextValue>(() => {
    function isChecked(name: RadioValue) {
      return value === name;
    }

    function select(name: RadioValue) {
      setValue(name);
    }

    return {
      checkedIcon,
      color,
      disabled,
      iconSize,
      isChecked,
      labelPosition,
      select,
      shape,
      size
    };
  }, [value, setValue, checkedIcon, color, disabled, iconSize, labelPosition, shape, size]);

  return (
    <RadioGroupContext value={contextValue}>
      <View
        ref={ref}
        className={slotClassNames.root}
      >
        {children}
      </View>
    </RadioGroupContext>
  );
};

export { RadioGroup };

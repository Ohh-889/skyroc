import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cn } from '@skyroc/utils';
import { useMemo } from 'react';
import { View } from 'react-native';
import { checkboxGroupVariants } from './checkbox-variants';
import { CheckboxGroupContext } from './CheckboxGroupContext';
import type { CheckboxGroupContextValue, CheckboxGroupProps, CheckboxValue } from './types';

/** 非受控默认值的稳定引用，避免每次渲染都产生新数组 */
const EMPTY_VALUE: CheckboxValue[] = [];

const CheckboxGroup = <T extends CheckboxValue = CheckboxValue>(props: CheckboxGroupProps<T>) => {
  const {
    checkedIcon,
    children,
    className,
    color,
    defaultValue,
    direction = 'vertical',
    disabled = false,
    iconSize,
    indeterminateIcon,
    labelPosition,
    max,
    onChange,
    shape,
    size,
    testID,
    value: valueProp
  } = props;

  // Context 内部统一按 CheckboxValue 流转，只在回传给使用方时收窄回 T
  function handleChange(next: CheckboxValue[]) {
    onChange?.(next as T[]);
  }

  const [value, setValue] = useControllableState<CheckboxValue[]>({
    caller: 'CheckboxGroup',
    defaultProp: defaultValue ?? EMPTY_VALUE,
    onChange: handleChange,
    prop: valueProp
  });

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      root: cn(checkboxGroupVariants({ direction, size }), className)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  const contextValue = useMemo<CheckboxGroupContextValue>(() => {
    function isChecked(name: CheckboxValue) {
      return value.includes(name);
    }

    function isMaxReached() {
      if (max === undefined || max <= 0) return false;

      return value.length >= max;
    }

    /** 选中上限与去重都收在这里兜底，消费方（含外部自定义子项）无需也无法绕过 */
    function toggle(name: CheckboxValue, checked: boolean) {
      if (!checked) {
        setValue(value.filter(item => item !== name));
        return true;
      }

      if (value.includes(name)) return true;

      if (isMaxReached()) return false;

      setValue([...value, name]);
      return true;
    }

    return {
      checkedIcon,
      color,
      disabled,
      iconSize,
      indeterminateIcon,
      isChecked,
      isMaxReached,
      labelPosition,
      shape,
      size,
      toggle
    };
  }, [value, setValue, checkedIcon, color, disabled, iconSize, indeterminateIcon, labelPosition, max, shape, size]);

  return (
    <CheckboxGroupContext value={contextValue}>
      <View
        className={slotClassNames.root}
        testID={testID}
      >
        {children}
      </View>
    </CheckboxGroupContext>
  );
};

export { CheckboxGroup };

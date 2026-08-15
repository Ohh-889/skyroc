import { cn, isNumber, isString } from '@skyroc/utils';
import { Pressable, View } from 'react-native';
import { Text } from '../text/Typography';
import { radioVariants } from './radio-variants';
import { RadioIndicator } from './RadioIndicator';
import type { RadioProps } from './types';
import { useRadioItem } from './useRadioItem';

const Radio = (props: RadioProps) => {
  const {
    checked,
    checkedIcon,
    children,
    className,
    color,
    defaultChecked,
    disabled,
    iconSize,
    labelDisabled = false,
    labelPosition,
    name,
    onCheckedChange,
    shape,
    size
  } = props;

  const item = useRadioItem({
    caller: 'Radio',
    checked,
    checkedIcon,
    color,
    defaultChecked,
    disabled,
    iconSize,
    labelPosition,
    name,
    onCheckedChange,
    shape,
    size
  });

  const variantSlots = radioVariants({
    disabled: item.disabled,
    labelPosition: item.labelPosition,
    size: item.size
  });

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      control: 'active:opacity-70',
      label: variantSlots.label(),
      labelWrapper: 'active:opacity-70',
      root: cn(variantSlots.root(), className)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  function renderLabel() {
    if (children === null || children === undefined) return null;

    const isTextChild = isString(children) || isNumber(children);

    return (
      <Pressable
        className={slotClassNames.labelWrapper}
        disabled={item.disabled || labelDisabled}
        onPress={item.select}
      >
        {isTextChild ? <Text className={slotClassNames.label}>{children}</Text> : children}
      </Pressable>
    );
  }

  return (
    <View className={slotClassNames.root}>
      <Pressable
        className={slotClassNames.control}
        disabled={item.disabled}
        hitSlop={4}
        onPress={item.select}
      >
        <RadioIndicator
          checked={item.checked}
          checkedIcon={item.checkedIcon}
          color={item.color}
          shape={item.shape}
          sizes={item.sizes}
        />
      </Pressable>

      {renderLabel()}
    </View>
  );
};

export { Radio };

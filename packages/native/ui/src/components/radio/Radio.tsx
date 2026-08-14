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

  const { label: labelCls, root: rootCls } = radioVariants({
    disabled: item.disabled,
    labelPosition: item.labelPosition,
    size: item.size
  });

  function renderLabel() {
    if (children === null || children === undefined) return null;

    const isTextChild = isString(children) || isNumber(children);

    return (
      <Pressable
        className="active:opacity-70"
        disabled={item.disabled || labelDisabled}
        onPress={item.select}
      >
        {isTextChild ? <Text className={labelCls()}>{children}</Text> : children}
      </Pressable>
    );
  }

  return (
    <View className={cn(rootCls(), className)}>
      <Pressable
        className="active:opacity-70"
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

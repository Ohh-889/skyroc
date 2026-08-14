/* eslint-disable complexity */
import { useContext } from 'react';
import { Pressable, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cn, isString } from '@skyroc/utils';
import { Text } from '../text/Typography';
import { RadioGroupContext } from './RadioGroupContext';
import { SIZE_CONTROL_MAP, SIZE_DOT_MAP, SIZE_INNER_ICON_MAP, radioVariants } from './radio-variants';
import type { RadioProps } from './types';

const INDICATOR_COLOR = '#fff';

const Radio = (props: RadioProps) => {
  const {
    checked: checkedProp,
    checkedIcon,
    children,
    className,
    color: colorProp,
    defaultChecked = false,
    disabled: disabledProp = false,
    iconSize: iconSizeProp,
    labelDisabled = false,
    labelPosition = 'right',
    name,
    onCheckedChange,
    shape = 'round',
    size: sizeProp
  } = props;

  const group = useContext(RadioGroupContext);

  const isGrouped = group !== undefined && name !== undefined;

  const [internalChecked, setInternalChecked] = useControllableState({
    caller: 'radio',
    defaultProp: defaultChecked,
    onChange: onCheckedChange,
    prop: isGrouped ? undefined : checkedProp
  });

  const isChecked = isGrouped ? group.isChecked(name) : internalChecked;

  const disabled = disabledProp || (group?.disabled ?? false);
  const color = colorProp ?? group?.color ?? 'primary';
  const size = sizeProp ?? group?.size ?? 'md';
  const controlSize = iconSizeProp ?? group?.iconSize ?? SIZE_CONTROL_MAP[size];
  const innerIconSize = SIZE_INNER_ICON_MAP[size];
  const dotSize = SIZE_DOT_MAP[size];
  const resolvedShape = group?.shape ?? shape;
  const resolvedCheckedIcon = checkedIcon ?? group?.checkedIcon;

  const {
    control: controlCls,
    dot: dotCls,
    label: labelCls,
    root: rootCls
  } = radioVariants({
    active: isChecked,
    color,
    disabled,
    labelPosition,
    shape: resolvedShape,
    size
  });

  function handleToggle() {
    if (disabled) return;

    if (isGrouped) {
      if (isChecked) return;
      group.select(name);
      return;
    }

    setInternalChecked(!isChecked);
  }

  function handleLabelPress() {
    if (labelDisabled) return;
    handleToggle();
  }

  function renderIndicator() {
    if (!isChecked) return null;

    if (resolvedCheckedIcon) {
      return resolvedCheckedIcon;
    }

    if (resolvedShape === 'square') {
      return (
        <Feather
          color={INDICATOR_COLOR}
          name="check"
          size={innerIconSize}
        />
      );
    }

    // round shape: render dot
    return (
      <View style={{ height: dotSize, width: dotSize }}>
        <View className={dotCls()} />
      </View>
    );
  }

  return (
    <View className={cn(rootCls(), className)}>
      <Pressable
        disabled={disabled}
        hitSlop={4}
        onPress={handleToggle}
        style={{ height: controlSize, width: controlSize }}
      >
        <View className={controlCls()}>{renderIndicator()}</View>
      </Pressable>

      {children ? (
        <Pressable
          disabled={disabled || labelDisabled}
          onPress={handleLabelPress}
        >
          {isString(children) ? <Text className={labelCls()}>{children}</Text> : <View>{children}</View>}
        </Pressable>
      ) : null}
    </View>
  );
};

export { Radio };

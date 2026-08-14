/* eslint-disable no-nested-ternary */
import { Pressable, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cn, isString } from '@skyroc/utils';
import { Text } from '../text/Typography';
import {
  SIZE_CONTROL_MAP,
  SIZE_DOT_MAP,
  SIZE_INNER_ICON_MAP,
  radioCardVariants,
  radioVariants
} from './radio-variants';
import type { RadioCardProps } from './types';

const INDICATOR_COLOR = '#fff';

const RadioCard = (props: RadioCardProps) => {
  const {
    checked: checkedProp,
    checkedIcon,
    className,
    color = 'primary',
    defaultChecked = false,
    description,
    disabled = false,
    icon,
    iconSize: iconSizeProp,
    label,
    name: _name,
    onCheckedChange,
    radioPosition = 'left',
    shape = 'round',
    size = 'md'
  } = props;

  const [internalChecked, setInternalChecked] = useControllableState({
    caller: 'radio-card',
    defaultProp: defaultChecked,
    onChange: onCheckedChange,
    prop: checkedProp
  });

  const isChecked = internalChecked;

  const controlSize = iconSizeProp ?? SIZE_CONTROL_MAP[size];
  const innerIconSize = SIZE_INNER_ICON_MAP[size];
  const dotSize = SIZE_DOT_MAP[size];

  const { control: controlCls, dot: dotCls } = radioVariants({
    active: isChecked,
    color,
    shape,
    size
  });

  const {
    card: cardCls,
    cardContent: cardContentCls,
    cardDescription: cardDescriptionCls,
    cardLabel: cardLabelCls
  } = radioCardVariants({ disabled });

  function handleToggle() {
    if (disabled) return;
    setInternalChecked(!isChecked);
  }

  function renderRadio() {
    if (isChecked && checkedIcon) {
      return checkedIcon;
    }

    return (
      <View style={{ height: controlSize, width: controlSize }}>
        <View className={controlCls()}>
          {isChecked ? (
            shape === 'square' ? (
              <Feather
                color={INDICATOR_COLOR}
                name="check"
                size={innerIconSize}
              />
            ) : (
              <View style={{ height: dotSize, width: dotSize }}>
                <View className={dotCls()} />
              </View>
            )
          ) : null}
        </View>
      </View>
    );
  }

  function renderLabel() {
    if (!label) return null;
    if (isString(label)) return <Text className={cardLabelCls()}>{label}</Text>;
    return label;
  }

  function renderDescription() {
    if (!description) return null;
    if (isString(description)) return <Text className={cardDescriptionCls()}>{description}</Text>;
    return description;
  }

  function renderContent() {
    return (
      <View className={cardContentCls()}>
        {icon ? <View className="shrink-0">{icon}</View> : null}
        <View className="flex-1 gap-0.5">
          {renderLabel()}
          {renderDescription()}
        </View>
      </View>
    );
  }

  return (
    <Pressable
      className={cn(cardCls(), className)}
      disabled={disabled}
      onPress={handleToggle}
    >
      {radioPosition === 'left' && renderRadio()}
      {renderContent()}
      {radioPosition === 'right' && renderRadio()}
    </Pressable>
  );
};

export { RadioCard };

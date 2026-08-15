import { Pressable, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cn, isString } from '@skyroc/utils';
import { Text } from '../text/Typography';
import { SIZE_CONTROL_MAP, SIZE_INNER_ICON_MAP, checkboxCardVariants, checkboxVariants } from './checkbox-variants';
import type { CheckboxCardProps } from './types';

const INDICATOR_COLOR = '#fff';

const CheckboxCard = (props: CheckboxCardProps) => {
  const {
    checked: checkedProp,
    checkedIcon,
    checkboxPosition = 'left',
    className,
    color = 'primary',
    defaultChecked = false,
    description,
    disabled = false,
    icon,
    iconSize: iconSizeProp,
    indeterminateIcon,
    label,
    name: _name,
    onCheckedChange,
    shape = 'round',
    size = 'md'
  } = props;

  const isIndeterminate = checkedProp === 'indeterminate';

  const [internalChecked, setInternalChecked] = useControllableState({
    caller: 'checkbox-card',
    defaultProp: defaultChecked,
    onChange: onCheckedChange,
    prop: isIndeterminate ? false : (checkedProp as boolean | undefined)
  });

  const isChecked = internalChecked;
  const isActive = isChecked || isIndeterminate;

  const controlSize = iconSizeProp ?? SIZE_CONTROL_MAP[size];
  const innerIconSize = SIZE_INNER_ICON_MAP[size];

  const { control: controlCls } = checkboxVariants({
    active: isActive,
    color,
    shape,
    size
  });

  const {
    card: cardCls,
    cardContent: cardContentCls,
    cardDescription: cardDescriptionCls,
    cardLabel: cardLabelCls
  } = checkboxCardVariants({ disabled });

  function handleToggle() {
    if (disabled) return;
    setInternalChecked(!isChecked);
  }

  function renderCheckbox() {
    if (isIndeterminate && indeterminateIcon) {
      return indeterminateIcon;
    }

    if (isChecked && checkedIcon) {
      return checkedIcon;
    }

    return (
      <View
        className={controlCls()}
        style={{ height: controlSize, width: controlSize }}
      >
        {isActive ? (
          <Feather
            color={INDICATOR_COLOR}
            name={isIndeterminate ? 'minus' : 'check'}
            size={innerIconSize}
          />
        ) : null}
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
      {checkboxPosition === 'left' && renderCheckbox()}
      {renderContent()}
      {checkboxPosition === 'right' && renderCheckbox()}
    </Pressable>
  );
};

export { CheckboxCard };

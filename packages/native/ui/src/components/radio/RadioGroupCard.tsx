import { View } from 'react-native';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cn } from '@skyroc/utils';
import { RadioCard } from './RadioCard';
import { radioGroupVariants } from './radio-variants';
import type { RadioGroupCardProps } from './types';

const RadioGroupCard = (props: RadioGroupCardProps) => {
  const {
    className,
    color,
    defaultValue = '',
    direction = 'vertical',
    disabled = false,
    iconSize,
    items,
    onChange,
    radioPosition = 'left',
    shape = 'round',
    size,
    value: valueProp
  } = props;

  const [value, setValue] = useControllableState({
    caller: 'radio-group-card',
    defaultProp: defaultValue,
    onChange,
    prop: valueProp
  });

  function handleItemChange(itemValue: string) {
    setValue(itemValue);
  }

  return (
    <View className={cn(radioGroupVariants({ direction, size }), className)}>
      {items.map(item => {
        const isChecked = value === item.value;
        const isDisabled = disabled || (item.disabled ?? false);

        return (
          <RadioCard
            key={item.value}
            checked={isChecked}
            color={color}
            description={item.description}
            disabled={isDisabled}
            icon={item.icon}
            iconSize={iconSize}
            label={item.label}
            name={item.value}
            radioPosition={radioPosition}
            shape={shape}
            size={size}
            onCheckedChange={() => handleItemChange(item.value)}
          />
        );
      })}
    </View>
  );
};

export { RadioGroupCard };

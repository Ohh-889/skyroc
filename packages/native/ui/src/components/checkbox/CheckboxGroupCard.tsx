import { View } from 'react-native';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cn } from '@skyroc/utils';
import { CheckboxCard } from './CheckboxCard';
import { checkboxGroupVariants } from './checkbox-variants';
import type { CheckboxGroupCardProps } from './types';

const CheckboxGroupCard = (props: CheckboxGroupCardProps) => {
  const {
    checkboxPosition = 'left',
    className,
    color,
    defaultValue = [],
    direction = 'vertical',
    disabled = false,
    iconSize,
    items,
    onChange,
    shape = 'round',
    size,
    value: valueProp
  } = props;

  const [value, setValue] = useControllableState({
    caller: 'checkbox-group-card',
    defaultProp: defaultValue,
    onChange,
    prop: valueProp
  });

  function handleItemChange(itemValue: string, checked: boolean) {
    const next = checked ? [...value, itemValue] : value.filter(v => v !== itemValue);
    setValue(next);
  }

  return (
    <View className={cn(checkboxGroupVariants({ direction, size }), className)}>
      {items.map(item => {
        const isChecked = value.includes(item.value);
        const isDisabled = disabled || (item.disabled ?? false);

        return (
          <CheckboxCard
            key={item.value}
            checkboxPosition={checkboxPosition}
            checked={isChecked}
            color={color}
            description={item.description}
            disabled={isDisabled}
            icon={item.icon}
            iconSize={iconSize}
            label={item.label}
            name={item.value}
            shape={shape}
            size={size}
            onCheckedChange={checked => handleItemChange(item.value, checked)}
          />
        );
      })}
    </View>
  );
};

export { CheckboxGroupCard };

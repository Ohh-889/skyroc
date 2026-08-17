import { RadioCard } from './RadioCard';
import { RadioGroup } from './RadioGroup';
import type { RadioGroupCardProps, RadioValue } from './types';

/** RadioGroup 的数据驱动封装，选中态与互斥逻辑完全复用 RadioGroupContext */
const RadioGroupCard = <T extends RadioValue = RadioValue>(props: RadioGroupCardProps<T>) => {
  const {
    checkedIcon,
    className,
    color,
    defaultValue,
    direction = 'vertical',
    disabled = false,
    iconSize,
    itemClassNames,
    items,
    onChange,
    radioPosition = 'left',
    ref,
    shape,
    size,
    value
  } = props;

  return (
    <RadioGroup<T>
      ref={ref}
      checkedIcon={checkedIcon}
      className={className}
      color={color}
      defaultValue={defaultValue}
      direction={direction}
      disabled={disabled}
      iconSize={iconSize}
      shape={shape}
      size={size}
      value={value}
      onChange={onChange}
    >
      {items.map(item => (
        <RadioCard
          key={String(item.value)}
          classNames={itemClassNames}
          description={item.description}
          disabled={item.disabled}
          icon={item.icon}
          label={item.label}
          name={item.value}
          radioPosition={radioPosition}
        />
      ))}
    </RadioGroup>
  );
};

export { RadioGroupCard };

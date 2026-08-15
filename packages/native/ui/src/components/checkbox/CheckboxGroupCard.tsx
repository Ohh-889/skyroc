import { CheckboxCard } from './CheckboxCard';
import { CheckboxGroup } from './CheckboxGroup';
import type { CheckboxGroupCardProps, CheckboxValue } from './types';

/** CheckboxGroup 的数据驱动封装，选中态、上限与去重逻辑完全复用 CheckboxGroupContext */
const CheckboxGroupCard = <T extends CheckboxValue = CheckboxValue>(props: CheckboxGroupCardProps<T>) => {
  const {
    checkboxPosition = 'left',
    checkedIcon,
    className,
    color,
    defaultValue,
    direction = 'vertical',
    disabled = false,
    iconSize,
    indeterminateIcon,
    items,
    max,
    onChange,
    shape,
    size,
    testID,
    value
  } = props;

  return (
    <CheckboxGroup<T>
      checkedIcon={checkedIcon}
      className={className}
      color={color}
      defaultValue={defaultValue}
      direction={direction}
      disabled={disabled}
      iconSize={iconSize}
      indeterminateIcon={indeterminateIcon}
      max={max}
      shape={shape}
      size={size}
      testID={testID}
      value={value}
      onChange={onChange}
    >
      {items.map(item => (
        <CheckboxCard
          key={String(item.value)}
          checkboxPosition={checkboxPosition}
          description={item.description}
          disabled={item.disabled}
          icon={item.icon}
          label={item.label}
          name={item.value}
        />
      ))}
    </CheckboxGroup>
  );
};

export { CheckboxGroupCard };

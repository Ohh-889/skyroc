import { Group } from '@radix-ui/react-select';
import { cn } from '@skyroc/utils';
import SelectItem from './SelectItem';
import SelectLabel from './SelectLabel';
import SelectSeparator from './SelectSeparator';
import { isGroup, isSeparator } from './shared';
import type { SelectOptionProps } from './types';

const SelectOption = (props: SelectOptionProps) => {
  const { classNames, indicatorIcon, item, size } = props;

  if (isSeparator(item)) {
    return (
      <SelectSeparator
        className={classNames?.separator}
        size={size}
        {...item}
      />
    );
  }

  if (isGroup(item)) {
    const { children, label, ...rest } = item;
    return (
      <Group className={cn(classNames?.group)} data-slot="select-group">
        <SelectLabel
          {...rest}
          className={classNames?.groupLabel}
        >
          {label}
        </SelectLabel>

        {children.map(({ label: childLabel, ...childRest }) => (
          <SelectItem
            classNames={classNames}
            indicatorIcon={indicatorIcon}
            key={childRest.value}
            size={size}
            {...childRest}
          >
            {childLabel}
          </SelectItem>
        ))}
      </Group>
    );
  }

  const { label, ...rest } = item;

  return (
    <SelectItem
      classNames={classNames}
      indicatorIcon={indicatorIcon}
      size={size}
      {...rest}
    >
      {label}
    </SelectItem>
  );
};

export default SelectOption;

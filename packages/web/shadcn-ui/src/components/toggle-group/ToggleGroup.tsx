import { isFunction } from '@skyroc/utils';
import ToggleGroupItem from './ToggleGroupItem';
import ToggleGroupRoot from './ToggleGroupRoot';
import type { ToggleGroupProps } from './types';

const ToggleGroup = (props: ToggleGroupProps) => {
  const { className, classNames, itemRender, items, size, variant, ...rest } = props;

  return (
    <ToggleGroupRoot {...rest} className={[classNames?.groupRoot, className]} size={size}>
      {items.map(item => {
        const { className: itemClassName, label, ...restItem } = item;

        return (
          <ToggleGroupItem
            key={item.value}
            className={[classNames?.toggle, itemClassName]}
            size={size}
            variant={variant}
            {...restItem}
          >
            {isFunction(itemRender) ? itemRender(item) : label}
          </ToggleGroupItem>
        );
      })}
    </ToggleGroupRoot>
  );
};

export default ToggleGroup;

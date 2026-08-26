import { Item } from '@radix-ui/react-toggle-group';
import { cn } from '@skyroc/utils';
import { toggleVariants } from '../toggle/toggle-variants';
import type { ToggleGroupItemProps } from './types';

const ToggleGroupItem = (props: ToggleGroupItemProps) => {
  const { className, size, variant, ...rest } = props;

  const { toggle } = toggleVariants({ size, variant });

  const mergedCls = cn(toggle(), className);

  return (
    <Item
      className={mergedCls}
      data-size={size}
      data-slot="toggle-group-item"
      data-variant={variant}
      {...rest}
    />
  );
};

export default ToggleGroupItem;

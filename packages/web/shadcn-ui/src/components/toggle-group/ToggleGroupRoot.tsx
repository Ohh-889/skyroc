import { Root } from '@radix-ui/react-toggle-group';
import { cn } from '@skyroc/utils';
import { toggleVariants } from '../toggle/toggle-variants';
import type { ToggleGroupRootProps } from './types';

const ToggleGroupRoot = (props: ToggleGroupRootProps) => {
  const { className, size, ...rest } = props;

  const { groupRoot } = toggleVariants({ size });

  const mergedCls = cn(groupRoot(), className);

  return (
    <Root
      data-size={size}
      data-slot="toggle-group"
      {...rest}
      className={mergedCls}
    />
  );
};

export default ToggleGroupRoot;

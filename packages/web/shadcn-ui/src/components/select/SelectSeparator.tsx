import { Separator } from '@radix-ui/react-select';
import { cn } from '@skyroc/utils';
import { selectVariants } from './select-variants';
import type { SelectSeparatorProps } from './types';

const SelectSeparator = (props: SelectSeparatorProps) => {
  const { className, size, ...rest } = props;

  const { separator } = selectVariants({ size });

  const mergedCls = cn(separator(), className);

  return (
    <Separator
      className={mergedCls}
      data-slot="select-separator"
      {...rest}
    />
  );
};

export default SelectSeparator;

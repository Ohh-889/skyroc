import { Label } from '@radix-ui/react-select';
import { cn } from '@skyroc/utils';
import { selectVariants } from './select-variants';
import type { SelectLabelProps } from './types';

const SelectLabel = (props: SelectLabelProps) => {
  const { className, size, ...rest } = props;

  const { groupLabel } = selectVariants({ size });

  const mergedCls = cn(groupLabel(), className);

  return (
    <Label
      className={mergedCls}
      data-slot="select-group-label"
      {...rest}
    />
  );
};

export default SelectLabel;

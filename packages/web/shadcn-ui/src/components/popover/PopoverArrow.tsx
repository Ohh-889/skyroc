import { Arrow } from '@radix-ui/react-popover';
import { cn } from '@skyroc/utils';
import { popoverVariants } from './popover-varianst';
import type { PopoverArrowProps } from './types';

const PopoverArrow = (props: PopoverArrowProps) => {
  const { className, size, ...rest } = props;

  const { arrow } = popoverVariants({ size });

  const mergedCls = cn(arrow(), className);

  return (
    <Arrow
      className={mergedCls}
      data-slot="popover-arrow"
      {...rest}
    />
  );
};

export default PopoverArrow;

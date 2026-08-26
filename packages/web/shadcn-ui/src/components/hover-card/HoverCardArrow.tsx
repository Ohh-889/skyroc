import { Arrow } from '@radix-ui/react-hover-card';
import { cn } from '@skyroc/utils';
import { hoverCardVariants } from './hover-card-variants';
import type { HoverCardArrowProps } from './types';

const HoverCardArrow = (props: HoverCardArrowProps) => {
  const { className, size, ...rest } = props;

  const { arrow } = hoverCardVariants({ size });

  const mergedClass = cn(arrow(), className);

  return (
    <Arrow
      {...rest}
      className={mergedClass}
      data-slot="hover-card-arrow"
    />
  );
};

export default HoverCardArrow;

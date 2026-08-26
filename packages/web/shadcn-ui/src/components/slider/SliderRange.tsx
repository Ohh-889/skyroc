import { Range } from '@radix-ui/react-slider';
import { cn } from '@skyroc/utils';
import { sliderVariants } from './slider-variants';
import type { SliderRangeProps } from './types';

const SliderRange = (props: SliderRangeProps) => {
  const { className, color, ...rest } = props;

  const { range } = sliderVariants({ color });

  const mergedCls = cn(range(), className);

  return (
    <Range
      className={mergedCls}
      data-color={color}
      data-slot="slider-range"
      {...rest}
    />
  );
};

export default SliderRange;

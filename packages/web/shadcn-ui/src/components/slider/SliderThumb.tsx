import { Thumb } from '@radix-ui/react-slider';
import { cn } from '@skyroc/utils';
import { sliderVariants } from './slider-variants';
import type { SliderThumbProps } from './types';

export const SliderThumb = (props: SliderThumbProps) => {
  const { className, color, size, ...rest } = props;

  const { thumb } = sliderVariants({ color, size });

  const mergedCls = cn(thumb(), className);

  return (
    <Thumb
      className={mergedCls}
      data-color={color}
      data-slot="slider-thumb"
      {...rest}
    />
  );
};

export default SliderThumb;

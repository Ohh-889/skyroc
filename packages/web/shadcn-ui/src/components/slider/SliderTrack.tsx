import { Track } from '@radix-ui/react-slider';
import { cn } from '@skyroc/utils';
import { sliderVariants } from './slider-variants';
import type { SliderTrackProps } from './types';

const SliderTrack = (props: SliderTrackProps) => {
  const { className, color, size, ...rest } = props;

  const { track } = sliderVariants({ color, size });

  const mergedCls = cn(track(), className);

  return (
    <Track
      className={mergedCls}
      data-color={color}
      data-slot="slider-track"
      {...rest}
    />
  );
};

export default SliderTrack;

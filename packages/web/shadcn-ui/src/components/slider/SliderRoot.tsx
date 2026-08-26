import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { Root } from '@radix-ui/react-slider';
import { cn } from '@skyroc/utils';
import { sliderVariants } from './slider-variants';
import type { SliderRootProps } from './types';

const SliderRoot = forwardRef<ComponentRef<typeof Root>, SliderRootProps>((props, ref) => {
  const { className, size, ...rest } = props;

  const { root } = sliderVariants({ size });

  const mergedCls = cn(root(), className);

  return (
    <Root
      className={mergedCls}
      data-slot="slider-root"
      ref={ref}
      {...rest}
    />
  );
});

SliderRoot.displayName = 'SliderRoot';

export default SliderRoot;

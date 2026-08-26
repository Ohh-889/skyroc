'use client';

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { useComponentConfig } from '../config-provider/context';
import SliderUI from '../../components/slider/SliderUI';
import type SliderRoot from '../../components/slider/SliderRoot';
import type { SliderProps } from '../../components/slider/types';

const Slider = forwardRef<ComponentRef<typeof SliderRoot>, SliderProps>((props, ref) => {
  const config = useComponentConfig('slider');

  const mergedProps = {
    ...config,
    ...props
  };

  return (
    <SliderUI
      {...mergedProps}
      ref={ref}
    />
  );
});

Slider.displayName = 'Slider';

export default Slider;

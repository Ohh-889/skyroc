'use client';

import { forwardRef } from 'react';
import { useComponentConfig } from '../config-provider/context';
import CarouselUI from '../../components/carousel/CarouselUI';
import type { CarouselProps } from '../../components/carousel/types';

const Carousel = forwardRef<HTMLDivElement, CarouselProps>((props, ref) => {
  const config = useComponentConfig('carousel');

  const mergedProps = {
    ...config,
    ...props
  };

  return (
    <CarouselUI
      {...mergedProps}
      ref={ref}
    />
  );
});

Carousel.displayName = 'Carousel';

export default Carousel;

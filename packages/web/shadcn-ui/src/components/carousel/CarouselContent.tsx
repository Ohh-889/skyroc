'use client';

import { forwardRef } from 'react';
import { cn } from '@skyroc/utils';
import { carouselVariants } from './carousel-variants';
import { useCarousel } from './context';
import type { CarouselContentProps } from './types';

const CarouselContent = forwardRef<HTMLDivElement, CarouselContentProps>((props, ref) => {
  const { className, classNames, size, ...rest } = props;

  const { carouselRef, orientation } = useCarousel();

  const { content, contentWrapper } = carouselVariants({ orientation, size });

  const contentClassName = cn(content(), classNames?.content);

  const contentWrapperClassName = cn(contentWrapper(), className || classNames?.contentWrapper);

  return (
    <div
      className={contentWrapperClassName}
      ref={carouselRef}
    >
      <div
        className={contentClassName}
        ref={ref}
        {...rest}
      />
    </div>
  );
});
CarouselContent.displayName = 'CarouselContent';

export default CarouselContent;

'use client';

import { forwardRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@skyroc/utils';
import { ButtonIcon } from '../button';
import { carouselVariants } from './carousel-variants';
import { useCarousel } from './context';
import type { CarouselNextProps } from './types';

const CarouselNext = forwardRef<HTMLButtonElement, CarouselNextProps>((props, ref) => {
  const { 'aria-label': ariaLabel, children, className, disabled, shape = 'circle', size, variant = 'pure', ...rest } = props;

  const { canScrollNext, orientation, scrollNext } = useCarousel();

  const { next } = carouselVariants({ orientation, size });

  const nextClassName = cn(next(), className);

  return (
    <ButtonIcon
      className={nextClassName}
      disabled={!canScrollNext || disabled}
      ref={ref}
      shape={shape}
      size={size}
      variant={variant}
      onClick={scrollNext}
      aria-label={ariaLabel ?? 'Next slide'}
      {...rest}
    >
      {children || <ChevronRight />}
    </ButtonIcon>
  );
});

CarouselNext.displayName = 'CarouselNext';

export default CarouselNext;

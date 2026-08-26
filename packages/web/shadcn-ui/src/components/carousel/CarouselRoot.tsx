'use client';

import { forwardRef, useCallback, useEffect, useState } from 'react';
import type { KeyboardEvent } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from '@skyroc/utils';
import { carouselVariants } from './carousel-variants';
import { CarouselContext } from './context';
import type { CarouselApi, CarouselRootProps } from './types';

const Carousel = forwardRef<HTMLDivElement, CarouselRootProps>((props, ref) => {
  const { children, className, opts, orientation = 'horizontal', plugins, setApi, size, ...rest } = props;

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const { root } = carouselVariants({ orientation, size });

  const rootClassName = cn(root(), className);

  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === 'horizontal' ? 'x' : 'y'
    },
    plugins
  );

  const onSelect = useCallback((carouselApi: CarouselApi) => {
    if (!carouselApi) {
      return;
    }

    setCanScrollPrev(carouselApi.canScrollPrev());
    setCanScrollNext(carouselApi.canScrollNext());
  }, []);

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const prevKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
      const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';

      if (event.key === prevKey) {
        event.preventDefault();
        scrollPrev();
      }
      else if (event.key === nextKey) {
        event.preventDefault();
        scrollNext();
      }
    },
    [orientation, scrollNext, scrollPrev]
  );

  useEffect(() => {
    if (!api || !setApi) {
      return;
    }

    setApi(api);
  }, [api, setApi]);

  function checkApi() {
    if (!api) {
      return;
    }

    onSelect(api);
  }

  useEffect(() => {
    api?.on('reInit', onSelect);
    api?.on('select', onSelect);

    return () => {
      api?.off('select', onSelect);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    checkApi();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api]);

  return (
    <CarouselContext.Provider
      value={{
        api,
        canScrollNext,
        canScrollPrev,
        carouselRef,
        opts,
        orientation: orientation || (opts?.axis === 'y' ? 'vertical' : 'horizontal'),
        scrollNext,
        scrollPrev
      }}
    >
      <div
        aria-roledescription="carousel"
        className={rootClassName}
        ref={ref}
        role="region"
        tabIndex={0}
        onKeyDownCapture={handleKeyDown}
        {...rest}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
});

Carousel.displayName = 'Carousel';

export default Carousel;

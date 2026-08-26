'use client';

import { Children, forwardRef } from 'react';
import CarouselContent from './CarouselContent';
import CarouselItem from './CarouselItem';
import CarouselNext from './CarouselNext';
import CarouselPrevious from './CarouselPrevious';
import CarouselRoot from './CarouselRoot';
import type { CarouselProps } from './types';

const CarouselUI = forwardRef<HTMLDivElement, CarouselProps>((props, ref) => {
  const { children, className, classNames, contentProps, counts, itemProps, nextProps, previousProps, size, ...rest } =
    props;

  const childItems = typeof children === 'function' ? [] : Children.toArray(children);
  const itemCount = counts ?? childItems.length;

  function renderItem(index: number) {
    return typeof children === 'function' ? children(index) : childItems[index];
  }

  return (
    <CarouselRoot className={className || classNames?.root} ref={ref} size={size} {...rest}>
      <CarouselContent classNames={classNames} size={size} {...contentProps}>
        {Array.from({ length: itemCount }).map((_, index) => (
          <CarouselItem className={classNames?.item} key={index} size={size} {...itemProps}>
            {renderItem(index)}
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselNext className={classNames?.next} size={size} {...nextProps} />

      <CarouselPrevious className={classNames?.previous} size={size} {...previousProps} />
    </CarouselRoot>
  );
});

CarouselUI.displayName = 'CarouselUI';

export default CarouselUI;

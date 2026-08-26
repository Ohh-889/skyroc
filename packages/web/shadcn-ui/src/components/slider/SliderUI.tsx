'use client';

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import SliderRange from './SliderRange';
import SliderRoot from './SliderRoot';
import { SliderThumb } from './SliderThumb';
import SliderTrack from './SliderTrack';
import type { SliderProps } from './types';

const SliderUI = forwardRef<ComponentRef<typeof SliderRoot>, SliderProps>((props, ref) => {
  const { className, classNames, color, defaultValue, rangeProps, size, thumbProps, trackProps, value, ...rest } = props;

  return (
    <SliderRoot
      className={className || classNames?.root}
      defaultValue={defaultValue}
      ref={ref}
      size={size}
      value={value}
      {...rest}
    >
      <SliderTrack
        className={classNames?.track}
        color={color}
        size={size}
        {...trackProps}
      >
        <SliderRange
          className={classNames?.range}
          color={color}
          {...rangeProps}
        />
      </SliderTrack>

      {(defaultValue || value)?.map((_, index) => (
        <SliderThumb
          className={classNames?.thumb}
          color={color}
          key={String(index)}
          size={size}
          {...thumbProps}
        />
      ))}
    </SliderRoot>
  );
});

SliderUI.displayName = 'SliderUI';

export default SliderUI;

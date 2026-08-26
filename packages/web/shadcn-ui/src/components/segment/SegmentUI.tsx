'use client';

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import type { Root } from '@radix-ui/react-tabs';
import SegmentList from '../tabs/TabsList';
import SegmentRoot from '../tabs/TabsRoot';
import SegmentTrigger from '../tabs/TabsTrigger';
import type { SegmentOptionData, SegmentProps } from './types';

const Segment = forwardRef<ComponentRef<typeof Root>, SegmentProps<SegmentOptionData>>((props, ref) => {
  const {
    className,
    classNames,
    dir,
    disabled,
    enableIndicator = true,
    items,
    listProps,
    loop,
    orientation = 'horizontal',
    shape = 'square',
    size,
    triggerProps,
    type,
    value,
    ...rest
  } = props;

  return (
    <SegmentRoot
      className={[className, classNames?.root]}
      data-slot="segment-root"
      dir={dir}
      orientation={orientation}
      ref={ref}
      size={size}
      value={value}
      {...rest}
    >
      <SegmentList
        className={classNames?.list}
        data-slot="segment-list"
        dir={dir}
        enableIndicator={enableIndicator}
        loop={loop}
        orientation={orientation}
        shape={shape}
        size={size}
        type={type}
        value={value}
        classNames={{
          indicator: classNames?.indicator,
          indicatorRoot: classNames?.indicatorRoot
        }}
        {...listProps}
      >
        {items.map(item => (
          <SegmentTrigger
            className={classNames?.trigger}
            data-slot="segment-trigger"
            dir={dir}
            disabled={disabled || item.disabled}
            enableIndicator={enableIndicator}
            key={item.value}
            size={size}
            value={item.value}
            {...triggerProps}
          >
            {item.label}
          </SegmentTrigger>
        ))}
      </SegmentList>
    </SegmentRoot>
  );
});

Segment.displayName = 'SegmentUI';

export default Segment;

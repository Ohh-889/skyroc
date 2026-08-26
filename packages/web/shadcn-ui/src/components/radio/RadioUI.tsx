'use client';

import { useId } from 'react';
import { cn } from '@skyroc/utils';
import RadioLabel from '../label/LabelUI';
import RadioGroupItem from './RadioGroupItem';
import RadioIndicator from './RadioIndicator';
import RadioRoot from './RadioRoot';
import type { RadioProps } from './types';

const Radio = (props: RadioProps) => {
  const { className, classNames, color, id, indicatorProps, itemProps, label, rootProps, size, value, variant, ...rest } = props;

  const internalId = useId();

  const controlId = id || internalId;
  const { className: itemClassName, ...restItemProps } = itemProps || {};

  return (
    <RadioRoot
      className={className || classNames?.root}
      size={size}
      {...rootProps}
    >
      <RadioGroupItem
        {...rest}
        {...restItemProps}
        className={cn(classNames?.control, itemClassName)}
        color={color}
        id={controlId}
        size={size}
        value={value}
        variant={variant}
      >
        <RadioIndicator
          className={classNames?.indicator}
          color={color}
          variant={variant}
          {...indicatorProps}
        />
      </RadioGroupItem>

      {label
        ? (
          <RadioLabel
            className={classNames?.label}
            htmlFor={controlId}
            size={size}
          >
            {label}
          </RadioLabel>
        )
        : null}
    </RadioRoot>
  );
};

Radio.displayName = 'RadioUI';

export default Radio;

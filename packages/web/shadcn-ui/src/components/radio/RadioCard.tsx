'use client';

import { forwardRef, useId } from 'react';
import { Item } from '@radix-ui/react-radio-group';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@skyroc/utils';
import RadioLabel from '../label/LabelUI';
import { radioVariants } from './radio-variants';
import RadioIndicator from './RadioIndicator';
import type { RadioCardProps } from './types';

const RadioCard = forwardRef<HTMLButtonElement, RadioCardProps>((props, ref) => {
  const {
    checked,
    className,
    classNames,
    color,
    description,
    disabled,
    icon,
    id: controlId,
    label,
    radioPosition = 'right',
    size,
    value,
    variant,
    ...rest
  } = props;

  const id = useId();

  const {
    card,
    cardContent,
    cardDescription,
    cardLabel,
    cardTextContent,
    control,
    indicator
  } = radioVariants({ color, size, variant });

  const mergedCls = cn(
    card(),
    disabled && 'cursor-not-allowed opacity-50',
    className || classNames?.card
  );

  const labelCls = cn(
    cardLabel(),
    classNames?.cardLabel
  );

  const descriptionCls = cn(
    cardDescription(),
    classNames?.cardDescription
  );

  const contentCls = cn(
    cardContent(),
    classNames?.cardContent
  );

  const textContentCls = cn(
    cardTextContent(),
    classNames?.cardTextContent
  );

  const controlCls = cn(
    control(),
    classNames?.control
  );

  const indicatorCls = cn(
    indicator(),
    classNames?.indicator
  );

  const radioElement = (
    <Item
      className={controlCls}
      disabled={disabled}
      id={controlId || id}
      ref={ref}
      value={value}
      {...rest}
    >
      <RadioIndicator
        className={indicatorCls}
        color={color}
        variant={variant}
      />
    </Item>
  );

  const contentElement = (
    <div className={contentCls}>
      {icon ? <Slot className="shrink-0 text-lg">{icon}</Slot> : null}

      <div className={textContentCls}>
        {label
          ? (
            <span className={labelCls}>
              {label}
            </span>
          )
          : null}

        {description
          ? (
            <p className={descriptionCls}>
              {description}
            </p>
          )
          : null}
      </div>
    </div>
  );

  return (
    <RadioLabel
      className={mergedCls}
      data-slot="radio-card"
      data-state={checked ? 'checked' : 'unchecked'}
      htmlFor={controlId || id}
    >
      {radioPosition === 'left' && radioElement}
      {contentElement}
      {radioPosition === 'right' && radioElement}
    </RadioLabel>
  );
});

RadioCard.displayName = 'RadioCard';

export default RadioCard;

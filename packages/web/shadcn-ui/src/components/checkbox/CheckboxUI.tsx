'use client';

import { Check, Minus } from 'lucide-react';
import { forwardRef, useId } from 'react';
import CheckboxLabel from '../label/LabelUI';
import CheckboxControl from './CheckboxControl';
import CheckboxIndicator from './CheckboxIndicator';
import CheckboxRoot from './CheckboxRoot';
import type { CheckboxProps } from './types';

const CheckboxUI = forwardRef<HTMLDivElement, CheckboxProps>((props, ref) => {
  const {
    checkedIcon = <Check className="size-full" />,
    children,
    className,
    classNames,
    forceMountIndicator,
    id: propId,
    indeterminateIcon = <Minus className="size-full" />,
    indicatorProps,
    rootProps,
    size,
    ...rest
  } = props;

  const isIndeterminate = rest.checked === 'indeterminate';

  const generatedId = useId();

  const controlId = propId || `${generatedId}-control`;

  return (
    <CheckboxRoot className={className || classNames?.root} ref={ref} {...rootProps}>
      <CheckboxControl className={classNames?.control} id={controlId} size={size} {...rest}>
        <CheckboxIndicator className={classNames?.indicator} forceMount={forceMountIndicator} {...indicatorProps}>
          {isIndeterminate ? indeterminateIcon : checkedIcon}
        </CheckboxIndicator>
      </CheckboxControl>

      {children ? (
        <CheckboxLabel className={classNames?.label} htmlFor={controlId}>
          {children}
        </CheckboxLabel>
      ) : null}
    </CheckboxRoot>
  );
});

CheckboxUI.displayName = 'CheckboxUI';

export default CheckboxUI;

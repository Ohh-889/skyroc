import { forwardRef } from 'react';
import { cn } from '@skyroc/utils';
import { numberInputVariants } from './number-input-variants';
import type { NumberInputControlProps } from './types';

const NumberInputControl = forwardRef<HTMLInputElement, NumberInputControlProps>((props, ref) => {
  const { center, className, disabled, max, min, readOnly, size, ...rest } = props;

  const { control } = numberInputVariants({ size, center });

  const mergedCls = cn(control(), className);

  return (
    <input
      aria-roledescription="Number Input"
      aria-valuemax={Number(max)}
      aria-valuemin={Number(min)}
      autoComplete="off"
      autoCorrect="off"
      className={mergedCls}
      data-disabled={disabled ? '' : undefined}
      data-readonly={readOnly ? '' : undefined}
      data-size={size}
      data-slot="number-input-control"
      disabled={disabled}
      inputMode="numeric"
      max={max}
      min={min}
      readOnly={readOnly}
      ref={ref}
      role="spinbutton"
      spellCheck="false"
      type="text"
      {...rest}
    />
  );
});

NumberInputControl.displayName = 'NumberInputControl';

export default NumberInputControl;

'use client';

import { forwardRef, useRef } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cn } from '@skyroc/utils';
import { numberInputVariants } from './number-input-variants';
import NumberInputControl from './NumberInputControl';
import type { NumberInputProps } from './types';

function parseNumberValue(v: string): number | undefined {
  if (v === '' || v === '-')
    return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
}

// eslint-disable-next-line complexity
const NumberInputUI = forwardRef<HTMLInputElement, NumberInputProps>((props, ref) => {
  const {
    center,
    className,
    classNames,
    clearable,
    controlProps,
    decrementIcon,
    defaultValue,
    disabled,
    incrementIcon,
    leading,
    max,
    min,
    onChange,
    onValueChange,
    readOnly,
    size,
    step = 1,
    trailing,
    value: valueProp,
    ...rest
  } = props;

  const { clearable: clearableCls, decrement, increment, root }
    = numberInputVariants({ size, center });

  const inputRef = useRef<HTMLInputElement>(null);
  const composedRefs = useComposedRefs(inputRef, ref);

  const [value, setValue] = useControllableState({
    caller: 'number-input',
    defaultProp: defaultValue,
    prop: valueProp,
    onChange: onValueChange
  });

  const displayValue = value === undefined ? '' : String(value);

  // ---------------------------
  // Tools
  // ---------------------------

  const clamp = (n: number) => {
    let x = n;
    if (min !== undefined)
      x = Math.max(x, min);
    if (max !== undefined)
      x = Math.min(x, max);
    return x;
  };

  const updateValue = (n: number | undefined) => {
    if (n === undefined) {
      setValue(undefined);
    }
    else {
      setValue(clamp(n));
    }
  };

  // ---------------------------
  // Common reusable boolean flags
  // ---------------------------

  const numericValue = parseNumberValue(displayValue);

  const isInteractable = !disabled && !readOnly;
  const hasValue = numericValue !== undefined;
  const hasMin = min !== undefined && hasValue;
  const hasMax = max !== undefined && hasValue;

  const isDecrementDisabled
    = !isInteractable || (hasMin && numericValue! <= min!);

  const isIncrementDisabled
    = !isInteractable || (hasMax && numericValue! >= max!);

  // ---------------------------
  // Events
  // ---------------------------

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    if (raw === '' || raw === '-' || /^-?\d*(?:\.\d*)?$/.test(raw)) {
      updateValue(parseNumberValue(raw));
      onChange?.(e);
    }
  };

  const handleBlur = () => {
    if (!hasValue)
      return;
    updateValue(numericValue);
  };

  const stepChange = (amount: number) => {
    if (!isInteractable)
      return;
    const current = numericValue ?? 0;
    updateValue(current + amount);
  };

  const handleIncrement = () => stepChange(step);
  const handleDecrement = () => stepChange(-step);

  const handleClear = () => {
    if (!isInteractable)
      return;
    updateValue(undefined);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isInteractable)
      return;

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleIncrement();
    }
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleDecrement();
    }
    else if (e.key === 'Escape') {
      inputRef.current?.blur();
    }
  };

  // ---------------------------
  // Classes
  // ---------------------------

  const mergedCls = cn(root(), className || classNames?.root);
  const mergedClearableCls = cn(clearableCls(), classNames?.clearable);
  const mergedDecrementCls = cn(decrement(), classNames?.decrement);
  const mergedIncrementCls = cn(increment(), classNames?.increment);

  return (
    <div
      className={mergedCls}
      data-disabled={disabled ? '' : undefined}
      data-readonly={readOnly ? '' : undefined}
      data-slot="number-input-root"
      role="group"
    >
      {leading}

      {/* Input */}
      <NumberInputControl
        {...rest}
        {...controlProps}
        center={center}
        className={classNames?.control}
        disabled={disabled}
        readOnly={readOnly}
        ref={composedRefs}
        size={size}
        value={displayValue}
        onBlur={handleBlur}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />

      {/* Clear */}
      {clearable && displayValue !== '' && isInteractable
        ? (
          <X
            className={mergedClearableCls}
            onClick={handleClear}
          />
        )
        : null}

      {trailing}

      {/* Decrement */}
      <button
        aria-label="Decrement"
        className={mergedDecrementCls}
        data-disabled={isDecrementDisabled ? '' : undefined}
        data-slot="number-input-decrement"
        disabled={isDecrementDisabled}
        tabIndex={-1}
        type="button"
        onClick={handleDecrement}
      >
        {decrementIcon || <Minus />}
      </button>

      {/* Increment */}
      <button
        aria-label="Increment"
        className={mergedIncrementCls}
        data-disabled={isIncrementDisabled ? '' : undefined}
        data-slot="number-input-increment"
        disabled={isIncrementDisabled}
        tabIndex={-1}
        type="button"
        onClick={handleIncrement}
      >
        {incrementIcon || <Plus />}
      </button>
    </div>
  );
});

NumberInputUI.displayName = 'NumberInputUI';
export default NumberInputUI;

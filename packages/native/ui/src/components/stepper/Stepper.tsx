/* eslint-disable max-params */
/* eslint-disable complexity */
import { useEffect, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cn } from '@skyroc/utils';
import { Button } from '../button/Button';
import { stepperVariants } from './stepper-variants';
import type { StepperProps } from './types';

/** 格式化数值为显示文本 */
function formatNumber(val: number, decimals?: number): string {
  if (decimals) {
    return val.toFixed(decimals);
  }
  return String(val);
}

/** 将数值限制在 min~max 范围内 */
function clampValue(val: number, min: number, max: number, isInteger: boolean): number {
  let result = Math.max(min, Math.min(max, val));
  if (isInteger) {
    result = Math.trunc(result);
  }
  return result;
}

const Stepper = (props: StepperProps) => {
  const {
    allowEmpty = false,
    autoFixed = true,
    beforeChange,
    className,
    classNames,
    decimalLength,
    defaultValue = 1,
    disabled = false,
    disableInput = false,
    disableMinus = false,
    disablePlus = false,
    integer = false,
    longPress = true,
    max = Number.MAX_SAFE_INTEGER,
    min = 1,
    onChange,
    onBlur,
    onChangeText,
    onMinus,
    onOverlimit,
    onPlus,
    showInput = true,
    showMinus = true,
    showPlus = true,
    size,
    step = 1,
    theme,
    value: valueProp,
    ...rest
  } = props;

  const [value, setValue] = useControllableState({
    caller: 'stepper',
    defaultProp: defaultValue,
    onChange,
    prop: valueProp
  });

  const [inputText, setInputText] = useState(() => formatNumber(value, decimalLength));

  const currentValueRef = useRef(value);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isLongPressRef = useRef(false);

  const isMinusDisabled = disabled || disableMinus || value <= min;
  const isPlusDisabled = disabled || disablePlus || value >= max;

  const slots = stepperVariants({ size, theme });

  async function trySetValue(newVal: number) {
    const clamped = clampValue(newVal, min, max, integer);
    if (beforeChange) {
      const allowed = await beforeChange(clamped);
      if (!allowed) return;
    }
    currentValueRef.current = clamped;
    setValue(clamped);
    setInputText(formatNumber(clamped, decimalLength));
  }

  function doMinus() {
    const current = currentValueRef.current;
    if (disabled || disableMinus || current <= min) {
      onOverlimit?.('minus');
      stopLongPress();
      return;
    }
    trySetValue(current - step);
  }

  function doPlus() {
    const current = currentValueRef.current;
    if (disabled || disablePlus || current >= max) {
      onOverlimit?.('plus');
      stopLongPress();
      return;
    }
    trySetValue(current + step);
  }

  function handleMinusPress() {
    if (isLongPressRef.current) {
      isLongPressRef.current = false;
      return;
    }
    doMinus();
    onMinus?.();
  }

  function handlePlusPress() {
    if (isLongPressRef.current) {
      isLongPressRef.current = false;
      return;
    }
    doPlus();
    onPlus?.();
  }

  function handleInputChange(text: string) {
    setInputText(text);
    onChangeText?.(text);
  }

  function handleInputBlur(e: Parameters<NonNullable<TextInput['props']['onBlur']>>[0]) {
    if (inputText === '' && allowEmpty) {
      onBlur?.(e);
      return;
    }
    const num = Number(inputText);
    if (Number.isNaN(num) || inputText === '') {
      setInputText(formatNumber(value, decimalLength));
    } else if (autoFixed) {
      trySetValue(num);
    }
    onBlur?.(e);
  }

  function startLongPress(action: () => void) {
    if (!longPress) return;
    stopLongPress();
    isLongPressRef.current = false;
    longPressTimerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      intervalRef.current = setInterval(action, 150);
    }, 600);
  }

  function stopLongPress() {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  useEffect(() => {
    currentValueRef.current = value;
    setInputText(formatNumber(value, decimalLength));
  }, [value, decimalLength]);

  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <View className={cn(slots.root(), className, classNames?.root)}>
      {showMinus && (
        <Button
          className={cn(slots.minus(), classNames?.minus)}
          disabled={isMinusDisabled}
          onPress={handleMinusPress}
          onPressIn={() => startLongPress(doMinus)}
          onPressOut={stopLongPress}
          size="icon"
          textClassName={cn(slots.minusIcon(), classNames?.minusIcon)}
          variant="ghost"
        >
          −
        </Button>
      )}

      {showInput && (
        <TextInput
          allowFontScaling={false}
          maxFontSizeMultiplier={1}
          keyboardType={integer ? 'number-pad' : 'decimal-pad'}
          selectTextOnFocus
          textAlign="center"
          className={cn(slots.input(), disabled && 'opacity-50', classNames?.input)}
          editable={!disabled && !disableInput}
          onBlur={handleInputBlur}
          onChangeText={handleInputChange}
          value={inputText}
          {...rest}
        />
      )}

      {showPlus && (
        <Button
          className={cn(slots.plus(), classNames?.plus)}
          disabled={isPlusDisabled}
          onPress={handlePlusPress}
          onPressIn={() => startLongPress(doPlus)}
          onPressOut={stopLongPress}
          size="icon"
          textClassName={cn(slots.plusIcon(), classNames?.plusIcon)}
          variant="ghost"
        >
          +
        </Button>
      )}
    </View>
  );
};

export { Stepper };

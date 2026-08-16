import { useEffect, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cn } from '@skyroc/utils';
import { Button } from '../button/Button';
import { stepperVariants } from './stepper-variants';
import type { StepperProps, StepperStepType } from './types';
import { useLongPress } from './use-long-press';

/** 小数位上限，用于截断浮点累加产生的尾数（0.1 + 0.2 = 0.30000000000000004） */
const MAX_DECIMAL_DIGITS = 10;

/** 归一化选项 */
interface NormalizeOptions {
  /** 固定小数位数 */
  decimalLength?: number;
  /** 是否只允许整数 */
  integer: boolean;
  /** 最大值 */
  max: number;
  /** 最小值 */
  min: number;
}

/** 格式化数值为显示文本；decimalLength 为 0 时也要走 toFixed，不能当假值跳过 */
function formatNumber(val: number, decimals?: number): string {
  return typeof decimals === 'number' ? val.toFixed(decimals) : String(val);
}

/** 取小数位数，指数记数法一律按上限处理 */
function decimalDigits(val: number): number {
  const text = String(val);

  if (text.includes('e') || text.includes('E')) {
    return MAX_DECIMAL_DIGITS;
  }

  const dotIndex = text.indexOf('.');

  return dotIndex === -1 ? 0 : Math.min(text.length - dotIndex - 1, MAX_DECIMAL_DIGITS);
}

/**
 * 归一化数值：先定精度再夹边界，保证 min / max 始终成立。
 *
 * 未指定 decimalLength 时按数值自身的小数位收敛，既能抹掉浮点尾数，又不会截掉用户输入的精度。
 */
function normalizeValue(val: number, options: NormalizeOptions): number {
  const { decimalLength, integer, max, min } = options;

  const rounded = integer ? Math.round(val) : Number(val.toFixed(decimalLength ?? decimalDigits(val)));

  return Math.max(min, Math.min(max, rounded));
}

/** 默认值集中在这里展开，组件本体只关心行为 */
function resolveProps(props: StepperProps) {
  const {
    allowEmpty = false,
    autoFixed = true,
    defaultValue = 1,
    disabled = false,
    disableInput = false,
    disableMinus = false,
    disablePlus = false,
    integer = false,
    longPress = true,
    max = Number.MAX_SAFE_INTEGER,
    min = 1,
    showInput = true,
    showMinus = true,
    showPlus = true,
    step = 1,
    ...restProps
  } = props;

  return {
    allowEmpty,
    autoFixed,
    defaultValue,
    disabled,
    disableInput,
    disableMinus,
    disablePlus,
    integer,
    longPress,
    max,
    min,
    showInput,
    showMinus,
    showPlus,
    step,
    ...restProps
  };
}

const Stepper = (props: StepperProps) => {
  const {
    allowEmpty,
    autoFixed,
    beforeChange,
    className,
    classNames,
    decimalLength,
    defaultValue,
    disabled,
    disableInput,
    disableMinus,
    disablePlus,
    integer,
    longPress,
    max,
    min,
    onBlur,
    onChange,
    onChangeText,
    onMinus,
    onOverlimit,
    onPlus,
    showInput,
    showMinus,
    showPlus,
    size,
    step,
    theme,
    value: valueProp,
    ...rest
  } = resolveProps(props);

  const [value, setValue] = useControllableState({
    caller: 'Stepper',
    defaultProp: defaultValue,
    onChange,
    prop: valueProp
  });

  /** 非 null 表示输入框正在被编辑，此时显示以用户输入为准；否则显示始终由 value 派生 */
  const [editingText, setEditingText] = useState<string | null>(null);

  const valueRef = useRef(value);
  const isSteppingRef = useRef(false);

  const displayText = editingText ?? formatNumber(value, decimalLength);
  const isMinusAtLimit = value <= min;
  const isPlusAtLimit = value >= max;

  const variantSlots = stepperVariants({ size, theme });

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      input: cn(variantSlots.input(), disabled && 'opacity-50', classNames?.input),
      minus: cn(variantSlots.minus(), isMinusAtLimit && 'opacity-50', classNames?.minus),
      minusIcon: cn(variantSlots.minusIcon(), classNames?.minusIcon),
      plus: cn(variantSlots.plus(), isPlusAtLimit && 'opacity-50', classNames?.plus),
      plusIcon: cn(variantSlots.plusIcon(), classNames?.plusIcon),
      root: cn(variantSlots.root(), classNames?.root, className)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  /** 提交新值：只写 value，显示态等 value 回流后自行派生，受控方拒绝更新时不会出现界面与值脱节 */
  async function commitValue(next: number) {
    const normalized = normalizeValue(next, { decimalLength, integer, max, min });

    setEditingText(null);

    if (normalized === valueRef.current) return;

    if (beforeChange) {
      const allowed = await beforeChange(normalized);
      if (!allowed) return;
    }

    setValue(normalized);
  }

  function isAtLimit(type: StepperStepType) {
    return type === 'minus' ? valueRef.current <= min : valueRef.current >= max;
  }

  async function applyStep(type: StepperStepType) {
    if (isAtLimit(type)) {
      onOverlimit?.(type);
      longPressControl.stop();
      return;
    }

    // beforeChange 是异步的，长按期间上一次未落定就跳过本次，避免读到同一个基准值连跳
    if (isSteppingRef.current) return;

    isSteppingRef.current = true;
    const current = valueRef.current;

    try {
      await commitValue(type === 'minus' ? current - step : current + step);
    } finally {
      isSteppingRef.current = false;
    }
  }

  /** 单击：长按结束时系统仍会补发一次 press，这一次要吞掉，避免多走一步 */
  function handlePress(type: StepperStepType) {
    if (longPressControl.consumeLongPress()) return;

    if (isAtLimit(type)) {
      onOverlimit?.(type);
      return;
    }

    applyStep(type);

    const onStepPress = type === 'minus' ? onMinus : onPlus;
    onStepPress?.();
  }

  function handleMinusPress() {
    handlePress('minus');
  }

  function handlePlusPress() {
    handlePress('plus');
  }

  function handleMinusPressIn() {
    longPressControl.start('minus');
  }

  function handlePlusPressIn() {
    longPressControl.start('plus');
  }

  function handleInputChange(text: string) {
    setEditingText(text);
    onChangeText?.(text);
  }

  /** 失焦落值：空串按 allowEmpty 决定保留还是回滚，非法值一律回滚 */
  function resolveInputText() {
    if (displayText === '') {
      if (!allowEmpty) setEditingText(null);
      return;
    }

    const num = Number(displayText);

    if (Number.isNaN(num)) {
      setEditingText(null);
      return;
    }

    // autoFixed 关闭时保留用户原文，既不修正也不提交
    if (autoFixed) commitValue(num);
  }

  function handleInputBlur(e: Parameters<NonNullable<TextInput['props']['onBlur']>>[0]) {
    resolveInputText();
    onBlur?.(e);
  }

  // 长按控制器消费的是上面的 applyStep，applyStep 又要用它中止连按，因此排在函数之后声明
  const longPressControl = useLongPress<StepperStepType>({ enabled: longPress, onRepeat: applyStep });

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  return (
    <View className={slotClassNames.root}>
      {showMinus && (
        <Button
          className={slotClassNames.minus}
          classNames={{ text: slotClassNames.minusIcon }}
          disabled={disabled || disableMinus}
          onPress={handleMinusPress}
          onPressIn={handleMinusPressIn}
          onPressOut={longPressControl.stop}
          size="icon"
          variant="ghost"
        >
          −
        </Button>
      )}

      {showInput && (
        <TextInput
          allowFontScaling={false}
          keyboardType={integer ? 'number-pad' : 'decimal-pad'}
          selectTextOnFocus
          textAlign="center"
          textAlignVertical="center"
          className={slotClassNames.input}
          editable={!disabled && !disableInput}
          onBlur={handleInputBlur}
          onChangeText={handleInputChange}
          value={displayText}
          {...rest}
        />
      )}

      {showPlus && (
        <Button
          className={slotClassNames.plus}
          classNames={{ text: slotClassNames.plusIcon }}
          disabled={disabled || disablePlus}
          onPress={handlePlusPress}
          onPressIn={handlePlusPressIn}
          onPressOut={longPressControl.stop}
          size="icon"
          variant="ghost"
        >
          +
        </Button>
      )}
    </View>
  );
};

export { Stepper };

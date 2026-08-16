import type { TextInputProps } from 'react-native';
import type { SlotClassNames } from '../../types';
import type { StepperSlots, StepperVariantProps } from './stepper-variants';

/** 步进器主题 */
type StepperTheme = NonNullable<StepperVariantProps['theme']>;

/** 步进器尺寸 */
type StepperSize = NonNullable<StepperVariantProps['size']>;

/** 步进器组件属性 */
interface StepperProps
  extends Omit<TextInputProps, 'defaultValue' | 'editable' | 'onChange' | 'style' | 'value'>, StepperVariantProps {
  /** 允许输入框为空 */
  allowEmpty?: boolean;

  /** 失焦时自动修正超出范围的值 */
  autoFixed?: boolean;

  /** 值变化前的拦截器，返回 false 阻止变化 */
  beforeChange?: (value: number) => Promise<boolean> | boolean;

  /** NativeWind 类名 */
  className?: string;

  /** 覆盖各 slot 的 className */
  classNames?: SlotClassNames<StepperSlots>;

  /** 固定小数位数 */
  decimalLength?: number;

  /** 默认值（非受控模式） */
  defaultValue?: number;

  /** 是否禁用整个组件 */
  disabled?: boolean;

  /** 是否禁用输入框 */
  disableInput?: boolean;

  /** 是否禁用减少按钮 */
  disableMinus?: boolean;

  /** 是否禁用增加按钮 */
  disablePlus?: boolean;

  /** 是否只允许整数 */
  integer?: boolean;

  /** 是否开启长按连续触发 */
  longPress?: boolean;

  /** 最大值 */
  max?: number;

  /** 最小值 */
  min?: number;

  /** 值变化回调 */
  onChange?: (value: number) => void;

  /** 点击减少按钮回调 */
  onMinus?: () => void;

  /** 超出限制时回调 */
  onOverlimit?: (type: 'minus' | 'plus') => void;

  /** 点击增加按钮回调 */
  onPlus?: () => void;

  /** 是否显示输入框 */
  showInput?: boolean;

  /** 是否显示减少按钮 */
  showMinus?: boolean;

  /** 是否显示增加按钮 */
  showPlus?: boolean;

  /** 步进值 */
  step?: number;

  /** 当前值（受控模式） */
  value?: number;
}

export type { StepperProps, StepperSize, StepperTheme };

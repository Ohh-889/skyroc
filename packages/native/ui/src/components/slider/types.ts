import type { ReactNode } from 'react';

/** 滑块组件属性 */
export interface SliderProps {
  /** 激活颜色 */
  activeColor?: string;

  /** 进度条高度（水平）或宽度（垂直） */
  barHeight?: number;

  /** 自定义滑块按钮 */
  button?: ReactNode;

  /** 滑块按钮大小 */
  buttonSize?: number;

  /** 自定义类名 */
  className?: string;

  /** 默认值（非受控） */
  defaultValue?: number | [number, number];

  /** 是否禁用 */
  disabled?: boolean;

  /** 非激活颜色 */
  inactiveColor?: string;

  /** 自定义左侧滑块按钮（范围模式） */
  leftButton?: ReactNode;

  /** 最大值 */
  max?: number;

  /** 最小值 */
  min?: number;

  /** 值变化回调（拖拽中实时触发） */
  onChange?: (value: number | [number, number]) => void;

  /** 拖拽结束回调 */
  onChangeAfterDrag?: (value: number | [number, number]) => void;

  /** 是否为范围选择 */
  range?: boolean;

  /** 是否只读 */
  readonly?: boolean;

  /** 自定义右侧滑块按钮（范围模式） */
  rightButton?: ReactNode;

  /** 步长 */
  step?: number;

  /** 当前值（受控） */
  value?: number | [number, number];

  /** 是否垂直方向 */
  vertical?: boolean;
}

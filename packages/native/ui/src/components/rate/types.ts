import type { ReactNode } from 'react';

/** 评分组件属性 */
export interface RateProps {
  /** 是否允许半星 */
  allowHalf?: boolean;

  /** 自定义类名 */
  className?: string;

  /** 是否允许再次点击后清除 */
  clearable?: boolean;

  /** 选中时的颜色 */
  color?: string;

  /** 星星总数 */
  count?: number;

  /** 默认选中值（非受控） */
  defaultValue?: number;

  /** 是否禁用 */
  disabled?: boolean;

  /** 禁用时的颜色 */
  disabledColor?: string;

  /** 星星间距 */
  gutter?: number;

  /** 自定义选中图标 */
  icon?: ReactNode | ((index: number, active: boolean) => ReactNode);

  /** 值变化回调 */
  onChange?: (value: number) => void;

  /** 是否只读 */
  readonly?: boolean;

  /** 图标大小 */
  size?: number;

  /** 当前选中值（受控） */
  value?: number;

  /** 未选中时的颜色 */
  voidColor?: string;

  /** 自定义未选中图标 */
  voidIcon?: ReactNode | ((index: number, active: boolean) => ReactNode);
}

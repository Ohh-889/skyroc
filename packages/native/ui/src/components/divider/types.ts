import type { ReactNode } from 'react';
import type { ViewProps } from 'react-native';

/** 分割线方向 */
export type DividerOrientation = 'horizontal' | 'vertical';

/** 内容位置（仅水平方向有效） */
export type DividerContentPosition = 'center' | 'left' | 'right';

/** Divider 组件属性 */
export interface DividerProps extends ViewProps {
  /** 自定义内容，显示在分割线中间（仅水平方向有效） */
  children?: ReactNode;

  /** 自定义容器样式类名 */
  className?: string;

  /** 内容位置，仅水平方向有效 */
  contentPosition?: DividerContentPosition;

  /** 是否使用虚线样式 */
  dashed?: boolean;

  /** 是否使用细线（hairline）样式 */
  hairline?: boolean;

  /** 自定义线条样式类名 */
  lineClassName?: string;

  /** 分割线方向 */
  orientation?: DividerOrientation;

  /** 自定义文字样式类名 */
  textClassName?: string;
}

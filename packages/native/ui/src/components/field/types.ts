import type { ElementType, ReactElement } from 'react';
import type { FieldProps as CoreFieldProps, FormBaseProps } from '@skyroc/form';
import type { SlotClassNames } from '../../types';
import type { FieldItemSlots } from './field-variants';

// ==================== FieldGroup ====================

/** FieldGroup 组件属性 */
export interface FieldGroupProps<Values = any, As extends ElementType = typeof import('react-native').View> extends FormBaseProps<Values> {
  /** 容器组件，默认 View，可传 ScrollView / KeyboardAwareScrollView 等 */
  component?: As;
  /** 子项间距（px），默认 24 */
  gap?: number;
  /** 容器额外 className */
  className?: string;
  /** 容器额外 style */
  style?: import('react-native').ViewStyle;
}

// ==================== FieldItem ====================

/** FieldItem slot 类名覆盖 */
export type FieldItemClassNames = SlotClassNames<FieldItemSlots>;

/** FieldItem 组件属性 */
export interface FieldItemProps<Values = any> extends Omit<CoreFieldProps<Values>, 'children'> {
  /** 标签文本 */
  label?: string;

  /** 是否显示必填标记 */
  required?: boolean;

  /** 描述文本，显示在子组件下方 */
  description?: string;

  /** 尺寸 */
  size?: 'lg' | 'md' | 'sm';

  /** 覆盖各 slot 的 className */
  classNames?: FieldItemClassNames;

  /** 子组件 — 接收注入的 value + onChange */
  children: ReactElement;
}

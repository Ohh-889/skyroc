import type { ReactElement, ReactNode } from 'react';
import type { ComputedFieldProps, FieldProps as CoreFieldProps, FormBaseProps } from '@skyroc/form';
import type { SlotClassNames } from '../../types';
import type { FormItemSlots } from './form-variants';

// ==================== Form ====================

/** Form 组件属性 */
export interface FormProps<Values = any> extends FormBaseProps<Values> {
  /** 是否显示子项间分隔线 */
  border?: boolean;
  /** 是否为卡片式内嵌样式 */
  inset?: boolean;
  /** 分组标题 */
  title?: string;
  /** 自定义容器类名 */
  className?: string;
  /** CellGroup 的标题类名 */
  titleClassName?: string;
}

// ==================== Form.Item ====================

/** Form.Item slot 类名覆盖 */
export type FormItemClassNames = SlotClassNames<FormItemSlots>;

/** Form.Item 组件属性 */
export interface FormItemProps<Values = any> extends Omit<CoreFieldProps<Values>, 'children'> {
  /** 标签文本 */
  label?: string;

  /** 是否显示必填标记 */
  required?: boolean;

  /** 描述文本，显示在输入区域下方 */
  description?: string;

  /** 右侧自定义内容 */
  trailing?: ReactNode;

  /** 是否显示右箭头 */
  showArrow?: boolean;

  /** 箭头方向 */
  arrowDirection?: 'down' | 'left' | 'right' | 'up';

  /** 点击事件（整行可点） */
  onPress?: () => void;

  /** 标签对齐方式 */
  labelAlign?: 'left' | 'top';

  /** 标签宽度 (默认 88) */
  labelWidth?: number;

  /** 尺寸 */
  size?: 'lg' | 'md' | 'sm';

  /** 是否禁用 */
  disabled?: boolean;

  /** 覆盖各 slot 的 className */
  classNames?: FormItemClassNames;

  /** 子组件 — 接收注入的 value + onChange */
  children: ReactElement;
}

// ==================== FormComputedField ====================

/** FormComputedField 组件属性 */
export interface FormComputedFieldProps<Values = any> extends ComputedFieldProps<Values> {
  /** 标签文本 */
  label?: string;

  /** 是否显示必填标记 */
  required?: boolean;

  /** 描述文本 */
  description?: string;

  /** 尺寸 */
  size?: 'lg' | 'md' | 'sm';

  /** 覆盖各 slot 的 className */
  classNames?: FormItemClassNames;
}

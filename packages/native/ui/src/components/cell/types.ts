import type { ReactNode } from 'react';
import type { PressableProps } from 'react-native';
import type { SlotClassNames } from '../../types';
import type { CellVariantProps } from './cell-variants';

/** Cell 组件可覆盖的 slot 名称 */
export type CellSlots = 'arrow' | 'content' | 'leading' | 'root' | 'subtitle' | 'title' | 'trailing';

/** Cell 列表项组件属性 */
export interface CellProps extends Omit<PressableProps, 'children' | 'disabled'>, CellVariantProps {
  /** 自定义箭头内容，覆盖默认 chevron */
  arrow?: ReactNode;

  /** 箭头方向，仅在 showArrow 为 true 时有效 */
  arrowDirection?: 'down' | 'left' | 'right' | 'up';

  /** 覆盖各 slot 的类名 */
  classNames?: SlotClassNames<CellSlots>;

  /** 是否禁用交互 */
  disabled?: boolean;

  /** 左侧区域内容，通常放图标或头像 */
  leading?: ReactNode;

  /** 是否显示右侧箭头 */
  showArrow?: boolean;

  /** 副标题，string 自动包裹 Text */
  subtitle?: ReactNode | string;

  /** 标题，string 自动包裹 Text */
  title?: ReactNode | string;

  /** 右侧内容区域，string 自动包裹 Text */
  trailing?: ReactNode | string;
}

/** CellGroup 分组容器组件属性 */
export interface CellGroupProps {
  /** 是否显示子项间分隔线 */
  border?: boolean;

  /** 分组内容，通常为 Cell 组件 */
  children: ReactNode;

  /** 自定义容器类名 */
  className?: string;

  /** 是否为卡片式内嵌样式（带圆角和边距） */
  inset?: boolean;

  /** 分组标题 */
  title?: string;

  /** 自定义标题类名 */
  titleClassName?: string;
}

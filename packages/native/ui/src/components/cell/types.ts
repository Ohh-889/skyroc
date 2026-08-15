import type { ReactNode } from 'react';
import type { SlotClassNames } from '../../types';
import type { CellGroupVariantProps, CellVariantProps } from './cell-variants';

/** Cell 组件可覆盖的 slot 名称 */
export type CellSlots =
  | 'arrow'
  | 'content'
  | 'leading'
  | 'root'
  | 'subtitle'
  | 'title'
  | 'trailing'
  | 'trailingText';

/** CellGroup 组件可覆盖的 slot 名称 */
export type CellGroupSlots = 'divider' | 'root' | 'title';

/** Cell 列表项组件属性 */
export interface CellProps extends CellVariantProps {
  /** 无障碍标签，未提供时读屏朗读子节点文本 */
  accessibilityLabel?: string;

  /** 自定义箭头内容，覆盖默认 chevron；传入即视为需要显示箭头 */
  arrow?: ReactNode;

  /** 默认箭头的方向，自定义 arrow 时无效 */
  arrowDirection?: 'down' | 'left' | 'right' | 'up';

  /** 内容是否垂直居中，多行内容想顶部对齐时传 false */
  center?: boolean;

  /** 覆盖各 slot 的类名 */
  classNames?: SlotClassNames<CellSlots>;

  /** 是否禁用交互，同时整体降低透明度 */
  disabled?: boolean;

  /** 左侧区域内容，通常放图标或头像 */
  leading?: ReactNode;

  /** 长按回调，与 onPress 一样会让整行变成可点击的 Pressable */
  onLongPress?: () => void;

  /** 点击回调，未提供且无 onLongPress 时渲染为不可点击的 View */
  onPress?: () => void;

  /** 是否显示右侧箭头，缺省时由 arrow 与点击回调推导 */
  showArrow?: boolean;

  /** 副标题，string 自动包裹 Text */
  subtitle?: ReactNode;

  /** 测试标识 */
  testID?: string;

  /** 标题，string 自动包裹 Text */
  title?: ReactNode;

  /** 右侧内容区域，string 自动包裹 Text */
  trailing?: ReactNode;
}

/** CellGroup 分组容器组件属性 */
export interface CellGroupProps extends CellGroupVariantProps {
  /** 是否在子项之间插入分隔线 */
  border?: boolean;

  /** 分组内容，通常为 Cell 组件 */
  children: ReactNode;

  /** 覆盖各 slot 的类名，分隔线需要缩进时给 divider 传 ml-* */
  classNames?: SlotClassNames<CellGroupSlots>;

  /** 是否为卡片式内嵌样式（左右留边） */
  inset?: boolean;

  /** 分组标题，string 自动包裹 Text */
  title?: ReactNode;
}

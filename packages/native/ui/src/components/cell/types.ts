import type { Key, ReactNode, Ref } from 'react';
import type { View } from 'react-native';
import type { SlotClassNames } from '../../types';
import type { CellGroupVariantProps, CellVariantProps } from './cell-variants';

/** Cell 组件可覆盖的 slot 名称 */
export type CellSlots = 'arrow' | 'content' | 'leading' | 'root' | 'subtitle' | 'title' | 'trailing' | 'trailingText';

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

  /** 根节点的 ref，用于 measure / 滚动定位等命令式操作；可点击时根节点是 Pressable，实例类型同为 View */
  ref?: Ref<View>;

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

/** CellGroup 通过 items 渲染的列表项配置 */
export interface CellGroupItem extends CellProps {
  /** React 列表渲染使用的稳定标识 */
  key: Key;
}

/** CellGroup 分组容器公共属性 */
interface CellGroupBaseProps extends CellGroupVariantProps {
  /** 是否在子项之间插入分隔线 */
  border?: boolean;

  /** 覆盖各 slot 的类名，分隔线需要缩进时给 divider 传 ml-* */
  classNames?: SlotClassNames<CellGroupSlots>;

  /** 是否为卡片式内嵌样式（左右留边） */
  inset?: boolean;

  /** 根节点的 ref，用于 measure / 滚动定位等命令式操作 */
  ref?: Ref<View>;

  /** 分组标题，string 自动包裹 Text */
  title?: ReactNode;
}

/** 使用 children 自由组合分组内容 */
export interface CellGroupChildrenProps extends CellGroupBaseProps {
  /** 分组内容，通常为 Cell，也可以是 FormItem 等自定义组件 */
  children: ReactNode;

  /** 使用 children 时不能同时传 items */
  items?: never;
}

/** 使用配置数组批量渲染 Cell */
export interface CellGroupItemsProps extends CellGroupBaseProps {
  /** 使用 items 时不能同时传 children */
  children?: never;

  /** Cell 配置数组，每项必须提供稳定 key */
  items: readonly CellGroupItem[];
}

/** CellGroup 支持 children 自由组合或 items 配置渲染，两种模式不能同时使用 */
export type CellGroupProps = CellGroupChildrenProps | CellGroupItemsProps;

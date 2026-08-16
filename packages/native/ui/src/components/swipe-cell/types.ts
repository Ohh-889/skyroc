import type { ReactNode, Ref } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { SlotClassNames } from '../../types/shared';

/** 滑动方向 */
type SwipeCellSide = 'left' | 'right';

/** 关闭触发位置 */
type SwipeCellPosition = 'cell' | 'left' | 'right';

/** beforeClose 回调参数 */
interface SwipeCellBeforeCloseParams {
  /** 组件标识 */
  name: number | string;
  /** 触发关闭的位置 */
  position: SwipeCellPosition;
}

/** 样式插槽名称 */
type SwipeCellSlots = 'content' | 'leading' | 'root' | 'trailing';

interface SwipeCellProps {
  /** 关闭前的拦截函数，返回 false 可阻止关闭 */
  beforeClose?: (params: SwipeCellBeforeCloseParams) => boolean | Promise<boolean>;

  /** 主内容区域 */
  children?: ReactNode;

  /** 自定义各插槽样式类名 */
  classNames?: SlotClassNames<SwipeCellSlots>;

  /** 是否禁用滑动 */
  disabled?: boolean;

  /** 左侧操作区域内容 */
  leading?: ReactNode;

  /** 左侧滑动区域宽度，不设置时根据内容自动计算 */
  leadingWidth?: number;

  /** 组件标识符，用于在事件回调中区分不同实例 */
  name?: number | string;

  /** 关闭时触发的回调 */
  onClose?: (params: { name: number | string; position: SwipeCellPosition }) => void;

  /** 打开时触发的回调 */
  onOpen?: (params: { name: number | string; position: SwipeCellSide }) => void;

  /** 组件实例引用，用于调用 open/close 方法 */
  ref?: Ref<SwipeCellInstance>;

  /** 自定义根容器样式 */
  style?: StyleProp<ViewStyle>;

  /** 右侧操作区域内容 */
  trailing?: ReactNode;

  /** 右侧滑动区域宽度，不设置时根据内容自动计算 */
  trailingWidth?: number;
}

/** SwipeCell 实例暴露的方法 */
interface SwipeCellInstance {
  /** 关闭操作区域 */
  close: () => void;

  /** 打开指定侧的操作区域 */
  open: (side: SwipeCellSide) => void;
}

export type {
  SwipeCellBeforeCloseParams,
  SwipeCellInstance,
  SwipeCellPosition,
  SwipeCellProps,
  SwipeCellSide,
  SwipeCellSlots
};

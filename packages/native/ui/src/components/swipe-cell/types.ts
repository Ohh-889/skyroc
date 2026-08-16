import type { ReactNode, Ref } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { SlotClassNames } from '../../types/shared';

/** 滑动方向 */
type SwipeCellSide = 'left' | 'right';

/**
 * 触发关闭的来源
 *
 * - `cell`：点击主体内容区收起
 * - `left` / `right`：从对应一侧的展开态收起（手势回弹、实例 `close()`、被其他 SwipeCell 挤掉）
 */
type SwipeCellPosition = 'cell' | SwipeCellSide;

/** 关闭类回调（`beforeClose` / `onClose`）的参数 */
interface SwipeCellCloseParams {
  /** 组件标识 */
  name: number | string;
  /** 触发关闭的来源 */
  position: SwipeCellPosition;
}

/** `beforeClose` 回调参数 */
type SwipeCellBeforeCloseParams = SwipeCellCloseParams;

/** `onOpen` 回调参数 */
interface SwipeCellOpenParams {
  /** 组件标识 */
  name: number | string;
  /** 展开的一侧 */
  position: SwipeCellSide;
}

/** 两侧操作区的实际宽度，由 props 指定或 onLayout 测量得到 */
interface SwipeCellWidths {
  /** 左侧操作区宽度 */
  leading: number;
  /** 右侧操作区宽度 */
  trailing: number;
}

/** 样式插槽名称 */
type SwipeCellSlots = 'content' | 'leading' | 'overlay' | 'root' | 'trailing';

interface SwipeCellProps {
  /**
   * 关闭前的拦截函数，返回 false 可阻止关闭
   *
   * 点击主体、手势回弹、实例 `close()` 三条路径都会经过；被其他 SwipeCell 挤掉与 `disabled` 强制收起不经过——那不是用户对本实例的主动操作。
   *
   * 挂了拦截后，操作区在拿到结果之前不会移动：确认才收起，拒绝则保持展开，不存在「先关掉再弹回来」的中间态。 代价是异步确认期间关闭动画会推迟到 Promise
   * resolve 之后。
   */
  beforeClose?: (params: SwipeCellBeforeCloseParams) => boolean | Promise<boolean>;

  /** 主内容区域 */
  children?: ReactNode;

  /** 自定义各插槽样式类名 */
  classNames?: SlotClassNames<SwipeCellSlots>;

  /** 是否禁用滑动，禁用时会立即收起已展开的操作区 */
  disabled?: boolean;

  /** 展开时是否自动收起其他 SwipeCell，默认开启 */
  exclusive?: boolean;

  /** 左侧操作区域内容 */
  leading?: ReactNode;

  /** 左侧滑动区域宽度，不设置时根据内容自动计算 */
  leadingWidth?: number;

  /** 组件标识符，用于在事件回调中区分不同实例 */
  name?: number | string;

  /** 关闭时触发的回调 */
  onClose?: (params: SwipeCellCloseParams) => void;

  /** 打开时触发的回调 */
  onOpen?: (params: SwipeCellOpenParams) => void;

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
  /** 关闭操作区域，会经过 `beforeClose` */
  close: () => void;

  /** 打开指定侧的操作区域；该侧宽度为 0（无内容或尚未测量）时不生效 */
  open: (side: SwipeCellSide) => void;
}

export type {
  SwipeCellBeforeCloseParams,
  SwipeCellCloseParams,
  SwipeCellInstance,
  SwipeCellOpenParams,
  SwipeCellPosition,
  SwipeCellProps,
  SwipeCellSide,
  SwipeCellSlots,
  SwipeCellWidths
};

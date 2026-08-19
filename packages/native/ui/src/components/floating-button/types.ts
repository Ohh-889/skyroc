import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

/**
 * 拖拽轴向约束
 *
 * - `x`：只能横向拖
 * - `y`：只能纵向拖
 * - `xy`：自由拖拽
 * - `lock`：完全不可拖，只保留点击
 */
type FloatingButtonAxis = 'lock' | 'x' | 'xy' | 'y';

/** 松手后自动吸附到最近边缘的轴向 */
type FloatingButtonMagnetic = 'x' | 'y';

/** 按钮左上角坐标，原点为父容器左上角 */
interface FloatingButtonOffset {
  /** 横向坐标 */
  x: number;

  /** 纵向坐标 */
  y: number;
}

/** 距父容器边缘的最小留白；给数字表示两轴相同，给对象可分别指定，缺省的一边回落到默认值 */
type FloatingButtonGap = number | { x?: number; y?: number };

/**
 * 悬浮按钮属性。
 *
 * 坐标系约定：原点是**父容器**左上角，可视边界取父容器的实测尺寸（内部铺一层 `absolute inset-0` 的测量层）。 因此挂在整屏容器里就按屏幕算，挂在手机框预览、平板分栏一类的定宽容器里就按那个容器算，
 * 两种场景都不会把按钮推到可视区外。需要盖在所有内容之上时，把它放在容器的最后一个子节点。
 */
interface FloatingButtonProps {
  /** 拖拽轴向约束，默认 `y`（只能上下拖） */
  axis?: FloatingButtonAxis;

  /** 按钮内容 */
  children?: ReactNode;

  /** Uniwind className，合并到根节点，可覆盖默认的底色与圆角 */
  className?: string;

  /** 是否禁用，禁用后不响应点击与拖拽，并整体降低不透明度 */
  disabled?: boolean;

  /**
   * 距父容器边缘的最小留白，默认 24。
   *
   * 拖拽与受控 `offset` 都会被夹进 `[gap, 容器尺寸 - size - gap]`。 需要贴边或自行管理边距时传 `0`。
   */
  gap?: FloatingButtonGap;

  /** 松手后自动吸附到该轴向最近的一侧边缘 */
  magnetic?: FloatingButtonMagnetic;

  /** 受控位置；不传则内部自持位置，默认停在右下角 */
  offset?: FloatingButtonOffset;

  /**
   * 拖拽结束时触发，参数是落位的**目标**坐标。
   *
   * 开了 `magnetic` 时给的是吸附终点，此刻回弹动画才刚开始，不是动画结束的回调。
   */
  onOffsetChange?: (offset: FloatingButtonOffset) => void;

  /** 点击回调；拖拽过程不会触发 */
  onPress?: () => void;

  /** 按钮直径（像素），默认 48 */
  size?: number;

  /** 根节点自定义样式，叠在动画样式之上 */
  style?: StyleProp<ViewStyle>;

  /**
   * 是否可见，默认 `true`，切换时走 180ms 的缩放缓动。
   *
   * 显隐刻意不用弹簧：缩放上的过冲没有一个方向说得通，收起时冲到负值会把视图镜像翻转，出现时冲过 1 也只是白晃一下。
   *
   * 也可以传一个 `SharedValue<boolean>`：显隐判断全程留在 UI 线程，不必为每次滚动回到 JS 线程再触发一次渲染（BackTop 就是这么用的）。
   */
  visible?: SharedValue<boolean> | boolean;
}

export type {
  FloatingButtonAxis,
  FloatingButtonGap,
  FloatingButtonMagnetic,
  FloatingButtonOffset,
  FloatingButtonProps
};

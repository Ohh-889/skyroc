import type { ReactNode } from 'react';
import type Animated from 'react-native-reanimated';
import type { AnimatedRef } from 'react-native-reanimated';

/**
 * 回到顶部按钮属性。
 *
 * 位置与可视边界都按窗口尺寸计算，坐标系约定同 FloatingButton：必须挂在铺满屏幕的容器里。
 */
interface BackTopProps {
  /**
   * 距屏幕底边的距离（像素），默认 128。
   *
   * 这是到**屏幕物理底边**的距离，不含安全区。需要避开 home indicator 时自行把安全区高度加进来。
   */
  bottom?: number;

  /** 自定义内容，替换默认的向上箭头 */
  children?: ReactNode;

  /** Uniwind className，透传给 FloatingButton 的根节点 */
  className?: string;

  /** 为 true 时瞬间跳到顶部，为 false 时走滚动动画 */
  immediate?: boolean;

  /** 显示阈值（像素），滚动距离超过该值按钮才出现 */
  offset?: number;

  /** 点击回调，在滚动开始前触发 */
  onPress?: () => void;

  /** 距屏幕右边的距离（像素），默认 30 */
  right?: number;

  /** 按钮直径（像素），默认 40 */
  size?: number;

  /** 目标滚动容器的 AnimatedRef，用于读取滚动距离与执行 scrollTo */
  target: AnimatedRef<Animated.ScrollView>;
}

export type { BackTopProps };

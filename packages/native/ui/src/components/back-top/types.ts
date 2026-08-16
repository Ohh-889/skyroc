import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type Animated from 'react-native-reanimated';
import type { AnimatedRef } from 'react-native-reanimated';

/**
 * 可回顶的滚动容器。
 *
 * `useScrollOffset` 与 `scrollTo` 对两者一视同仁，所以列表——BackTop 最常见的宿主——不必为了回顶退回 ScrollView。 其它滚动组件经 `createAnimatedComponent`
 * 包装后同样适用，这里只列出 Reanimated 内置的两个。
 */
type BackTopScrollable = Animated.FlatList | Animated.ScrollView;

/**
 * 回到顶部按钮属性。
 *
 * 位置与可视边界都按窗口尺寸计算，坐标系约定同 FloatingButton：必须挂在铺满屏幕的容器里。
 */
interface BackTopProps<TRef extends BackTopScrollable = Animated.ScrollView> {
  /**
   * 距屏幕底边的距离（像素），默认 128。
   *
   * 这是到**屏幕物理底边**的距离，不含安全区——位置最终落在 transform 上，拿不到 `*-safe` 工具类背后的运行时 inset。 需要避开 home indicator 或常驻 TabBar
   * 时，由调用方把相应高度并进这个值。
   */
  bottom?: number;

  /** 自定义内容，替换默认的向上箭头 */
  children?: ReactNode;

  /** Uniwind className，透传给 FloatingButton 的根节点 */
  className?: string;

  /** 是否禁用，禁用后不响应点击并整体降低不透明度；显隐仍然跟随滚动 */
  disabled?: boolean;

  /** 为 true 时瞬间跳到顶部，为 false 时走滚动动画 */
  immediate?: boolean;

  /** 显示阈值（像素），滚动距离超过该值按钮才出现。与 FloatingButton 表示坐标的 offset 不是一回事 */
  offset?: number;

  /** 点击回调，在滚动开始前触发 */
  onPress?: () => void;

  /** 距屏幕右边的距离（像素），默认 30 */
  right?: number;

  /** 按钮直径（像素），默认 40 */
  size?: number;

  /** 根节点自定义样式，叠在动画样式之上 */
  style?: StyleProp<ViewStyle>;

  /** 目标滚动容器的 AnimatedRef，用于读取滚动距离与执行 scrollTo */
  target: AnimatedRef<TRef>;
}

export type { BackTopProps, BackTopScrollable };

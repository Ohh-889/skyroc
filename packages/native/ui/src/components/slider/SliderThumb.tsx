import type { ReactNode } from 'react';
import type { AccessibilityActionEvent, AccessibilityActionInfo } from 'react-native';
import { View } from 'react-native';
import type { PanGesture } from 'react-native-gesture-handler';
import { GestureDetector } from 'react-native-gesture-handler';
import type { SharedValue } from 'react-native-reanimated';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { valueToRatio } from './slider-math';
import type { SliderBounds } from './types';

/** 辅助技术能对 `adjustable` 发起的两个动作 */
const ACCESSIBILITY_ACTIONS: AccessibilityActionInfo[] = [{ name: 'decrement' }, { name: 'increment' }];

/** 单个滑块属性 */
interface SliderThumbProps {
  /** 取值边界，用来把值换算成轨道比例 */
  bounds: SliderBounds;

  /** 自定义滑块内容，缺省渲染 `thumbInner` 圆钮 */
  children?: ReactNode;

  /** 定位框的类名（thumb slot） */
  className: string;

  /** 拖拽手势，由父组件按单值 / 区间语义构造 */
  gesture: PanGesture;

  /** 触摸层在交叉轴上的跨度（px），用来把滑块与轨道中心对齐 */
  hitSize: number;

  /** 缺省圆钮的类名（thumbInner slot） */
  innerClassName: string;

  /** 是否可交互，禁用与只读时摘掉无障碍调节能力 */
  interactive: boolean;

  /** 无障碍步进回调，`direction` 为 1 表示 increment */
  onAdjust: (direction: 1 | -1) => void;

  /** 滑块直径（px） */
  size: number;

  /** 轨道长度（px），随布局变化 */
  trackSizeSV: SharedValue<number>;

  /** 当前值的 JS 侧镜像，只用于无障碍读值——UI 线程的位移不依赖它 */
  value: number;

  /** 该滑块的权威值，拖拽期间由 UI 线程直接写入 */
  valueSV: SharedValue<number>;

  /** 是否垂直方向 */
  vertical: boolean;
}

/**
 * 单个滑块。
 *
 * 位移完全由 `valueSV` 在 UI 线程驱动：手指移动时 shared value 直接变，圆钮同帧跟手； JS 线程的重渲染只负责把值同步给受控方，跟不跟得上都不影响手感。
 *
 * 拆成独立组件是为了让两个滑块各持一个 `useAnimatedStyle`——区间模式下 hook 数量恒定，不会随 `range` 变化。
 */
const SliderThumb = (props: SliderThumbProps) => {
  const {
    bounds,
    children,
    className,
    gesture,
    hitSize,
    innerClassName,
    interactive,
    onAdjust,
    size,
    trackSizeSV,
    value,
    valueSV,
    vertical
  } = props;

  // 定位框贴在命中层的起始边（水平靠左、垂直靠底），位移量正好等于「值在轨道上的像素偏移」：
  // 轨道两端各内缩了半个圆钮，所以圆钮左/下边缘的偏移与轨道内的比例位置直接相等，不需要再补半径
  const animatedStyle = useAnimatedStyle(() => {
    const offset = valueToRatio(valueSV.value, bounds) * trackSizeSV.value;

    return { transform: vertical ? [{ translateY: -offset }] : [{ translateX: offset }] };
    // bounds 每次渲染都是新对象，依赖里只取被 worklet 读到的两个边界值
  }, [bounds.max, bounds.min, trackSizeSV, valueSV, vertical]);

  // 交叉轴居中：命中层与圆钮同心，轨道也是同心的，三者中心线因此严格重合
  const crossOffset = (hitSize - size) / 2;

  function handleAccessibilityAction(event: AccessibilityActionEvent) {
    if (event.nativeEvent.actionName === 'increment') {
      onAdjust(1);
      return;
    }

    if (event.nativeEvent.actionName === 'decrement') {
      onAdjust(-1);
    }
  }

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        accessibilityActions={ACCESSIBILITY_ACTIONS}
        accessibilityRole="adjustable"
        accessibilityValue={{ max: bounds.max, min: bounds.min, now: value }}
        accessible={interactive}
        className={className}
        style={[
          vertical
            ? { bottom: 0, height: size, left: crossOffset, width: size }
            : { height: size, left: 0, top: crossOffset, width: size },
          animatedStyle
        ]}
        onAccessibilityAction={handleAccessibilityAction}
      >
        {children ?? <View className={innerClassName} />}
      </Animated.View>
    </GestureDetector>
  );
};

export { SliderThumb };

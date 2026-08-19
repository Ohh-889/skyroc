import { cn, isNumber } from '@skyroc/utils';
import { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { useContainerSize } from '../../hooks/use-container-size';
import { floatingButtonVariants } from './floating-button-variants';
import type { FloatingButtonGap, FloatingButtonProps } from './types';

/**
 * 吸附与边界回弹的弹簧参数。
 *
 * 阻尼比刻意压到略大于 1（临界阻尼），保留弹簧的减速手感但完全不过冲：位移方向一旦过冲，按钮会先冲出 `gap` 边界再退回来，等于视觉上违反了组件自己声明的边距。
 */
const SPRING_CONFIG = {
  damping: 30,
  mass: 1,
  stiffness: 200
};

/** 显隐动画时长（ms） */
const VISIBILITY_DURATION = 180;

/**
 * 显隐动画：两个方向都用 timing，不用弹簧。
 *
 * 缩放上的过冲没有一个方向说得通：收起时会冲到负值，负缩放把视图镜像翻转再弹回来，看着像「缩没了又蹦出来一个」； 出现时冲过 1 再回落也只是白多晃一下。所以显隐一律走无过冲的缓动，只用 in / out 区分方向。
 */
const SHOW_TIMING = {
  duration: VISIBILITY_DURATION,
  easing: Easing.out(Easing.quad)
};

/** 收起缓动，与 SHOW_TIMING 互为反向 */
const HIDE_TIMING = {
  duration: VISIBILITY_DURATION,
  easing: Easing.in(Easing.quad)
};

/** 按下时的不透明度 */
const PRESS_OPACITY = 0.8;

/** 按下 / 抬起的过渡时长（ms） */
const PRESS_DURATION = 100;

/** 禁用态的不透明度 */
const DISABLED_OPACITY = 0.5;

/** 默认距父容器边缘的留白 */
const DEFAULT_GAP = 24;

/** 默认直径 */
const DEFAULT_SIZE = 48;

/** 不传 offset 时，默认停靠位置离底边界的额外距离——直接贴底会压住 TabBar 一类的常驻栏 */
const DEFAULT_BOTTOM_INSET = 100;

/**
 * 缩放小于该值时不再接收触摸。
 *
 * 隐藏动画跑完前按钮几乎看不见，此时仍能点中就是误触；反过来显示动画过半即可点击，不必等缓动走完。
 */
const INTERACTIVE_SCALE = 0.5;

/** 把数值夹在闭区间内 */
function clamp(value: number, min: number, max: number) {
  'worklet';

  return Math.min(Math.max(value, min), max);
}

/** Visible 传的是 SharedValue 还是普通布尔 */
function isSharedVisible(visible: SharedValue<boolean> | boolean): visible is SharedValue<boolean> {
  return typeof visible !== 'boolean';
}

/** 把 gap 的两种写法归一成双轴数值，对象形式缺省的一边回落到默认值 */
function resolveGap(gap: FloatingButtonGap) {
  if (isNumber(gap)) return { x: gap, y: gap };

  return { x: gap.x ?? DEFAULT_GAP, y: gap.y ?? DEFAULT_GAP };
}

const FloatingButton = (props: FloatingButtonProps) => {
  const {
    axis = 'y',
    children,
    className,
    disabled = false,
    gap = DEFAULT_GAP,
    magnetic,
    offset,
    onOffsetChange,
    onPress,
    size = DEFAULT_SIZE,
    style,
    visible = true
  } = props;

  // 边界按父容器实测尺寸算，不再按窗口：渲染本就是相对父容器的 absolute，
  // 用窗口尺寸只在「宿主铺满屏幕」时才碰巧对得上，宿主是手机框预览一类的定宽容器时按钮会被推到容器外
  const { handleLayout, height: containerHeight, measured, width: containerWidth } = useContainerSize();

  // 几何量前置到 shared value 之前：位置初值要用到 maxX / maxY，属于「初值依赖上游数据」的例外。
  // max 再兜一层 Math.max，避免容器太窄或 gap 过大时区间反转，clamp 拿到 min > max 会给出错误结果
  const { x: gapX, y: gapY } = resolveGap(gap);
  const minX = gapX;
  const maxX = Math.max(minX, containerWidth - size - gapX);
  const minY = gapY;
  const maxY = Math.max(minY, containerHeight - size - gapY);

  // visible 的两种载体在这里拆开，但只是「读法」不同：下面统一由一个 useAnimatedReaction 消费，
  // 不存在 UI 线程与 JS 线程各一套显隐逻辑
  const visibleShared = isSharedVisible(visible) ? visible : null;
  const visibleFlag = isSharedVisible(visible) ? true : visible;
  const initialScale = !visibleShared && visibleFlag ? 1 : 0;

  const translateX = useSharedValue(clamp(offset?.x ?? maxX, minX, maxX));
  const translateY = useSharedValue(clamp(offset?.y ?? maxY - DEFAULT_BOTTOM_INSET, minY, maxY));
  // SharedValue 不能在 React render 阶段读 .value：先隐藏，交给下面的 UI 线程 reaction 在首轮无动画同步。
  // 普通 boolean 则可直接作为初值，避免 visible=false 挂载时先闪出按钮。
  const scale = useSharedValue(initialScale);
  const opacity = useSharedValue(1);
  const contextX = useSharedValue(0);
  const contextY = useSharedValue(0);

  // 拆成标量再进依赖数组：offset 多半是调用方内联的字面量，按对象比会每次渲染都判定为变化
  const offsetX = offset?.x;
  const offsetY = offset?.y;

  // 首次拿到实测尺寸之前，位置是按窗口尺寸估的；补正到真实边界属于「纠正估算」而不是位置变化，得跳过动画
  const settledRef = useRef(false);

  function handleOffsetChange(x: number, y: number) {
    onOffsetChange?.({ x, y });
  }

  const tapGesture = Gesture.Tap()
    .enabled(!disabled)
    .onBegin(() => {
      opacity.value = withTiming(PRESS_OPACITY, { duration: PRESS_DURATION });
    })
    // 用 onStart 而不是 onEnd：Tap 只有识别成功才会进入 ACTIVE，而 onEnd 连识别失败的那次也会走到
    .onStart(() => {
      if (onPress) {
        scheduleOnRN(onPress);
      }
    })
    .onFinalize(() => {
      opacity.value = withTiming(1, { duration: PRESS_DURATION });
    });

  const panGesture = Gesture.Pan()
    .enabled(!disabled && axis !== 'lock')
    .onBegin(() => {
      contextX.value = translateX.value;
      contextY.value = translateY.value;
      opacity.value = withTiming(PRESS_OPACITY, { duration: PRESS_DURATION });
    })
    .onUpdate(event => {
      let nextX = contextX.value;
      let nextY = contextY.value;

      if (axis === 'x' || axis === 'xy') {
        nextX = contextX.value + event.translationX;
      }
      if (axis === 'y' || axis === 'xy') {
        nextY = contextY.value + event.translationY;
      }

      translateX.value = clamp(nextX, minX, maxX);
      translateY.value = clamp(nextY, minY, maxY);
    })
    .onEnd(() => {
      let finalX = translateX.value;
      let finalY = translateY.value;

      if (magnetic === 'x') {
        const midX = (minX + maxX) / 2;

        finalX = translateX.value < midX ? minX : maxX;
        translateX.value = withSpring(finalX, SPRING_CONFIG);
      }

      if (magnetic === 'y') {
        const midY = (minY + maxY) / 2;

        finalY = translateY.value < midY ? minY : maxY;
        translateY.value = withSpring(finalY, SPRING_CONFIG);
      }

      if (onOffsetChange) {
        scheduleOnRN(handleOffsetChange, finalX, finalY);
      }
    })
    .onFinalize(() => {
      opacity.value = withTiming(1, { duration: PRESS_DURATION });
    });

  // Exclusive 让 Pan 优先：一旦手指移动就判定为拖拽，Tap 不再触发。
  //
  // axis 为 lock 时干脆不组合：Pan 这时已经 enabled(false)，但 RNGH 的 web 实现里，被禁用的成员
  // 仍留在 Exclusive 的仲裁链上，Tap 要等一个永远不会失败的 Pan 让位，点击就此彻底失效
  // （原生端不会，所以真机上一直是好的）。BackTop 正是 axis="lock"，web 上点不动就是这条。
  const composedGesture = axis === 'lock' ? tapGesture : Gesture.Exclusive(panGesture, tapGesture);

  const animatedStyle = useAnimatedStyle(
    () => ({
      height: size,
      opacity: disabled ? DISABLED_OPACITY : opacity.value,
      pointerEvents: scale.value < INTERACTIVE_SCALE ? 'none' : 'auto',
      transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { scale: scale.value }],
      width: size
    }),
    [disabled, opacity, scale, size, translateX, translateY]
  );

  // SharedValue 模式不能在 render 阶段读取初值，首轮在 UI 线程直接同步且不播放动画；
  // 普通 boolean 的 scale 已由初值给到位。后续值没变时跳过，避免 mapper 重启后凭空重放动画。
  useAnimatedReaction(
    () => (visibleShared ? visibleShared.value : visibleFlag),
    (current, previous) => {
      if (previous === null) {
        if (visibleShared) {
          scale.value = current ? 1 : 0;
        }

        return;
      }

      if (current === previous) return;

      scale.value = current ? withTiming(1, SHOW_TIMING) : withTiming(0, HIDE_TIMING);
    },
    [scale, visibleFlag, visibleShared]
  );

  // 受控位置同步 + 边界重夹。非受控（拖拽）时也必须跑：旋转或容器尺寸变化后 max 会变小，
  // 而 clamp 只在拖拽过程中生效，按钮一旦停在可视区外就既点不到也拖不回来
  useEffect(() => {
    const animate = settledRef.current;

    settledRef.current = measured;

    const nextX = clamp(offsetX ?? translateX.value, minX, maxX);
    const nextY = clamp(offsetY ?? translateY.value, minY, maxY);

    translateX.value = animate ? withSpring(nextX, SPRING_CONFIG) : nextX;
    translateY.value = animate ? withSpring(nextY, SPRING_CONFIG) : nextY;
  }, [offsetX, offsetY, minX, maxX, minY, maxY, measured, translateX, translateY]);

  return (
    // 测量层：absolute inset-0 铺满父容器，onLayout 回来的就是按钮真正可用的可视区。
    // box-none 让它只做尺寸探针，不接管任何触摸，底下的页面照常可点
    <View
      className="absolute inset-0"
      pointerEvents="box-none"
      onLayout={handleLayout}
    >
      <GestureDetector gesture={composedGesture}>
        <Animated.View
          className={cn(floatingButtonVariants(), className)}
          style={[animatedStyle, style]}
        >
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export { FloatingButton };

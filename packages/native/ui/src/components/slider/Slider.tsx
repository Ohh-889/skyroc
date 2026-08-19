import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cn } from '@skyroc/utils';
import { useEffect, useRef } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { clamp, positionToValue, valueToRatio } from './slider-math';
import {
  DEFAULT_SLIDER_BAR_SIZE,
  DEFAULT_SLIDER_THUMB_SIZE,
  SLIDER_MIN_HIT_SIZE,
  sliderVariants
} from './slider-variants';
import { SliderThumb } from './SliderThumb';
import type { SliderBounds, SliderInternalProps, SliderProps } from './types';

/** 缺省值按形态分流：区间模式没给数组时两端都停在 `min`，避免 `[min, 0]` 这种首尾倒置的区间 */
function resolveDefaultValue(defaultValue: number | [number, number] | undefined, range: boolean, min: number) {
  if (range) {
    return Array.isArray(defaultValue) ? defaultValue : ([min, min] as [number, number]);
  }

  return Array.isArray(defaultValue) ? defaultValue[0] : (defaultValue ?? min);
}

/**
 * 把对外的标量 / 二元组统一成内部的 `[start, end]`，顺带夹边界并保证 `start <= end`。
 *
 * 单值模式两端取同一个数，`end` 只是占位——这样组件里再没有第二处需要判断 `range` 的取值分支。
 */
function resolveThumbValues(
  value: number | [number, number] | undefined,
  range: boolean,
  bounds: SliderBounds
): [number, number] {
  if (!range) {
    const single = clamp(Array.isArray(value) ? value[0] : (value ?? bounds.min), bounds.min, bounds.max);

    return [single, single];
  }

  const raw: [number, number] = Array.isArray(value) ? value : [bounds.min, value ?? bounds.min];
  const start = clamp(raw[0], bounds.min, bounds.max);

  return [start, clamp(raw[1], start, bounds.max)];
}

const Slider = (props: SliderProps) => {
  // 判别联合只服务于调用方；组件内部统一按 [start, end] 处理，因此在解构处一次性放宽类型
  const {
    barSize = DEFAULT_SLIDER_BAR_SIZE,
    className,
    classNames,
    color,
    defaultValue,
    disabled = false,
    endThumb,
    max = 100,
    min = 0,
    onChange,
    onChangeAfterDrag,
    range = false,
    readonly = false,
    ref,
    startThumb,
    step = 1,
    testID,
    thumb,
    thumbSize = DEFAULT_SLIDER_THUMB_SIZE,
    value: valueProp,
    vertical = false
  } = props as SliderInternalProps;

  const [value, setValue] = useControllableState<number | [number, number]>({
    caller: 'Slider',
    defaultProp: resolveDefaultValue(defaultValue, range, min),
    onChange,
    prop: valueProp
  });

  // 拖拽期间的权威值全在 UI 线程上：手势直接改 shared value，圆钮与激活段同帧跟手，
  // React 状态只是它的渲染镜像，重渲染跟不跟得上都不影响手感
  const trackSizeSV = useSharedValue(0);
  const startValueSV = useSharedValue(min);
  const endValueSV = useSharedValue(min);
  const startDragSV = useSharedValue(0);
  const endDragSV = useSharedValue(0);

  // 手势闭包在 UI 线程上冻住的是创建那一刻的函数，回调必须经 ref 取用才拿得到最新的一份
  const onChangeAfterDragRef = useRef(onChangeAfterDrag);

  const bounds: SliderBounds = { max, min, step: step > 0 ? step : 1 };

  const [startValue, endValue] = resolveThumbValues(value, range, bounds);

  const interactive = !disabled && !readonly;

  // 轨道两端各内缩半个圆钮，圆钮因此永远落在命中层内，不会溢出到相邻内容上；
  // 命中层与轨道同心，交叉轴上三者中心线严格重合
  const thumbRadius = thumbSize / 2;
  const hitSize = Math.max(thumbSize, SLIDER_MIN_HIT_SIZE);
  const barOffset = (hitSize - barSize) / 2;

  const activeBarStyle = useAnimatedStyle(() => {
    const startRatio = range ? valueToRatio(startValueSV.value, bounds) : 0;
    const endRatio = valueToRatio(range ? endValueSV.value : startValueSV.value, bounds);
    const trackSize = trackSizeSV.value;

    return vertical
      ? { bottom: startRatio * trackSize, height: (endRatio - startRatio) * trackSize }
      : { left: startRatio * trackSize, width: (endRatio - startRatio) * trackSize };
    // bounds 每次渲染都是新对象，依赖里只取被 worklet 读到的两个边界值
  }, [bounds.max, bounds.min, endValueSV, range, startValueSV, trackSizeSV, vertical]);

  const variantSlots = sliderVariants({ color, disabled, vertical });

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      activeBar: cn(variantSlots.activeBar(), classNames?.activeBar),
      hitArea: cn(variantSlots.hitArea(), classNames?.hitArea),
      root: cn(variantSlots.root(), classNames?.root, className),
      thumb: cn(variantSlots.thumb(), classNames?.thumb),
      thumbInner: cn(variantSlots.thumbInner(), classNames?.thumbInner),
      track: cn(variantSlots.track(), classNames?.track)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  /** UI 线程把结果送回 JS 线程：两端的值都由参数带过来，绝不从被冻住的闭包里读 state */
  function commitValue(nextStart: number, nextEnd: number) {
    setValue(range ? [nextStart, nextEnd] : nextStart);
  }

  function commitAfterDrag(nextStart: number, nextEnd: number) {
    onChangeAfterDragRef.current?.(range ? [nextStart, nextEnd] : nextStart);
  }

  function handleTrackLayout(event: LayoutChangeEvent) {
    const layout = event.nativeEvent.layout;

    trackSizeSV.value = vertical ? layout.height : layout.width;
  }

  /** 无障碍步进：辅助技术只能按 step 加减，同样受两端互不穿越的约束 */
  function adjustThumb(isEnd: boolean, direction: 1 | -1) {
    const delta = bounds.step * direction;

    if (!range) {
      const next = clamp(startValue + delta, min, max);

      startValueSV.value = next;
      endValueSV.value = next;
      commitValue(next, next);
      commitAfterDrag(next, next);
      return;
    }

    const nextStart = isEnd ? startValue : clamp(startValue + delta, min, endValue);
    const nextEnd = isEnd ? clamp(endValue + delta, startValue, max) : endValue;

    startValueSV.value = nextStart;
    endValueSV.value = nextEnd;
    commitValue(nextStart, nextEnd);
    commitAfterDrag(nextStart, nextEnd);
  }

  function handleStartAdjust(direction: 1 | -1) {
    adjustThumb(false, direction);
  }

  function handleEndAdjust(direction: 1 | -1) {
    adjustThumb(true, direction);
  }

  /**
   * 构造某一侧滑块的拖拽手势。
   *
   * `onStart` 把当前值换算成起拖像素位置，`onUpdate` 只做位移叠加——比每帧读手指绝对坐标稳， 手指偏离轨道中心线也不会跳值。松手上报的值取自 shared value，是当帧的权威值，不会慢一拍。
   */
  function createThumbGesture(isEnd: boolean) {
    const dragStartSV = isEnd ? endDragSV : startDragSV;
    const valueSV = isEnd ? endValueSV : startValueSV;

    return Gesture.Pan()
      .enabled(interactive)
      .onStart(() => {
        dragStartSV.value = valueToRatio(valueSV.value, bounds) * trackSizeSV.value;
      })
      .onUpdate(event => {
        const delta = vertical ? -event.translationY : event.translationX;
        const next = positionToValue(dragStartSV.value + delta, trackSizeSV.value, bounds);

        // 区间两端互为边界。允许穿越会让松手后「手上这个滑块」变成另一个，比夹住更难用
        const lower = range && isEnd ? startValueSV.value : bounds.min;
        const upper = range && !isEnd ? endValueSV.value : bounds.max;

        valueSV.value = clamp(next, lower, upper);

        scheduleOnRN(commitValue, startValueSV.value, endValueSV.value);
      })
      .onEnd(() => {
        scheduleOnRN(commitAfterDrag, startValueSV.value, endValueSV.value);
      });
  }

  const startGesture = createThumbGesture(false);
  const endGesture = createThumbGesture(true);

  /**
   * 点击轨道把最近的滑块挪过去。
   *
   * 用 Tap 而不是 Pressable：`event.x` / `event.y` 相对 GestureDetector 挂载的那个视图，基准明确； Pressable 的 `locationX`
   * 相对实际接收触摸的原生视图，落在激活段上时基准会变成子视图。
   */
  const trackTapGesture = Gesture.Tap()
    .enabled(interactive)
    .onEnd((event, success) => {
      if (!success) return;

      // 命中层两端各留了 thumbRadius 给圆钮，减掉之后才是轨道内的位置
      const position = vertical ? trackSizeSV.value - (event.y - thumbRadius) : event.x - thumbRadius;
      const next = positionToValue(position, trackSizeSV.value, bounds);

      if (!range) {
        startValueSV.value = next;
        endValueSV.value = next;
      } else if (Math.abs(next - endValueSV.value) < Math.abs(next - startValueSV.value)) {
        endValueSV.value = Math.max(next, startValueSV.value);
      } else {
        startValueSV.value = Math.min(next, endValueSV.value);
      }

      scheduleOnRN(commitValue, startValueSV.value, endValueSV.value);
      scheduleOnRN(commitAfterDrag, startValueSV.value, endValueSV.value);
    });

  // 每次渲染刷新回调引用，让 UI 线程调度回来的那次调用拿到最新的一份
  useEffect(() => {
    onChangeAfterDragRef.current = onChangeAfterDrag;
  });

  // 受控方改值时把权威值推回 UI 线程。拖拽期间 UI 线程先写、React 后到，回写的是同一个数，两边不会打架
  useEffect(() => {
    startValueSV.value = startValue;
    endValueSV.value = endValue;
  }, [startValue, endValue, startValueSV, endValueSV]);

  return (
    <View
      ref={ref}
      className={slotClassNames.root}
      testID={testID}
    >
      <GestureDetector gesture={trackTapGesture}>
        <View
          className={slotClassNames.hitArea}
          style={vertical ? { width: hitSize } : { height: hitSize }}
        >
          <View
            className={slotClassNames.track}
            style={
              vertical
                ? { bottom: thumbRadius, left: barOffset, top: thumbRadius, width: barSize }
                : { height: barSize, left: thumbRadius, right: thumbRadius, top: barOffset }
            }
            onLayout={handleTrackLayout}
          >
            <Animated.View
              className={slotClassNames.activeBar}
              style={[vertical ? { left: 0, right: 0 } : { bottom: 0, top: 0 }, activeBarStyle]}
            />
          </View>

          <SliderThumb
            bounds={bounds}
            className={slotClassNames.thumb}
            gesture={startGesture}
            hitSize={hitSize}
            innerClassName={slotClassNames.thumbInner}
            interactive={interactive}
            size={thumbSize}
            trackSizeSV={trackSizeSV}
            value={startValue}
            valueSV={startValueSV}
            vertical={vertical}
            onAdjust={handleStartAdjust}
          >
            {range ? startThumb : thumb}
          </SliderThumb>

          {range ? (
            <SliderThumb
              bounds={bounds}
              className={slotClassNames.thumb}
              gesture={endGesture}
              hitSize={hitSize}
              innerClassName={slotClassNames.thumbInner}
              interactive={interactive}
              size={thumbSize}
              trackSizeSV={trackSizeSV}
              value={endValue}
              valueSV={endValueSV}
              vertical={vertical}
              onAdjust={handleEndAdjust}
            >
              {endThumb}
            </SliderThumb>
          ) : null}
        </View>
      </GestureDetector>
    </View>
  );
};

export { Slider };

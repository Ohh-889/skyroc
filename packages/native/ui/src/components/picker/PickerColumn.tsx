/* eslint-disable react-hooks/exhaustive-deps -- findValueIndex 每次渲染都是新函数，列进依赖会让同步 effect 每帧重跑；
   它的结果完全由 value / options 决定，所以只声明这两者。首次定位那个 effect 按语义就只该在挂载时跑一次。 */
import { useEffect, useRef } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { View } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import Animated, {
  createAnimatedComponent,
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { cn } from '@skyroc/utils';
import { scheduleOnRN } from 'react-native-worklets';
import { ScrollView as GHScrollView } from 'react-native-gesture-handler';
import type { SlotClassNames } from '../../types';
import { Text } from '../text/Typography';
import { pickerVariants } from './picker-variants';
import type { PickerColumnProps, PickerFieldNames, PickerOption, PickerSlots } from './types';

/** 变体槽是纯函数，提到模块级，省掉每个选项一次调用 */
const slots = pickerVariants();

/** 距中心每远一格衰减的透明度，以及衰减下限 */
const OPACITY_STEP = 0.25;

const MIN_OPACITY = 0.3;

/** 距中心每远一格衰减的缩放，以及衰减下限 */
const SCALE_STEP = 0.05;

const MIN_SCALE = 0.85;

/** 禁用项在距离衰减之上再打的折扣 */
const DISABLED_OPACITY_RATIO = 0.4;

/** 首次定位完成后恢复滚动动画的延迟（ms） */
const RESTORE_ANIMATION_DELAY = 50;

/** 拖拽结束时判断后面还有没有 momentum 的速度阈值 */
const MOMENTUM_VELOCITY_THRESHOLD = 0.01;

/** 滚过一格时的轻触反馈；不闭包任何东西，提到组件外，避免每次渲染都给 worklet 换一个新引用 */
function triggerHaptic() {
  Haptics.selectionAsync();
}

interface PickerColumnItemProps {
  /** 覆盖各 slot 的类名 */
  classNames?: SlotClassNames<PickerSlots>;

  /** 字段名映射 */
  fieldNames: Required<PickerFieldNames>;

  /** 该项在列中的下标 */
  index: number;

  /** 每个选项的高度（px） */
  itemHeight: number;

  /** 选项数据 */
  option: PickerOption;

  /** 当前滚动偏移 */
  scrollY: SharedValue<number>;

  /** 可见选项数 */
  visibleCount: number;
}

const PickerColumnItem = (props: PickerColumnItemProps) => {
  const { classNames, fieldNames, index, itemHeight, option, scrollY, visibleCount } = props;

  const centerOffset = Math.floor(visibleCount / 2);
  const spacerHeight = centerOffset * itemHeight;
  const label = String(option[fieldNames.label] ?? '');

  const animatedStyle = useAnimatedStyle(() => {
    const itemCenter = spacerHeight + index * itemHeight;
    const viewCenter = scrollY.value + centerOffset * itemHeight;
    const distance = Math.abs(itemCenter - viewCenter) / itemHeight;

    const opacity = Math.max(MIN_OPACITY, 1 - distance * OPACITY_STEP);
    const scale = Math.max(MIN_SCALE, 1 - distance * SCALE_STEP);

    return {
      opacity: option.disabled ? opacity * DISABLED_OPACITY_RATIO : opacity,
      transform: [{ scale }]
    };
  }, [centerOffset, index, itemHeight, option.disabled, scrollY, spacerHeight]);

  return (
    <Animated.View
      className={cn(slots.item(), classNames?.item)}
      style={[{ height: itemHeight }, animatedStyle]}
    >
      <Text
        className={cn(slots.itemText(), classNames?.itemText)}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Animated.View>
  );
};

const AnimatedGHScrollView = createAnimatedComponent(GHScrollView);

const PickerColumn = (props: PickerColumnProps) => {
  const { classNames, columnIndex, fieldNames, haptic, itemHeight, onChange, options, value, visibleCount } = props;

  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const scrollY = useSharedValue(0);
  const scrollTarget = useSharedValue(0);
  const scrollAnimated = useSharedValue(true);
  const prevScrollIndex = useSharedValue(-1);
  const isUserScrolling = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const centerOffset = Math.floor(visibleCount / 2);
  const spacerHeight = centerOffset * itemHeight;
  const maxIndex = Math.max(0, options.length - 1);

  function findValueIndex(val: string): number {
    const idx = options.findIndex(option => option[fieldNames.value] === val);
    return idx >= 0 ? idx : 0;
  }

  function findNearestEnabled(index: number): number {
    if (!options[index]?.disabled) return index;

    for (let offset = 1; offset < options.length; offset += 1) {
      const forward = index + offset;
      const backward = index - offset;

      if (forward < options.length && !options[forward]?.disabled) return forward;
      if (backward >= 0 && !options[backward]?.disabled) return backward;
    }

    return index;
  }

  // 轻量滚动处理：UI 线程只跟踪 scrollY 与轻触反馈
  const scrollHandler = useAnimatedScrollHandler({
    onScroll(event) {
      scrollY.value = event.contentOffset.y;

      if (!haptic) return;

      // 回弹会把 offset 带到选项范围之外，不 clamp 的话拉到头还会一路震
      const rawIndex = Math.round(event.contentOffset.y / itemHeight);
      const currentIndex = Math.min(Math.max(rawIndex, 0), maxIndex);

      if (currentIndex !== prevScrollIndex.value) {
        prevScrollIndex.value = currentIndex;
        scheduleOnRN(triggerHaptic);
      }
    }
  }, [haptic, itemHeight, maxIndex, prevScrollIndex, scrollY]);

  // 响应式滚动：scrollTarget 变化时在 UI 线程执行 scrollTo
  useDerivedValue(() => {
    scrollTo(scrollViewRef, 0, scrollTarget.value, scrollAnimated.value);
  }, [scrollAnimated, scrollTarget, scrollViewRef]);

  /** 按当前偏移结算选中项，禁用项自动吸附到最近的可用项 */
  function commitSelection(offsetY: number) {
    isUserScrolling.current = false;

    const rawIndex = Math.round(offsetY / itemHeight);
    const selectedIndex = Math.min(Math.max(rawIndex, 0), maxIndex);
    const correctedIndex = findNearestEnabled(selectedIndex);

    if (correctedIndex !== selectedIndex) {
      scrollTarget.value = correctedIndex * itemHeight;
    }

    const selectedOption = options[correctedIndex];

    if (!selectedOption) return;

    const selectedValue = selectedOption[fieldNames.value] as string | undefined;

    if (selectedValue !== undefined && selectedValue !== value) {
      onChange(selectedValue, columnIndex);
    }
  }

  function handleScrollBeginDrag() {
    isUserScrolling.current = true;
  }

  /**
   * 拖拽结束兜底。
   *
   * Android 上 snapToInterval 已经吸附住时不会再产生 momentum，onMomentumScrollEnd 不触发， isUserScrolling 会永远卡在
   * true，之后 value → 滚动位置的同步全部静默失效。 但飞滚时这个回调先于 momentum 触发，带着速度就提交会先落一个途中的错值，所以按速度分流。
   */
  function handleScrollEndDrag(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const velocityY = event.nativeEvent.velocity?.y ?? 0;

    if (Math.abs(velocityY) > MOMENTUM_VELOCITY_THRESHOLD) return;

    commitSelection(event.nativeEvent.contentOffset.y);
  }

  function handleMomentumScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    commitSelection(event.nativeEvent.contentOffset.y);
  }

  // value 变化（如级联联动）时同步滚动位置，用户正在滚动时不抢
  useEffect(() => {
    if (isUserScrolling.current) return;

    const targetIndex = findValueIndex(value);
    scrollTarget.value = targetIndex * itemHeight;
  }, [value, options]);

  // 首次定位：不带动画直接落到选中项
  useEffect(() => {
    const targetIndex = findValueIndex(value);
    const y = targetIndex * itemHeight;

    scrollY.value = y;
    scrollAnimated.value = false;

    // scrollTo 要等 ScrollView 完成首次布局才生效，两级 timer 分别做「布局后定位」与「定位后恢复动画」；
    // 卸载时必须清掉，否则会去写一个已经销毁的组件的 shared value
    timersRef.current.push(
      setTimeout(() => {
        scrollTarget.value = y;

        timersRef.current.push(
          setTimeout(() => {
            scrollAnimated.value = true;
          }, RESTORE_ANIMATION_DELAY)
        );
      })
    );

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, []);

  return (
    // 列的 className 落在这层普通 View 上：AnimatedGHScrollView 是 createAnimatedComponent 包过的
    // 第三方组件，Uniwind 的 className 能不能透到它身上没有把握，布局不赌这个
    <View className={cn(slots.column(), classNames?.column)}>
      <AnimatedGHScrollView
        ref={scrollViewRef}
        alwaysBounceVertical
        decelerationRate="fast"
        directionalLockEnabled
        nestedScrollEnabled
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        style={{ flex: 1 }}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        onScroll={scrollHandler}
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
      >
        {/* 顶部占位，让第一项能滚到中心 */}
        <View style={{ height: spacerHeight }} />

        {options.map((option, index) => (
          <PickerColumnItem
            key={String(option[fieldNames.value] ?? index)}
            classNames={classNames}
            fieldNames={fieldNames}
            index={index}
            itemHeight={itemHeight}
            option={option}
            scrollY={scrollY}
            visibleCount={visibleCount}
          />
        ))}

        {/* 底部占位，让最后一项能滚到中心 */}
        <View style={{ height: spacerHeight }} />
      </AnimatedGHScrollView>
    </View>
  );
};

export { PickerColumn };

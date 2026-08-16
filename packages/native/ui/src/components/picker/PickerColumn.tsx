import { useEffect, useRef } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { View } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import Animated, {
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { scheduleOnRN } from 'react-native-worklets';
import { ScrollView as GHScrollView } from 'react-native-gesture-handler';
import { Text } from '../text/Typography';
import { pickerVariants } from './picker-variants';
import type { PickerColumnProps, PickerOption } from './types';
/** Hoist variant slots — pure function, no need to call per item */
const slots = pickerVariants();

interface PickerColumnItemProps {
  /** Index of this item within the column */
  index: number;

  /** Height of each item in pixels */
  itemHeight: number;

  /** The picker option data */
  option: PickerOption;

  /** Current scroll offset shared value */
  scrollY: SharedValue<number>;

  /** Number of visible items */
  visibleCount: number;
}

const PickerColumnItem = (props: PickerColumnItemProps) => {
  const { index, itemHeight, option, scrollY, visibleCount } = props;

  const centerOffset = Math.floor(visibleCount / 2);
  const spacerHeight = centerOffset * itemHeight;

  const animatedStyle = useAnimatedStyle(() => {
    const itemCenter = spacerHeight + index * itemHeight;
    const viewCenter = scrollY.value + centerOffset * itemHeight;
    const distance = Math.abs(itemCenter - viewCenter) / itemHeight;

    const opacity = Math.max(0.3, 1 - distance * 0.25);
    const scale = Math.max(0.85, 1 - distance * 0.05);

    return {
      opacity: option.disabled ? opacity * 0.4 : opacity,
      transform: [{ scale }]
    };
  });

  return (
    <Animated.View style={[{ alignItems: 'center', height: itemHeight, justifyContent: 'center' }, animatedStyle]}>
      <Text
        className={slots.itemText()}
        numberOfLines={1}
      >
        {option.label}
      </Text>
    </Animated.View>
  );
};

const AnimatedGHScrollView = Animated.createAnimatedComponent(GHScrollView);

const PickerColumn = (props: PickerColumnProps) => {
  const { columnIndex, fieldNames, haptic, itemHeight, onChange, options, value, visibleCount } = props;

  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const scrollY = useSharedValue(0);
  const scrollTarget = useSharedValue(0);
  const scrollAnimated = useSharedValue(true);
  const prevScrollIndex = useSharedValue(-1);
  const isUserScrolling = useRef(false);
  const centerOffset = Math.floor(visibleCount / 2);
  const spacerHeight = centerOffset * itemHeight;

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

  function triggerHaptic() {
    Haptics.selectionAsync();
  }

  // Lightweight scroll handler — only tracks scrollY on UI thread + haptic
  const scrollHandler = useAnimatedScrollHandler({
    onScroll(event) {
      scrollY.value = event.contentOffset.y;

      if (haptic) {
        const currentIndex = Math.round(event.contentOffset.y / itemHeight);

        if (currentIndex !== prevScrollIndex.value) {
          prevScrollIndex.value = currentIndex;
          scheduleOnRN(triggerHaptic);
        }
      }
    }
  });

  // Reactive scroll — runs on UI thread when scrollTarget changes.
  // Same pattern as Wheel.tsx reference: useDerivedValue drives scrollTo.
  useDerivedValue(() => {
    scrollTo(scrollViewRef, 0, scrollTarget.value, scrollAnimated.value);
  });

  // Native event: user starts dragging (runs on JS thread, no bridge cost)
  function handleScrollBeginDrag() {
    isUserScrolling.current = true;
  }

  // Native event: momentum ends — determine selection (runs on JS thread)
  function handleMomentumScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    isUserScrolling.current = false;
    const offsetY = event.nativeEvent.contentOffset.y;
    let selectedIndex = Math.round(offsetY / itemHeight);
    selectedIndex = Math.max(0, Math.min(selectedIndex, options.length - 1));

    const correctedIndex = findNearestEnabled(selectedIndex);

    if (correctedIndex !== selectedIndex) {
      const y = correctedIndex * itemHeight;
      scrollTarget.value = y;
    }

    const selectedOption = options[correctedIndex];
    if (selectedOption) {
      const selectedValue = selectedOption[fieldNames.value] as string;

      if (selectedValue !== value) {
        onChange(selectedValue, columnIndex);
      }
    }
  }

  // Sync scroll position when value prop changes (e.g., cascade update)
  useEffect(() => {
    if (isUserScrolling.current) return;

    const targetIndex = findValueIndex(value);
    scrollTarget.value = targetIndex * itemHeight;
  }, [value, options]);

  // Initial scroll position — no animation, same pattern as reference Wheel.tsx
  useEffect(() => {
    const targetIndex = findValueIndex(value);
    const y = targetIndex * itemHeight;
    scrollY.value = y;
    scrollAnimated.value = false;

    setTimeout(() => {
      scrollTarget.value = y;
      // Restore animation for subsequent scrolls
      setTimeout(() => {
        scrollAnimated.value = true;
      }, 50);
    });
  }, []);

  return (
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
    >
      {/* Top spacer */}
      <View style={{ height: spacerHeight }} />

      {options.map((option, index) => (
        <PickerColumnItem
          key={option[fieldNames.value] as string}
          index={index}
          itemHeight={itemHeight}
          option={option}
          scrollY={scrollY}
          visibleCount={visibleCount}
        />
      ))}

      {/* Bottom spacer */}
      <View style={{ height: spacerHeight }} />
    </AnimatedGHScrollView>
  );
};

export { PickerColumn };

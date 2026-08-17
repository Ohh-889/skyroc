/* eslint-disable complexity */
import { useEffect, useRef } from 'react';
import { type LayoutChangeEvent, Pressable, View, type ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import type { SliderProps } from './types';

const DEFAULT_ACTIVE_COLOR = '#1677ff';
const DEFAULT_INACTIVE_COLOR = '#e5e5e5';

const Slider = (props: SliderProps) => {
  const {
    activeColor = DEFAULT_ACTIVE_COLOR,
    barHeight = 2,
    button,
    buttonSize = 24,
    className,
    defaultValue = 0,
    disabled = false,
    inactiveColor = DEFAULT_INACTIVE_COLOR,
    leftButton,
    max = 100,
    min = 0,
    onChange,
    onChangeAfterDrag,
    range = false,
    readonly = false,
    rightButton,
    step = 1,
    value: valueProp,
    vertical = false
  } = props;

  const [value, setValue] = useControllableState({
    caller: 'Slider',
    defaultProp: defaultValue,
    onChange,
    prop: valueProp
  });

  // Shared values for UI-thread gesture math
  const trackSizeSV = useSharedValue(0);
  const thumb1StartPos = useSharedValue(0);
  const thumb2StartPos = useSharedValue(0);
  // Mirror current value into shared values so gesture onStart can read them
  const thumb1ValueSV = useSharedValue(0);
  const thumb2ValueSV = useSharedValue(0);

  const onChangeAfterDragRef = useRef(onChangeAfterDrag);
  onChangeAfterDragRef.current = onChangeAfterDrag;

  // Keep shared values in sync with React state
  useEffect(() => {
    if (range) {
      const arr = Array.isArray(value) ? value : [min, value as number];
      thumb1ValueSV.value = arr[0];
      thumb2ValueSV.value = arr[1];
    } else {
      thumb1ValueSV.value = typeof value === 'number' ? value : (value as [number, number])[0];
    }
  }, [value, range, min]);

  function isInteractive(): boolean {
    return !disabled && !readonly;
  }

  function getSingleValue(): number {
    if (typeof value === 'number') return value;
    return (value as [number, number])[0];
  }

  function getRangeValues(): [number, number] {
    if (Array.isArray(value)) return value as [number, number];
    return [min, value as number];
  }

  function handleSingleChange(newVal: number) {
    setValue(newVal);
  }

  function handleRangeChange(index: number, newVal: number) {
    const current = getRangeValues();
    const next: [number, number] = [...current];
    next[index] = newVal;
    if (next[0] > next[1]) {
      if (index === 0) {
        next[0] = next[1];
      } else {
        next[1] = next[0];
      }
    }
    setValue(next);
  }

  function handleAfterDrag(val: number | [number, number]) {
    onChangeAfterDragRef.current?.(val);
  }

  function handleTrackLayout(e: LayoutChangeEvent) {
    const layout = e.nativeEvent.layout;
    trackSizeSV.value = vertical ? layout.height : layout.width;
  }

  function handleTrackPress(e: { nativeEvent: { locationX: number; locationY: number } }) {
    if (!isInteractive()) return;
    if (trackSizeSV.value <= 0) return;

    const position = vertical ? trackSizeSV.value - e.nativeEvent.locationY : e.nativeEvent.locationX;
    const newVal = jsSnapToStep(position);

    if (range) {
      const [left, right] = getRangeValues();
      const distLeft = Math.abs(newVal - left);
      const distRight = Math.abs(newVal - right);
      if (distLeft <= distRight) {
        handleRangeChange(0, newVal);
        handleAfterDrag([newVal, right]);
      } else {
        handleRangeChange(1, newVal);
        handleAfterDrag([left, newVal]);
      }
    } else {
      handleSingleChange(newVal);
      handleAfterDrag(newVal);
    }
  }

  function jsSnapToStep(position: number): number {
    const size = trackSizeSV.value;
    if (size <= 0) return min;
    const ratio = Math.min(Math.max(position / size, 0), 1);
    const raw = min + ratio * (max - min);
    const snapped = Math.round((raw - min) / step) * step + min;
    return Math.min(Math.max(snapped, min), max);
  }

  // --- Worklet helpers for gesture callbacks ---
  function snapPositionToValue(pos: number, size: number): number {
    'worklet';
    if (size <= 0) return min;
    const ratio = Math.min(Math.max(pos / size, 0), 1);
    const raw = min + ratio * (max - min);
    const snapped = Math.round((raw - min) / step) * step + min;
    return Math.min(Math.max(snapped, min), max);
  }

  function valToPos(val: number, size: number): number {
    'worklet';
    if (max === min) return 0;
    return ((val - min) / (max - min)) * size;
  }

  // --- Single mode thumb gesture ---
  const singlePanGesture = Gesture.Pan()
    .enabled(isInteractive())
    .onStart(() => {
      'worklet';
      thumb1StartPos.value = valToPos(thumb1ValueSV.value, trackSizeSV.value);
    })
    .onUpdate(e => {
      'worklet';
      const delta = vertical ? -e.translationY : e.translationX;
      const newPos = Math.min(Math.max(thumb1StartPos.value + delta, 0), trackSizeSV.value);
      const newVal = snapPositionToValue(newPos, trackSizeSV.value);
      scheduleOnRN(handleSingleChange, newVal);
    })
    .onEnd(() => {
      'worklet';
      const current = value;
      scheduleOnRN(handleAfterDrag, current);
    });

  // --- Range mode: left thumb gesture ---
  const leftPanGesture = Gesture.Pan()
    .enabled(isInteractive())
    .onStart(() => {
      'worklet';
      thumb1StartPos.value = valToPos(thumb1ValueSV.value, trackSizeSV.value);
    })
    .onUpdate(e => {
      'worklet';
      const delta = vertical ? -e.translationY : e.translationX;
      const newPos = Math.min(Math.max(thumb1StartPos.value + delta, 0), trackSizeSV.value);
      const newVal = snapPositionToValue(newPos, trackSizeSV.value);
      scheduleOnRN(handleRangeChange, 0, newVal);
    })
    .onEnd(() => {
      'worklet';
      const current = value;
      scheduleOnRN(handleAfterDrag, current);
    });

  // --- Range mode: right thumb gesture ---
  const rightPanGesture = Gesture.Pan()
    .enabled(isInteractive())
    .onStart(() => {
      'worklet';
      thumb2StartPos.value = valToPos(thumb2ValueSV.value, trackSizeSV.value);
    })
    .onUpdate(e => {
      'worklet';
      const delta = vertical ? -e.translationY : e.translationX;
      const newPos = Math.min(Math.max(thumb2StartPos.value + delta, 0), trackSizeSV.value);
      const newVal = snapPositionToValue(newPos, trackSizeSV.value);
      scheduleOnRN(handleRangeChange, 1, newVal);
    })
    .onEnd(() => {
      'worklet';
      const current = value;
      scheduleOnRN(handleAfterDrag, current);
    });

  // --- Render helpers ---
  function renderDefaultButton() {
    return (
      <View
        style={{
          backgroundColor: '#fff',
          borderColor: disabled ? inactiveColor : activeColor,
          borderRadius: buttonSize / 2,
          borderWidth: 2,
          height: buttonSize,
          width: buttonSize
        }}
      />
    );
  }

  function renderThumb(gesture: ReturnType<typeof Gesture.Pan>, ratio: number, customButton?: React.ReactNode) {
    // Use transform to offset the thumb center — no layout side effects
    const thumbStyle: ViewStyle = vertical
      ? {
          bottom: `${ratio * 100}%` as unknown as number,
          left: buttonSize / 2,
          position: 'absolute',
          transform: [{ translateX: -(buttonSize / 2) }, { translateY: buttonSize / 2 }]
        }
      : {
          left: `${ratio * 100}%` as unknown as number,
          position: 'absolute',
          top: buttonSize / 2,
          transform: [{ translateX: -(buttonSize / 2) }, { translateY: -(buttonSize / 2) }]
        };

    return (
      <GestureDetector gesture={gesture}>
        <Animated.View style={thumbStyle}>{customButton || button || renderDefaultButton()}</Animated.View>
      </GestureDetector>
    );
  }

  function renderActiveBar() {
    if (range) {
      const [leftVal, rightVal] = getRangeValues();
      const leftRatio = (leftVal - min) / (max - min);
      const rightRatio = (rightVal - min) / (max - min);

      const barStyle: ViewStyle = vertical
        ? {
            backgroundColor: activeColor,
            borderRadius: barHeight / 2,
            bottom: `${leftRatio * 100}%` as unknown as number,
            height: `${(rightRatio - leftRatio) * 100}%` as unknown as number,
            position: 'absolute',
            width: '100%' as unknown as number
          }
        : {
            backgroundColor: activeColor,
            borderRadius: barHeight / 2,
            height: '100%' as unknown as number,
            left: `${leftRatio * 100}%` as unknown as number,
            position: 'absolute',
            width: `${(rightRatio - leftRatio) * 100}%` as unknown as number
          };

      return <View style={[barStyle, disabled && { opacity: 0.5 }]} />;
    }

    const val = getSingleValue();
    const ratio = (val - min) / (max - min);

    const barStyle: ViewStyle = vertical
      ? {
          backgroundColor: activeColor,
          borderRadius: barHeight / 2,
          bottom: 0,
          height: `${ratio * 100}%` as unknown as number,
          position: 'absolute',
          width: '100%' as unknown as number
        }
      : {
          backgroundColor: activeColor,
          borderRadius: barHeight / 2,
          height: '100%' as unknown as number,
          left: 0,
          position: 'absolute',
          width: `${ratio * 100}%` as unknown as number
        };

    return <View style={[barStyle, disabled && { opacity: 0.5 }]} />;
  }

  // --- Layout ---
  const trackStyle: ViewStyle = vertical
    ? {
        backgroundColor: inactiveColor,
        borderRadius: barHeight / 2,
        height: '100%' as unknown as number,
        position: 'relative',
        width: barHeight
      }
    : {
        backgroundColor: inactiveColor,
        borderRadius: barHeight / 2,
        height: barHeight,
        position: 'relative',
        width: '100%' as unknown as number
      };

  const containerStyle: ViewStyle = vertical
    ? {
        alignItems: 'center',
        height: '100%' as unknown as number,
        justifyContent: 'center',
        paddingHorizontal: buttonSize / 2,
        position: 'relative'
      }
    : {
        justifyContent: 'center',
        paddingVertical: buttonSize / 2,
        position: 'relative',
        width: '100%' as unknown as number
      };

  // Compute ratios for thumb positions
  const singleRatio = range ? 0 : (getSingleValue() - min) / (max - min);
  const [rangeLeft, rangeRight] = range ? getRangeValues() : [0, 0];
  const leftRatio = (rangeLeft - min) / (max - min);
  const rightRatio = (rangeRight - min) / (max - min);

  return (
    <View
      className={className}
      style={[containerStyle, { position: 'relative', alignSelf: 'flex-start' }]}
    >
      <Pressable
        disabled={!isInteractive()}
        onLayout={handleTrackLayout}
        onPress={handleTrackPress}
        style={trackStyle}
      >
        {renderActiveBar()}
      </Pressable>

      {range ? (
        <>
          {renderThumb(leftPanGesture, leftRatio, leftButton)}
          {renderThumb(rightPanGesture, rightRatio, rightButton)}
        </>
      ) : (
        renderThumb(singlePanGesture, singleRatio)
      )}
    </View>
  );
};

export { Slider };

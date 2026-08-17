import { useEffect } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { SIZE_THUMB_MAP, SIZE_TRACK_MAP, switchVariants } from './switch-variants';
import type { SwitchProps } from './types';

const Switch = (props: SwitchProps) => {
  const {
    checked: checkedProp,
    children,
    color = 'primary',
    defaultChecked = false,
    disabled = false,
    loading = false,
    onCheckedChange,
    size = 'md'
  } = props;

  const [checked, setChecked] = useControllableState({
    caller: 'switch',
    defaultProp: defaultChecked,
    onChange: onCheckedChange,
    prop: checkedProp
  });

  const isDisabled = disabled || loading;

  const trackSize = SIZE_TRACK_MAP[size];
  const thumbSize = SIZE_THUMB_MAP[size];
  const padding = (trackSize.height - thumbSize) / 2;
  const translateXEnd = trackSize.width - thumbSize - padding * 2;

  const progress = useSharedValue(checked ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(checked ? 1 : 0);
  }, [checked, progress]);

  const overlayAnimStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    width: trackSize.width,
    left: 0,
    top: 0,
    height: trackSize.height,
    position: 'absolute'
  }));

  const thumbAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * translateXEnd }]
  }));

  function handlePress() {
    if (isDisabled) return;
    setChecked(!checked);
  }

  const {
    checkedOverlay: checkedOverlayCls,
    indicator: indicatorCls,
    thumb: thumbCls,
    uncheckedBg: uncheckedBgCls
  } = switchVariants({ color });

  return (
    <Pressable
      disabled={isDisabled}
      hitSlop={4}
      onPress={handlePress}
      style={{
        height: trackSize.height,
        width: trackSize.width,
        overflow: 'hidden',
        borderRadius: 999,
        opacity: isDisabled ? 0.5 : 1
      }}
    >
      <View className={uncheckedBgCls()} />
      <Animated.View style={overlayAnimStyle}>
        <View className={checkedOverlayCls()}></View>
      </Animated.View>
      <Animated.View style={[{ height: thumbSize, left: padding, top: padding, width: thumbSize }, thumbAnimStyle]}>
        <View className={thumbCls()}>
          {loading ? (
            <ActivityIndicator
              className={indicatorCls()}
              size={thumbSize * 0.6}
            />
          ) : null}
          {!loading && children ? children : null}
        </View>
      </Animated.View>
    </Pressable>
  );
};

export { Switch };

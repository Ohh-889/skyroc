import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cn, isNumber, isString } from '@skyroc/utils';
import { useEffect } from 'react';
import { ActivityIndicator, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Text } from '../text/Typography';
import { SIZE_THUMB_MAP, SIZE_TRACK_MAP, switchVariants } from './switch-variants';
import type { SwitchProps } from './types';

/** 滑块位移与选中色淡入共用的时长（ms） */
const DURATION = 200;

/** RN `size="small"` 时指示器的固有边长（px），用于按滑块尺寸缩放 */
const INDICATOR_BASE_SIZE = 20;

/** 指示器相对滑块的占比 */
const INDICATOR_RATIO = 0.6;

const Switch = (props: SwitchProps) => {
  const {
    checked: checkedProp,
    children,
    className,
    classNames,
    color = 'primary',
    defaultChecked = false,
    disabled = false,
    loading = false,
    onCheckedChange,
    ref,
    size = 'md',
    testID
  } = props;

  const [checked, setChecked] = useControllableState({
    caller: 'Switch',
    defaultProp: defaultChecked,
    onChange: onCheckedChange,
    prop: checkedProp
  });

  const progress = useSharedValue(checked ? 1 : 0);

  const isDisabled = disabled || loading;

  const trackSize = SIZE_TRACK_MAP[size];
  const thumbSize = SIZE_THUMB_MAP[size];
  const padding = (trackSize.height - thumbSize) / 2;
  const translateXEnd = trackSize.width - thumbSize - padding * 2;

  // 只有透明度和位移在动，尺寸/定位交给 className 与静态 style，避免每帧重算不变量
  const overlayAnimStyle = useAnimatedStyle(() => ({ opacity: progress.value }));
  const thumbAnimStyle = useAnimatedStyle(() => ({ transform: [{ translateX: progress.value * translateXEnd }] }));

  const variantSlots = switchVariants({ color, disabled: isDisabled });

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      checkedOverlay: cn(variantSlots.checkedOverlay(), classNames?.checkedOverlay),
      indicator: cn(variantSlots.indicator(), classNames?.indicator),
      root: cn(variantSlots.root(), classNames?.root, className),
      thumb: cn(variantSlots.thumb(), classNames?.thumb)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  const isTextChild = isString(children) || isNumber(children);

  function handlePress() {
    if (isDisabled) return;

    setChecked(!checked);
  }

  /**
   * 滑块内容：loading 优先，其次才是自定义 children。
   *
   * iOS 的 ActivityIndicator 忽略数字 size（只会撑大外框，指示器本身仍是固有尺寸），
   * 因此统一用 `small` 再按滑块尺寸做 scale，两端表现才一致。
   */
  function renderThumbContent() {
    if (loading) {
      return (
        <ActivityIndicator
          colorClassName={slotClassNames.indicator}
          size="small"
          style={{ transform: [{ scale: (thumbSize * INDICATOR_RATIO) / INDICATOR_BASE_SIZE }] }}
        />
      );
    }

    return isTextChild ? <Text>{children}</Text> : children;
  }

  useEffect(() => {
    progress.value = withTiming(checked ? 1 : 0, { duration: DURATION });
  }, [checked, progress]);

  return (
    <Pressable
      ref={ref}
      className={slotClassNames.root}
      disabled={isDisabled}
      hitSlop={4}
      onPress={handlePress}
      style={{ height: trackSize.height, width: trackSize.width }}
      testID={testID}
    >
      <Animated.View
        className={slotClassNames.checkedOverlay}
        style={overlayAnimStyle}
      />

      <Animated.View
        className={slotClassNames.thumb}
        style={[{ height: thumbSize, left: padding, top: padding, width: thumbSize }, thumbAnimStyle]}
      >
        {renderThumbContent()}
      </Animated.View>
    </Pressable>
  );
};

export { Switch };

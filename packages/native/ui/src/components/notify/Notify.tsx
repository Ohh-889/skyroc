import { useEffect, useRef } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '../text/Typography';
import { notifyVariants } from './notify-variants';
import type { NotifyProps } from './types';

const ENTER_DURATION = 200;

const Notify = (props: NotifyProps) => {
  const {
    duration = 3000,
    message,
    onClick,
    onClose,
    onUpdateShow,
    position = 'top',
    show = false,
    type = 'danger'
  } = props;

  const insets = useSafeAreaInsets();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(position === 'top' ? -20 : 20);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const variantSlots = notifyVariants({ type });

  /** 变体槽合并成最终类名，集中一处，避免 JSX 里散落类名计算 */
  function resolveSlotClassNames() {
    return {
      content: variantSlots.content(),
      message: variantSlots.message(),
      root: variantSlots.root()
    };
  }

  const slotClassNames = resolveSlotClassNames();

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }]
  }));

  useEffect(() => {
    if (show) {
      opacity.value = withTiming(1, { duration: ENTER_DURATION });
      translateY.value = withTiming(0, { duration: ENTER_DURATION });

      if (duration > 0) {
        timerRef.current = setTimeout(() => {
          handleClose();
        }, duration);
      }
    } else {
      opacity.value = withTiming(0, { duration: 150 });
      translateY.value = withTiming(position === 'top' ? -20 : 20, { duration: 150 });
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [show, duration, message, type]);

  function handleClose() {
    onUpdateShow?.(false);
    onClose?.();
  }

  function handlePress() {
    onClick?.();
  }

  if (!show) return null;

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        className={slotClassNames.root}
        onPress={handlePress}
      >
        {position === 'top' && <View style={{ height: insets.top }} />}
        <View className={slotClassNames.content}>
          <Text className={slotClassNames.message}>{message}</Text>
        </View>
        {position === 'bottom' && <View style={{ height: insets.bottom }} />}
      </Pressable>
    </Animated.View>
  );
};

export { Notify };

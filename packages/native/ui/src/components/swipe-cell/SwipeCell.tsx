import { useImperativeHandle, useRef, useState } from 'react';
import { type LayoutChangeEvent, Pressable, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { cn } from '@skyroc/utils';
import { swipeCellVariants } from './swipe-cell-variants';
import type { SwipeCellPosition, SwipeCellProps } from './types';

/** 弹簧动画配置 */
const SPRING_CONFIG = {
  damping: 20,
  mass: 0.5,
  stiffness: 200
};

/** 触发开启的滑动速度阈值 */
const VELOCITY_THRESHOLD = 500;

/** 触发开启的距离比例阈值 */
const OPEN_THRESHOLD = 0.3;

const SwipeCell = (props: SwipeCellProps) => {
  const {
    beforeClose,
    children,
    classNames,
    disabled = false,
    leading,
    leadingWidth: leadingWidthProp,
    name = '',
    onClose,
    onOpen,
    ref,
    trailing,
    trailingWidth: trailingWidthProp
  } = props;

  const slots = swipeCellVariants();

  const translateX = useSharedValue(0);
  const startX = useSharedValue(0);
  const leadingWidthSV = useSharedValue(leadingWidthProp ?? 0);
  const trailingWidthSV = useSharedValue(trailingWidthProp ?? 0);
  const openStateSV = useSharedValue<'left' | 'none' | 'right'>('none');

  const [isOpen, setIsOpen] = useState(false);

  const nameRef = useRef(name);
  nameRef.current = name;

  const onOpenRef = useRef(onOpen);
  onOpenRef.current = onOpen;

  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // 同步外部传入的宽度到 shared value
  if (leadingWidthProp !== undefined) {
    leadingWidthSV.value = leadingWidthProp;
  }
  if (trailingWidthProp !== undefined) {
    trailingWidthSV.value = trailingWidthProp;
  }

  function handleLeadingLayout(e: LayoutChangeEvent) {
    if (!leadingWidthProp) {
      leadingWidthSV.value = e.nativeEvent.layout.width;
    }
  }

  function handleTrailingLayout(e: LayoutChangeEvent) {
    if (!trailingWidthProp) {
      trailingWidthSV.value = e.nativeEvent.layout.width;
    }
  }

  function notifyOpen(side: 'left' | 'right') {
    setIsOpen(true);
    onOpenRef.current?.({ name: nameRef.current, position: side });
  }

  function notifyClose(position: SwipeCellPosition) {
    setIsOpen(false);
    onCloseRef.current?.({ name: nameRef.current, position });
  }

  async function handleContentPress() {
    if (beforeClose) {
      const result = await beforeClose({
        name: nameRef.current,
        position: 'cell'
      });
      if (!result) return;
    }
    translateX.value = withSpring(0, SPRING_CONFIG);
    openStateSV.value = 'none';
    notifyClose('cell');
  }

  function performOpen(side: 'left' | 'right') {
    const target = side === 'left' ? leadingWidthSV.value : -trailingWidthSV.value;
    translateX.value = withSpring(target, SPRING_CONFIG);
    openStateSV.value = side;
    setIsOpen(true);
    onOpenRef.current?.({ name: nameRef.current, position: side });
  }

  function performClose() {
    translateX.value = withSpring(0, SPRING_CONFIG);
    openStateSV.value = 'none';
    setIsOpen(false);
  }

  useImperativeHandle(ref, () => ({
    close: performClose,
    open: performOpen
  }));

  const panGesture = Gesture.Pan()
    .enabled(!disabled)
    .activeOffsetX([-10, 10])
    .onStart(() => {
      startX.value = translateX.value;
    })
    .onUpdate(e => {
      let newX = startX.value + e.translationX;
      newX = Math.max(newX, -trailingWidthSV.value);
      newX = Math.min(newX, leadingWidthSV.value);
      translateX.value = newX;
    })
    .onEnd(e => {
      const currentX = translateX.value;
      const wasOpen = openStateSV.value;

      if (currentX > 0 && leadingWidthSV.value > 0) {
        const shouldOpen = currentX > leadingWidthSV.value * OPEN_THRESHOLD || e.velocityX > VELOCITY_THRESHOLD;

        if (shouldOpen) {
          translateX.value = withSpring(leadingWidthSV.value, SPRING_CONFIG);
          if (wasOpen !== 'left') {
            if (wasOpen !== 'none') {
              scheduleOnRN(notifyClose, 'cell');
            }
            openStateSV.value = 'left';
            scheduleOnRN(notifyOpen, 'left');
          }
        } else {
          translateX.value = withSpring(0, SPRING_CONFIG);
          if (wasOpen !== 'none') {
            openStateSV.value = 'none';
            scheduleOnRN(notifyClose, 'cell');
          }
        }
      } else if (currentX < 0 && trailingWidthSV.value > 0) {
        const shouldOpen =
          Math.abs(currentX) > trailingWidthSV.value * OPEN_THRESHOLD || e.velocityX < -VELOCITY_THRESHOLD;

        if (shouldOpen) {
          translateX.value = withSpring(-trailingWidthSV.value, SPRING_CONFIG);
          if (wasOpen !== 'right') {
            if (wasOpen !== 'none') {
              scheduleOnRN(notifyClose, 'cell');
            }
            openStateSV.value = 'right';
            scheduleOnRN(notifyOpen, 'right');
          }
        } else {
          translateX.value = withSpring(0, SPRING_CONFIG);
          if (wasOpen !== 'none') {
            openStateSV.value = 'none';
            scheduleOnRN(notifyClose, 'cell');
          }
        }
      } else {
        translateX.value = withSpring(0, SPRING_CONFIG);
        if (wasOpen !== 'none') {
          openStateSV.value = 'none';
          scheduleOnRN(notifyClose, 'cell');
        }
      }
    });

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }]
  }));

  return (
    <View className={cn(slots.root(), classNames?.root)}>
      {leading ? (
        <View
          className={cn(slots.leading(), classNames?.leading)}
          onLayout={handleLeadingLayout}
        >
          {leading}
        </View>
      ) : null}

      {trailing ? (
        <View
          className={cn(slots.trailing(), classNames?.trailing)}
          onLayout={handleTrailingLayout}
        >
          {trailing}
        </View>
      ) : null}

      <GestureDetector gesture={panGesture}>
        <Animated.View style={contentAnimatedStyle}>
          <View className={cn(slots.content(), classNames?.content)}>{children}</View>
          {isOpen ? (
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={handleContentPress}
            />
          ) : null}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export { SwipeCell };

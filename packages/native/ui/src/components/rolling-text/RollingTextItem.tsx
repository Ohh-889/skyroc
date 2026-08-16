import { useEffect, useRef } from 'react';
import { View } from 'react-native';
import Animated, {
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming
} from 'react-native-reanimated';
import { Text } from '../text/Typography';
import type { RollingTextItemProps } from './types';

/** 单列滚动项 */
const RollingTextItem = (props: RollingTextItemProps) => {
  const { chars, delay, direction, duration, height, onFinish, runId, textClassName } = props;

  /** 整列除首项外的可滚动距离 */
  const totalHeight = (chars.length - 1) * height;

  /**
   * Down 时序列倒序渲染，配合 -totalHeight → 0 的位移，字符自上而下推入。
   *
   * 不用 toReversed 是因为 Hermes 和旧版 JSC 都还没实现 ES2023 的 change-array-by-copy； 展开已经产出副本，就地 reverse 不会动到入参。
   */
  const displayArr = direction === 'down' ? [...chars].reverse() : chars;

  const fromValue = direction === 'down' ? -totalHeight : 0;
  const toValue = direction === 'down' ? 0 : -totalHeight;

  const translateY = useSharedValue(fromValue);

  /** 保持回调引用最新：把 onFinish 直接放进动画依赖的话，父级每渲染一次动画就重播一次 */
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  /**
   * 序列内容的稳定标识。
   *
   * 父组件每次渲染都会新建 chars，数组本身进依赖会让动画在无关重渲染时误重播； 而只依赖 totalHeight 又会漏掉「位数不变但目标值变了」的情况（12 → 34）， 因此用内容摘要作为依赖。
   */
  const sequenceKey = chars.join('');

  /** 没拿到回调的列不必跨线程通知，省掉一次 runOnJS */
  const shouldNotify = Boolean(onFinish);

  const animStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));

  function notifyFinish() {
    onFinishRef.current?.();
  }

  useEffect(() => {
    // 先掐断上一轮动画，避免与新一轮抢同一个 shared value
    cancelAnimation(translateY);
    translateY.value = fromValue;

    if (runId > 0) {
      translateY.value = withDelay(
        delay,
        withTiming(toValue, { duration }, finished => {
          'worklet';

          // 被下一轮打断时 finished 为 false，只有真正落定才回调
          if (finished && shouldNotify) {
            runOnJS(notifyFinish)();
          }
        })
      );
    }

    return () => cancelAnimation(translateY);
  }, [translateY, runId, sequenceKey, fromValue, toValue, delay, duration, shouldNotify]);

  return (
    <View style={{ height, overflow: 'hidden' }}>
      <Animated.View style={animStyle}>
        {displayArr.map((char, index) => (
          <View
            key={index}
            style={{ alignItems: 'center', height, justifyContent: 'center' }}
          >
            {/* 行高跟随 height，字号与行高才不用调用方自己对齐；等宽数字避免滚动时列宽跳动 */}
            <Text
              className={textClassName}
              style={{ fontVariant: ['tabular-nums'], lineHeight: height }}
            >
              {char}
            </Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
};

export { RollingTextItem };

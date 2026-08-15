import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { cn } from '@skyroc/utils';
import { Text } from '../text/Typography';
import type { RollingTextItemProps } from './types';

/** 单列滚动项 */
const RollingTextItem = (props: RollingTextItemProps) => {
  const { delay, direction, duration, figureArr, height, runId, textClassName } = props;

  /** 整列除首项外的可滚动距离 */
  const totalHeight = (figureArr.length - 1) * height;

  /**
   * down 时序列倒序渲染，配合 -totalHeight → 0 的位移，字符自上而下推入。
   *
   * 不用 toReversed 是因为 Hermes 和旧版 JSC 都还没实现 ES2023 的 change-array-by-copy；
   * 展开已经产出副本，就地 reverse 不会动到入参。
   */
  const displayArr = direction === 'down' ? [...figureArr].reverse() : figureArr;

  const fromValue = direction === 'down' ? -totalHeight : 0;
  const toValue = direction === 'down' ? 0 : -totalHeight;

  const translateY = useSharedValue(fromValue);

  /**
   * 序列内容的稳定标识。
   *
   * 父组件每次渲染都会新建 figureArr，数组本身进依赖会让动画在无关重渲染时误重播；
   * 而只依赖 totalHeight 又会漏掉「位数不变但目标值变了」的情况（12 → 34），
   * 因此用内容摘要作为依赖。
   */
  const sequenceKey = figureArr.join('');

  const animStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));

  useEffect(() => {
    // 先掐断上一轮动画，避免与新一轮抢同一个 shared value
    cancelAnimation(translateY);
    translateY.value = fromValue;

    if (runId > 0) {
      translateY.value = withDelay(delay, withTiming(toValue, { duration }));
    }

    return () => cancelAnimation(translateY);
  }, [translateY, runId, sequenceKey, fromValue, toValue, delay, duration]);

  return (
    <View style={{ height, overflow: 'hidden' }}>
      <Animated.View style={animStyle}>
        {displayArr.map((figure, index) => (
          <View
            key={`${figure}-${index}`}
            style={{ alignItems: 'center', height, justifyContent: 'center' }}
          >
            <Text className={cn('text-lg font-medium text-foreground', textClassName)}>{figure}</Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
};

export { RollingTextItem };

import { useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { cn } from '@skyroc/utils';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Cell } from '../cell';
import { CollapseContext } from './CollapseContext';
import { collapseItemVariants } from './collapse-variants';
import type { CollapseItemProps } from './types';

/** 动画时长 */
const DURATION = 300;

/** 全局索引计数器 */
let globalIndex = 0;

/**
 * 内容绝对定位，脱离文档流独立测量，因此外层高度始终由 animatedHeight 驱动。
 * useAnimatedStyle 必须每次返回相同的属性集合，否则被移除的属性会在原生侧残留。
 */
const styles = StyleSheet.create({
  measure: { left: 0, position: 'absolute', right: 0, top: 0 },
  wrapper: { overflow: 'hidden' }
});

const CollapseItem = (props: CollapseItemProps) => {
  const {
    children,
    className,
    disabled = false,
    icon,
    isLink = true,
    label,
    lazyRender = true,
    name,
    readonly = false,
    ref,
    size = 'md',
    title,
    value
  } = props;

  const context = useContext(CollapseContext);

  // 使用 name 或稳定的自增索引
  const indexRef = useRef<number | undefined>(undefined);
  if (indexRef.current === undefined) {
    indexRef.current = globalIndex;
    globalIndex += 1;
  }
  const itemName = name ?? indexRef.current;
  const expanded = context?.isExpanded(itemName) ?? false;

  // 是否曾经展开过（用于懒渲染）
  const [hasExpanded, setHasExpanded] = useState(expanded);

  // 动画共享值
  const contentHeight = useSharedValue(0);
  const animatedHeight = useSharedValue(0);
  const arrowRotation = useSharedValue(expanded ? 1 : 0);
  /** 是否已完成首次内容高度测量 */
  const measuredRef = useRef(false);
  /** 挂载时是否为展开态（defaultValue），用于跳过入场动画 */
  const mountedExpandedRef = useRef(expanded);

  useImperativeHandle(ref, () => ({
    toggle: (val?: boolean) => {
      const newExpanded = val ?? !expanded;
      context?.toggle(itemName, newExpanded);
    }
  }));

  useEffect(() => {
    if (expanded) {
      setHasExpanded(true);
    }
  }, [expanded]);

  // 注册到父组件（用于 toggleAll）
  useEffect(() => {
    if (!context) return undefined;
    const unregister = context.register({
      disabled,
      expanded,
      name: itemName
    });
    return unregister;
  }, [context, disabled, expanded, itemName]);

  // 展开/收起动画
  useEffect(() => {
    arrowRotation.value = withTiming(expanded ? 1 : 0, { duration: DURATION });

    // 内容尚未测量（懒渲染首次展开），等 onLayout 回调驱动高度
    if (expanded && !measuredRef.current) return;

    animatedHeight.value = withTiming(expanded ? contentHeight.value : 0, { duration: DURATION });
  }, [expanded]);

  const wrapperStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value
  }));

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${arrowRotation.value * 90}deg` }]
  }));

  if (!context) {
    return null;
  }

  function handlePress() {
    if (disabled || readonly) return;
    context!.toggle(itemName, !expanded);
  }

  function handleContentLayout(e: LayoutChangeEvent) {
    const { height } = e.nativeEvent.layout;
    if (height <= 0) return;

    contentHeight.value = height;

    const isFirstMeasure = !measuredRef.current;
    measuredRef.current = true;

    if (!expanded) return;

    // 挂载即展开（defaultValue）时直接落位，避免入场动画
    if (isFirstMeasure && mountedExpandedRef.current) {
      animatedHeight.value = height;
      return;
    }

    // 首次展开 或 展开态内容高度变化
    animatedHeight.value = withTiming(height, { duration: DURATION });
  }

  const shouldRender = lazyRender ? hasExpanded : true;
  const showArrow = isLink && !readonly;
  const slots = collapseItemVariants({ disabled, size });

  function renderArrow() {
    if (!showArrow) return undefined;
    return (
      <Animated.View style={arrowStyle}>
        <AntDesign
          color="#6b7280"
          name="down"
          size={12}
        />
      </Animated.View>
    );
  }

  return (
    <View className={cn(slots.root(), className)}>
      <Cell
        arrow={renderArrow()}
        center
        disabled={disabled}
        leading={icon}
        showArrow={showArrow}
        size={size}
        subtitle={label}
        title={title}
        trailing={value}
        onPress={handlePress}
      />

      <Animated.View
        className={slots.wrapper()}
        style={[styles.wrapper, wrapperStyle]}
      >
        {shouldRender ? (
          <View
            style={styles.measure}
            onLayout={handleContentLayout}
          >
            <View className={slots.content()}>{children}</View>
          </View>
        ) : null}
      </Animated.View>
    </View>
  );
};

export { CollapseItem };

import AntDesign from '@expo/vector-icons/AntDesign';
import { cn, isString } from '@skyroc/utils';
import { useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { withUniwind } from 'uniwind';
import { ARROW_SIZE_MAP, Cell } from '../cell';
import { Text } from '../text/Typography';
import { collapseItemVariants } from './collapse-variants';
import { CollapseIndexContext } from './CollapseContext';
import type { CollapseItemProps } from './types';
import { useCollapseContext } from './use-collapse-context';

/** 动画时长 */
const DURATION = 300;

/** AntDesign 不认 className，用 withUniwind 把 `accent-*` 工具类映射到 color 上，让箭头颜色跟随主题 token */
const ArrowIcon = withUniwind(AntDesign);

const CollapseItem = (props: CollapseItemProps) => {
  const {
    children,
    className,
    classNames,
    disabled = false,
    headerClassNames,
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

  const context = useCollapseContext();
  const index = useContext(CollapseIndexContext);

  const itemName = name ?? index;
  const expanded = context.isExpanded(itemName);

  /** 是否曾经展开过，收起后仍保留内容，避免每次展开都重新挂载 */
  const [hasExpanded, setHasExpanded] = useState(expanded);

  const contentHeight = useSharedValue(0);
  const animatedHeight = useSharedValue(0);
  const arrowRotation = useSharedValue(expanded ? 1 : 0);

  /** 是否已完成首次内容高度测量 */
  const measuredRef = useRef(false);
  /** 挂载时是否为展开态（defaultValue），用于跳过入场动画 */
  const mountedExpandedRef = useRef(expanded);

  useImperativeHandle(ref, () => ({
    toggle: (val?: boolean) => {
      context.toggle(itemName, val ?? !expanded);
    }
  }));

  // useAnimatedStyle 必须每次返回相同的属性集合，否则被移除的属性会在原生侧残留
  const wrapperStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value
  }));

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${arrowRotation.value * 90}deg` }]
  }));

  const shouldRender = !lazyRender || expanded || hasExpanded;
  const showArrow = isLink && !readonly;

  const variantSlots = collapseItemVariants({ border: index > 0, disabled, size });

  function handlePress() {
    if (disabled || readonly) return;
    context.toggle(itemName, !expanded);
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

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      arrowIcon: cn(variantSlots.arrowIcon(), classNames?.arrow),
      content: cn(variantSlots.content(), classNames?.content),
      contentText: cn(variantSlots.contentText(), classNames?.contentText),
      measure: variantSlots.measure(),
      root: cn(variantSlots.root(), classNames?.root, className),
      wrapper: cn(variantSlots.wrapper(), classNames?.wrapper)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  function renderArrow() {
    if (!showArrow) return undefined;
    return (
      <Animated.View style={arrowStyle}>
        <ArrowIcon
          colorClassName={slotClassNames.arrowIcon}
          name="down"
          size={ARROW_SIZE_MAP[size]}
        />
      </Animated.View>
    );
  }

  useEffect(() => {
    if (expanded) {
      setHasExpanded(true);
    }
  }, [expanded]);

  // 注册到父组件（用于 toggleAll）
  useEffect(() => {
    return context.register({ disabled, name: itemName });
  }, [context, disabled, itemName]);

  // 展开/收起动画
  useEffect(() => {
    arrowRotation.value = withTiming(expanded ? 1 : 0, { duration: DURATION });

    // 内容尚未测量（懒渲染首次展开），等 onLayout 回调驱动高度
    if (expanded && !measuredRef.current) return;

    animatedHeight.value = withTiming(expanded ? contentHeight.value : 0, { duration: DURATION });
  }, [animatedHeight, arrowRotation, contentHeight, expanded]);

  return (
    <View className={slotClassNames.root}>
      <Cell
        arrow={renderArrow()}
        center
        classNames={headerClassNames}
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
        className={slotClassNames.wrapper}
        style={wrapperStyle}
      >
        {shouldRender ? (
          <View
            className={slotClassNames.measure}
            onLayout={handleContentLayout}
          >
            <View className={slotClassNames.content}>
              {isString(children) ? <Text className={slotClassNames.contentText}>{children}</Text> : children}
            </View>
          </View>
        ) : null}
      </Animated.View>
    </View>
  );
};

export { CollapseItem };

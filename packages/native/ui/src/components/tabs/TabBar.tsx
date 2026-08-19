import { cn, isString } from '@skyroc/utils';
import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import type { LayoutRectangle, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { Text } from '../text/Typography';
import { tabsVariants } from './tabs-variants';
import type { TabBarProps } from './types';

/**
 * 指示器对齐所需的全部可变量。
 *
 * 这些数据只驱动动画与滚动、不参与渲染，因此整体挂在一个稳定的 ref 上：tab 布局变化不会引起 tabBar 重渲染， alignToTab 也得以提到组件外层，effect 的依赖数组才能只写 activeIndex
 * 且保持诚实。
 */
interface TabIndicatorContext {
  /** 是否已完成首帧落位；首帧直接落位不做动画 */
  hasPositioned: boolean;

  /** 指示器宽度 */
  indicatorWidth: SharedValue<number>;

  /** 指示器横向位移 */
  indicatorX: SharedValue<number>;

  /** TabBar 滚动容器 */
  scrollViewRef: RefObject<ScrollView | null>;

  /** 各 tab 已测量的布局 */
  tabLayouts: Map<number, LayoutRectangle>;

  /** 滚动容器可视宽度 */
  viewportWidth: number;
}

/** 把指示器与滚动位置对齐到指定 tab；布局尚未测量出来时静默跳过 */
function alignToTab(context: TabIndicatorContext, index: number) {
  const layout = context.tabLayouts.get(index);
  if (!layout) return;

  const animated = context.hasPositioned;

  context.indicatorX.value = animated ? withTiming(layout.x) : layout.x;
  context.indicatorWidth.value = animated ? withTiming(layout.width) : layout.width;

  // 视口宽度还没测出来就先不滚动，等 ScrollView 的 onLayout 回来会再补一次
  if (context.viewportWidth <= 0) return;

  context.hasPositioned = true;

  context.scrollViewRef.current?.scrollTo({
    animated,
    x: Math.max(0, layout.x - (context.viewportWidth - layout.width) / 2)
  });
}

const TabBar = (props: TabBarProps) => {
  const { activeIndex, classNames, items, onTabPress, type } = props;

  const scrollViewRef = useRef<ScrollView>(null);
  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);

  const contextRef = useRef<TabIndicatorContext>({
    hasPositioned: false,
    indicatorWidth,
    indicatorX,
    scrollViewRef,
    tabLayouts: new Map(),
    viewportWidth: 0
  });

  const variantSlots = tabsVariants({ type });

  const indicatorAnimStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateX: indicatorX.value }],
      width: indicatorWidth.value
    }),
    [indicatorWidth, indicatorX]
  );

  /** 指示器定位：line 型贴底作描边，pill 型撑满高度作选中背景 */
  const indicatorLayoutStyle: ViewStyle =
    type === 'pill' ? { bottom: 0, position: 'absolute', top: 0 } : { bottom: 0, position: 'absolute' };

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      indicator: cn(variantSlots.indicator(), classNames?.indicator),
      scrollContent: 'grow',
      tabBar: cn(variantSlots.tabBar(), classNames?.tabBar),
      tabBarContent: cn(variantSlots.tabBarContent(), classNames?.tabBarContent)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  /** 单个 tab 的类名随激活态与禁用态变化，只能逐项解析 */
  function resolveTabClassNames(active: boolean, disabled: boolean) {
    const tabSlots = tabsVariants({ active, disabled, type });

    return {
      tab: cn(tabSlots.tab(), classNames?.tab),
      tabText: cn(tabSlots.tabText(), classNames?.tabText)
    };
  }

  function handleTabLayout(index: number, layout: LayoutRectangle) {
    contextRef.current.tabLayouts.set(index, layout);

    if (index === activeIndex) alignToTab(contextRef.current, activeIndex);
  }

  function handleViewportLayout(width: number) {
    if (contextRef.current.viewportWidth === width) return;

    contextRef.current.viewportWidth = width;

    alignToTab(contextRef.current, activeIndex);
  }

  useEffect(() => {
    alignToTab(contextRef.current, activeIndex);
  }, [activeIndex]);

  return (
    <View className={slotClassNames.tabBar}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        contentContainerClassName={slotClassNames.scrollContent}
        showsHorizontalScrollIndicator={false}
        onLayout={e => handleViewportLayout(e.nativeEvent.layout.width)}
      >
        {/* 指示器先于 tab 渲染，靠绘制顺序压在文字下层；负 zIndex 在 Android 上不可靠 */}
        <Animated.View style={[indicatorLayoutStyle, indicatorAnimStyle]}>
          <View className={slotClassNames.indicator} />
        </Animated.View>

        <View className={slotClassNames.tabBarContent}>
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            const tabClassNames = resolveTabClassNames(isActive, Boolean(item.disabled));

            return (
              <Pressable
                key={item.key}
                className={tabClassNames.tab}
                disabled={item.disabled}
                onLayout={e => handleTabLayout(index, e.nativeEvent.layout)}
                onPress={() => onTabPress(index)}
              >
                {isString(item.title) ? <Text className={tabClassNames.tabText}>{item.title}</Text> : item.title}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export { TabBar };

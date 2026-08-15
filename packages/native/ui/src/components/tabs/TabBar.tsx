import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { cn, isString } from '@skyroc/utils';
import type { LayoutRectangle } from 'react-native';
import { Text } from '../text/Typography';
import { tabsVariants } from './tabs-variants';
import type { TabBarProps } from './types';

const TabBar = (props: TabBarProps) => {
  const { activeIndex, classNames, items, onTabPress, type } = props;

  const scrollViewRef = useRef<ScrollView>(null);
  const [tabLayouts, setTabLayouts] = useState<Map<number, LayoutRectangle>>(new Map());

  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);

  const slots = tabsVariants({ type });

  useEffect(() => {
    const layout = tabLayouts.get(activeIndex);
    if (!layout) return;

    indicatorX.value = withTiming(layout.x);
    indicatorWidth.value = withTiming(layout.width);

    scrollViewRef.current?.scrollTo({
      x: Math.max(0, layout.x - 100),
      animated: true
    });
  }, [activeIndex, tabLayouts, indicatorX, indicatorWidth]);

  const indicatorAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
    width: indicatorWidth.value,
    position: 'absolute',
    bottom: 0
  }));

  function handleTabLayout(index: number, layout: LayoutRectangle) {
    setTabLayouts(prev => {
      const next = new Map(prev);
      next.set(index, layout);
      return next;
    });
  }

  return (
    <View className={cn(slots.tabBar(), classNames?.tabBar)}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        contentContainerClassName="flex-1"
        showsHorizontalScrollIndicator={false}
      >
        <View className={cn(slots.tabBarContent(), classNames?.tabBarContent)}>
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            const tabSlots = tabsVariants({ active: isActive, disabled: Boolean(item.disabled), type });

            return (
              <Pressable
                key={item.key}
                className={cn(tabSlots.tab(), classNames?.tab)}
                disabled={item.disabled}
                onLayout={e => handleTabLayout(index, e.nativeEvent.layout)}
                onPress={() => onTabPress(index)}
              >
                {isString(item.title) ? (
                  <Text className={cn(tabSlots.tabText(), classNames?.tabText)}>{item.title}</Text>
                ) : (
                  item.title
                )}
              </Pressable>
            );
          })}
        </View>

        <Animated.View style={[indicatorAnimStyle, type === 'pill' ? { zIndex: -1, top: 0 } : undefined]}>
          <View className={cn(slots.indicator(), classNames?.indicator)} />
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export { TabBar };

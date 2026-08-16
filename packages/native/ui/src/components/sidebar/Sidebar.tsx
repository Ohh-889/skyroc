import { useEffect, useRef } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cn, isString } from '@skyroc/utils';
import { Badge } from '../badge/Badge';
import { Text } from '../text/Typography';
import { sidebarVariants } from './sidebar-variants';
import type { SidebarItem, SidebarProps } from './types';

/** 渲染单个侧边栏项 */
function renderItem(
  item: SidebarItem,
  index: number,
  props: {
    activeIndex: number;
    classNames: SidebarProps['classNames'];
    onPress: (index: number) => void;
  }
) {
  const { activeIndex, classNames, onPress } = props;
  const isActive = index === activeIndex;
  const slots = sidebarVariants({ active: isActive, disabled: Boolean(item.disabled) });

  return (
    <Pressable
      key={item.key}
      className={cn(slots.item(), classNames?.item)}
      disabled={item.disabled}
      onPress={() => onPress(index)}
    >
      <Badge
        content={item.badge}
        dot={item.dot}
      >
        {isString(item.title) ? (
          <Text className={cn(slots.itemText(), classNames?.itemText)}>{item.title}</Text>
        ) : (
          item.title
        )}
      </Badge>
    </Pressable>
  );
}

const Sidebar = (props: SidebarProps) => {
  const { activeIndex: activeIndexProp, className, classNames, defaultActiveIndex = 0, items, onIndexChange } = props;

  const [activeIndex, setActiveIndex] = useControllableState({
    caller: 'sidebar',
    defaultProp: defaultActiveIndex,
    onChange: onIndexChange,
    prop: activeIndexProp
  });

  const itemHeight = useRef(0);
  const indicatorY = useSharedValue(0);

  const slots = sidebarVariants();

  useEffect(() => {
    if (itemHeight.current > 0) {
      const centerY = activeIndex * itemHeight.current + itemHeight.current / 2 - 8;
      indicatorY.value = withTiming(centerY);
    }
  }, [activeIndex, indicatorY]);

  const indicatorAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: indicatorY.value }],
    position: 'absolute',
    zIndex: 100,
    left: 0
  }));

  function handleFirstLayout(height: number) {
    if (itemHeight.current > 0) return;
    itemHeight.current = height;

    const centerY = activeIndex * height + height / 2 - 8;
    indicatorY.value = centerY;
  }

  const ctx = { activeIndex, classNames, onPress: setActiveIndex };

  return (
    <View className={cn(slots.root(), className)}>
      <Animated.View style={indicatorAnimStyle}>
        <View className={cn(slots.indicator(), classNames?.indicator)} />
      </Animated.View>

      {items.map((item, index) => (
        <View
          key={item.key}
          onLayout={index === 0 ? e => handleFirstLayout(e.nativeEvent.layout.height) : undefined}
        >
          {renderItem(item, index, ctx)}
        </View>
      ))}
    </View>
  );
};

export { Sidebar };

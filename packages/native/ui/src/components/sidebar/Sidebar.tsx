import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cn, isString } from '@skyroc/utils';
import { useEffect, useRef } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import type { LayoutRectangle, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { Badge } from '../badge/Badge';
import { Text } from '../text/Typography';
import { sidebarVariants } from './sidebar-variants';
import type { SidebarItem, SidebarProps } from './types';

/** 指示器绝对定位在内容容器左侧，纵向位移交给动画样式 */
const indicatorLayoutStyle: ViewStyle = { left: 0, position: 'absolute' };

/**
 * 指示器对齐所需的全部可变量。
 *
 * 这些数据只驱动动画、不参与渲染，因此整体挂在一个稳定的 ref 上：布局变化不会引起 Sidebar 重渲染，alignToItem 也得以提到组件外层，effect
 * 的依赖数组才能只写 activeIndex 且保持诚实。
 */
interface SidebarIndicatorContext {
  /** 是否已完成首帧落位；首帧直接落位不做动画 */
  hasPositioned: boolean;

  /** 指示器自身高度，由指示器的 onLayout 实测，不与样式里的高度硬编码耦合 */
  indicatorHeight: number;

  /** 指示器纵向位移 */
  indicatorY: SharedValue<number>;

  /** 各项已测量的布局 */
  itemLayouts: Map<number, LayoutRectangle>;
}

/** 把指示器对齐到指定项的垂直中心；布局或指示器高度尚未测出来时静默跳过，后续 onLayout 回来会再补一次 */
function alignToItem(context: SidebarIndicatorContext, index: number) {
  const layout = context.itemLayouts.get(index);

  if (!layout || context.indicatorHeight <= 0) return;

  const centerY = layout.y + (layout.height - context.indicatorHeight) / 2;

  context.indicatorY.value = context.hasPositioned ? withTiming(centerY) : centerY;

  context.hasPositioned = true;
}

/** 侧边栏单项属性 */
interface SidebarItemViewProps {
  /** 是否为当前激活项 */
  active: boolean;

  /** 各插槽自定义 className */
  classNames: SidebarProps['classNames'];

  /** 单项配置 */
  item: SidebarItem;

  /** 布局测量回调，坐标相对于内容容器 */
  onLayout: (layout: LayoutRectangle) => void;

  /** 点击回调 */
  onPress: () => void;
}

const SidebarItemView = (props: SidebarItemViewProps) => {
  const { active, classNames, item, onLayout, onPress } = props;

  const disabled = Boolean(item.disabled);

  const variantSlots = sidebarVariants({ active, disabled });

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      item: cn(variantSlots.item(), classNames?.item),
      itemText: cn(variantSlots.itemText(), classNames?.itemText)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  return (
    <Pressable
      accessibilityLabel={isString(item.title) ? item.title : undefined}
      accessibilityRole="tab"
      accessibilityState={{ disabled, selected: active }}
      className={slotClassNames.item}
      disabled={disabled}
      onLayout={e => onLayout(e.nativeEvent.layout)}
      onPress={onPress}
    >
      <Badge
        content={item.badge}
        dot={item.dot}
      >
        {isString(item.title) ? <Text className={slotClassNames.itemText}>{item.title}</Text> : item.title}
      </Badge>
    </Pressable>
  );
};

const Sidebar = (props: SidebarProps) => {
  const {
    activeIndex: activeIndexProp,
    className,
    classNames,
    defaultActiveIndex = 0,
    items,
    onIndexChange,
    scrollable = true,
    ...restProps
  } = props;

  const [activeIndex, setActiveIndex] = useControllableState({
    caller: 'sidebar',
    defaultProp: defaultActiveIndex,
    onChange: index => onIndexChange?.(index, items[index]),
    prop: activeIndexProp
  });

  const indicatorY = useSharedValue(0);

  const contextRef = useRef<SidebarIndicatorContext>({
    hasPositioned: false,
    indicatorHeight: 0,
    indicatorY,
    itemLayouts: new Map()
  });

  const variantSlots = sidebarVariants();

  const indicatorAnimStyle = useAnimatedStyle(() => ({ transform: [{ translateY: indicatorY.value }] }));

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      content: cn(variantSlots.content(), classNames?.content),
      indicator: cn(variantSlots.indicator(), classNames?.indicator),
      root: cn(variantSlots.root(), classNames?.root, className)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  /** 每项各自上报布局，项高不必相等；旋转、字号缩放引起的重排也会再次触发，指示器随之重新落位 */
  function handleItemLayout(index: number, layout: LayoutRectangle) {
    contextRef.current.itemLayouts.set(index, layout);

    if (index === activeIndex) alignToItem(contextRef.current, activeIndex);
  }

  function handleIndicatorLayout(height: number) {
    if (contextRef.current.indicatorHeight === height) return;

    contextRef.current.indicatorHeight = height;

    alignToItem(contextRef.current, activeIndex);
  }

  useEffect(() => {
    const context = contextRef.current;

    // items 变短后残留的旧布局必须清掉，否则指示器可能落在已经不存在的项上
    for (const index of context.itemLayouts.keys()) {
      if (index >= items.length) context.itemLayouts.delete(index);
    }

    alignToItem(context, activeIndex);
  }, [activeIndex, items.length]);

  const content = (
    <>
      {items.map((item, index) => (
        <SidebarItemView
          key={item.key}
          active={index === activeIndex}
          classNames={classNames}
          item={item}
          onLayout={layout => handleItemLayout(index, layout)}
          onPress={() => setActiveIndex(index)}
        />
      ))}

      {/* 指示器后于各项渲染，靠绘制顺序压在激活项之上；zIndex 在 Android 上不总可靠 */}
      <Animated.View style={[indicatorLayoutStyle, indicatorAnimStyle]}>
        <View
          className={slotClassNames.indicator}
          onLayout={e => handleIndicatorLayout(e.nativeEvent.layout.height)}
        />
      </Animated.View>
    </>
  );

  // 两种模式保持相同的节点层级：root 一层、content 一层，
  // 这样 className 与 classNames.content 落在哪个节点上不随 scrollable 变化
  if (!scrollable) {
    return (
      <View
        accessibilityRole="tablist"
        className={slotClassNames.root}
        {...restProps}
      >
        <View className={slotClassNames.content}>{content}</View>
      </View>
    );
  }

  return (
    <ScrollView
      accessibilityRole="tablist"
      className={slotClassNames.root}
      contentContainerClassName={slotClassNames.content}
      showsVerticalScrollIndicator={false}
      {...restProps}
    >
      {content}
    </ScrollView>
  );
};

export { Sidebar };

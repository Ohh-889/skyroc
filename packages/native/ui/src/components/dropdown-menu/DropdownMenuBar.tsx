import FontAwesome from '@expo/vector-icons/FontAwesome';
import { cn } from '@skyroc/utils';
import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { withUniwind } from 'uniwind';
import { Text } from '../text/Typography';
import { dropdownMenuVariants } from './dropdown-menu-variants';
import type { DropdownMenuBarProps, DropdownMenuDirection } from './types';

/** FontAwesome 不认 className，用 withUniwind 把 `accent-*` 工具类映射到 color 上，让箭头色跟随主题 token */
const ArrowIcon = withUniwind(FontAwesome);

/** 箭头边长（px） */
const ARROW_SIZE = 14;

/** 带旋转动画的箭头图标属性 */
interface AnimatedArrowProps {
  /** 是否展开态 */
  active: boolean;

  /** 已解析的 arrow slot 类名，只接受 `accent-*` 颜色类 */
  colorClassName: string;

  /** 展开方向 */
  direction: DropdownMenuDirection;

  /** 动画时长（毫秒） */
  duration: number;
}

/** 展开时旋转半圈的箭头 */
const AnimatedArrow = (props: AnimatedArrowProps) => {
  const { active, colorClassName, direction, duration } = props;

  const rotation = useSharedValue(active ? 180 : 0);

  const arrowStyle = useAnimatedStyle(
    () => ({
      transform: [{ rotate: `${rotation.value}deg` }]
    }),
    [rotation]
  );

  useEffect(() => {
    rotation.value = withTiming(active ? 180 : 0, { duration });
  }, [active, duration, rotation]);

  return (
    <Animated.View
      className="ml-0.5"
      style={arrowStyle}
    >
      <ArrowIcon
        colorClassName={colorClassName}
        name={direction === 'up' ? 'caret-up' : 'caret-down'}
        size={ARROW_SIZE}
      />
    </Animated.View>
  );
};

/** 下拉菜单标题栏 */
const DropdownMenuBar = (props: DropdownMenuBarProps) => {
  const { activeIndex, classNames, direction, duration, items, onLayout, onTitlePress, titleTexts } = props;

  const variantSlots = dropdownMenuVariants({ direction });

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      bar: cn(variantSlots.bar(), classNames?.bar)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  /** 单个标题的类名随展开态与禁用态变化，只能逐项解析 */
  function resolveTitleClassNames(active: boolean, disabled: boolean) {
    const titleSlots = dropdownMenuVariants({ active, direction, disabled });

    return {
      arrow: cn(titleSlots.arrow(), classNames?.arrow),
      title: cn(titleSlots.title(), classNames?.title),
      titleText: cn(titleSlots.titleText(), classNames?.titleText)
    };
  }

  return (
    <View
      className={slotClassNames.bar}
      onLayout={onLayout}
    >
      {items.map((item, index) => {
        const isActive = activeIndex === index;
        const titleClassNames = resolveTitleClassNames(isActive, Boolean(item.disabled));

        return (
          <Pressable
            key={item.key ?? index}
            className={titleClassNames.title}
            disabled={item.disabled}
            onPress={() => onTitlePress(index)}
          >
            <Text className={titleClassNames.titleText}>{titleTexts[index]}</Text>

            <AnimatedArrow
              active={isActive}
              colorClassName={titleClassNames.arrow}
              direction={direction}
              duration={duration}
            />
          </Pressable>
        );
      })}
    </View>
  );
};

export { DropdownMenuBar };

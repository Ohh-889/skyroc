import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { cn } from '@skyroc/utils';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Text } from '../text/Typography';
import type { SlotClassNames } from '../../types/shared';
import { dropdownMenuVariants } from './dropdown-menu-variants';
import type { DropdownMenuDirection, DropdownMenuItem, DropdownMenuSlots } from './types';

/** 带旋转动画的箭头图标属性 */
interface AnimatedArrowProps {
  /** 是否激活（展开） */
  active: boolean;

  /** 展开方向 */
  direction: DropdownMenuDirection;

  /** 动画时长（毫秒） */
  duration: number;
}

/** 标题栏属性 */
interface DropdownMenuBarProps {
  /** 当前高亮标题索引，-1 表示无 */
  activeItemIndex: number;

  /** 各插槽自定义 className */
  classNames?: SlotClassNames<DropdownMenuSlots>;

  /** 展开方向 */
  direction: DropdownMenuDirection;

  /** 动画时长 */
  duration: number;

  /** 菜单项列表 */
  items: DropdownMenuItem[];

  /** 布局测量回调 */
  onLayout: (e: LayoutChangeEvent) => void;

  /** 标题点击回调 */
  onTitlePress: (index: number) => void;

  /** 各项当前显示文本 */
  titleTexts: string[];
}

/** 带旋转动画的箭头图标 */
const AnimatedArrow = (props: AnimatedArrowProps) => {
  const { active, direction, duration } = props;

  const rotation = useSharedValue(active ? 180 : 0);

  useEffect(() => {
    rotation.value = withTiming(active ? 180 : 0, { duration });
  }, [active, duration]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
    marginLeft: 2
  }));

  return (
    <Animated.View style={animStyle}>
      <FontAwesome
        color={active ? '#000' : '#999'}
        name={direction === 'up' ? 'caret-up' : 'caret-down'}
        size={14}
      />
    </Animated.View>
  );
};

/** 下拉菜单标题栏 */
const DropdownMenuBar = (props: DropdownMenuBarProps) => {
  const { activeItemIndex, classNames, direction, duration, items, onLayout, onTitlePress, titleTexts } = props;

  const slots = dropdownMenuVariants();

  return (
    <View
      className={cn(slots.bar(), classNames?.bar)}
      onLayout={onLayout}
    >
      {items.map((item, index) => {
        const isActive = activeItemIndex === index;
        const titleSlots = dropdownMenuVariants({ active: isActive, disabled: Boolean(item.disabled) });

        return (
          <Pressable
            key={index}
            className={cn(titleSlots.title(), classNames?.title)}
            disabled={item.disabled}
            onPress={() => onTitlePress(index)}
          >
            <Text className={cn(titleSlots.titleText(), classNames?.titleText)}>{titleTexts[index]}</Text>
            <AnimatedArrow
              active={isActive}
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
export type { DropdownMenuBarProps };
